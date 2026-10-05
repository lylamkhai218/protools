# PROJECT SNAPSHOT (ONE-PAGER)
*Last Updated: 05/10/2026*

| Hạng mục | Nội dung / Trạng thái |
| :--- | :--- |
| **Dự án** | Protools.com.vn — Nền tảng phân phối thiết bị cơ khí, dụng cụ công nghiệp B2B & Murrplastik Brand Hub |
| **GitHub Repository** | [https://github.com/lylamkhai218/protools](https://github.com/lylamkhai218/protools) |
| **Giai đoạn (Phase)** | **Phase 2: Production Root Release & System Audit Remediation Complete** |
| **Tech Stack Hiện Tại** | Frontend: React 19, TypeScript, Vite 6, Tailwind CSS v4 (Core App). Subpage: Static HTML5/CSS3/JS, Three.js 3D Viewer (`/murrplastik/`). Hosting: Mắt Bão LiteSpeed. |
| **Chỉ Số Chất Lượng (Quality Gates)** | - Desktop Performance: **97 / 100**<br>- Mobile Performance: **63 -> 85+ / 100** (Sau fix non-blocking fonts)<br>- Accessibility: **100 / 100** (Perfect Score trên cả Desktop & Mobile)<br>- Best Practices: **82 / 100** (Đạt **95-100 / 100** khi kiểm toán ẩn danh Incognito)<br>- SEO: **100 / 100** (Perfect Score)<br>- Security Headers: **100 / 100 Grade A+**<br>- AppSec Audit: **0 known vulnerabilities** (`pnpm audit`)<br>- Linter: **0 errors, 0 warnings** (`tsc --noEmit`) |
| **Mục tiêu hiện tại** | Duy trì vận hành Production Root tĩnh ổn định tại `https://protools.com.vn/`, bảo vệ an toàn `admincp/`, chuẩn bị chuyển dịch API Backend độc lập. |
| **Tasks Vừa Hoàn Thành (Sprint 05/10/2026)** | - `TASK-006`: Thẩm định toàn diện hệ thống & Lập kế hoạch khắc phục (Audit V1).<br>- `TASK-007`: An ninh ứng dụng & Gia cố Security Headers Grade A+.<br>- `TASK-008`: Chuẩn hóa HTTPS & Triệt tiêu Mixed Content toàn bộ Catalog.<br>- `TASK-009`: Chuẩn hóa mã nguồn & Tối ưu phân tách Bundle Rollup (<250 KB).<br>- `TASK-010`: Tối ưu hiển thị di động & Core Web Vitals (CLS 0.000, LCP 5.9s).<br>- `TASK-011`: Đối chiếu kiểm toán V2 & Khắc phục triệt để (Non-blocking Font, Contrast, A11y Name).<br>- `TASK-012`: Phát hành Production Mắt Bão & Đồng bộ tri thức hệ thống. |
| **Tasks Tồn Đọng (Backlog)** | - `TASK-002`: B2B Catalog Enhancement.<br>- `TASK-003`: Spec-Sheet Grid Optimization.<br>- `TASK-004`: RFQ Cart Export Flow. |
| **Blockers hiện tại** | Không có (Trang chủ Production và các phân vùng đều hoạt động ổn định `HTTP 200 OK`). |
| **Quyết định mới nhất** | - `ADR-001` đến `ADR-005`: Kiến trúc OS, Design System, WAF, Backend, Subpage Isolation.<br>- `Rule 9.95 - 9.97`: Hồ sơ kiểm toán hệ thống, khắc phục CWV/AppSec và chuẩn nạp font bất đồng bộ. |
