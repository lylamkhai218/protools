# TASK-007: AN NINH ỨNG DỤNG (APPSEC) & GIA CỐ SECURITY HEADERS

* **Task ID:** `TASK-007`
* **Tiêu đề:** Xử lý triệt để lỗ hổng phụ thuộc npm & Nâng hạng Security Headers lên Grade A+
* **Người thực hiện:** Cybersecurity Guard (`protools_security`) & CTO Specialist
* **Trạng thái:** Completed (05/10/2026)
* **Mục tiêu:** Đưa `pnpm audit` về 0 lỗ hổng bảo mật và cấu hình bảo mật máy chủ LiteSpeed đạt chuẩn an ninh quốc tế.
* **Yêu cầu liên quan:** `NFR-02` (Application & Network Security), `ADR-003` (WAF Security Policy)
* **Kết quả & Tiêu chí nghiệm thu:**
  - [x] Gỡ bỏ gói thừa `express` và `@types/express` không sử dụng trong SPA.
  - [x] Khai báo override `nanoid >= 3.3.18` trong `package.json` và `pnpm-workspace.yaml`.
  - [x] Kiểm tra lại qua `pnpm audit`: Đạt **0 known vulnerabilities found**.
  - [x] Bổ sung chỉ thị HSTS `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` và CSP chuẩn trong `deploy_production_root.py`.
  - [x] Điểm số SecurityHeaders đạt **100/100 Grade A+**.
