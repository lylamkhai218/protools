# REQUIREMENT TO DESIGN MAPPING

| Requirement ID | Design Artifact | Diagram Reference | Ghi chú thiết kế |
| :--- | :--- | :--- | :--- |
| `FR-01.1` (Danh mục) | `.project/analysis/domain-model.md` | `ERD-01` (Bảng `categories`) | Cây phân cấp Category đa tầng |
| `FR-02.1` (Spec-sheet) | `.project/architecture/design-system.md` | `ERD-01` (Bảng `product_variants`) | Hiển thị dạng bảng lưới với thông số D, d, l, L, R |
| `FR-03.1` (RFQ Cart) | `.project/analysis/use-case-model.md` | `SEQ-01` (Quy trình RFQ) | Giỏ hàng lưu cục bộ LocalStorage |
| `FR-03.2` (Form RFQ) | `.project/data/data-model.md` | `ERD-01` (Bảng `rfq_requests`) | Thu thập thông tin doanh nghiệp |
| `NFR-01.2` (Touch Target) | `.project/architecture/design-system.md` | CSS Tokens | Vùng bấm tối thiểu 48x48px trên Mobile |
| `NFR-02.1` (WAF Defense) | `.project/architecture/deployment-diagram.md` | WAF Perimeter | Không tạo HTTP bridge script |
