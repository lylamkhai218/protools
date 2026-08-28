# PROJECT ROADMAP — PROTOOLS.COM.VN

```mermaid
gantt
    title Protools.com.vn Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: OS Bootstrap
    Project OS Initialization       :done,    p1_1, 2026-08-21, 1d
    Design System & Baseline Docs   :active,  p1_2, 2026-08-21, 2d
    section Phase 2: Core B2B Frontend
    Spec-sheet Grid & Catalog UX    :         p2_1, after p1_2, 4d
    RFQ Cart & Project Quote Export :         p2_2, after p2_1, 3d
    Responsive Mobile Optimization  :         p2_3, after p2_2, 3d
    section Phase 3: Modern Backend
    Data Modeling & Schema Design   :         p3_1, after p2_3, 3d
    Independent REST API Engine     :         p3_2, after p3_1, 5d
    Database Migration (ETL)        :         p3_3, after p3_2, 4d
    section Phase 4: Release & Hardening
    Imunify360 Security Audit       :         p4_1, after p3_3, 2d
    Production Deployment & QA      :         p4_2, after p4_1, 2d
```

## CHI TIẾT TỪNG GIAI ĐOẠN

### Phase 1: Project OS Bootstrap & Knowledge Foundation (Hiện tại)
- Thiết lập hệ thống thư mục 3 tầng: `.project/`, `.agents/`, `.tasks/`, `.handoffs/`, `.memory/`.
- Chuẩn hóa tài liệu SRS, SAD, Architecture, Design System và ADRs.
- Cấu hình 7 vai trò Subagents chuyên trách.

### Phase 2: Core B2B Frontend & User Experience
- Tối ưu hóa UI/UX Spec-sheet Grid theo chuẩn Industrial Precision.
- Triển khai tính năng tạo giỏ Yêu cầu báo giá (RFQ) và xuất PDF dự toán.
- Kiểm thử độ nhạy Touch Target 48px trên thiết bị thực địa.

### Phase 3: Independent Modern Backend & Data Pipeline
- Thiết kế Data Model chuẩn cho B2B Industrial Catalog.
- Xây dựng Backend REST API độc lập (ADR-004), tách biệt hoàn toàn với WordPress.
- Xây dựng công cụ ETL trích xuất dữ liệu an toàn từ dump database MariaDB cũ.

### Phase 4: Verification, Security Hardening & Release
- Đánh giá tuân thủ WAF Imunify360, kiểm tra tải và bảo mật form RFQ.
- Triển khai Production an toàn qua script [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).
