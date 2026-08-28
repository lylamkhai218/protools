# ADR-004: LỰA CHỌN B — PHÁT TRIỂN BACKEND ĐỘC LẬP HIỆN ĐẠI (NEW INDEPENDENT MODERN BACKEND)

* **Status:** Accepted
* **Date:** 2026-08-21
* **Context:** Database MariaDB 10.6 (`prod2e4e_db`) trên máy chủ Mắt Bão đang chứa 67 bảng WordPress cũ bị phân mảnh. Cần quyết định hướng đi cho tầng dịch vụ Backend API và xử lý dữ liệu.
* **Decision:**
  1. **Chọn Lựa chọn B:** Xây dựng tầng Backend REST API độc lập, thiết kế Schema CSDL chuẩn hóa (Normalized B2B Industrial Schema) thay vì tiếp tục sử dụng WordPress Core hay WP REST API.
  2. Tách rời hoàn toàn Frontend SPA (React + Vite) và Backend REST API.
  3. Dữ liệu sản phẩm cũ sẽ được trích xuất (ETL) an toàn từ bản dump MariaDB đưa vào schema mới hoặc nhập liệu qua Admin Dashboard chuẩn.
* **Consequences:**
  - Kiến trúc sạch sẽ, tốc độ cao, không bị gánh nặng rườm rà của WordPress plugins/core.
  - Cần phát triển bộ REST API endpoints (`/api/v1/categories`, `/api/v1/products`, `/api/v1/rfq`) và bảo vệ chống tấn công SQLi/XSS tại tầng API.
