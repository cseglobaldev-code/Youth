# TÀI LIỆU KỸ THUẬT 
## DỰ ÁN: Y.O.U (YOUTH ORGANIZATION UNION) PLATFORM

---


## 1. Tổng quan Hệ thống

Frontend của nền tảng **Y.O.U** được xây dựng trên nền **React 19.2 (Vite, TypeScript, Tailwind CSS, Ant Design v6)**, vận hành theo kiến trúc **Decoupled Headless SPA**. 

Hệ thống được đóng gói và phân phối toàn cầu qua **Cloudflare Workers** (`wrangler.jsonc`), hợp nhất hai ứng dụng độc lập trong cùng một repository:
1. **Public Website:** Trải nghiệm công khai mượt mà, hỗ trợ song ngữ (EN/VI), thân thiện SEO, tối ưu tốc độ phản hồi trên mạng lưới Edge.
2. **Management Portal (`/portal`):** Không gian quản trị nội bộ doanh nghiệp độc lập (dành cho Admin, Biên tập viên, HR, Kiểm toán viên), thay thế bảng điều khiển mặc định của Strapi với chi phí hạ tầng bổ sung bằng 0.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       TRÌNH DUYỆT NGƯỜI DÙNG                                     │
└─────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE EDGE WORKER (SPA + REVERSE PROXY)                        │
│                                                                                                  │
│   🌐 1. Public Visitor SPA (React 19)                       👑 2. Management Portal (/portal)   │
│      • Trang chủ (/), Giới thiệu (/about-us)                   • Tổng quan & Thống kê Dashboard  │
│      • Thành viên (/members), Dự án (/projects)                • Content Studio & Page Builder   │
│      • Tin tức (/news), Tài liệu (/policy-documents)           • Tuyển dụng Lãnh đạo (ATS & CV)  │
│      • Modals: Ứng tuyển, Đăng ký, Quyên góp                   • Media Studio & Quản trị Cài đặt │
│            │                                                              │                      │
│            └──────────────────────────────┬───────────────────────────────┘                      │
│                                           │ Cùng gọi API Same-Origin: /api/*                     │
│                                           ▼                                                      │
│                           ⚡ CLOUDFLARE WORKER PROXY ENGINE                                     │
│                             • CORS Preflight: OPTIONS ➔ 204 No Content                          │
│                             • Cho phép: GET, HEAD, POST, PUT, DELETE                             │
│                             • Bảo toàn Authorization Header (JWT của Staff)                      │
│                             • Bơm Bearer Secret an toàn cho khách vãng lai                       │
│                             • Điều phối Trạng thái Preview (draft/published cookie)              │
└───────────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                            │ Upstream HTTPS Request
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                STRAPI v5 BACKEND CORE ENGINE (:1337)                             │
│   • Document Service API (/api/projects, /api/members, /api/pages, /api/home-page...)            │
│   • Custom Portal Auth Controller (/api/portal-auth/login - bcrypt verification & Master Token)  │
│   • Asynchronous Email Dispatcher (Nodemailer + LarkSuite SMTP, non-blocking setImmediate)       │
│   • Cloudinary Media Storage Adapter                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cấu trúc Thư mục Dự án

```
src/
├── api/                   # Tầng giao tiếp dữ liệu với Strapi v5
│   ├── strapi.ts          # Core Client: resolveConfig, In-Memory TTL Cache, parseStringArray, mapSocialLinks
│   ├── applications.ts    # API gửi form ứng tuyển & đăng ký thành viên (hỗ trợ camelCase focusSdgs)
│   ├── documents.ts       # API lấy Policy Documents (map chính xác thời gian updatedAt thực tế)
│   ├── faqs.ts            # API lấy FAQs kèm displayOrder phục vụ sắp xếp ưu tiên
│   ├── global.ts          # API lấy cấu hình toàn cục (Hotline, Ngân hàng, QR Code, Điều khoản)
│   ├── inquiries.ts       # API gửi form liên hệ (Inquiries)
│   ├── leadership.ts      # API lấy danh sách Ban Lãnh đạo & Giám đốc Châu lục (CONTINENT_REGIONS)
│   ├── members.ts         # API lấy danh sách & chi tiết Thành viên (hỗ trợ bypassCache khi Preview)
│   ├── news.ts            # API lấy danh sách tin tức & bài viết chi tiết từ collection news-items
│   └── pages.ts           # API lấy Dynamic Pages & Home Page (hỗ trợ Wildcard Deep Populate)
├── app/                   # Root App Component & Providers bọc ngoài
│   ├── App.tsx            # Entrypoint Router
│   └── AppProviders.tsx   # Tích hợp Ant Design Theme + Ant Design Locale (en_US / vi_VN) + Antd App wrapper
├── components/            # UI Components phục vụ Public Website
│   ├── documents/         # DocumentRow hiển thị danh sách văn bản chính sách
│   ├── dynamic/           # BỘ RENDERER DYNAMIC BLOCKS CHO CMS
│   │   ├── BlockErrorBoundary.tsx # Bọc bắt lỗi riêng cho từng section, tránh sập toàn trang
│   │   ├── BlockRenderer.tsx      # Bộ điều phối phân tích mảng blocks và ánh xạ component
│   │   ├── BlocksRenderer.tsx     # Trình dựng Strapi v5 Rich Text Blocks (AST JSON, Table, ảnh)
│   │   ├── SectionWrapper.tsx     # Bọc cấu hình nền, độ rộng (Container Width), đệm (Padding)
│   │   └── blocks/                # 13 Khối Section động (Hero, MediaText, StatsGrid, CTABanner...)
│   ├── layout/            # Layout công khai: RootLayout, Header (Desktop/Mobile), Footer, Logo
│   ├── leadership/        # Card lãnh đạo (ExecutiveCard, TeamMemberCard, LeaderMemberModal)
│   ├── members/           # Card thành viên (MemberCardLarge)
│   ├── modals/            # Modals: JoinChoiceModal, ApplyRoleModal, RegisterOrganizationModal, SupportModal
│   ├── projects/          # Card dự án (ProjectCard)
│   ├── shared/            # Components dùng chung: CTABanner, ImageGallery, ShareButton, StatsGrid...
│   └── ui/                # UI cơ sở: Button, PillButton, SDGTag, Icon, Container, ImageWithFallback
├── context/               # React Context Providers
│   └── LanguageContext.tsx# Engine quản lý chuyển đổi ngôn ngữ EN ⇄ VI toàn diện (lưu localStorage)
├── data/                  # Dữ liệu tĩnh bổ trợ (DIAL_CODES cho 97 quốc gia, SDGS_DATA màu chuẩn UN)
├── hooks/                 # Custom React Hooks: useDisclosure, usePagination, useRolePermissions...
├── lib/utils/             # Helpers tiện ích: format, cn (clsx+tailwind-merge), countryFlag, seo
├── locales/               # Từ điển đa ngôn ngữ (en.ts, vi.ts, types.ts)
├── pages/                 # Các trang công khai: HomePage, AboutPage, ProjectsPage, NewsPage, NewsDetailPage...
├── portal/                # SUB-APP MANAGEMENT PORTAL DÀNH CHO ADMIN & STAFF (/portal/*)
│   ├── api/               # API độc lập cho Portal (CRUD, File Upload, User Management, ATS Status)
│   ├── components/        # Components chuyên dụng: PortalDataTable, MediaPicker, SdgMultiSelect
│   │   ├── auth/          # PortalAuthGuard (Bảo vệ đường dẫn & kiểm tra quyền theo vai trò)
│   │   ├── builder/       # Trình dựng trang trực quan (DynamicZoneEditor, SectionCatalogModal, Drawer)
│   │   ├── layout/        # PortalLayout (Ant Design Shell với Sider phân quyền, Header, User Menu)
│   │   └── shared/        # Reusable Data Table, File Uploader, SDG Checklist
│   ├── context/           # PortalAuthContext (Quản lý phiên đăng nhập JWT, giải quyết quyền hạn)
│   ├── hooks/             # useRolePermissions (Xác thực 4 roles: Super Admin, Editor, Reviewer, Viewer)
│   ├── pages/             # Dashboard, Content Studio, Page Builders, ATS Review Pipeline, Media Studio
│   ├── routes/            # PortalRoutes.tsx (Sub-router gom nhóm theo nhóm quyền hạn)
│   └── utils/             # csv.ts (Trình xuất dữ liệu ra Excel/CSV hỗ trợ tiếng Việt UTF-8 BOM)
├── routes/                # Định tuyến tổng thể của ứng dụng (AppRouter.tsx, paths.ts)
├── styles/                # Stylesheets toàn cục (index.css, fonts.css)
└── worker/                # Code Cloudflare Worker Edge Proxy (index.ts, handlers.ts)
```

---

## 3. Tầng Mạng & Cloudflare Edge Worker Proxy

### 3.1 Request Handling Protocol

1. **Ở môi trường Phát triển Cục bộ (`npm run dev`):**
   - Client gọi thẳng tới Strapi qua biến môi trường `VITE_STRAPI_API_URL=http://localhost:1337`.
2. **Ở môi trường Production (Cloudflare Worker):**
   - Client không chứa bất kỳ URL hoặc API token nào của backend. Mọi cuộc gọi đều gửi về `/api/*` trên cùng domain (`same-origin`).
   - File `src/worker/handlers.ts` chặn các request này trên Edge:
     - **Xử lý CORS Preflight:** Trả về HTTP `204 No Content` ngay lập tức cho các request `OPTIONS`.
     - **Bảo toàn Phiên Quản trị:** Nếu request có `Authorization: Bearer <jwt>`, proxy sẽ giữ nguyên token này để chuyển tiếp lên Strapi (đảm bảo phiên của Portal không bị hạ quyền).
     - **Bảo vệ Khách vãng lai:** Nếu request không có header xác thực, proxy sẽ tự động bổ sung token đọc công khai (`STRAPI_API_TOKEN` lưu trong Cloudflare Secret) trước khi gửi tới backend.
     - **Cho phép đầy đủ các phương thức:** Hỗ trợ `GET`, `HEAD`, `POST`, `PUT`, `DELETE`.

```typescript
// Trích đoạn logic chuyển tiếp thông minh tại src/worker/handlers.ts
const clientAuth = request.headers.get('Authorization');
if (clientAuth) {
  headers.set('Authorization', clientAuth); // Giữ nguyên token quản trị của Portal
} else if (env.STRAPI_API_TOKEN) {
  headers.set('Authorization', `Bearer ${env.STRAPI_API_TOKEN}`); // Token đọc công khai
}
```

---

## 4. Data Layer: Parsers, Mappers, AST Renderers & SEO

Mọi dữ liệu trả về từ Strapi v5 đều bắt buộc phải đi qua tầng Data Mapping để đảm bảo tính an toàn kiểu dữ liệu và tránh lỗi giao diện.

### 4.1 Parser An toàn Danh sách Quốc gia: `parseStringArray()`
Khắc phục lỗi dữ liệu bị trống khi chuỗi quốc gia nhập bằng tay dạng phân tách bằng dấu phẩy `"Vietnam, Cambodia, Laos"` thay vì mảng JSON:

```typescript
export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  const str = text(value).trim();
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Tự động phân tách dấu phẩy nếu không phải JSON
  }
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}
```

### 4.2 Chuẩn hóa Tự động Giao thức Mạng Xã hội: `mapSocialLinks()`
Tự động thêm `https://` cho các đường link người dùng nhập thiếu giao thức (như `facebook.com/org`), giúp đường link không bị bộ lọc Regex vô tình loại bỏ.

### 4.3 Trình dựng Blocks AST v5: `<BlocksRenderer />`
Chuyển đổi cây JSON AST của Strapi v5 thành mã JSX:
- Tự động gắn tiền tố `baseUrl` cho ảnh tải lên nội bộ (`/uploads/...`) tránh lỗi ảnh 404.
- Hỗ trợ đầy đủ Heading 1–6, Paragraphs, Lists, Quotes, Code Blocks, và **Bảng dữ liệu (Table, TableRow, TableCell)**.

### 4.4 Cập nhật SEO & OpenGraph Động: `updatePageSEO()` (`src/lib/utils/seo.ts`)
Tự động cập nhật thẻ `<title>`, `<meta name="description">`, `<meta name="keywords">`, các thẻ mạng xã hội `og:title`, `og:description`, `og:image`, và xử lý cờ chặn lập chỉ mục `noindex` thời gian thực khi chuyển trang.

---

## 5. Hệ thống Dynamic Zone & 13 Khối Section

Giao diện các trang đơn (`home-page`, `about-us`) và các trang tùy biến (`/pages/:slug`) được lắp ghép từ 13 khối giao diện chuẩn hóa:

| Tên Component | Mục đích & Dữ liệu hiển thị |
|---|---|
| `sections.hero` | Banner mở đầu trang, chữ gradient cầu vồng, video/ảnh nền, nút CTA kép |
| `sections.rich-text` | Bài viết văn bản dài, danh sách, bảng dữ liệu qua chuẩn Blocks AST |
| `sections.media-text` | Bố cục 2 cột: Ảnh/Video một bên và nội dung câu chuyện một bên |
| `sections.stats-grid` | Lưới đếm số liệu ấn tượng (hỗ trợ đơn vị động như `+`, `%`, `$`, `M`) |
| `sections.cta-banner` | Banner kêu gọi hành động với dải màu cầu vồng và nút bấm bo tròn |
| `sections.image-gallery` | Bộ sưu tập ảnh hoạt động hỗ trợ xem lưới hoặc giao diện Featured nổi bật |
| `sections.faq-section` | Khối câu hỏi thường gặp dạng Accordion (lấy từ FAQ chung hoặc custom) |
| `sections.featured-projects` | Danh sách dự án tiêu biểu (tự động lấy từ Collection `projects`) |
| `sections.featured-members` | Danh sách tổ chức thành viên (tự động lấy từ Collection `members`) |
| `sections.team-grid` | Lưới nhân sự Ban Lãnh đạo hoặc Giám đốc Châu lục |
| `sections.embed` | Nhúng Iframe linh hoạt (tự động convert link YouTube thường sang link embed) |
| `sections.feature-grid` | Lưới thẻ giới thiệu Sứ mệnh, Tầm nhìn, Giá trị cốt lõi (Mission Cards) |
| `sections.image-text-grid` | Lưới hình tròn hoặc bo góc giới thiệu các lĩnh vực hoạt động trọng tâm |

### Lưu ý Kỹ thuật về Deep Populate trong Strapi v5
Để các khối quan hệ như `featured-projects` hay `featured-members` lấy được cả ảnh đại diện bên trong, hàm gọi API tại `src/api/pages.ts` bắt buộc phải sử dụng **Wildcard Deep Populate**:

```typescript
query.append('populate[contentBlocks][on][sections.featured-projects][populate][projects][populate]', '*');
query.append('populate[contentBlocks][on][sections.featured-members][populate][members][populate]', '*');
query.append('populate[contentBlocks][on][sections.team-grid][populate][teamMembers][populate]', '*');
```

---

## 6. Hệ thống Đa ngôn ngữ (English ⇄ Tiếng Việt) & Ant Design Bridge

Ứng dụng tích hợp hệ thống chuyển đổi ngôn ngữ không phụ thuộc thư viện nặng bên ngoài, kết nối trực tiếp với hệ sinh thái Ant Design.

```
                    ┌──────────────────────────────────────────────┐
                    │       LanguageProvider (React Context)       │
                    │   State: 'en' | 'vi' (Đồng bộ localStorage)  │
                    └──────────────────────┬───────────────────────┘
                                           │
             ┌─────────────────────────────┴─────────────────────────────┐
             ▼                                                           ▼
┌───────────────────────────┐                               ┌───────────────────────────┐
│     Từ điển Giao diện     │                               │    Ant Design Bridge      │
│  src/locales/{en,vi}.ts   │                               │  ConfigProvider locale    │
│  (Nav, Form, Modals, CTA) │                               │  (DatePicker, Pagination) │
└───────────────────────────┘                               └───────────────────────────┘
```

- **Sử dụng trong Code:** Gọi `const { language, setLanguage, t } = useLanguage();`.
- **Cầu nối Ant Design:** File `AppProviders.tsx` truyền thẳng đối tượng ngôn ngữ chuẩn (`antdLocale: enUS | viVN`) vào `<ConfigProvider>` bọc trong `<AntdApp>`, giúp các lịch chọn ngày (DatePicker), phân trang (Pagination) tự động đổi sang tiếng Việt (`Tháng 1`, `Thứ 2`...) mà không có lỗi cảnh báo console.
- **Nút chuyển đổi trên Header:** Dropdown thông minh hiển thị cờ 🇬🇧 / 🇻🇳, đổi giao diện tức thì không cần tải lại trang.

---

## 7. Cơ chế Live Preview trên Edge

1. **Khởi tạo:** Biên tập viên bấm **Preview** trên Strapi hoặc Management Portal.
2. **Ký duyệt Token:** Cloudflare Worker xác thực chữ ký bảo mật `PREVIEW_SECRET` và gắn cookie `you_preview=draft`.
3. **Hiển thị Thời gian thực:**
   - Trình duyệt điều hướng về URL frontend kèm tham số `?preview=1`.
   - Một dải banner màu cam xuất hiện cố định: `Preview Mode: You are viewing a draft version of this page.`
   - Các hàm gọi API tự động gắn cờ `bypassCache: true` và `status=draft`, cho phép biên tập viên xem ngay nội dung vừa chỉnh sửa mà không bị vướng bộ nhớ đệm 5 phút.

---

## 8. Custom Management Portal (`/portal`) & Phân quyền 4 Tầng (RBAC)

Được xây dựng cách ly 100% trong thư mục `src/portal/`, sử dụng bộ UI doanh nghiệp **Ant Design v6**, đóng vai trò là bảng điều khiển thay thế hoàn toàn cho giao diện Strapi Admin đối với nhân sự phi kỹ thuật.

### 8.1 Ma trận Phân quyền Tuyệt đối (Strict 4-Role Matrix)

```
┌───────────────────────────┬─────────────────────────────────────┬────────────────────────────────────┐
│ Vai trò (Role)            │ Phạm vi Được phép (Allowed Scope)   │ Ràng buộc Chặn (Strictly Blocked)  │
├───────────────────────────┼─────────────────────────────────────┼────────────────────────────────────┤
│ 👑 Super Admin            │ • Toàn quyền Content Studios        │ • Không có (Toàn quyền hệ thống)   │
│   (admin / super admin)   │ • Toàn quyền Page Builders          │                                    │
│                           │ • Quản lý ATS Tuyển dụng & Ứng viên │                                    │
│                           │ • Quản lý Media Studio (Tải, Xóa)   │                                    │
│                           │ • Sửa Cài đặt Website (Ngân hàng, QR)│                                   │
│                           │ • Quản lý Tài khoản Staff & Roles   │                                    │
├───────────────────────────┼─────────────────────────────────────┼────────────────────────────────────┤
│ ✍️ Content Editor         │ • Dự án (Tạo, Sửa, Xuất bản, Xóa)  │ 🚫 BỊ CHẶN khỏi ATS Tuyển dụng (CV)│
│   (editor)                │ • Tổ chức Thành viên (Tạo, Sửa)     │ 🚫 BỊ CHẶN khỏi Sổ quỹ Quyên góp   │
│                           │ • Tin tức & Bài viết (Viết, Đăng)   │ 🚫 BỊ CHẶN khỏi Cài đặt Ngân hàng  │
│                           │ • Đội ngũ Lãnh đạo, Tài liệu, FAQs  │ 🚫 BỊ CHẶN khỏi Quản lý Nhân sự    │
│                           │ • Bố cục Trang (Home, About Us)     │                                    │
│                           │ • Media Studio (Tải ảnh lên)        │                                    │
├───────────────────────────┼─────────────────────────────────────┼────────────────────────────────────┤
│ 📋 HR / Reviewer          │ • Tuyển dụng Lãnh đạo (Xem CV, ATS) │ 🚫 BỊ CHẶN khỏi Content Studios   │
│   (reviewer / hr)         │ • Đọc 9 câu hỏi đánh giá ứng viên   │ 🚫 BỊ CHẶN khỏi Page Builder       │
│                           │ • Đổi trạng thái ứng viên (Pipeline)│ 🚫 BỊ CHẶN khỏi Cài đặt Website    │
│                           │ • Lưu Ghi chú & Đánh giá nội bộ     │ 🚫 BỊ CHẶN khỏi Quản lý Nhân sự    │
│                           │ • Duyệt hồ sơ Đăng ký Tổ chức       │ 🚫 BỊ CHẶN khỏi Xóa tệp Media      │
│                           │ • Hòm thư Tin nhắn & Phản hồi       │                                    │
│                           │ • Xuất file Excel/CSV Nhà hảo tâm   │                                    │
├───────────────────────────┼─────────────────────────────────────┼────────────────────────────────────┤
│ 👁️ Viewer / Auditor      │ • Xem Tổng quan & Số liệu Báo cáo   │ 🚫 KHÔNG CÓ QUYỀN GHI / SỬA / XÓA  │
│   (viewer / auditor)      │ • Đọc nội dung & Bố cục (Chỉ xem)   │ 🚫 KHÔNG đổi trạng thái ứng viên   │
│                           │ • Đọc hồ sơ ứng viên (Thanh tra)    │ 🚫 KHÔNG viết ghi chú nội bộ       │
│                           │ • Xem kho tệp Media                 │ 🚫 KHÔNG tạo/sửa/xóa bài viết      │
│                           │                                     │ 🚫 BỊ CHẶN khỏi Settings & Staff   │
└───────────────────────────┴─────────────────────────────────────┴────────────────────────────────────┘
```

### 8.2 Cơ chế Khóa 3 Lớp

1. **Lớp 1: Khóa Đường dẫn URL (`PortalAuthGuard.tsx`):**
   - Nếu tài khoản HR cố tình nhập URL của Biên tập viên như `/portal/projects` hoặc tài khoản Biên tập viên vào `/portal/settings`, Guard chặn ngay lập tức và hiển thị màn hình **Ant Design `403 — Access Restricted`**.
2. **Lớp 2: Khóa Nút Thao tác trên Giao diện (`useRolePermissions.ts`):**
   - Khi tài khoản **Viewer / Auditor** đăng nhập, hệ thống tự động ẩn hoặc vô hiệu hóa (`disabled`) toàn bộ các nút *"Add New"*, *"Edit"*, *"Delete"*, *"Save Draft"*, *"Publish Live"*.
   - Trong ATS: Dropdown chuyển trạng thái biến thành thẻ Tag tĩnh; ô nhập Ghi chú nội bộ chuyển sang chế độ `readOnly` và nút *"Save Notes"* biến mất.
3. **Lớp 3: Điều hướng Tuyệt đối Chống Lặp vô tận (`PortalRoutes.tsx`):**
   - Mọi điều hướng fallback đều sử dụng đường dẫn tuyệt đối `ROUTES.PORTAL.DASHBOARD` (`/portal/dashboard`), loại bỏ hoàn toàn lỗi đệ quy lặp vô hạn `dashboard/dashboard/dashboard...` của React Router.

---

### 8.3 Các Tính năng Nổi bật trong Management Portal

- **Candidate ATS (Tuyển dụng Lãnh đạo):** Chuyển đổi linh hoạt giữa giao diện **Bảng Pipeline (Kanban Board)** và **Bảng Dữ liệu (Data Table)**. Cho phép xem trực tiếp hồ sơ CV/Resume định dạng PDF ngay trong Drawer mà không cần tải file về máy.
- **Sắp xếp FAQ bằng Kéo thả (`/portal/faqs`):** Giao diện bảng cho phép đổi thứ tự câu hỏi và bấm *"Save Reordered Priority"* để lưu trực tiếp vào cơ sở dữ liệu.
- **Xem trước Văn bản & Media In-Browser:** Xem trực tiếp PDF của các tài liệu chính sách hoặc ảnh trên Cloudinary trong popup tiện lợi.
- **Xuất Báo cáo Excel/CSV Chuẩn UTF-8:** Hỗ trợ xuất danh sách nhà hảo tâm và ứng viên kèm dấu tiếng Việt chuẩn xác cho Microsoft Excel qua `src/portal/utils/csv.ts`.

---

## 9. Biểu mẫu Người dùng & Xử lý Dữ liệu An toàn

Hệ thống cung cấp 4 biểu mẫu người dùng, được bảo vệ với cơ chế an toàn:

1. **Liên hệ & Đối tác (`/contact`)**
2. **Ứng tuyển Lãnh đạo / Giám đốc Châu lục (`ApplyRoleModal`)**
3. **Đăng ký Thành viên Tổ chức (`RegisterOrganizationModal`)**
4. **Hộp thư Động viên & Quyên góp (`SupportModal`)**

### Các Cải tiến Bảo vệ Dữ liệu Biểu mẫu:
- **Bảo toàn Dữ liệu Form Nhiều Bước:** Sử dụng `preserve={true}` và giữ các bước luôn tồn tại trong DOM (`style={{ display: step === '...' ? 'block' : 'none' }}`), giúp dữ liệu không bị xóa mất khi người dùng chuyển bước (khắc phục triệt để lỗi thiếu `fullName`, `email`, `projects`, `letter`).
- **Tự động Nhận diện Dự án Đang xem:** Khi người dùng bấm nút ủng hộ trên trang chi tiết một dự án (`/projects/:id`), form quyên góp sẽ tự động tích chọn sẵn dự án đó.
- **Chuẩn hóa Tên Dự án Thay vì Mã Hash:** Lưu trữ tên dự án thực tế (`p.name`) thay vì mã hash database (`kejykakupvhr4...`), giúp email gửi đi và bảng quản trị hiển thị tên dự án rõ ràng, chuyên nghiệp.
- **Xử lý Lỗi Tường minh (No Fake Success):** Nếu có lỗi mạng hoặc lỗi API (mã 400/500), form hiển thị thanh thông báo lỗi màu đỏ (`<Alert type="error" />`) và giữ nguyên dữ liệu đã nhập để người dùng gửi lại, tuyệt đối không chuyển sang màn hình cảm ơn giả lập.

---

## 10. Design System, Nhận diện Thương hiệu & Native Web Share

### 10.1 Bảng màu Chuẩn Thương hiệu Y.O.U
- **Màu Xanh Đậm (Deep Navy - Footer/Banners):** `#0B1A2B`
- **Màu Xanh Hoàng gia (Royal Blue - Nút bấm chính/Link):** `#005D9A` (hoặc `#1771B9`)
- **Màu Đỏ Năng động (Vibrant Red - Điểm nhấn/Nút CTA):** `#EE334E`
- **Màu Nền Xanh Nhạt (Soft Background):** `#F2F7FF`
- **Dải màu Cầu vồng Đặc trưng (Signature 4-Color Rainbow Gradient):**
  ```css
  background: linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%);
  ```
- **Bộ màu 17 Mục tiêu SDG:** Đồng bộ 100% mã màu chuẩn của Liên Hợp Quốc giữa `src/config/theme/tokens.ts` và `src/data/sdgs.ts`.

### 10.2 Nút Chia sẻ Đa nền tảng: `<ShareButton />` (`src/components/shared/ShareButton/`)
Được tích hợp đồng bộ trên trang Chi tiết Dự án, Chi tiết Thành viên và Chi tiết Bài viết Tin tức:
- **Trên Thiết bị Di động / Trình duyệt Hỗ trợ:** Kích hoạt bảng chia sẻ gốc của hệ điều hành (**Native Web Share API**) để gửi qua WhatsApp, Zalo, Messenger, LinkedIn, X, AirDrop.
- **Trên Máy tính bàn:** Tự động sao chép liên kết vào bộ nhớ tạm (Clipboard), hiển thị thông báo song ngữ mượt mà (*"Link copied to clipboard!"* hoặc *"Đã sao chép liên kết vào bộ nhớ tạm!"*), đồng thời icon chuyển thành dấu tích xanh (`check`) trong 2 giây.
- **An toàn khi Hủy:** Bắt lỗi `AbortError` mượt mà khi người dùng đóng bảng chia sẻ mà không báo lỗi đỏ trên màn hình.

---

## 11. Hướng dẫn Cài đặt, Kiểm thử & Quy tắc Phát triển

### 11.1 Khởi chạy Môi trường Phát triển (Local Development)

```bash
# Bước 1: Di chuyển vào thư mục frontend
cd cseglobaldev-code-youth

# Bước 2: Cài đặt dependencies (React 19, Ant Design v6)
npm install

# Bước 3: Chuẩn bị file cấu hình môi trường
cp .env.example .env.local

# Bước 4: Khởi chạy ứng dụng với Vite
npm run dev
```
- **Website công khai:** `http://localhost:5173/`
- **Management Portal:** `http://localhost:5173/portal/login`

### 11.2 Chạy Bộ Kiểm thử 
```bash
npm run test:run
```
*Nên đảm bảo các bài kiểm tra API Mappers, Logic Phân quyền, Định dạng Thời gian, và Quy tắc Proxy Cloudflare đều đạt kết quả xanh (PASS).*

---

### QUY TẮC PHÁT TRIỂN

1. **Quy tắc Cách ly Portal:** Mọi tính năng, trang và thành phần của khu vực quản trị phải được đặt trọn vẹn trong thư mục `src/portal/`. Không bao giờ chỉnh sửa các component của Public Website để phục vụ riêng cho Portal.
2. **Quy tắc An toàn Dữ liệu Hình ảnh:** Luôn sử dụng component `<ImageWithFallback />` thay vì thẻ `<img>` truyền thống để tự động hiển thị biểu tượng placeholder trung tính khi đường link ảnh bị hỏng hoặc chưa kịp tải.
3. **Quy tắc Ngôn ngữ Toàn diện:** Mọi chuỗi ký tự hiển thị trên giao diện đều phải được khai báo trong `src/locales/en.ts` và `src/locales/vi.ts`, sau đó gọi qua hook `useLanguage()`. Tuyệt đối không viết cứng chuỗi tiếng Anh hoặc tiếng Việt vào mã nguồn JSX.
4. **Quy tắc Least Privilege (Quyền Tối thiểu):** Các tài khoản nhân sự mới hoặc chưa phân loại vai trò rõ ràng bắt buộc phải rơi vào trạng thái mặc định an toàn là **`Viewer / Auditor` (Chỉ đọc)**. Quyền chỉnh sửa nội dung hoặc duyệt tuyển dụng chỉ được mở khi có chỉ định cụ thể từ Super Admin.