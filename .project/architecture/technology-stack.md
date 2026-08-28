# TECHNOLOGY STACK SPECIFICATION

## 1. TẦNG FRONTEND (DECIDED & ACTIVE)
* **Framework:** React 18.x (SPA)
* **Language:** TypeScript 5.x
* **Build Tool & Dev Server:** Vite 5.x
* **Styling Framework:** Tailwind CSS 3.x
* **Iconography:** Lucide React
* **Client Routing:** React Router v6
* **State Management:** React Context + LocalStorage Persistence for RFQ Cart
* **Design Standards:** Industrial Precision Design System (`.project/architecture/design-system.md`)

## 2. TẦNG BACKEND & API (STRATEGICALLY DECIDED — ADR-004)
* **Kiến trúc:** **Lựa chọn B — New Independent Modern Backend**
* **Mục tiêu:** Xây dựng dịch vụ API độc lập, chuẩn hóa Data Contract, tách biệt hoàn toàn khỏi mã nguồn và cấu trúc bảng của WordPress legacy.
* **Các ứng viên công nghệ (Đang đánh giá theo hiệu năng & tương thích hosting Mắt Bão):**
  - *Phương án 1 (Khuyến nghị cho Hosting Mắt Bão):* **PHP 8.2+ Modern Micro-Framework (Slim 4 / Laravel 11 API-only)** — Chạy trực tiếp native trên LiteSpeed LSAPI của Mắt Bão mà không cần cấu hình Reverse Proxy port riêng.
  - *Phương án 2:* **Node.js / Express / Fastify (TypeScript)** — Cần Node.js Selector trên DirectAdmin.
  - *Phương án 3:* **Python / FastAPI** — Cần Python App Manager trên DirectAdmin.

## 3. TẦNG DỮ LIỆU & HẠ TẦNG (DECIDED & ACTIVE)
* **Hệ quản trị CSDL:** MariaDB 10.6 (`prod2e4e_db`)
* **Web Server:** LiteSpeed Web Server
* **Quản trị Máy chủ:** DirectAdmin 1.6x (Evolution Skin)
* **Tường lửa & Bảo mật:** Imunify360 (IM360 WAF) + ModSecurity
* **Môi trường Phát triển Local:** Windows PowerShell + pnpm / Node v20+
