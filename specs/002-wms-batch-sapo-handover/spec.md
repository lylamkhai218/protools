# Đặc Tả Kỹ Thuật (Spec) — Quản Lý Lô Hàng Mới, Kiểm Kho & Chuẩn Bị Bàn Giao Sapo (`002-wms-batch-sapo-handover`)

## 1. Mục Tiêu & Phạm Vi
Cung cấp quy trình chuẩn hóa trên `/kho/` để khởi tạo lô hàng mới từ chứng từ, kiểm đếm thực tế có xác nhận theo vai trò, xử lý hàng đóng gộp / thiếu / thừa, đối chiếu giá vốn kế toán đã duyệt, xác minh ảnh và xuất dữ liệu bàn giao sang Sapo theo hợp đồng dữ liệu thống nhất.

## 2. Yêu Cầu Chức Năng Cốt Lõi (Functional Requirements)
- **FR-201 (Vòng đời 5 trạng thái lô)**: Mỗi lô hàng đi qua 5 trạng thái: `DRAFT` (Nháp) -> `IN_INSPECTION` (Đang kiểm) -> `PENDING_DISCREPANCY` (Chờ xử lý chênh lệch) -> `INSPECTED_VERIFIED` (Đã kiểm & Đã đối chiếu) -> `HANDED_OVER_SAPO` (Đã bàn giao Sapo).
- **FR-202 (Truy xuất nguồn gốc dòng & Chống tạo trùng)**: Mỗi dòng hàng lưu `batch_id`, `source_line_id` (mã dòng chứng từ gốc), `source_file_name`, `source_row_index`, người kiểm (`inspected_by`), thời điểm (`inspected_at`) và mảng lịch sử sửa đổi (`revision_history`). Chặn tạo trùng khi trùng số hóa đơn / vận đơn / tờ khai hoặc mã dòng nguồn (`batch_id + source_line_id`) hoặc `Idempotency-Key`.
- **FR-203 (Kiểm đếm hàng đóng gộp, thiếu, thừa và chưa phân bổ)**:
  - Không tự động đánh dấu đủ theo Invoice.
  - Khi 1 SKU có nhiều dòng trong cùng lô (như `87121110`: 1 + 4 = 5), hệ thống chỉ gợi ý phân bổ sau khi thủ kho nhập tổng thực đếm vật lý và bấm xác nhận.
  - Hỗ trợ đầy đủ 4 trạng thái phân bổ: `ALLOCATED_MATCHED` (Đủ khớp tổng), `SHORTAGE` (Nhận thiếu, tách riêng `qty_shortage`, không đưa lượng thiếu vào đơn nhập Sapo), `OVERAGE` (Nhận thừa, giữ `qty_overage` chờ đối chiếu), và `UNALLOCATED` (Chưa xác định phân bổ dòng).
- **FR-204 (Tách biệt 3 lớp giá & Ghi nhận lệch làm tròn)**:
  - `estimated_cost_vnd`: Giá ước tính từ tỷ giá và hệ số chi phí, gắn nhãn `[ƯỚC TÍNH]`, lưu nguồn và công thức.
  - `customs_taxable_unit_vnd`: Trị giá tính thuế hải quan từ tờ khai thông quan.
  - `accounting_cost`: Giá vốn kế toán đã xác nhận (`accounting_allocated_total_vnd`, `accounting_unit_cost_exact`, `sapo_unit_cost_rounded`, `rounding_diff_vnd`, `cost_status`: `ESTIMATED` | `PENDING_ACCOUNTING` | `ACCOUNTING_CONFIRMED`). Chỉ cho phép xuất vào đơn nhập Sapo khi `cost_status === 'ACCOUNTING_CONFIRMED'`.
- **FR-205 (Gợi ý có nguồn & Xác nhận ảnh)**:
  - Thông tin lấy từ Catalog / lịch sử gắn trạng thái `SUGGESTED` kèm `source_ref`; cảnh báo khi trùng barcode hoặc lệch mã SKU hãng vs SKU Sapo (VD: `83691502` vs `PVN11009`).
  - Phân biệt `img_studio` (Ảnh hãng) và `img_real` (Ảnh thực tế tại kho); yêu cầu người kiểm tra xác nhận ảnh đúng SKU (`image_verified = true`). Khi xuất Sapo, SKU và `verified_image_url` nằm trên cùng dòng đã duyệt.
- **FR-206 (Hợp đồng bàn giao Sapo & Ghi nhận PON/PCN)**:
  - Xuất dữ liệu bàn giao theo đúng schema chung và 2 mẫu Sapo hiện hành (Mẫu 1: Danh mục sản phẩm mới tồn ban đầu = 0; Mẫu 2: Đơn nhập hàng chi nhánh `CN3` chỉ gồm dòng đã xác nhận thực nhận > 0 và giá kế toán đã duyệt).
  - Lưu kết quả nhập (`pon_code`, `pcn_code`, `return_prn_code`, `imported_by`, `imported_at`) để khóa dòng/lô, chống nhập lại.
- **FR-207 (Tài khoản cá nhân, Phân quyền RBAC & Sandbox cách ly)**:
  - Xác thực định danh cá nhân theo 4 vai trò: `PREPARER`, `WAREHOUSE`, `ACCOUNTANT`, `APPROVER` (hoặc `ADMIN`). Bảo vệ trường giá vốn đối với vai trò không có quyền.
  - Hỗ trợ chế độ Sandbox cô lập (`wms_sandbox.json`) để chạy toàn bộ kiểm thử tự động mà không chạm vào dữ liệu Production (`wms_500kg.json`).
