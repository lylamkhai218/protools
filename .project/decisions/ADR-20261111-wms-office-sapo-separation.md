# ADR-20261111: Tách Biệt Luồng Tạo Lô / Kiểm Kho & Bàn Giao Sapo Với Việc Tự Động Ghi Sổ ERP `/office/`

* **Trạng thái**: Approved (11/11/2026)
* **Liên kết**: [`DOI_CHIEU_PLAN_ANTIGRAVITY.md`](file:///d:/T&TVina/Sapo/01_Huong_dan_va_ban_giao/DOI_CHIEU_PLAN_ANTIGRAVITY.md), [`SPEC_SAPO_PREPARATION_DRAFT.md`](file:///d:/T&TVina/Sapo/01_Huong_dan_va_ban_giao/SPEC_SAPO_PREPARATION_DRAFT.md)

## 1. Bối Cảnh (Context)
Khi có lô hàng nhập khẩu mới về kho T&T Vina, dữ liệu đi qua các bước:
1. Tạo hồ sơ lô hàng từ chứng từ gốc (Invoice, Packing List, Tờ khai Hải quan, AWB/Bill).
2. Thủ kho kiểm đếm thực tế tại `/kho/` (quét barcode, đếm thực nhận, xử lý đóng gộp túi / thiếu / thừa, chụp ảnh thực tế, xếp vị trí Hộp/Kệ).
3. Kế toán đối chiếu và xác nhận bảng giá vốn phân bổ (`TONG_HOP_TON_KHO`), kiểm tra chênh lệch làm tròn đơn giá nguyên VNĐ.
4. Người duyệt phê duyệt và xuất 2 mẫu file chuẩn (Danh mục sản phẩm mới tồn = 0 & Đơn nhập hàng chi nhánh `CN3`) để nhập vào phần mềm Sapo, sau đó lưu lại mã `PON...` / `PCN...`.

Trong khi đó, phân hệ `/office/` có bảng `tt_goods_receipts`, `tt_stock_items` và `tt_stock_ledger`. Nếu tự động tạo phiếu `POSTED` hoặc tự động cộng dồn thẻ kho bên `/office/` ngay khi quét kho trên `/kho/` mà chưa xác định rõ hệ thống nào là Nguồn dữ liệu chủ (System of Record), thời điểm ghi nhận và khóa chống ghi trùng (khi 1 SKU nằm ở nhiều dòng hoặc nhiều lô, hoặc có xuất kho giao khách / hoàn trả), sẽ dẫn đến sai lệch tồn kho và lệch giá vốn kế toán.

## 2. Quyết Định (Decision)
1. **Không tự động tạo phiếu `POSTED` hoặc ghi sổ `tt_stock_ledger` bên `/office/` từ `/kho/`** trong giai đoạn này.
2. **Tách biệt rõ Số lượng kiểm nhận (`qty_received_verified`) và Tồn hiện tại (`qty_current_on_hand`)**:
   - Đơn nhập Sapo sử dụng `qty_received_verified` (số lượng thực nhận đủ căn cứ theo chứng từ nhập) và `approved_unit_cost_vnd` (giá vốn kế toán đã xác nhận).
   - Lượng hàng đã xuất giao khách (VD: giao FSTV, QCS) được lưu ở trường riêng (`qty_delivered_out` + `delivery_ref`) để thủ kho trừ riêng, không lấy số còn lại làm số nhập ban đầu.
   - Bảng đọc tồn kho tại [`public/office/api.php`](file:///d:/T&TVina/protools/public/office/api.php) khi tham chiếu `wms_500kg.json` phải tổng hợp theo định danh dòng nguồn (`batch_id + id`) để không bị ghi đè hoặc cộng trùng khi 1 SKU xuất hiện ở nhiều dòng/nhiều lô.
3. **Mọi kiểm thử tạo lô, xử lý chênh lệch và xuất mẫu Sapo bắt buộc chạy trên môi trường Sandbox tách biệt** (`wms_sandbox.json`), tuyệt đối không tạo dữ liệu thử nghiệm trên file dữ liệu Production (`wms_500kg.json`).

## 3. Hệ Quả (Consequences)
- Bảo toàn 100% tính chính xác của dữ liệu kiểm kho Production và sổ kế toán Sapo.
- Giữ đường biên rõ ràng giữa Công cụ kiểm kho `/kho/` và Công cụ chuẩn bị nhập Sapo (`D:\T&TVina\Sapo`) thông qua hợp đồng dữ liệu chung `specs/002-wms-batch-sapo-handover/contracts/sapo-handover.md`.
