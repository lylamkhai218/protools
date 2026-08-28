# REQUIREMENTS TRACEABILITY MATRIX (RTM)

| Business Goal | Req ID | Mô tả Yêu cầu | Use Case | Thiết kế / Diagram | Task ID | Code Location | Test ID | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `BUS-01` | `FR-01.1` | Cây danh mục đa cấp | `UC-01` | `ERD-01`, `domain-model` | `TASK-002` | `src/pages/Home.tsx` | `TEST-01` | In Progress |
| `BUS-01` | `FR-01.2` | Tìm kiếm thông minh | `UC-01` | `domain-model` | `TASK-002` | `src/components/Header.tsx` | `TEST-02` | In Progress |
| `BUS-01` | `FR-02.1` | Bảng Spec-sheet Grid | `UC-02` | `ERD-01`, `design-system` | `TASK-003` | `src/pages/ProductDetail.tsx` | `TEST-03` | In Progress |
| `BUS-02` | `FR-03.1` | Giỏ hàng RFQ Cart | `UC-03` | `SEQ-01` | `TASK-004` | `src/pages/CartQuote.tsx` | `TEST-04` | In Progress |
| `BUS-02` | `FR-03.3` | Xuất bảng dự toán PDF | `UC-03` | `SEQ-01` | `TASK-004` | `src/pages/CartQuote.tsx` | `TEST-05` | Planned |
| `BUS-03` | `NFR-01.2`| Touch Target 48px | `UC-02` | `design-system` | `TASK-001` | `src/index.css` | `TEST-06` | In Progress |
| `BUS-03` | `NFR-02.1`| Bảo mật WAF Imunify360| Toàn bộ | `deployment-diagram` | `TASK-001` | `.htaccess`, `deploy_protools.py`| `TEST-07` | Verified |
