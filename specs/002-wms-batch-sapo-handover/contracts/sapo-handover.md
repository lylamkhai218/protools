# Hợp Đồng Dữ Liệu & API — Tạo Lô, Kiểm Kho & Bàn Giao Sapo (`contracts/sapo-handover.md`)

## 1. Các Vai Trò & Phân Quyền (RBAC Matrix)

| Vai trò (`role`) | Quyền hạn trên `/kho/` | Quyền xem Giá vốn Kế toán |
| :--- | :--- | :--- |
| `PREPARER` | Tạo lô nháp (`DRAFT`), xem trước ghép cột (`preview_new_batch`), cập nhật chứng từ nguồn. | Chỉ xem giá ước tính |
| `WAREHOUSE` | Quét kiểm đếm (`update_item`), xác nhận phân bổ gộp/thiếu/thừa (`allocate_sku_group`), chụp ảnh thực tế, xếp vị trí kệ/hộp. | Ẩn giá vốn kế toán |
| `ACCOUNTANT` | Nạp và xác nhận giá vốn kế toán phân bổ (`update_accounting_cost`), kiểm tra chênh lệch làm tròn (`rounding_diff_vnd`), xem toàn bộ báo cáo giá. | Toàn quyền xem & xác nhận |
| `APPROVER` / `ADMIN` | Toàn quyền các bước trên + Duyệt xác nhận ảnh/SKU (`verify_item_handover`), xuất gói bàn giao Sapo (`export_sapo_handover`), ghi nhận kết quả `PON`/`PCN` (`record_sapo_import`). | Toàn quyền |

## 2. Danh Sách Endpoints API (`/kho/api.php`)

Mọi thao tác ghi (`POST`) yêu cầu phiên đăng nhập hợp lệ, kiểm tra quyền theo `role`, và ghi nhật ký kiểm toán (`revision_history` / `audit_log`) gắn với `user_id` + `user_name` + `role`. Hỗ trợ tham số môi trường/query `sandbox=1` (chỉ thao tác trên `data/wms_sandbox.json`).

| Action (`?action=...`) | Method | Vai trò cho phép | Mô tả & Điều kiện tiên quyết |
| :--- | :--- | :--- | :--- |
| `login` | `POST` | Public | Hỗ trợ đăng nhập định danh cá nhân (`operator_id` / `email` + `pin` / `password`) trả về `user` (`id`, `name`, `role`) và `csrf_token`. |
| `preview_new_batch` | `POST` | `PREPARER`, `WAREHOUSE`, `ACCOUNTANT`, `APPROVER`, `ADMIN` | Kiểm tra trùng chứng từ (`invoice_no`, `awb_no`, `customs_declaration`). Ghép dòng hàng, tự động gợi ý (`SUGGESTED` + `source_ref`) từ lịch sử kho & Catalog, cảnh báo trùng barcode hoặc mã `PVN...`, tính `estimated_cost_vnd` có nhãn ước tính. |
| `create_batch` | `POST` | `PREPARER`, `APPROVER`, `ADMIN` | Yêu cầu `Idempotency-Key`. Chặn `409 Conflict` nếu trùng mã lô, trùng chứng từ hoặc trùng `source_line_id`. Tạo lô ở trạng thái `DRAFT` hoặc `IN_INSPECTION`. |
| `update_item` | `POST` | `WAREHOUSE`, `APPROVER`, `ADMIN` | Cập nhật kết quả kiểm đếm thực tế (`qty_actual`, `qty_shortage`, `qty_overage`, `allocation_status`, `box_code`, `loc_code`, `note`, ảnh thực tế). Tự động tính lại trạng thái lô (`IN_INSPECTION` / `PENDING_DISCREPANCY`). |
| `allocate_sku_group` | `POST` | `WAREHOUSE`, `APPROVER`, `ADMIN` | Xử lý cụm dòng cùng SKU trong 1 lô (như `87121110` 1+4=5): nhận `qty_counted_total` và chế độ phân bổ (`CONFIRM_SPLIT`, `SHORTAGE_SPLIT`, `UNALLOCATED_SHORTAGE`, `OVERAGE_HOLD`). Không tự đánh dấu đủ nếu `qty_counted_total` chưa được thủ kho xác nhận. |
| `update_accounting_cost` | `POST` | `ACCOUNTANT`, `APPROVER`, `ADMIN` | Cập nhật `accounting_allocated_total_vnd`, `sapo_unit_cost_rounded`, tự tính `rounding_diff_vnd`, chuyển `cost_status = 'ACCOUNTING_CONFIRMED'`. |
| `verify_item_handover` | `POST` | `ACCOUNTANT`, `APPROVER`, `ADMIN` | Xác nhận `sapo_sku`, `verified_image_url`, `unit`, chuyển dòng sang `INSPECTED_VERIFIED` khi đã đủ lượng thực nhận + giá vốn kế toán + ảnh. |
| `export_sapo_handover` | `GET` | `ACCOUNTANT`, `APPROVER`, `ADMIN` | Xuất gói dữ liệu bàn giao Sapo theo lô (`format=json` | `sapo_catalog_csv` | `sapo_po_csv`). Chặn các dòng đã có `pon_code`/`pcn_code` hoặc chưa đủ điều kiện `INSPECTED_VERIFIED`. |
| `record_sapo_import` | `POST` | `ACCOUNTANT`, `APPROVER`, `ADMIN` | Lưu kết quả nhập Sapo (`pon_code`, `pcn_code`, `return_prn_code`, `note`) cho lô/dòng, khóa trạng thái `HANDED_OVER_SAPO` để chống nhập lại. |

## 3. Cấu Trúc Bản Ghi Bàn Giao Sapo (`SapoHandoverItem`)

```json
{
  "batch_id": "STOCK_500KG",
  "batch_status": "INSPECTED_VERIFIED",
  "source_line_id": "T1_STT107",
  "source_doc_ref": {
    "invoice_no": "9004768969",
    "delivery_note_no": "8006432726",
    "customs_declaration": "108705001330",
    "source_file_name": "PackingList_8006432726.xlsx",
    "source_row_index": 107
  },
  "manufacturer_sku": "87121110",
  "sapo_sku": "87121110",
  "sapo_product_exists": false,
  "product_type_code": "PGN0025",
  "branch_code": "CN3",
  "unit": "Cái",
  "qty_invoice": 1,
  "qty_received_verified": 1,
  "qty_shortage": 0,
  "qty_overage": 0,
  "qty_delivered_after_receipt": 0,
  "allocation_status": "ALLOCATED_MATCHED",
  "cost_info": {
    "estimated_cost_vnd": 217187,
    "estimated_formula": "EUR 7.136 * 28200 * 1.08",
    "customs_taxable_unit_vnd": null,
    "accounting_allocated_total_vnd": 203762.8,
    "sapo_unit_cost_rounded": 203763,
    "rounding_diff_vnd": 0.2,
    "cost_status": "ACCOUNTING_CONFIRMED",
    "cost_verified_by": "accountant@t2tvina.com",
    "cost_verified_at": "2026-11-11 10:00:00"
  },
  "image_info": {
    "verified_image_url": "https://protools.com.vn/kho/uploads/Thung1_STT107_87121110_1791875162_2543.jpg",
    "image_type": "WAREHOUSE_REAL",
    "image_verified": true,
    "image_verified_by": "admin@t2tvina.com"
  },
  "storage_location": {
    "box_code": "BOX-06",
    "loc_code": "Hộp 06 - Kệ 1 - Tầng 1"
  },
  "sapo_import_result": {
    "status": "IMPORTED",
    "pon_code": "PON10812",
    "pcn_code": "PCN10778",
    "return_prn_code": null,
    "imported_by": "admin@t2tvina.com",
    "imported_at": "2026-11-11 11:00:00"
  }
}
```
