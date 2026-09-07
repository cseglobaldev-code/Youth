# 📘 TÀI LIỆU KỸ THUẬT
## DỰ ÁN: Y.O.U (YOUTH ORGANIZATION UNION) PLATFORM
*Phiên bản: 2.0 — Cập nhật lần cuối: Tháng 9/2026*

---

## 📑 MỤC LỤC
1. [Tổng quan Hệ thống & Triết lý Kiến trúc](#1-tổng-quan-hệ-thống--triết-lý-kiến-trúc)
2. [Cấu trúc Thư mục Dự án (Frontend Repository)](#2-cấu-trúc-thư-mục-dự-án-frontend-repository)
3. [Cơ chế Kết nối & Giao tiếp với Backend Strapi v5](#3-cơ-chế-kết-nối--giao-tiếp-với-backend-strapi-v5)
4. [Data Layer: Parsers, Mappers & AST Renderers](#4-data-layer-parsers-mappers--ast-renderers)
5. [Hệ thống Dynamic Zone & 13 Section Blocks](#5-hệ-thống-dynamic-zone--13-section-blocks)
6. [Hệ thống Đa ngôn ngữ (English ⇄ Tiếng Việt)](#6-hệ-thống-đa-ngôn-ngữ-english--tiếng-việt)
7. [Cơ chế Xem trước Nội dung CMS theo Thời gian thực (Live Preview)](#7-cơ-chế-xem-trước-nội-dung-cms-theo-thời-gian-thực-live-preview)
8. [Management Portal (`/portal`) & Hệ thống Phân quyền 4 Roles](#8-management-portal-portal--hệ-thống-phân-quyền-4-roles)
9. [Luồng Form Submissions & Email Tự động (LarkSuite SMTP)](#9-luồng-form-submissions--email-tự-động-larksuite-smtp)
10. [Design System & Quy chuẩn Nhận diện Thương hiệu](#10-design-system--quy-chuẩn-nhận-diện-thương-hiệu)
11. [Hướng dẫn Cài đặt, Kiểm thử & Quy trình Làm việc](#11-hướng-dẫn-cài-đặt-kiểm-thử--quy-trình-làm-việc)

---

## 1. Tổng quan Hệ thống & Triết lý Kiến trúc

Dự án **Y.O.U (Youth Organization Union)** là một nền tảng quy mô toàn cầu kết nối các tổ chức thanh niên trên 6 châu lục. Hệ thống được xây dựng theo mô hình **Decoupled Headless CMS**, tối ưu hóa hiệu năng tối đa trên **Edge Network** (Cloudflare Workers) và tính năng quản trị dễ dùng cho nhân sự phi kỹ thuật.

### 🏛️ Sơ đồ Kiến trúc Tổng thể (System Topology)

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    NGƯỜI DÙNG TRUY CẬP                 │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                                                           ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             CLOUDFLARE EDGE WORKER (SPA + PROXY)                                 │
│                                                                                                                  │
│   🌐 1. Public Visitor SPA (React 19)                           👑 2. Management Portal (/portal)               │
│      • Trang chủ (/), Về chúng tôi (/about-us)                     • Dashboard tổng quan & chỉ số                │
│      • Tổ chức thành viên (/members), Dự án (/projects)            • Content Studio (Projects, News, Members...) │
│      • Tin tức & Báo chí (/news), Tài liệu (/policy-documents)     • Candidate ATS (Vetting ứng viên & xem CV)   │
│      • Form ứng tuyển, Đăng ký, Quyên góp                          • Media Studio & Quản trị Settings/Users      │
│            │                                                              │                                      │
│            └──────────────────────────────┬───────────────────────────────┘                                      │
│                                           │ Cùng gọi Same-Origin: /api/*                                         │
│                                           ▼                                                                      │
│                                ⚡ EDGE CMS PROXY HANDLER                                                         │
│                                  • Bơm Bearer Token bảo mật                                                      │
│                                  • Kiểm soát Method (GET, POST, PUT, DELETE, OPTIONS)                            │
│                                  • Điều hướng Preview Status (draft/published)                                   │
└───────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────┘
                                            │ Upstream HTTPS
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       STRAPI v5 HEADLESS BACKEND (VPS / DOCKER)                                  │
│                                                                                                                  │
│   • Document Service API (Tự động hỗ trợ documentId, Draft & Publish)                                            │
│   • Custom Portal Auth Controller (/api/portal-auth/login - bcrypt verification & Master Token)                  │
│   • Asynchronous Email Dispatcher (Nodemailer + LarkSuite SMTP, non-blocking setImmediate)                       │
│   • Cloudinary Media Storage Adapter                                                                             │
│   • Database: SQLite (Dev) / PostgreSQL (Production)                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cấu trúc Thư mục Dự án (Frontend Repository)

```
src/
├── api/                   # Các module gọi API nghiệp vụ (Projects, Members, News, Pages, v.v.)
│   ├── strapi.ts          # Core Client: resolveConfig, In-Memory TTL Cache, parseStringArray, mapSocialLinks
│   ├── applications.ts    # API gửi Form: Leadership, Organization, Support
│   ├── documents.ts       # API lấy Policy Documents từ CMS
│   ├── faqs.ts            # API lấy FAQs kèm displayOrder
│   ├── global.ts          # API cấu hình toàn cục (Hotline, Ngân hàng, QR Code)
│   ├── inquiries.ts       # API gửi liên hệ Contact Us
│   ├── leadership.ts      # API lấy danh sách Ban Lãnh đạo & Giám đốc Châu lục
│   ├── members.ts         # API lấy danh sách & chi tiết Tổ chức Thành viên
│   ├── news.ts            # API lấy tin tức & bài viết chi tiết
│   └── pages.ts           # API lấy nội dung Dynamic Page & Homepage từ Strapi
├── app/                   # Root App Component & Providers bọc ngoài
│   ├── App.tsx            # Entry Router
│   └── AppProviders.tsx   # Tích hợp Ant Design Theme + Ant Design Locale (en_US / vi_VN)
├── components/            # UI Components tái sử dụng cho Public Website
│   ├── documents/         # DocumentRow hiển thị tệp tài liệu
│   ├── dynamic/           # 🌟 BỘ RENDERER DYNAMIC BLOCKS CHO CMS
│   │   ├── BlockRenderer.tsx    # Nhận mảng blocks từ CMS và render component tương ứng
│   │   ├── BlocksRenderer.tsx   # Render Strapi v5 Rich Text Blocks (AST JSON)
│   │   ├── SectionWrapper.tsx   # Wrapper quản lý nền, padding, độ rộng (Container Width)
│   │   └── blocks/              # 13 Components của Dynamic Zone (Hero, CTA, Grid, Gallery...)
│   ├── layout/            # Shell công khai: RootLayout, Header, Footer, Logo
│   ├── leadership/        # Card lãnh đạo (ExecutiveCard, TeamMemberCard, LeaderMemberModal)
│   ├── members/           # Card thành viên (MemberCardLarge)
│   ├── modals/            # Modals: JoinChoiceModal, ApplyRoleModal, RegisterOrgModal, SupportModal
│   ├── projects/          # Card dự án (ProjectCard)
│   ├── shared/            # Components dùng chung: CTABanner, ImageGallery, ShareButton, StatsGrid...
│   └── ui/                # Nguyên tử UI cơ bản: Button, PillButton, SDGTag, Icon, Container, ImageWithFallback
├── context/               # React Context Providers
│   └── LanguageContext.tsx# Quản lý chuyển đổi ngôn ngữ EN ⇄ VI toàn ứng dụng
├── data/                  # Dữ liệu tĩnh bổ trợ (DIAL_CODES cho 97 quốc gia, SDGS_DATA chuẩn UN)
├── hooks/                 # Custom React Hooks: useDisclosure, usePagination, useRolePermissions...
├── lib/utils/             # Helpers tiện ích: format, cn (clsx+tailwind-merge), countryFlag, seo
├── locales/               # Từ điển đa ngôn ngữ (en.ts, vi.ts, types.ts)
├── pages/                 # Các trang công khai (HomePage, AboutPage, ProjectsPage, NewsPage...)
├── portal/                # 👑 SUB-APP MANAGEMENT PORTAL DÀNH CHO ADMIN & STAFF
│   ├── api/               # API độc lập cho Portal (CRUD, File Upload, User Management, ATS)
│   ├── components/        # Components chuyên dụng cho Portal (PortalDataTable, MediaPicker, SdgMultiSelect)
│   ├── context/           # PortalAuthContext (Xác thực Admin JWT, phân quyền 4 roles)
│   ├── pages/             # Dashboard, Content Studio, Page Builders, ATS Review Pipeline, Media Studio
│   └── routes/            # PortalRoutes.tsx (Sub-router bảo vệ bởi PortalAuthGuard)
├── routes/                # Cấu hình định tuyến chính của ứng dụng (AppRouter.tsx, paths.ts)
├── styles/                # Global Styles & Typography (index.css, fonts.css)
└── worker/                # Code Cloudflare Worker Edge Proxy (index.ts, handlers.ts)
```

---

## 3. Cơ chế Kết nối & Giao tiếp với Backend Strapi v5

### 3.1 Luồng Request: Môi trường Local vs Production

1. **Ở môi trường Local (`npm run dev`):**
   - Frontend kết nối trực tiếp đến Strapi qua biến môi trường `VITE_STRAPI_API_URL=http://localhost:1337`.
2. **Ở môi trường Production (Cloudflare Worker):**
   - Không khai báo `VITE_STRAPI_API_URL` ở frontend bundle.
   - Mọi request từ trình duyệt gọi relative path `/api/*` (cùng origin).
   - Cloudflare Worker (`src/worker/handlers.ts`) chặn request `/api/*`, tự động gắn Authorization Header bí mật (`STRAPI_API_TOKEN` từ Cloudflare Secret) và chuyển tiếp an toàn đến máy chủ Strapi.
   - **Tuyệt đối không bao giờ để lộ API Token vào mã nguồn JavaScript gửi về Client.**

### 3.2 Chuẩn Request Helper: `resolveConfig()` (`src/api/strapi.ts`)

Mọi hàm gọi API trong thư mục `src/api/` đều thông qua hàm chuẩn hóa cấu hình:

```typescript
export interface StrapiRequestOptions {
  baseUrl?: string;
  token?: string;
  signal?: AbortSignal;
  bypassCache?: boolean;
  locale?: string;
}

export function resolveConfig(options: StrapiRequestOptions): { baseUrl: string; token?: string } {
  const configuredBaseUrl = import.meta.env.VITE_STRAPI_API_URL || undefined;
  const fallbackBaseUrl = typeof window === 'undefined' ? '' : window.location.origin;
  const baseUrl = (options.baseUrl ?? configuredBaseUrl ?? fallbackBaseUrl).replace(/\/$/, '');
  const token = options.token;
  return { baseUrl, token };
}
```

### 3.3 Cơ chế Cache Bộ nhớ & Bypass khi ở chế độ Preview

Hệ thống có sẵn In-Memory TTL Cache (5 phút) để tối ưu hóa tốc độ tải trang:
- Khi user bình thường duyệt web ➔ Trả dữ liệu từ Cache nếu còn hạn.
- Khi biên tập viên đang ở chế độ **Preview** (`?preview=1` hoặc `bypassCache: true`) ➔ Tự động bỏ qua cache và yêu cầu dữ liệu mới nhất từ Strapi (kèm `status=draft`).

---

## 4. Data Layer: Parsers, Mappers & AST Renderers

Strapi v5 trả về cấu trúc dữ liệu thô dạng Flat Document. Frontend **không bao giờ sử dụng trực tiếp dữ liệu thô** này trên UI mà bắt buộc phải thông qua các hàm Mapper chuẩn hóa.

```
Strapi v5 API Response (Raw)  ──►  Data Mapper (api/*.ts)  ──►  UI Component (Props sạch & an toàn)
```

### 4.1 Parser an toàn chuỗi danh sách quốc gia: `parseStringArray()`

Tránh lỗi vỡ giao diện khi dữ liệu quốc gia được nhập dưới dạng mảng JSON `["Vietnam","Laos"]` hoặc chuỗi phân tách bằng dấu phẩy `"Vietnam, Cambodia, Laos"`:

```typescript
export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  const str = text(value).trim();
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Không phải JSON hợp lệ -> chuyển sang split dấu phẩy
  }
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}
```

### 4.2 Tự động Chuẩn hóa Link Mạng xã hội: `mapSocialLinks()`

Tự động bổ sung `https://` nếu biên tập viên quên nhập giao thức, tránh việc link bị bộ lọc Regex vô tình loại bỏ:

```typescript
export function mapSocialLinks(value: StrapiSocialLink[] | null | undefined): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((link) => VALID_SOCIAL_PLATFORMS.has(text(link.platform)))
    .map((link) => {
      let url = text(link.url).trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return {
        platform: text(link.platform) as SocialLink['platform'],
        url,
      };
    })
    .filter((link) => /^https?:\/\//i.test(link.url));
}
```

### 4.3 Trình dựng Nội dung Rich Text: `<BlocksRenderer />`

Strapi v5 sử dụng định dạng **Blocks JSON AST** (thay vì HTML thuần). File `src/components/dynamic/BlocksRenderer.tsx` chịu trách nhiệm chuyển đổi AST này thành giao diện:
- Tự động gắn tiền tố `baseUrl` cho ảnh cục bộ (`/uploads/...`).
- Hỗ trợ đầy đủ Heading 1–6, Paragraphs, Lists (đánh số & dấu đầu dòng), Quotes, Code Blocks, Inline formatting (Bold, Italic, Code, Underline, Strikethrough) và **Bảng dữ liệu (Table, TableRow, TableCell)**.

---

## 5. Hệ thống Dynamic Zone & 13 Section Blocks

Nền tảng Y.O.U cho phép biên tập viên tùy biến 100% bố cục trang mà không cần lập trình viên sửa code.

```
CMS Page Payload (contentBlocks)  ──►  <BlockRenderer blocks={data.contentBlocks} />  ──►  13 Blocks tương ứng
```

### 📋 Danh mục 13 Dynamic Section Blocks

| Component UID | Tên Khối | Mục đích & Dữ liệu hiển thị |
|---|---|---|
| `sections.hero` | **Hero Section** | Tiêu đề lớn, chữ gradient nổi bật, nút CTA kép, video/ảnh nền |
| `sections.rich-text` | **Rich Text Block** | Nội dung bài viết văn bản dài, trích dẫn, bảng biểu qua Blocks AST |
| `sections.media-text` | **Media & Text (2 Cột)** | Bố cục câu chuyện: Ảnh/Video bên trái hoặc phải kèm chữ bên cạnh |
| `sections.stats-grid` | **Stats Grid** | Bộ đếm số liệu ấn tượng (Tổ chức, Quốc gia, Tình nguyện viên, v.v.) |
| `sections.cta-banner` | **CTA Banner** | Khối kêu gọi hành động với dải màu cầu vồng và nút đăng ký |
| `sections.image-gallery`| **Image Gallery** | Bộ sưu tập ảnh hoạt động với chế độ xem lưới hoặc chế độ Featured |
| `sections.faq-section` | **FAQ Section** | Khối câu hỏi thường gặp dạng Accordion (dùng FAQ chung hoặc custom) |
| `sections.featured-projects` | **Featured Projects** | Nhúng danh sách dự án tiêu biểu theo thẻ Card chuẩn |
| `sections.featured-members` | **Featured Members** | Nhúng danh sách tổ chức thành viên Y.O.U |
| `sections.team-grid` | **Team Grid** | Nhúng danh sách Lãnh đạo điều hành hoặc Giám đốc châu lục |
| `sections.embed` | **Embed Block** | Nhúng Video YouTube (tự convert sang link embed), Google Maps, Iframe |
| `sections.feature-grid`| **Feature / Icon Grid**| Lưới thẻ biểu tượng giới thiệu Sứ mệnh, Giá trị cốt lõi |
| `sections.image-text-grid`| **Activity Circles** | Lưới ảnh tròn/vuông kèm tiêu đề và mô tả hoạt động nổi bật |

### ⚠️ Lưu ý Kỹ thuật Quan trọng (Deep Population trong Strapi v5)

Trong Strapi v5, câu lệnh `populate=*` chỉ tải dữ liệu quan hệ **1 tầng**. Để các khối như `featured-projects` hay `featured-members` hiển thị đầy đủ ảnh con (`outstandingImage`, `logo`, `cover`), truy vấn trong `src/api/pages.ts` bắt buộc phải sử dụng **Wildcard Deep Populate**:

```typescript
query.append('populate[contentBlocks][on][sections.featured-projects][populate][projects][populate]', '*');
query.append('populate[contentBlocks][on][sections.featured-members][populate][members][populate]', '*');
query.append('populate[contentBlocks][on][sections.team-grid][populate][teamMembers][populate]', '*');
```

---

## 6. Hệ thống Đa ngôn ngữ (English ⇄ Tiếng Việt)

Ứng dụng hỗ trợ chuyển đổi song ngữ tức thì 

```
                    ┌────────────────────────────────────────┐
                    │      LanguageProvider (React Context)  │
                    │   State: 'en' | 'vi' (Lưu localStorage)│
                    └───────────────────┬────────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│ Từ điển tĩnh (locales/) │                               │ Ant Design Localization │
│  t.nav.about, t.common  │                               │ DatePicker, Pagination  │
└─────────────────────────┘                               └─────────────────────────┘
```

### 6.1 Cách sử dụng trong Component

Bất kỳ component nào cần hiển thị chuỗi đa ngữ chỉ cần gọi hook `useLanguage()`:

```tsx
import { useLanguage } from '@/context/LanguageContext';

export function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h2>{t.home.ctaBannerTitle}</h2>
      <p>{t.common.keyword}</p>
      <button onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}>
        Switch to {language === 'en' ? 'Tiếng Việt' : 'English'}
      </button>
    </div>
  );
}
```

---

## 7. Cơ chế Xem trước Nội dung CMS theo Thời gian thực (Live Preview)

1. Khi biên tập viên ấn **"Preview"** trong Strapi Admin:
   - Strapi gửi request xác thực qua API Preview của Cloudflare Worker: `/api/preview?url=/projects/project-1&secret=...&status=draft`.
   - Worker xác thực bí mật `PREVIEW_SECRET`, gắn Cookie `you_preview=draft` an toàn và chuyển hướng về frontend: `/projects/project-1?preview=1`.
2. Trên giao diện Frontend:
   - Tham số `?preview=1` được nhận diện.
   - Frontend hiển thị thanh banner màu cam: `Preview Mode: You are viewing a draft version of this page.`
   - Dữ liệu gọi về Strapi tự động bổ sung `&status=draft` và **bỏ qua bộ nhớ đệm (Cache Bypass)** để biên tập viên thấy ngay thay đổi mà không phải chờ 5 phút.

---

## 8. Management Portal (`/portal`) & Hệ thống Phân quyền 4 Roles

Nhằm tối ưu trải nghiệm cho nhân sự phi kỹ thuật (HR, Marketing, Ban đối tác), toàn bộ giao diện quản trị được xây dựng riêng biệt tại `/portal` bằng **Ant Design v6**, hoàn toàn độc lập với giao diện khách công khai.

```
                                  CÁC VAI TRÒ HỆ THỐNG
   👑 Super Admin          ✍️ Content Editor       📋 HR / Reviewer        👁️ Viewer / Auditor
         │                         │                       │                        │
         ▼                         ▼                       ▼                        ▼
 ┌───────────────┐         ┌───────────────┐       ┌───────────────┐        ┌───────────────┐
 │ Full Quyền:   │         │ Quyền Quản trị│       │ Quyền Tuyển   │        │ Quyền Xem     │
 │  • Content    │         │ Nội dung:     │       │ dụng & Duyệt: │        │ Báo cáo:      │
 │  • Builder    │         │  • Projects   │       │  • ATS Tuyển  │        │  • Xem chỉ số │
 │  • ATS Tuyển  │         │  • Members    │       │    dụng (CV)  │        │  • Xem hồ sơ  │
 │    dụng (CV)  │         │  • News       │       │  • Duyệt Org  │        │    ứng viên   │
 │  • Cài đặt &  │         │  • Media      │       │  • Inquiries  │        │  • Xem Dự án  │
 │    Users      │         │  • Builder    │       │  • Postbox    │        │  🚫 KHÔNG CÓ  │
 │               │         │ 🚫 KHÔNG XEM  │      │ 🚫 KHÔNG SỬA  │        │    QUYỀN SỬA  │
 │               │         │    CV / ATS   │       │    NỘI DUNG   │        │    HAY XÓA    │
 └───────────────┘         └───────────────┘       └───────────────┘        └───────────────┘
```

### 8.1 Bộ phân quyền chi tiết (4-Role Matrix)

1. **👑 Super Admin (`admin`):** Toàn quyền truy cập mọi tính năng, cài đặt tài khoản ngân hàng, mã QR, cấu hình nhân sự và duyệt bài.
2. **✍️ Content Editor (`editor`):** Quản lý Dự án, Tổ chức thành viên, Tin tức, Banner trang chủ, Media Studio. Bị **chặn hoàn toàn** khỏi khu vực ATS và hồ sơ CV của ứng viên để bảo mật thông tin cá nhân.
3. **📋 HR / Reviewer (`reviewer`):** Quản lý pipeline tuyển dụng Giám đốc châu lục (ATS), xem trực tiếp CV dạng PDF trên trình duyệt, chấm điểm 9 câu hỏi đánh giá, ghi chú nội bộ, duyệt tổ chức thành viên mới, xuất báo cáo quyên góp ra Excel/CSV. Bị **chặn hoàn toàn** khỏi khu vực sửa nội dung website và cài đặt hệ thống.
4. **👁️ Viewer / Auditor (`viewer`):** Dành cho kiểm toán viên, cố vấn cấp cao. Được phép truy cập xem tất cả các mục nhưng **ở chế độ Chỉ đọc (Read-Only)**. Toàn bộ nút Thêm mới, Sửa, Xóa, Lưu ghi chú và Đổi trạng thái đều bị ẩn hoặc khóa chặt.

### 8.2 Hook Phân quyền Frontend: `useRolePermissions()`

Sử dụng hook này trong mọi trang quản trị để kiểm soát hiển thị các nút thao tác:

```tsx
import { useRolePermissions } from '@/portal/hooks/useRolePermissions';

export function SomeManagerPage() {
  const { canManageContent, isReadOnly } = useRolePermissions();

  return (
    <div>
      {/* Nút thêm mới chỉ hiện với Admin/Editor, tự ẩn với Viewer */}
      {canManageContent && <Button type="primary">Add New Project</Button>}
      
      {/* Khóa form ở chế độ Read-Only */}
      <Input disabled={isReadOnly} />
    </div>
  );
}
```

---

## 9. Luồng Form Submissions & Email Tự động (LarkSuite SMTP)

Hệ thống có 4 biểu mẫu người dùng:

1. **Liên hệ & Đối tác** (`/contact` ➔ `/api/inquiries`)
2. **Ứng tuyển Giám đốc Châu lục** (`ApplyRoleModal` ➔ `/api/leadership-applications`)
3. **Đăng ký Tổ chức Thành viên** (`RegisterOrganizationModal` ➔ `/api/organization-applications`)
4. **Hòm thư Động viên & Quyên góp** (`SupportModal` ➔ `/api/support-submissions`)

### Luồng Gửi Email Hai Chiều Tự Động (Dual-Email Protocol)

Khi người dùng submit biểu mẫu:
1. Dữ liệu được lưu an toàn vào Database Strapi.
2. Hook `afterCreate` tại backend chạy **bất đồng bộ ngầm** (`setImmediate`) để gọi Nodemailer (LarkSuite SMTP / Gmail):
   - 📩 **Email 1 (Staff Alert):** Gửi về hòm thư Admin `info@youthorgunion.org` kèm bảng tóm tắt chi tiết thông tin hồ sơ.
   - 📨 **Email 2 (User Receipt):** Gửi email xác nhận kèm lời cảm ơn và trích dẫn lại nội dung đơn về hòm thư của người nộp.
3. Nếu máy chủ SMTP gặp sự cố hoặc timeout, tiến trình lưu Database **vẫn thành công 100%**, frontend nhận `200 OK` ngay lập tức và người dùng không bao giờ bị đứng màn hình.

---

## 10. Design System & Quy chuẩn Nhận diện Thương hiệu

Khi phát triển component mới, nên tuân thủ một số quy chuẩn nhận diện thương hiệu sau:

### 10.1 Brand Colors
- **Deep Navy (Chủ đạo Footer/Header):** `#0B1A2B`
- **Royal Brand Blue (Nút chính/Link):** `#005D9A` (`#1771B9`)
- **Vibrant Accent Red (Nút CTA/Điểm nhấn):** `#EE334E`
- **Soft Background Light Blue (Nền Card):** `#F2F7FF`
- **Viền chia Gradient Divider:** `linear-gradient(90deg, rgba(194,211,239,0) 0%, rgba(194,211,239,1) 20%, rgba(194,211,239,1) 80%, rgba(194,211,239,0) 100%)`
- **Dải màu Cầu vồng Đặc trưng (Signature Rainbow Gradient):**
  ```css
  background: linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%);
  ```

### 10.2 Kiểu dáng & Typography
- **Font chữ Tiêu đề & Giao diện:** `Open Sans, sans-serif`
- **Font chữ Nội dung đọc dài:** `Inter, sans-serif`
- **Nút bấm Hành động:** Bo tròn dạng viên thuốc `rounded-full` (hoặc `rounded-btn` cho form nhỏ).
- **Thẻ Card & Container:** Bo góc mềm `rounded-2xl` (16px) hoặc `rounded-3xl` (24px/40px).

---

## 11. Hướng dẫn Cài đặt, Kiểm thử & Quy trình Làm việc

### 11.1 Cài đặt Môi trường Phát triển (Local Setup)

#### Bước 1: Khởi động Backend Strapi
```bash
cd alberttrann-youth-cms

# 1. Cài đặt dependencies
npm install

# 2. Tạo dữ liệu mẫu đầy đủ (Dự án, Tổ chức, Tin tức, Lãnh đạo, FAQs, Settings)
npm run seed

# 3. Khởi chạy máy chủ Strapi (chạy tại http://localhost:1337)
npm run develop
```

#### Bước 2: Khởi động Frontend Client
```bash
cd cseglobaldev-code-youth

# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env.local
cp .env.example .env.local

# 3. Khởi chạy máy chủ phát triển Vite (chạy tại http://localhost:5173)
npm run dev
```

### 11.2 Chạy Bộ Kiểm thử Tự động (Unit Tests)
```bash
cd cseglobaldev-code-youth
npm run test:run
```
*Tất cả các bài test kiểm tra API Mappers, Helper chuyển đổi ngày tháng, Quy tắc Proxy Cloudflare và Preview Policy nên đạt 100% trạng thái Pass.*

### 11.3 Tài khoản Quản trị Mặc định trên Môi trường Local
- **Trang đăng nhập Portal:** `http://localhost:5173/portal/login`
- **Email:** `<email>@gmail.com`
- **Mật khẩu:** Mật khẩu Admin bạn thiết lập khi khởi tạo Strapi.

---

###  QUY TẮC 

1. **DO:**
   - Luôn sử dụng component `<ImageWithFallback />` thay vì thẻ `<img>` trần để tránh lỗi ảnh vỡ khi link hỏng.
   - Luôn sử dụng hook `useLanguage()` để lấy chuỗi chữ hiển thị thay vì viết cứng tiếng Anh hoặc tiếng Việt vào JSX.
   - Mọi form submit lên Strapi phải xử lý lỗi trong khối `catch` bằng cách hiện thông báo lỗi (`Alert` / `message.error`), tuyệt đối không được chuyển sang màn hình thành công giả lập khi request thất bại.

2. **DON'T:**
   - **Không bao giờ** đặt token bí mật vào biến `VITE_*` vì biến này sẽ bị đóng gói công khai vào file Javascript gửi về trình duyệt người dùng.
   - **Không bao giờ** sửa trực tiếp code hiển thị của khách công khai khi đang làm tính năng cho `/portal`. Toàn bộ code admin phải được cô lập hoàn toàn bên trong thư mục `src/portal/`.
   - **Không bao giờ** dùng `JSON.parse()` trực tiếp trên dữ liệu CMS mà không bọc `try...catch` hoặc không qua hàm `parseStringArray()`.