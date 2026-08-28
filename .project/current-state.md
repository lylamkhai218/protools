# CURRENT STATE AUDIT & DISCOVERY LOG
*Last Updated: 21/08/2026*

## 1. PHÂN LOẠI TRẠNG THÁI TRI THỨC (KNOWLEDGE CONFIDENCE)

### 🟢 KNOWN (Đã xác thực 100% bằng chứng thực tế)
- Domain chính: `https://protools.com.vn/`
- Máy chủ: Mắt Bão Cloud Network (`s2d34.cloudnetwork.vn` - IP `112.78.2.34`, Port DirectAdmin `2222`).
- Web Server: LiteSpeed Web Server, hỗ trợ `.htaccess` mod_rewrite cho Single Page Application.
- Database Engine: MariaDB 10.6 (`prod2e4e_db`), chứa 67 bảng từ hệ thống legacy WordPress.
- Hệ thống an ninh: Tường lửa Imunify360 (WAF) + ModSecurity, tự động ban IP nếu phát hiện HTTP SQL Bridge hoặc query `information_schema` qua POST.
- Mã nguồn hiện tại trong `src/`: React 18, TypeScript, Tailwind CSS, Vite, Lucide React icons.
- Design System: Industrial Precision (Barlow Condensed, IBM Plex Sans, 4px grid).
- Tỷ lệ người dùng thực địa: ~92% kỹ sư hiện trường sử dụng Mobile.

### 🟡 DECIDED (Đã thống nhất chiến lược)
- `ADR-001`: Triển khai Project OS Bootstrap theo chuẩn Antigravity 2.0.
- `ADR-002`: Xây dựng giao diện B2B Industrial Precision với Mobile-first, Spec-sheet Grid và Touch Target 48px.
- `ADR-003`: Cấm tuyệt đối SQL Bridge Scripts qua Web để phòng thủ WAF Imunify360.
- `ADR-004`: Lựa chọn B — Xây dựng Backend Độc lập Hiện đại (New Independent Modern Backend), không phụ thuộc vào mã nguồn WordPress legacy.
- `ADR-005`: Áp dụng chiến lược Subpage Isolation Architecture cho phân vùng `/murrplastik/`.

### 🟢 NEW KNOWN (Đã nghiệm thu ngày 28/08/2026)
- **Trang chủ Production**: `https://protools.com.vn/` chạy PHP CMS nguyên bản, đảm bảo hoạt động kinh doanh liên tục.
- **Phân vùng Murrplastik Hub**: `https://protools.com.vn/murrplastik/` chạy độc lập tại `/public_html/murrplastik/`, đã đồng bộ 244 file từ `D:\T&TVina\murrplastik_code` (gồm 5 nhóm sản phẩm ACS, SUV, KDH, EFK, AUR, 2 ngành công nghiệp F&B, Ô tô, và trình xem 3D interactive viewer).

---

## 2. HIỆN TRẠNG MÃ NGUỒN FRONTEND
- [`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx): Routing chính cho các trang Home, ProductDetail, CartQuote, DocumentCenter, AdminDashboard.
- [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx) & [`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx): Header/Footer theo định hướng B2B.
- [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts): Mock data sản phẩm cơ khí (mũi phay, dao tiện, đầu kẹp, thiết bị đo).
- [`sync_murrplastik_to_prod.py`](file:///d:/T&TVina/protools/sync_murrplastik_to_prod.py): Script đồng bộ dữ liệu tự động giữa local `D:\T&TVina\murrplastik_code` và `/public_html/murrplastik/`.
