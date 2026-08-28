# ADR-002: CHUẨN HÓA INDUSTRIAL PRECISION DESIGN SYSTEM & MOBILE-FIRST B2B

* **Status:** Accepted
* **Date:** 2026-08-21
* **Context:** Người dùng Protools gồm 92% kỹ sư hiện trường thao tác trên điện thoại trong môi trường xưởng máy và các chuyên viên thu mua thao tác bảng tính trên máy tính.
* **Decision:**
  1. Áp dụng phong cách thiết kế **Industrial Precision**: Barlow Condensed (Headline kỹ thuật) + IBM Plex Sans / Barlow (Body & Số liệu).
  2. Bảng Spec-sheet dạng Grid tối ưu hóa bằng CSS Container Queries và Tonal Layering.
  3. Đảm bảo Touch Target tối thiểu 48x48px cho toàn bộ nút bấm cảm ứng.
  4. Sử dụng đơn vị `dvh` cho thanh hành động đáy (Bottom Sticky RFQ bar).
* **Consequences:** File thiết kế gốc `DESIGN.md` được hợp nhất vào `.project/architecture/design-system.md`, loại bỏ sự trùng lặp và tập trung hóa tài liệu trong Project OS.
