# PROTOOLS.COM.VN — B2B INDUSTRIAL TOOLING PLATFORM

> Nền tảng số hóa danh mục thiết bị cơ khí, tra cứu thông số kỹ thuật (Spec-sheet Grid) và quy trình Yêu cầu báo giá (RFQ) cho ngành công nghiệp chế tạo Việt Nam.

---

## ⚡ ANTIGRAVITY PROJECT OS QUICK ACCESS

Hệ thống hoạt động theo chuẩn **Antigravity Project Operating System (Project OS)**:

1. **Hiến pháp & Trạng thái hoạt động:**
   - 📜 [Hiến pháp dự án](file:///d:/T&TVina/protools/.project/constitution.md)
   - 📊 [One-Pager Snapshot](file:///d:/T&TVina/protools/.project/snapshot.md)
   - 🔍 [Hiện trạng hệ thống](file:///d:/T&TVina/protools/.project/current-state.md)
   - 🗺️ [Lộ trình phát triển Roadmap](file:///d:/T&TVina/protools/.project/roadmap.md)
2. **Yêu cầu & Nghiệp vụ:**
   - 📋 [Software Requirements Specification (SRS)](file:///d:/T&TVina/protools/.project/requirements/SRS.md)
   - ⚙️ [Yêu cầu chức năng (FR)](file:///d:/T&TVina/protools/.project/requirements/functional-requirements.md)
   - 🛡️ [Yêu cầu phi chức năng (NFR)](file:///d:/T&TVina/protools/.project/requirements/non-functional-requirements.md)
   - 📐 [Ma trận Traceability (RTM)](file:///d:/T&TVina/protools/.project/traceability/requirements-matrix.md)
3. **Kiến trúc & Quyết định kỹ thuật:**
   - 🏗️ [Tổng quan Kiến trúc](file:///d:/T&TVina/protools/.project/architecture/architecture.md)
   - 🎨 [Industrial Precision Design System](file:///d:/T&TVina/protools/.project/architecture/design-system.md)
   - 💡 [Chỉ mục quyết định kiến trúc (ADRs)](file:///d:/T&TVina/protools/.project/decisions/README.md)
4. **Tác vụ & Nhật ký học hỏi:**
   - 🎯 [Danh sách Tasks đang làm](file:///d:/T&TVina/protools/.tasks/active/)
   - 💡 [Kinh nghiệm & Bài học](file:///d:/T&TVina/protools/.memory/lessons/)
   - ⚠️ [Hồ sơ sự cố & Khắc phục](file:///d:/T&TVina/protools/.memory/mistakes/)

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN CỤC BỘ (LOCAL DEVELOPMENT)

```bash
# Cài đặt thư viện
pnpm install

# Khởi chạy server phát triển
pnpm dev

# Đóng gói sản phẩm tĩnh
pnpm build
```

---

## 🛡️ AN TOÀN BẢO MẬT & DEPLOY
- Cấm tuyệt đối upload HTTP SQL bridge script lên máy chủ Mắt Bão (Tránh vi phạm WAF Rule `77218530`).
- Triển khai code tự động qua: `python deploy_protools.py`.
