# PROJECT SNAPSHOT (ONE-PAGER)
*Last Updated: 28/08/2026*

| Hạng mục | Nội dung / Trạng thái |
| :--- | :--- |
| **Dự án** | Protools.com.vn — Nền tảng phân phối thiết bị cơ khí, dụng cụ công nghiệp B2B & Murrplastik Brand Hub |
| **Giai đoạn (Phase)** | **Phase 1: OS Bootstrap & Murrplastik Subpage Isolation Integration** |
| **Tech Stack Hiện Tại** | Frontend: React 18, TypeScript, Vite, Tailwind CSS (Core App). Subpage: Static HTML5/CSS3/JS, Three.js 3D Viewer (`/murrplastik/`). Hosting: Mắt Bão LiteSpeed. |
| **Tech Stack Chưa Chốt** | Lựa chọn công nghệ Backend API cụ thể (Node.js/FastAPI/Laravel 11) cho Phase 3. *(Đã chốt kiến trúc: Independent Backend - ADR-004)*. |
| **Mục tiêu hiện tại** | Duy trì trang chủ PHP CMS cũ nguyên bản trên Production, vận hành phân vùng `/murrplastik/` độc lập đồng bộ từ local `D:\T&TVina\murrplastik_code`. |
| **Tasks đang chạy (Active)** | - `TASK-001`: Triển khai Antigravity Project OS Bootstrap.<br>- `TASK-005`: Tích hợp & Vận hành Murrplastik Subpage Isolation Hub. |
| **Blockers hiện tại** | Không có (Trang chủ và phân vùng Murrplastik đều hoạt động ổn định `HTTP 200 OK`). |
| **Quyết định mới nhất** | - `ADR-001`: Áp dụng Project OS Bootstrap 3-tier memory.<br>- `ADR-002`: Chuẩn hóa Industrial Precision Design System.<br>- `ADR-003`: Chính sách An toàn WAF Imunify360.<br>- `ADR-004`: Kiến trúc Backend Độc lập Mới (Independent Modern Backend).<br>- `ADR-005`: Chiến lược cô lập thư mục con Subpage Isolation cho Murrplastik Hub. |
| **Rủi ro lớn nhất** | - Vi phạm chính sách WAF Imunify360 gây Auto-Ban IP (Đã có quy tắc phòng vệ).<br>- Xung đột URL Rewrite giữa LiteSpeed root và thư mục con (Đã bypass bằng `RewriteRule ^murrplastik - [L]`). |
