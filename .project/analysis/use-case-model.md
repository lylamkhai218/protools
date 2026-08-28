# USE CASE MODEL — PROTOOLS.COM.VN

```mermaid
graph LR
    subgraph Actors
        FE[Kỹ sư hiện trường / Kỹ thuật viên]
        PO[Chuyên viên thu mua / Procurement]
        AD[Admin / Sales Team T&T Vina]
    end

    subgraph Protools_Platform [Hệ thống Protools B2B]
        UC01((UC-01: Duyệt danh mục & Tìm kiếm thông số))
        UC02((UC-02: Tra cứu Spec-sheet Grid & Chọn SKU))
        UC03((UC-03: Tổng hợp & Gửi yêu cầu báo giá RFQ))
        UC04((UC-04: Xuất bảng dự toán PDF/Excel))
        UC05((UC-05: Tải tài liệu kỹ thuật / Catalog))
        UC06((UC-06: Quản trị sản phẩm & Xử lý RFQ))
    end

    FE --> UC01
    FE --> UC02
    FE --> UC03
    FE --> UC05

    PO --> UC01
    PO --> UC02
    PO --> UC03
    PO --> UC04
    PO --> UC05

    AD --> UC06
```

## DANH MỤC TRUY XUẤT USE CASES
- [`UC-01`](file:///d:/T&TVina/protools/.project/requirements/use-cases/UC-01-catalog-browsing.md): Duyệt danh mục & Tìm kiếm
- [`UC-02`](file:///d:/T&TVina/protools/.project/requirements/use-cases/UC-02-spec-sheet-lookup.md): Tra cứu Spec-sheet Grid
- [`UC-03`](file:///d:/T&TVina/protools/.project/requirements/use-cases/UC-03-rfq-cart-submission.md): Tổng hợp và gửi RFQ
- `UC-04`: Xuất bảng dự toán PDF
- `UC-05`: Tải tài liệu kỹ thuật
- `UC-06`: Quản trị hệ thống và xử lý đơn RFQ
