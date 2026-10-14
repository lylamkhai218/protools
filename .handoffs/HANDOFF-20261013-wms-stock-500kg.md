# HANDOFF: Hệ Thống WebApp Kiểm Kho, Quét Mã Vạch & Định Vị Lô Hàng 500kg Murrplastik (`/kho/`)

- **Ngày thực hiện**: `13/10/2026`
- **Đường dẫn Production Live**: `https://protools.com.vn/kho/`
- **Đường dẫn Mã nguồn trong Project `protools`**:
  - Giao diện WebApp Mobile/Desktop: `public/kho/index.html`
  - Backend PHP API (Lưu trạng thái kiểm, Upload ảnh thực tế, Xuất CSV Sapo): `public/kho/api.php`
  - Cấu hình Header mở quyền Camera (`Permissions-Policy: camera=(self)`): `public/kho/.htaccess`
  - Cơ sở dữ liệu JSON đồng bộ 261 dòng hàng: `public/kho/data/wms_500kg.json`
  - File Excel Checklist 4 Thùng: `public/kho/data/Checklist_Kiem_Ke_4_Thung_Stock_500kg.xlsx`
  - File Excel Bàn giao Nhập Kho Sapo: `public/kho/data/Ban_Giao_Kho_Sapo_Stock_500kg.xlsx`
  - Thư mục lưu ảnh chụp thực tế tại kho: `public/kho/uploads/`
  - Script deploy nhanh lên FTP Mắt Bão: `deploy_wms_kho.py`

## Trạng Thái Dữ Liệu Lô Hàng 500kg Hiện Tại
1. **Tổng số dòng hàng**: `261 dòng` (4 Thùng Pallet: Thùng 1 = 157 dòng, Thùng 2 = 68 dòng, Thùng 3 = 7 dòng, Thùng 4 = 29 dòng).
2. **Ảnh sản phẩm**:
   - Đã tích hợp **100% (261/261 dòng)** ảnh chuẩn Studio từ Murrplastik CloudFront CDN (`58QAQNDEVQ`).
   - Đã đính kèm sẵn 2 ảnh chụp thực tế mẫu (`Thung1_STT002_83728515.png` và `Thung1_STT012_83728527.png`).
3. **Trạng thái kiểm Thùng 1**:
   - Đã tích `Đã kiểm đủ (Checked = true)` cho **152/157 mã**.
   - Đánh dấu nổi bật **5 mã chưa thấy hàng** (`STT 40: 83621862`, `STT 41: 83621856`, `STT 42: 83641448`, `STT 126: 87303095`, `STT 144: 87121384`) để tìm/đối soát khi khui Thùng 2, 3, 4.
4. **Quy hoạch vị trí kho**:
   - Kết hợp **18 Hộp/Thùng Phân Loại Cùng Nhóm (`BOX-01` -> `BOX-17` + `KO-01..03`)** và mã vị trí **`Kệ - Tầng - Hộp` (`K1-T2`, `K2-T3`...)**.
