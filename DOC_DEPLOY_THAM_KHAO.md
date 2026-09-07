# TÀI LIỆU KỸ THUẬT & HƯỚNG DẪN DEPLOYMENT
## DỰ ÁN: Y.O.U ALLIANCE PLATFORM (FRONTEND & BACKEND INFRASTRUCTURE)

---


## 1. Tổng quan Kiến trúc Hạ tầng & Topology Mạng

Hệ thống Y.O.U được xây dựng theo mô hình **Decoupled Headless Jamstack** tận dụng mạng lưới máy chủ toàn cầu (Global Edge Network) của Cloudflare để tối ưu hóa tốc độ truy cập cho các thành viên trên 6 châu lục.

```
                                               ┌──────────────────────────────────────────────┐
                                               │            NGƯỜI DÙNG / TRÌNH DUYỆT          │
                                               └──────────────────────┬───────────────────────┘
                                                                      │
                                                HTTPS (Anycast DNS)   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                   CLOUDFLARE EDGE NETWORK                                                       │
│                                                                                                                                 │
│   🌐 1. Public Visitor SPA (React 19)                            👑 2. Custom Management Portal (/portal)                      │
│      • Assets phục vụ trực tiếp từ Cloudflare Edge KV Cache         • Tích hợp Ant Design v6, Lazy-loaded                       │
│      • SPA Fallback về index.html cho dynamic client routes         • Cách ly hoàn toàn khỏi public code                        │
│                                                                                                                                 │
│   ⚡ 3. Cloudflare Worker Reverse Proxy Engine (src/worker/handlers.ts)                                                        │
│      • Bắt toàn bộ request cùng origin /api/* (run_worker_first: ["/api/*"])                                                    │
│      • CORS Preflight: Trả về HTTP 204 No Content cho request OPTIONS                                                           │
│      • Authorization: Bảo toàn Bearer JWT của Admin Portal; tự động gắn STRAPI_API_TOKEN cho khách vãng lai                     │
│      • Preview Gateway: Xác thực mã bí mật PREVIEW_SECRET và quản lý cookie you_preview=draft                                   │
└─────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┘
                                                              │
                                      Encrypted HTTPS Tunnel  │ (Origin Request qua Domain admin.youthorgunion.com)
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            VPS / CLOUD SERVER (BACKEND INFRASTRUCTURE)                                          │
│                                                                                                                                 │
│   ┌────────────────────────────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐   │
│   │                 Strapi v5 Container (Node 22 Bookworm Slim)            │ │        PostgreSQL 16 Database Container      │   │
│   │  • Docker Image: ghcr.io/alberttrann/youth-cms:latest                  │ │  • Volume lưu trữ: strapi-data               │   │
│   │  • Cổng nội bộ: 1337                                                   │ │  • Port nội bộ: 5432                         │   │
│   │  • Document Service API & Custom Portal Auth Engine                    │ │  • Tự động backup định kỳ hàng ngày          │   │
│   │  • Background Email Dispatcher (setImmediate)                          │ └──────────────────────────────────────────────┘   │
│   └────────────────────────────────────────┬───────────────────────────────┘                                                    │
└────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
        ┌───────────────────────────┐                 ┌───────────────────────────┐
        │   Cloudinary Media CDN    │                 │   LarkSuite / SMTP Server │
        │ • Upload: POST /api/upload│                 │  • Gửi mail thông báo     │
        │ • Tối ưu WebP thời gian   │                 │    Admin & Thư xác nhận   │
        │    thực trên toàn cầu     │                 │    biên nhận cho ứng viên │
        └───────────────────────────┘                 └───────────────────────────┘
```

---

## 2. Ma trận Môi trường, Biến Môi trường & Quản lý Secrets

### 2.1 Môi trường Frontend 

Frontend có sự phân tách tuyệt đối giữa **Client Bundle** (chạy trên trình duyệt) và **Edge Worker** (chạy trên máy chủ Cloudflare):

| Tên Biến / Secret | Tầng Hoạt động | Môi trường Local (`.env.local` / `.dev.vars`) | Production (Cloudflare Worker Secret) | Ý nghĩa Kỹ thuật |
|---|:---:|---|---|---|
| `VITE_STRAPI_API_URL` | Client (Trình duyệt) | `http://localhost:1337` | *(Bỏ trống / Xóa)* | Khi ở Production, client gọi `/api/*` cùng origin. Biến này chỉ dùng cho local dev. |
| `STRAPI_API_URL` | Edge Worker | `http://localhost:1337` | `https://admin.youthorgunion.com` | Địa chỉ máy chủ Strapi thực tế mà Worker proxy sẽ chuyển tiếp yêu cầu tới. |
| `STRAPI_API_TOKEN` | Edge Worker | *(Token đọc local)* | *(Encrypted Secret từ Strapi Admin)* | API Token bí mật có quyền đọc công khai. Worker tự động gắn vào Header `Authorization`. |
| `PREVIEW_SECRET` | Edge Worker | *(Chuỗi ngẫu nhiên sha256)* | *(Encrypted Secret trùng khớp Backend)* | Khóa bí mật dùng để bắt tay xác thực khi Strapi Admin kích hoạt luồng Live Preview. |

> **CẢNH BÁO BẢO MẬT:** Tuyệt đối **KHÔNG** đặt tên biến có tiền tố `VITE_` cho các mã bí mật (như `VITE_STRAPI_API_TOKEN`). Vite sẽ tự động nhúng toàn bộ giá trị này dưới dạng chuỗi thô (hardcoded string) vào tệp `.js` biên dịch, làm lộ quyền quản trị cho bất kỳ ai inspect mã nguồn website.

---

### 2.2 Môi trường Backend 

| Tên Biến Môi trường | Kiểu Giá trị | Ví dụ Môi trường Production | Mô tả & Ràng buộc |
|---|:---:|---|---|
| `NODE_ENV` | String | `production` | Bật chế độ tối ưu hóa hiệu năng và tắt tính năng debug của Strapi. |
| `HOST` | String | `0.0.0.0` | Cho phép Docker container lắng nghe kết nối từ mọi interface. |
| `PORT` | Integer | `1337` | Cổng dịch vụ HTTP nội bộ của container Strapi. |
| `APP_KEYS` | Chuỗi 4 base64 | `key1,key2,key3,key4` | Dùng để ký session và cookie (Sinh bằng: `openssl rand -base64 16`). |
| `API_TOKEN_SALT` | Chuỗi base64 | *(Sinh ngẫu nhiên)* | Muối mã hóa dùng để băm các API Token lưu trong CSDL. |
| `ADMIN_JWT_SECRET` | Chuỗi base64 | *(Sinh ngẫu nhiên)* | Mã bí mật dùng để ký và xác thực phiên đăng nhập của tài khoản Strapi Admin. |
| `JWT_SECRET` | Chuỗi base64 | *(Sinh ngẫu nhiên)* | Mã bí mật dùng để cấp phát JWT cho plugin Users & Permissions. |
| `TRANSFER_TOKEN_SALT` | Chuỗi base64 | *(Sinh ngẫu nhiên)* | Muối dùng cho tính năng Strapi Data Transfer CLI. |
| `ENCRYPTION_KEY` | Chuỗi base64 | *(Sinh ngẫu nhiên)* | Khóa dẫn xuất dùng để sinh Master Session Token cho Custom Portal. |
| `DATABASE_CLIENT` | String | `postgres` | Sử dụng PostgreSQL 16 trên Production (thay vì SQLite `.tmp/data.db`). |
| `DATABASE_URL` | Connection String | `postgresql://strapi:strong_password@db:5432/strapi` | Đường dẫn kết nối CSDL nội bộ trong mạng Docker Network. |
| `DATABASE_SSL` | Boolean | `false` | `false` khi kết nối CSDL qua mạng nội bộ Docker; `true` khi dùng Cloud Managed DB. |
| `CLOUDINARY_NAME` | String | `mutcixn2` | Tên tài khoản lưu trữ Cloudinary CDN. |
| `CLOUDINARY_KEY` | String | `658835419561867` | API Key kết nối dịch vụ Cloudinary. |
| `CLOUDINARY_SECRET` | String | *(Bí mật từ Cloudinary)* | API Secret dùng để ký upload ảnh và tệp. |
| `CLIENT_URL` | URL | `https://youthorgunion.com` | URL chính thức của Frontend, dùng để xác thực CORS và bắt tay Live Preview. |
| `PREVIEW_SECRET` | Chuỗi sha256 | *(Trùng với Worker)* | Khóa bí mật dùng để ký URL xem trước bài nháp. |
| `SMTP_HOST` | Hostname | `smtp.larksuite.com` | Máy chủ gửi thư SMTP (SSL Port 465). |
| `SMTP_PORT` | Integer | `465` | Cổng kết nối bảo mật SSL. |
| `SMTP_SECURE` | Boolean | `true` | Bắt buộc SSL khi kết nối cổng 465. |
| `SMTP_USERNAME` | Email | `no-reply@youthorgunion.com` | Tài khoản hòm thư gửi thông báo tự động. |
| `SMTP_PASSWORD` | App Password | *(Mã ủy quyền LarkSuite)* | Mật khẩu ứng dụng IMAP/SMTP được sinh trong cài đặt Lark Mail. |
| `EMAIL_DEFAULT_FROM` | String | `"Y.O.U Alliance" <no-reply@youthorgunion.com>` | Nhãn và địa chỉ người gửi hiển thị trong hòm thư của khách hàng. |
| `EMAIL_DEFAULT_REPLY_TO` | Email | `no-reply@youthorgunion.com` | Hòm thư nhận phản hồi mặc định. |
| `STAFF_NOTIFICATION_EMAIL`| Email | `info@youthorgunion.org` | Hòm thư nhận thông báo đơn ứng tuyển và hồ sơ đăng ký mới. |

---

## 3. Hướng dẫn Triển khai Frontend trên Cloudflare Workers

Frontend sử dụng tệp cấu hình **`wrangler.jsonc`** theo kiến trúc **Cloudflare Workers with Static Assets**, cho phép kết hợp hoàn hảo giữa tệp tĩnh SPA và reverse proxy API.

### 3.1 Cấu hình Tệp `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "youorg",
  "main": "src/worker/index.ts",
  "vars": {
    "STRAPI_API_URL": "https://admin.youthorgunion.com"
  },
  "compatibility_date": "2026-06-02",
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "assets": {
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "compatibility_flags": [
    "nodejs_compat"
  ]
}
```

> **Giải thích cơ chế cốt lõi:**
> - `not_found_handling: "single-page-application"`: Mọi đường dẫn route của React (như `/about-us`, `/members/123`, `/portal/dashboard`) nếu không trùng khớp tệp tĩnh cụ thể sẽ tự động trả về `index.html` với mã HTTP `200`, loại bỏ hoàn toàn lỗi 404 khi người dùng ấn F5 tải lại trang.
> - `run_worker_first: ["/api/*"]`: Bắt buộc các request gọi `/api/*` phải chạy qua mã nguồn Worker (`src/worker/index.ts` và `src/worker/handlers.ts`) trước để thực thi logic proxy bảo mật, không để rơi vào tầng phục vụ file tĩnh.

---

### 3.2 Quy trình Triển khai Thủ công qua Wrangler CLI

#### Bước 1: Chuẩn bị mã nguồn và cài đặt dependencies
```bash
cd Youth

# Cài đặt sạch toàn bộ dependencies
npm ci

# Chạy typecheck và kiểm tra tính hợp lệ của mã nguồn
npm run build
```

#### Bước 2: Đăng nhập tài khoản Cloudflare
```bash
npx wrangler login
```
*(Trình duyệt sẽ mở ra để xác thực quyền truy cập vào tài khoản Cloudflare của tổ chức).*

#### Bước 3: Khởi tạo Secrets trên Cloudflare Worker (Chỉ làm lần đầu)
```bash
# 1. Khai báo API Token bí mật từ Strapi
npx wrangler secret put STRAPI_API_TOKEN
# Paste token đã sinh trong Strapi Admin vào đây

# 2. Khai báo Secret dùng cho Preview
npx wrangler secret put PREVIEW_SECRET
# Paste chuỗi secret trùng với backend vào đây
```

#### Bước 4: Thực thi lệnh Deploy
```bash
npm run deploy
```
*Lệnh trên tương đương với `tsc -b && vite build && wrangler deploy`. Khi chạy xong, Cloudflare sẽ thông báo:*
```
Total Upload: xx files / xx MB
Uploaded xx assets
Deployed youorg triggers:
  - https://youthorgunion.com
```

---

### 3.3 Quy trình Tự động hóa CI/CD qua GitHub Actions (Frontend)

Tạo file **`.github/workflows/deploy-frontend.yml`** để tự động build và deploy mỗi khi push vào nhánh `main`:

```yaml
name: Deploy Frontend to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Build & Deploy Worker
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Typecheck & Build Assets
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

---

## 4. Hướng dẫn Triển khai Backend Strapi v5 trên VPS / Cloud Server

Backend được container hóa hoàn toàn qua **Docker Multi-stage Build** và vận hành cùng cơ sở dữ liệu **PostgreSQL 16**.

### 4.1 Quy trình CI/CD Build Docker Image (GitHub Actions)

Mã nguồn backend đã được cấu hình sẵn pipeline `.github/workflows/ci-cd.yml`:
1. Khi có commit đẩy vào nhánh `main` hoặc khi gắn thẻ phiên bản `v*`:
   - GitHub Actions khởi chạy container PostgreSQL tạm thời để chạy test tự động.
   - Biên dịch TypeScript (`npm run build`) và kiểm thử điểm kết nối `/_health`.
   - Đóng gói thành Docker Image đa kiến trúc (linux/amd64, linux/arm64) và xuất bản lên GitHub Container Registry:
     `ghcr.io/alberttrann/youth-cms:latest`

---

### 4.2 Triển khai trên Máy chủ VPS qua Docker Compose

#### Bước 1: Cài đặt Docker & Docker Compose trên VPS (Ubuntu 22.04 / 24.04)
```bash
# Cài đặt Docker engine và compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Bước 2: Tạo thư mục triển khai và chuẩn bị tệp cấu hình
Tạo thư mục trên VPS:
```bash
mkdir -p /opt/youth-cms
cd /opt/youth-cms
```

Tạo tệp **`docker-compose.yml`**:
```yaml
services:
  strapi:
    image: ghcr.io/alberttrann/youth-cms:latest
    pull_policy: always
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 1337
      DATABASE_CLIENT: postgres
      DATABASE_URL: postgresql://strapi_user:${POSTGRES_PASSWORD}@postgres:5432/strapi_prod
      DATABASE_SSL: false
    ports:
      - "127.0.0.1:1337:1337"
    volumes:
      - strapi-uploads:/opt/app/public/uploads

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: strapi_prod
      POSTGRES_USER: strapi_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi_user -d strapi_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  strapi-uploads:
  postgres-data:
```

#### Bước 3: Tạo tệp `.env` trên VPS
Tạo tệp `/opt/youth-cms/.env` chứa các giá trị production thực tế (sử dụng mẫu mục 2.2). Thiết lập mật khẩu mạnh cho PostgreSQL:
```bash
# Sinh mật khẩu ngẫu nhiên cho database:
openssl rand -hex 24
```
Gán giá trị vào `POSTGRES_PASSWORD=...` trong `.env`.

#### Bước 4: Đăng nhập GitHub Container Registry và Khởi chạy
```bash
# Đăng nhập vào GHCR để pull image private:
echo "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull image mới nhất và khởi chạy nền:
docker compose pull
docker compose up -d
```

#### Bước 5: Kiểm tra trạng thái Container
```bash
docker compose ps
docker compose logs -f strapi
```
*Khi thấy log xuất hiện: `[INFO] Server running on http://0.0.0.0:1337` là hệ thống đã hoạt động.*

---

### 4.3 Khởi tạo Dữ liệu trên Production (First-Time Seed)

Sau khi container khởi chạy lần đầu tiên trên cơ sở dữ liệu PostgreSQL mới tinh, thực thi lệnh sau bên trong container để nạp toàn bộ danh mục dữ liệu mẫu, tạo các quyền hạn và Master Token:

```bash
docker compose exec strapi node scripts/seed-all.js
```

*Terminal sẽ báo cáo:*
```
🌱 Starting comprehensive Strapi database seeding...
✅ Global Setting seeded
✅ 5 FAQs seeded
✅ 4 Policy Documents seeded
✅ 4 News Items seeded
✅ 6 Leadership Team Members seeded
✅ 3 Member Organizations seeded
✅ 3 Projects seeded (linked to members)
🎉 Comprehensive database seeding completed successfully!
```

---

## 5. Cấu hình Tên miền, DNS, SSL/TLS & Cloudflare Edge Rules

### 5.1 Bảng Phân giải Bản ghi DNS (Cloudflare DNS Management)

| Loại Bản ghi | Tên miền con (Name) | Đích trỏ đến (Content / Target) | Bật Proxy (Orange Cloud) | Mục đích |
|---|---|---|:---:|---|
| **A / CNAME** | `youthorgunion.com` (Root) | Trỏ vào Cloudflare Worker `youorg` | **YES (Proxied)** | Public Website & Management Portal |
| **CNAME** | `www.youthorgunion.com` | `youthorgunion.com` | **YES (Proxied)** | Tự động chuyển tiếp www về non-www |
| **A** | `admin.youthorgunion.com` | `IP_CỦA_VPS_BACKEND` | **YES (Proxied)** | Endpoint máy chủ Strapi Backend |

---

### 5.2 Cấu hình SSL/TLS & Bảo mật Cloudflare
1. **Chế độ mã hóa SSL/TLS:** Thiết lập **Full (Strict)**.  
   *(Yêu cầu máy chủ VPS backend cài đặt chứng chỉ SSL hợp lệ do Cloudflare Origin CA cấp hoặc Let's Encrypt).*
2. **Always Use HTTPS:** Bật **ON** (Tự động nâng cấp mọi request HTTP lên HTTPS).
3. **Minimum TLS Version:** Chọn **TLS 1.2** hoặc **TLS 1.3** để đạt tiêu chuẩn bảo mật ngân hàng.

---

### 5.3 Cấu hình Nginx Reverse Proxy trên VPS Backend

Để Strapi tiếp nhận an toàn các request từ Cloudflare gửi về subdomain `admin.youthorgunion.com`, tạo file cấu hình `/etc/nginx/sites-available/strapi`:

```nginx
server {
    listen 80;
    server_name admin.youthorgunion.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.youthorgunion.com;

    # Đường dẫn chứng chỉ SSL (Let's Encrypt hoặc Cloudflare Origin Certificate)
    ssl_certificate /etc/letsencrypt/live/admin.youthorgunion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.youthorgunion.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 100M; # Cho phép upload tệp tài liệu và ảnh lớn

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout cho các thao tác upload tệp lớn
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```
Kích hoạt cấu hình:
```bash
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Post-Deployment Smoke Tests

Sau khi hoàn tất lệnh `wrangler deploy` và khởi động container backend, đội ngũ QA/DevOps bắt buộc phải thực thi bộ kịch bản kiểm thử khói (Smoke Test) dưới đây để đảm bảo hệ thống đạt độ ổn định 100%:

### Kịch bản 1: Kiểm tra Điểm cuối Backend Healthcheck
```bash
curl -I https://admin.youthorgunion.com/_health
```
*Kết quả kỳ vọng:* Trả về HTTP `204 No Content`.

---

### Kịch bản 2: Kiểm tra CORS Preflight trên Cloudflare Worker Proxy
```bash
curl -X OPTIONS https://youthorgunion.com/api/projects \
  -H "Origin: https://youthorgunion.com" \
  -H "Access-Control-Request-Method: PUT" -I
```
*Kết quả kỳ vọng:* Trả về HTTP `204 No Content` kèm header:
- `Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Origin: *`

---

### Kịch bản 3: Kiểm tra Phục vụ Static Assets & SPA Routing
```bash
# 1. Truy cập root website
curl -I https://youthorgunion.com/

# 2. Truy cập deep-route client SPA (phải trả về 200, không được trả về 404)
curl -I https://youthorgunion.com/members
curl -I https://youthorgunion.com/portal/dashboard
```
*Kết quả kỳ vọng:* Toàn bộ các link trên đều trả về HTTP `200 OK` (Content-Type: `text/html`).

---

### Kịch bản 4: Kiểm tra Proxy Bảo mật Không Rò rỉ Secret
```bash
curl -s https://youthorgunion.com/api/global-setting | grep -q "MB Bank" && echo "PASS: Proxy working" || echo "FAIL"
```
*Kết quả kỳ vọng:* In ra `PASS: Proxy working`. Kiểm tra tệp build `.js` trên trình duyệt không tìm thấy chuỗi bí mật `STRAPI_API_TOKEN`.

---

### Kịch bản 5: Kiểm tra Thử nghiệm Luồng Gửi Email Tự động (LarkSuite SMTP)
1. Truy cập `https://youthorgunion.com/contact`.
2. Gửi một tin nhắn liên hệ thử nghiệm với email cá nhân.
3. Kiểm tra hòm thư cá nhân (nhận mail xác nhận tức thì) và hòm thư Admin `info@youthorgunion.org` (nhận mail cảnh báo).

---

## 7. Observability & Logging

### 7.1 Xem Trực tiếp Nhật ký Cloudflare Worker (Real-Time Edge Logs)
Sử dụng công cụ Wrangler Tail để xem trực tiếp các request và lỗi nếu có trên tầng Edge:
```bash
cd Youth
npx wrangler tail
```

---

### 7.2 Xem Nhật ký Container Strapi Backend trên VPS
```bash
cd /opt/youth-cms
# Xem 100 dòng log gần nhất và theo dõi liên tục
docker compose logs -f --tail=100 strapi
```

---

### 7.3 Cấu hình Uptime Monitoring Miễn phí (UptimeRobot / BetterUptime)
Tạo 2 bộ giám sát tự động (Ping chu kỳ 1 phút):
1. **Frontend Monitor:** `https://youthorgunion.com/` (Kiểm tra mã trạng thái HTTP `200 OK`).
2. **Backend Health Monitor:** `https://admin.youthorgunion.com/_health` (Kiểm tra mã trạng thái HTTP `204`).
3. **Cấu hình Alert:** Bắn thông báo ngay lập tức về Telegram / Discord / Email khi hệ thống phản hồi quá 5 giây hoặc trả về mã lỗi 5xx.

---

## 8. Kế hoạch Sao lưu, Phục hồi Dữ liệu & Quy trình Rollback

### 8.1 Quy trình Sao lưu Cơ sở Dữ liệu PostgreSQL Tự động Hàng ngày

Tạo kịch bản backup tự động tại `/opt/youth-cms/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/opt/youth-cms/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# Xuất dump dữ liệu nén
docker compose -f /opt/youth-cms/docker-compose.yml exec -T postgres \
  pg_dump -U strapi_user -d strapi_prod | gzip > "$BACKUP_DIR/strapi_backup_$TIMESTAMP.sql.gz"

# Tự động dọn dẹp các bản backup cũ hơn 30 ngày
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed successfully at $TIMESTAMP"
```
Cấp quyền thực thi và tạo cron job chạy mỗi đêm lúc 02:00 AM:
```bash
chmod +x /opt/youth-cms/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/youth-cms/backup.sh >> /var/log/strapi_backup.log 2>&1") | crontab -
```

---

### 8.2 Quy trình Rollback Nhanh cho Frontend 

Nếu phiên bản Frontend mới đẩy lên gặp lỗi phát sinh ngoài ý muốn:

#### Cách 1: Sử dụng tính năng Rollback của Cloudflare Dashboard
1. Truy cập **Cloudflare Dashboard ➔ Workers & Pages ➔ Chọn Worker `youorg`**.
2. Chọn tab **Deployments**.
3. Tại phiên bản ổn định liền trước, bấm nút **Rollback** ➔ Hệ thống lập tức hoàn nguyên trên toàn cầu trong vòng 5 giây.

#### Cách 2: Rollback qua CLI
```bash
cd Youth
npx wrangler rollback
```

---

### 8.3 Quy trình Rollback cho Backend Strapi

Nếu phiên bản Backend mới gặp lỗi không tương thích:
```bash
cd /opt/youth-cms

# 1. Quay trở lại phiên bản Image ổn định trước đó (ví dụ tag commit hash hoặc v1.0.0):
docker compose down
sed -i 's/youth-cms:latest/youth-cms:v1.0.0/g' docker-compose.yml
docker compose up -d

# 2. Trường hợp hỏng cơ sở dữ liệu, phục hồi bản dump gần nhất:
gunzip < /opt/youth-cms/backups/strapi_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose exec -T postgres psql -U strapi_user -d strapi_prod
```

---

## 9. Incident Response Runbook

### Sự cố 1: Khách hàng gặp lỗi `502 Bad Gateway` hoặc `Network Error`
- **Hiện tượng:** Truy cập website công khai bình thường nhưng không tải được danh sách Dự án, Thành viên, hoặc không nộp được form.
- **Nguyên nhân:** Container Strapi Backend trên VPS bị dừng, đầy RAM hoặc khởi động lại.
- **Quy trình xử lý:**
  1. SSH vào VPS: `ssh user@your_vps_ip`.
  2. Kiểm tra tài nguyên máy chủ: `free -m` và `df -h`.
  3. Kiểm tra container: `cd /opt/youth-cms && docker compose ps`.
  4. Nếu container ở trạng thái `Exit`, xem nguyên nhân sập: `docker compose logs --tail=50 strapi`.
  5. Khởi động lại: `docker compose restart strapi`.

---

### Sự cố 2: Đăng ký Form hoặc Nộp Đơn Báo Lỗi `405 Method Not Allowed`
- **Hiện tượng:** Nhấn gửi đơn đăng ký hoặc liên hệ bị đỏ thông báo lỗi trên giao diện.
- **Nguyên nhân:** Cloudflare Worker Proxy chưa cập nhật danh sách method cho phép (`POST`, `PUT`, `OPTIONS`).
- **Quy trình xử lý:**
  1. Kiểm tra lại tệp `src/worker/handlers.ts` và `functions/api/[[path]].ts`.
  2. Đảm bảo biến `allowedMethods` có đầy đủ: `new Set(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'])`.
  3. Chạy lại lệnh deploy frontend: `npm run deploy`.

---

### Sự cố 3: Đăng nhập Portal Báo `Failed to fetch` hoặc `Connection Refused`
- **Hiện tượng:** Không thể đăng nhập vào trang quản trị `/portal/login`.
- **Nguyên nhân:** Máy chủ Strapi chưa được bật, hoặc tường lửa (UFW) trên VPS đang chặn kết nối đến port của Nginx reverse proxy.
- **Quy trình xử lý:**
  1. Kiểm tra Nginx trên VPS: `sudo systemctl status nginx`.
  2. Đảm bảo cổng 80 và 443 được mở trên tường lửa VPS:
     ```bash
     sudo ufw allow 80/tcp
     sudo ufw allow 443/tcp
     sudo ufw status
     ```
  3. Kiểm tra SSL của subdomain `admin.youthorgunion.com` còn hạn hay đã hết hạn.

---

### Sự cố 4: Thư Gửi Tự Động Bị Đưa Vào Thư Rác (Spam)
- **Hiện tượng:** Ứng viên nộp đơn nhưng phản ánh không nhận được email xác nhận trong Hộp thư đến (Inbox).
- **Nguyên nhân:** Bản ghi SPF, DKIM hoặc DMARC của tên miền `youthorgunion.com` chưa ủy quyền cho máy chủ LarkSuite SMTP.
- **Quy trình xử lý:**
  1. Truy cập **Cloudflare DNS Management**.
  2. Bổ sung bản ghi TXT xác thực SPF của LarkSuite:
     - Tên: `@`
     - Giá trị: `v=spf1 include:spf.larksuite.com ~all`
  3. Lấy khóa **DKIM** từ bảng điều khiển Lark Mail Admin và cấu hình bản ghi CNAME/TXT tương ứng.