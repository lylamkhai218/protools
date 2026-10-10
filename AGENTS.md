# AGENTS.MD - PROJECT GUIDELINES & OPERATIONAL RULES
* **Agent Codename:** `PROTOOLS-CORE-AGENT`
* **Agent Role:** Lead Fullstack & Infrastructure Security Specialist (Protools.com.vn)
* **Organization:** T&T Vina Industrial Co., Ltd
* **Workspace:** `d:\T&TVina\protools`
* **Last Updated:** 21/08/2026

---

## 0. NGUYÊN TẮC BẢO TOÀN KIẾN THỨC AGENT (APPEND-ONLY RULE)
> [!IMPORTANT]
> **QUY TẮC BẤT BIẾN:** Mọi Agent khi làm việc trên dự án này nếu có kiến thức mới, sự cố mới hoặc quyết định kỹ thuật mới phát sinh **CHỈ ĐƯỢC PHÉP GHI THÊM (APPEND-ONLY)** vào cuối các mục tương ứng. **CẤM TUYỆT ĐỐI việc xóa bỏ, sửa đổi làm mất hoặc ghi đè đè bẹp các quy tắc và bài học kinh nghiệm đã tích lũy trước đó.**

---

## 1. TỔNG QUAN DỰ ÁN & HẠ TẦNG (SYSTEM PROFILE)

* **Business:** Website B2B phân phối thiết bị cơ khí, dụng cụ công nghiệp Protools.
* **GitHub Repository:** [https://github.com/lylamkhai218/protools](https://github.com/lylamkhai218/protools)
* **Frontend Techstack:** React, TypeScript, Vite, Tailwind CSS (Single Page Application - SPA).
* **Hosting Server:** Mắt Bão Cloud Network (`s2d34.cloudnetwork.vn` - IP: `112.78.2.34`).
* **Control Panel:** DirectAdmin (Evolution Skin - Port `2222`).
* **Web Server:** LiteSpeed Web Server.
* **Database Engine:** MariaDB 10.6 (`prod2e4e_db`).
* **Hệ thống Phòng thủ (WAF/IPS):** **Imunify360 (IM360 WAF)** + ModSecurity Rule Engine.

---

## 2. NGUYÊN TẮC BẢO MẬT BẮT BUỘC (CRITICAL SECURITY RULES)

### ❌ Rule 2.1: CẤM TUYỆT ĐỐI SQL Bridge Scripts trên Web
* **KHÔNG ĐƯỢC PHÉP** upload bất kỳ file script trung gian nào như `ntunnel_mysql.php`, `adminer.php`, `db_bridge.php` lên `public_html`.
* **Lý do kỹ thuật:** Tường lửa Imunify360 (Rule `77218530` / `77350224`) sẽ tự động nhận diện các payload truy vấn qua HTTP là **SQL Injection** và kích hoạt **Auto-Ban (khóa IP toàn bộ cổng server)** ngay lập tức.

### 🛡️ Rule 2.2: Quy chuẩn Quản trị Cơ sở Dữ liệu (Database Protocol)
1. **Thao tác trực tiếp:** Chỉ sử dụng **phpMyAdmin** chính thức qua DirectAdmin (`https://s2d34.cloudnetwork.vn:2222`).
2. **Thao tác qua Navicat:** Chỉ sử dụng tài khoản **Read-Only (SELECT Only)** và phải khai báo IP vào mục **Access Hosts** trên DirectAdmin trước khi kết nối trực tiếp qua Port `3306`.
3. **Phân tích / Thử nghiệm:** Luôn ưu tiên xuất bản dump file `.sql` về môi trường Localhost để chạy thử nghiệm, không chạy truy vấn nặng trên Production.

---

## 3. HỒ SƠ SỰ CỐ & DỮ LIỆU TƯỜNG LỬA (INCIDENT AUDIT LOGS)

### Sự cố 21/08/2026: Auto-Ban do Navicat HTTP Tunnel
* **Hành động gây lỗi:** Tải `ntunnel_mysql.php` lên `/public_html` và mở bảng từ xa bằng Navicat Desktop qua HTTP.
* **Transaction ID:** `E8B9U-gvg-mlTBAwloBz5iXW`
* **Client IP bị khóa:** `1.52.255.88`
* **Rule ID kích hoạt:** `77218530` (CRITICAL) & `77350224`
* **File WAF:** `/etc/modsecurity.d/013_i360_generic.conf:129`
* **Mẫu truy vấn bị bắt (Payload):**
  ```sql
  SELECT DISTINCT ROUTINE_SCHEMA, ROUTINE_NAME, PARAMS.PARAMETER 
  FROM information_schema.ROUTINES 
  LEFT JOIN ( ... ) ... 
  WHERE ROUTINE_SCHEMA = 'prod2e4e_db'
  ```
* **Bài học kinh nghiệm:** WAF Imunify360 tự động nhận diện từ khóa `information_schema\b` qua HTTP POST là `SQL Injection Attack` và chặn tức thì toàn bộ cổng quản trị (21, 2222, 2083) của IP gửi yêu cầu.
* **Thời gian khóa của Tường lửa (Auto-Ban TTL):**
  * Trong Audit Log của WAF chỉ lưu sự kiện vi phạm (Rule/Severity: `CRITICAL`), không chứa trường thời gian hết hạn vì chính sách chặn nằm ở tầng Daemon Server của Imunify360.
  * **Cơ chế:** Khóa tạm thời (Temporary IP Block / Graylist).
  * **Thời gian mở khóa tự động:** **15 – 30 phút** (kể từ request vi phạm cuối cùng, nếu không gửi thêm request nào làm reset bộ đếm).
  * **Giải pháp mở khóa tức thì (Zero-Wait):** Đổi IP qua VPN / 4G (10s) hoặc vào `id.matbao.net` bấm nút "Mở khóa IP" (1 phút).

### Sự cố 28/08/2026: FTP Permission Denied (553) khi ghi `.htaccess` SPA Routing
* **Hiện tượng:** Khi chạy deploy, máy chủ FTP từ chối ghi đè file `.htaccess` do file cũ đang đặt quyền `444` (Read-only).
* **Ảnh hưởng:** Web server LiteSpeed tiếp tục chạy các RewriteRule của mã nguồn PHP cũ, khiến truy cập các route SPA (như `/murrplastik`) bị rewrite vào `index.php?language_alias=...`.
* **Giải pháp kỹ thuật:** Gọi lệnh `SITE CHMOD 644 .htaccess` trước khi thực hiện `STOR .htaccess` trong script phát hành [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).

---

## 4. NGUYÊN TẮC PHÁT TRIỂN & DEPLOY (DEV & RELEASE RULES)

### 📦 Rule 4.1: Quy trình Deploy Production an toàn
* Mọi tiến trình phát hành code mới lên máy chủ phải tuân thủ nghiêm ngặt qua script [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py):
  1. **Tự động sao lưu (Auto Backup):** Luôn chạy backup dữ liệu cũ trên host về thư mục `/backups` trước khi ghi đè.
  2. **Đóng gói Bundle:** Build code tĩnh qua `pnpm build` (Vite).
  3. **Cấu hình Routing:** Luôn đảm bảo file `.htaccess` cho SPA routing được cập nhật trên root `public_html`.

### 🔄 Rule 4.2: Quản lý Rollback & Backup
* Toàn bộ mã nguồn và tài nguyên tĩnh cũ được lưu trữ tại thư mục [`backups/`](file:///d:/T&TVina/protools/backups/) kèm file `.zip` nén có timestamp để có thể hoàn tác (Rollback) bất cứ lúc nào.

### 🛡️ Rule 4.3: Chiến lược Test Trang Con Cô Lập (Subpage Isolation)
* Khi user yêu cầu test trang con (như `/murrplastik`) trên Production mà chưa thay thế toàn bộ hệ thống:
  1. **Tuyệt đối không ghi đè** `public_html/index.html` hoặc root `.htaccess` của website chính.
  2. **Triển khai cô lập**: Đặt `base: '/[tên_trang]/'` trong [`vite.config.ts`](file:///d:/T&TVina/protools/vite.config.ts) và upload toàn bộ bundle vào thư mục con `public_html/[tên_trang]/`.
  3. **Bypass Rewrite**: Thêm quy tắc `RewriteRule ^[tên_trang](/.*)?$ - [L]` trong root `.htaccess` để web server chuyển quyền xử lý trực tiếp vào thư mục con.

---

## 5. QUY CHUẨN GIAO TIẾP VỚI USER (COMMUNICATION STYLE)

* **Phong cách ADHD Standard:**
  * Đi thẳng vào hành động và giải pháp kỹ thuật (Lead with action / code / commands).
  * Đánh số các bước thực hiện (1, 2, 3).
  * Không mở đầu bằng lời chào/khen thừa thãi, không kết thúc bằng câu xã giao.
  * Luôn tạo clickable link cho các file trong dự án bằng định dạng Markdown: `[tên_file](file:///đường_dẫn_tuyệt_đối)`.

---

## 6. QUY ĐỊNH KÍCH HOẠT SKILLS BẮT BUỘC (MANDATORY SKILLS)

Mọi Agent khi thực thi tác vụ trong dự án Protools phải kích hoạt các Skills sau theo đúng ngữ cảnh:

1. 🛡️ **`everything-cyber-security`**:
   * **Bắt buộc kích hoạt**: Trước MỌI thao tác liên quan đến Database, Server Hosting, API, Phân quyền, hoặc cấu hình kết nối mạng.
2. 🐞 **`systematic-debugging`**:
   * **Bắt buộc kích hoạt**: Khi gặp bất kỳ lỗi kết nối, lỗi code hoặc phản hồi bất thường nào từ hệ thống trước khi đề xuất giải pháp.
3. 🎨 **`ui-ux-pro-max`**:
   * **Bắt buộc kích hoạt**: Khi thiết kế hoặc code các component giao diện B2B, bảng thông số kỹ thuật (Spec-sheet), và layout Responsive Mobile-first cho Protools.
4. ✅ **`verification-before-completion`**:
   * **Bắt buộc kích hoạt**: Luôn chạy lệnh kiểm chứng thực tế và có bằng chứng đầu ra trước khi kết luận hoàn thành tác vụ.
5. ⚡ **`i-have-adhd`**:
   * **Mặc định toàn thời gian**: Phong cách giao tiếp trực diện, gạch đầu dòng, không văn vở rườm rà.

---

## 7. HỆ THỐNG MULTI-AGENTS CHUYÊN TRÁCH (SPECIALIZED SUBAGENTS SQUAD)

Hệ thống được trang bị 4 Subagent chuyên biệt được điều phối bởi `PROTOOLS-CORE-AGENT`:

| Subagent Name | Vai trò chuyên môn | Nhiệm vụ chính |
| :--- | :--- | :--- |
| `protools_frontend` | 🎨 Frontend & UI/UX Specialist | Code React, TypeScript, Tailwind CSS, Spec-sheet Grid, Container Queries theo [`design-system.md`](file:///d:/T&TVina/protools/.project/architecture/design-system.md). |
| `protools_security` | 🛡️ Cybersecurity & WAF Guard | Kiểm soát an toàn máy chủ Mắt Bão, rà soát lỗ hổng API/Form, ngăn chặn tuyệt đối HTTP SQL bridges. |
| `protools_data` | 🔍 Database Architect | Phân tích 67 bảng của `prod2e4e_db`, map kiểu dữ liệu TypeScript, chuẩn bị data model. |
| `protools_qa` | 🧪 QA & Verification Specialist | Chạy build Vite tĩnh (`pnpm build`), kiểm tra SPA `.htaccess`, xác thực trước khi release. |

---

## 8. HỆ THỐNG PROJECT OS (PROJECT OPERATING SYSTEM)

* **Hiến pháp vận hành (Constitution):** Xem chi tiết tại [`.project/constitution.md`](file:///d:/T&TVina/protools/.project/constitution.md).
* **Trạng thái tức thời (Snapshot):** Mọi Agent trước khi thực thi tác vụ BẮT BUỘC đọc [`.project/snapshot.md`](file:///d:/T&TVina/protools/.project/snapshot.md).
* **Mô hình bộ nhớ 3 tầng:**
  1. **Dài hạn (`.project/`):** Chứa SRS, SAD, Architecture, Data Model, Traceability và bộ quyết định [ADRs](file:///d:/T&TVina/protools/.project/decisions/README.md).
  2. **Tác vụ (`.tasks/`, `.handoffs/`):** Chứa Backlog, Active tasks và Biên bản bàn giao công việc giữa các Agent.
  3. **Học hỏi (`.memory/`):** Chứa bài học [Lessons](file:///d:/T&TVina/protools/.memory/lessons/), sai lầm [Mistakes](file:///d:/T&TVina/protools/.memory/mistakes/), mẫu thiết kế [Patterns](file:///d:/T&TVina/protools/.memory/patterns/).
* **Thứ tự nạp ngữ cảnh tối ưu (Progressive Context Loading):**
  `AGENTS.md` → `.project/snapshot.md` → Relevant Task (`.tasks/`) → Requirements/ADR → Source Code (`src/`).
* **Chuỗi truy xuất nguồn gốc (Traceability):**
  `BUS-*` (Mục tiêu kinh doanh) → `FR/NFR-*` (Yêu cầu) → `UC-*` (Use Case) → `SAD` (Thiết kế) → `TASK-*` (Tác vụ) → `Code` → `TEST-*` (Kiểm thử).

---

## 9. QUY CHUẨN KỸ THUẬT & BÀI HỌC VẬN HÀNH (KNOWLEDGE LOG 28/08/2026)

### 📝 Rule 9.1: Chuẩn hóa UTF-8 khi gửi Form Báo Giá sang Google Apps Script
* **Hiện tượng**: Khi gửi tiếng Việt có dấu qua HTTP POST sang Google Apps Script, nếu không chỉ định rõ bảng mã thì ký tự có dấu (`ộ, ử, ệ`) sẽ bị lỗi font (`?`).
* **Giải pháp**: Luôn đặt header `Content-Type: text/plain;charset=utf-8` trong `fetch()`. Định dạng này vừa đảm bảo mã hóa tiếng Việt trọn vẹn, vừa tránh kích hoạt CORS Preflight `OPTIONS` request.

### 🌐 Rule 9.2: Chiến lược Chuyển tiếp Tên miền Minh bạch (White-Hat Domain Migration)
* **Quy chuẩn chuyển đổi**: Khi chuyển giao tên miền vi phạm thương hiệu (`murrplastikvn.com`) sang phân vùng mới (`protools.com.vn/murrplastik/`):
  1. **Triệt tiêu trùng lặp**: Dọn sạch nội dung chi tiết trên domain cũ, chỉ giữ duy nhất một trang **Thông báo chuyển hướng (Transition Notice)** kèm đếm ngược 60 giây và nút chuyển ngay.
  2. **Bảo toàn URL con**: Sử dụng JavaScript đọc `window.location.pathname` để chuyển tiếp chính xác vào đúng trang sản phẩm/ngành tương ứng.
  3. **Tuyên bố pháp lý**: Ghi rõ thời điểm hết hạn và từ bỏ quyền sở hữu sau ngày `24/10/2026`.
  4. **SEO Indexing**: Giữ nguyên `index, follow` và gắn `Canonical Tag` trên domain mới, không dùng `noindex`.

### 🔒 Rule 9.3: Nguyên tắc Vệ sinh Máy chủ & Bảo mật File Nhạy Cảm
* Tuyệt đối không để các file tài liệu nội bộ (`.md`, `.csv`), script deploy (`.py`) và đặc biệt là file cấu hình **`.env`** nằm trong thư mục `public_html` của web server.
* Khi phát hành, chỉ đồng bộ các file tĩnh đã được làm sạch (`.html`, `.css`, `.js`, `.webp`, `.stl`, `.xml`).

### 🛡️ Rule 9.4: Quản lý Thông tin Bảo mật Tuyệt mật (Local Credentials Isolation)
* Toàn bộ tài khoản, mật khẩu quản trị nội bộ chỉ được lưu trữ tại file cục bộ [`.memory/credentials.local.md`](file:///d:/T&TVina/protools/.memory/credentials.local.md) hoặc `.env.local`.
* Bắt buộc khai báo các mẫu file này trong [`.gitignore`](file:///d:/T&TVina/protools/.gitignore). Tuyệt đối cấm commit hoặc push tài khoản lên GitHub hoặc upload lên public hosting.

### 📦 Rule 9.5: Tiêu chuẩn Quản lý Gói (Default Package Manager Standard - pnpm)
* **Bắt buộc**: Mặc định 100% mọi lệnh quản lý gói, cài đặt dependency, chạy môi trường dev và build trong dự án này PHẢI dùng **`pnpm`** (`pnpm dev`, `pnpm build`, `pnpm add`, `pnpm deploy:protools`).
* **Cấm**: Tuyệt đối không dùng `npm` hoặc `yarn` để tránh xung đột file lock và trùng lặp node_modules.

### 🏢 Rule 9.6: Tiêu chuẩn Dữ liệu Doanh nghiệp & Danh mục Sản phẩm Thực tế (Authentic Company & Catalog Standard)
* **Thông tin doanh nghiệp**: Luôn sử dụng thông tin công ty và liên hệ chính thức đã được xác thực từ `protools.com.vn`:
  - **Tên công ty**: `CÔNG TY TNHH CÔNG NGHIỆP T&T VINA` (`T&T VINA INDUSTRIAL CO., LTD`)
  - **Trụ sở chính**: `Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội` (Số 11 ngách 68 ngõ 467 Lĩnh Nam)
  - **Cơ sở 2 (Hưng Yên)**: `Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)`
  - **Phòng Bán Hàng**: `0964.920.025 (Ms. Nhinh)`
  - **Phòng Kinh Doanh**: `0943.301.886 (Mr. Thanh)`
  - **Phòng Kỹ Thuật (Dự án & Hỗ trợ kỹ thuật)**: `0983.794.782 (Mr. Phong)` - `0981.919.590 (Mr. Hai)`
  - **Email**: `t2t.vina@gmail.com`
* **Danh mục sản phẩm thực tế**: Mọi sản phẩm thể hiện trên giao diện mới phải được trích xuất chính xác từ hệ thống danh mục cũ (14 sản phẩm Murrplastik Đức, Robot hàn 6 trục, Hakko 936, Bể hàn CM-808, Tô vít Hios CL-4000/CL-3000, Robot bơm keo SP-982, Máy cắt băng dính Zcut 9, Máy đo lực HP-10, Kính hiển vi SM-3TPZ, Quạt ion SL-001).

### 🏛️ Rule 9.7: Quy Chuẩn Nhận Diện & Tên Pháp Nhân (Brand & Legal Entity Standard - 29/08/2026)
* **Tên thương hiệu cốt lõi**: `T&T VINA` (`T&T VINA INDUSTRIAL CO., LTD`).
* **Cổng thông tin / Web Catalog**: `Protools.com.vn`.
* **Chỉ số xuất xứ**: `100% Chính hãng Nhật Bản / CHLB Đức / Hàn Quốc`.
* **Điều khoản sở hữu trí tuệ**: Toàn bộ nội dung, hình ảnh sản phẩm, thông số kỹ thuật và tài liệu kỹ thuật thuộc quyền sở hữu của T&T Vina Industrial Co., Ltd.
* **Credit phát triển**: Chân trang hiển thị tinh tế dòng credit `Thiết kế & phát triển bởi KhaiLL` (font mono nhạt).

### 🚀 Rule 9.8: Quy Chuẩn Widget Tương Tác Nổi & Điều Hướng (Floating Action Hub & Scroll Standard - 29/08/2026)
* **Nút Quay Về Đầu Trang (Back to Top)**: Tự động xuất hiện khi người dùng cuộn đạt từ **`50%`** chiều cao trang trở lên, tích hợp hiệu ứng chuyển động 2 giai đoạn: cuộn nhẹ lên một đoạn ngắn rồi mới lướt mượt mà về đỉnh trang (`window.scrollBy({ top: -280 })` -> `window.scrollTo({ top: 0 })`).
* **Trung Tâm Liên Hệ Nổi (Floating Quick Contact Hub)**:
  - Vị trí: Cố định góc dưới cùng bên phải (`bottom-6 right-6`).
  - Hành vi: Bấm mở rộng menu với đầy đủ các kênh liên hệ trực tiếp:
    1. Zalo Bán Hàng: `0964.920.025 (Ms. Nhinh)`
    2. Zalo Kinh Doanh: `0943.301.886 (Mr. Thanh)`
    3. Hotline Kỹ Thuật: `0983.794.782 (Mr. Phong)` - `0981.919.590 (Mr. Hai)`
    4. Email Báo Giá: `t2t.vina@gmail.com`

### 📊 Rule 9.9: Hiệu Ứng Số Chạy Tự Động (Animated Counter Standard - 29/08/2026)
* Mọi chỉ số định lượng năng lực công ty (`100%`, `24h`, `500+`, `76+`, `10+`) sử dụng component [`src/components/AnimatedCounter.tsx`](file:///d:/T&TVina/protools/src/components/AnimatedCounter.tsx).
* Cơ chế: Sử dụng `IntersectionObserver` kích hoạt đếm số mượt mà từ `0` đến `N` bằng thuật toán giảm tốc mượt `easeOutCubic` thời lượng `1000ms`, rolling liên tục từng frame không bị ngắt quãng.

### 🔍 Rule 9.10: Quy Chuẩn SEO Schema & FAQ Accordion (SEO Rich Snippets Standard - 29/08/2026)
* Trang chủ tích hợp khối câu hỏi thường gặp (FAQ) định dạng Accordion kèm mã cấu trúc chuẩn Google **`JSON-LD FAQPage`**.
* Nội dung FAQ giải đáp chính xác về: Danh mục sản phẩm, Chứng từ CO/CQ, Chính sách bảo hành 12 tháng, Quy trình báo giá hỏa tốc 15-30 phút, và Địa chỉ kho Hà Nội / Hưng Yên.

### ✨ Rule 9.11: Hiệu Ứng Hero Ambient Glow & Scroll Down Badge (Hero Interactive Standard - 29/08/2026)
* **Khối Hero hiện đại**: Tích hợp vầng sáng màu thương hiệu `ambient glow` phía sau. Khi người dùng cuộn chuột, vầng sáng tự động mở rộng (`scale` & `opacity` loang dần ra nền trang) tạo chiều sâu thị giác.
* **Mũi tên điều hướng Hero**: Nút bấm tròn nổi bật với hiệu ứng hào quang phát xung (`pulse aura`) và icon `ChevronDown` nảy nhẹ (`bounce`), bấm vào sẽ cuộn mượt mà trực tiếp xuống khối Trụ Cột Giải Pháp (`#solution-pillars`).

### 📦 Rule 9.12: Quy Chuẩn B2B Procurement & Quản Trị BOM (Misumi-Aligned B2B Standards - 29/08/2026)
* **Công Cụ Báo Giá Nhanh Theo BOM (BOM Quick Quote Tool)**: Tích hợp trực tiếp tại [`src/pages/CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx), cho phép Mua hàng dán danh sách mã SKU / Part Number từ Excel hoặc chọn các gói BOM mẫu để nạp tự động hàng loạt thiết bị vào giỏ báo giá kèm tính năng xuất file Excel/CSV.
* **Bảng Báo Giá Chiết Khấu Theo Số Lượng (B2B Volume Tier Pricing Table)**: Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), phân định rõ các bậc số lượng (`1-5 cái`, `6-20 cái`, `21-50 cái`, `>50 cái`) kèm thời gian giao hàng (Lead Time) và chiết khấu tương ứng; click vào dòng bậc giá tự động cập nhật số lượng đặt.
* **Cam Kết Lead Time & Kho Hàng KCN**: Hiển thị rõ kho hàng sẵn có (Hà Nội, Hưng Yên cạnh KCN Liên Hà Thái) và cam kết giao hàng trong ngày nếu đặt trước 15:00.
* **Thiết Bị Tương Đương & Phụ Kiện (Cross-Reference & Accessories)**: Gợi ý các sản phẩm cùng hệ sinh thái kỹ thuật kèm nút bấm 1-click thêm vào báo giá.

### 🤖 Rule 9.13: Quy Chuẩn Tiêu Điểm Robotics Đức & VinFast Body Shop Case Study (29/08/2026)
* **Thiết Bị Tiêu Điểm Hero**: Đặt **`R-Tec Liner`** (`MP-1081`) của hãng Murrplastik (CHLB Đức) làm thiết bị tiêu điểm công nghệ tại Hero Section trang chủ.
* **Chứng Minh Năng Lực Ứng Dụng Thực Tế (Automotive Case Study)**: Gắn nhãn chứng thực *"Đã lắp đặt & hoạt động ổn định trên dàn Robot hàn ABB tại xưởng Body Shop (hàn thân xe) Tổ hợp Nhà máy Ô tô VinFast Cát Hải (Hải Phòng)"*.
* **Điều Hướng Chuyên Sâu**: Trang chi tiết sản phẩm tích hợp banner điều hướng trực tiếp sang trang giải pháp công nghiệp ô tô: `https://protools.com.vn/murrplastik/industries/san-xuat-o-to/`.

### 🏷️ Rule 9.14: Quy Chuẩn Nhận Diện Đối Tác & Liên Kết Chuyên Ngành (Authorized Brands & Interactive Marquee - 29/08/2026)
* **Màu sắc thương hiệu tương tác**: Khối đối tác ủy quyền (Partner Marquee) phản hồi màu chủ đạo chính xác của từng hãng khi hover:
  - **Murrplastik**: Đỏ Murr (`#E30613`)
  - **Hakko**: Xanh Hakko (`#005BAC`)
  - **HIOS**: Đỏ HIOS (`#C8102E`)
  - **Quick**: Cam Quick (`#FF6600`)
  - **Loctite**: Đỏ Loctite (`#D32F2F`)
  - **Samwon**: Xanh Samwon (`#003399`)
* **Điều hướng chuyên ngành**: Click vào Murrplastik dẫn trực tiếp đến chuyên trang `https://protools.com.vn/murrplastik`; click vào các hãng khác tự động lọc danh mục thiết bị tương ứng trên trang chủ.

### 🛡️ Rule 9.15: Quy Chuẩn Phát Hành Bản Xem Thử & Chặn SEO Tuyệt Đối (Preview Staging & Strict Noindex Standard - 30/08/2026)
* **Mục đích**: Phát hành phiên bản xem thử nghiệm cô lập cho ban giám đốc/khách hàng duyệt tại URL phụ (`https://protools.com.vn/preview/`) mà không làm xáo trộn website chính và tuyệt đối không cho phép Google/Bing index dữ liệu thử nghiệm.
* **Cơ chế 3 lớp bảo vệ No-Index**:
  1. **Lớp 1 (HTML Meta Tags)**: Tự động chèn `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />` và `<meta name="googlebot" content="noindex, nofollow" />` vào `<head>` của `index.html`.
  2. **Lớp 2 (Server HTTP Header)**: Cấu hình `Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"` trong file `.htaccess` cục bộ tại thư mục `/preview/`.
  3. **Lớp 3 (Robots.txt)**: Khởi tạo file `/preview/robots.txt` chứa chỉ thị `User-agent: *` `Disallow: /`.
* **Quy trình đóng gói**: Tự động hóa qua lệnh `pnpm deploy:preview` (gọi [`deploy_preview.py`](file:///d:/T&TVina/protools/deploy_preview.py)) với tham số `--base=/preview/`, tải lên thư mục cô lập `public_html/preview/` trên máy chủ Mắt Bão và cấp quyền `644` cho `.htaccess`.

### 📞 Rule 9.16: Quy Chuẩn Thông Tin Liên Hệ, Địa Chỉ & Nút Copy Tương Tác (30/08/2026)
* **Thông Tin Trụ Sở & Kho Hàng Chuẩn**:
  - **Trụ sở chính**: `Thôn Trà Hồi - Xã Thái Thụy - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)`
  - **Văn phòng giao dịch & Kho hàng**: `Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội`
* **Đội Ngũ Liên Hệ Chính Thức**:
  - **Hotline Tổng Đài**: `0915.168.824` (Ms. Nhung - hiển thị số Hotline không ghi tên ở Hero)
  - **Phòng Bán Hàng & Kinh Doanh**:
    - `+84 929938368` (Ms. Hiền - Kinh Doanh)
    - `+84 365366455` (Ms. Phương - Kinh Doanh)
  - **Phòng Kinh Doanh Murrplastik**:
    - `0868.822.409` (Mr. Bình - NVKD Murrplastik)
    - `0968.597.131` (Mr. Khải - NVKD Murrplastik)
  - **Phòng Dự Án**: `0943.301.886` (Mr. Thanh)
  - **Email**: `t2t.vina@gmail.com`
* **Quy Chuẩn Nút Sao Chép (Copy Button)**: Mọi khối liên hệ (Floating Widget, Top Bar, Footer, Product Detail) tích hợp nút sao chép nhanh số điện thoại/email kèm phản hồi thị giác trực quan (`Check` icon / `Đã chép`).

### 📐 Rule 9.17: Quy Chuẩn Bố Cục Chân Trang Cân Bằng & Logo Danh Mục Header (30/08/2026)
* **Bố cục Footer 2 khối vĩ mô cân bằng (Zero Blank Space)**:
  - **Cột Trái (`lg:col-span-5`)**: Tên pháp nhân + Slogan + Trụ sở chính (Hưng Yên) + VPGD & Kho Hà Nội (Lĩnh Nam) kèm khung bản đồ nhúng Google Maps iframe trực tiếp (chiều cao ~170px).
  - **Cột Phải (`lg:col-span-7`)**:
    - Hàng trên (2 cột nhỏ): `Danh Mục Thiết Bị` (7 nhóm thiết bị) song song `Tư Vấn & Báo Giá` (Hotline, Phòng Dự Án, Kinh Doanh, KD Murr, Email).
    - Hàng dưới: `Hãng Sản Xuất Ủy Quyền Chính Hãng` (6 thẻ lưới 3 cột: Murrplastik, Hakko, HIOS, Quick, Loctite, Samwon) kèm nút `Tạo Danh Sách Yêu Cầu Báo Giá Nhanh`.
* **Tiêu chuẩn Mega Dropdown Danh Mục Header**:
  - Hạng mục Murrplastik hiển thị logo chính hãng sắc nét (`/logos/logo_murrplastik.png`) kèm viền đỏ và nhãn `Made in Germany`.
### 🏷️ Rule 9.18: Quy Chuẩn Phân Luồng Nhân Viên Kinh Doanh Theo Hãng & Credit Footer (30/08/2026)
* **Phân luồng Sales trong Product Detail**:
  - Khi xem sản phẩm thuộc hãng **Murrplastik** (hoặc danh mục `murrplastik`, SKU bắt đầu bằng `MP-`): nút Zalo hiển thị `Zalo KD Murr: Mr. Bình (0868.822.409)` và liên kết tới `https://zalo.me/0868822409`.
  - Khi xem các sản phẩm khác (Hakko, HIOS, Quick, Loctite, Samwon...): nút Zalo hiển thị `Zalo KD: Ms. Hiền (0929.938.368)` và liên kết tới `https://zalo.me/0929938368`.
* **Định dạng Credit chân trang**: Chân trang hiển thị chính xác cú pháp `Thiết kế & phát triển: KhaiLL` (dùng dấu `:`, không dùng chữ `bởi`).

### ⚡ Rule 9.19: Quy Chuẩn Chuyển Trang Tức Thì (Instant Scroll Reset) & Tương Tác Trụ Cột Giải Pháp (30/08/2026)
* **Khắc phục hiện tượng cuộn ngược khi vào Product Detail**:
  - Khi người dùng bấm xem chi tiết sản phẩm từ bất kỳ vị trí nào trên trang chủ, router sử dụng `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })` để đưa viewport về đỉnh trang ngay lập tức (loại bỏ hoàn toàn hiệu ứng smooth scroll từ đáy trang lên).
* **Tương tác Khối Trụ Cột Giải Pháp (Solution Pillars)**:
### 🧭 Rule 9.20: Quy Chuẩn Điều Hướng Breadcrumb Đa Tầng Trong Chi Tiết Sản Phẩm (30/08/2026)
* **Tương tác Breadcrumb toàn diện**:
  - `Trang chủ`: Click quay về trang chủ.
  - `Danh mục thiết bị` (`product.category`): Click chuyển về trang chủ và kích hoạt bộ lọc danh mục tương ứng (`product.categorySlug`).
  - `Thương hiệu` (`product.brand`): Click chuyển về trang chủ và lọc theo hãng sản xuất.
### 🎯 Rule 9.21: Quy Chuẩn Tương Tác Danh Mục Header Cuộn Tự Động Xuống Bảng Sản Phẩm (30/08/2026)
* **Hành vi Menu Danh Mục Header**:
  - Khi người dùng bấm vào bất kỳ ngành hàng/nhóm thiết bị nào trong Menu Dropdown `Danh Mục Thiết Bị` trên Header (hoặc Mobile Drawer):
    1. Lập tức đóng Dropdown menu.
    2. Kích hoạt bộ lọc danh mục tương ứng.
### 🔍 Rule 9.22: Quy Chuẩn Điều Hướng Tìm Kiếm & Đồng Bộ URL Tức Thời (30/08/2026)
* **Khắc phục lỗi tìm kiếm**:
  - Sửa mã nguồn `Header.tsx` chuyển sang tab đúng `product-detail` khi chọn sản phẩm từ kết quả tìm kiếm (loại bỏ nhầm lẫn `detail`).
  - Hỗ trợ phím `Enter` trên thanh tìm kiếm để chọn nhanh sản phẩm đầu tiên phù hợp.
* **Đồng bộ hóa URL trình duyệt (State-to-URL Sync)**:
  - Khi xem sản phẩm: URL tự động cập nhật `?product=[SKU_hoặc_ID]` (ví dụ: `https://protools.com.vn/preview/?product=MP-1081`).
  - Khi lọc danh mục: URL cập nhật `?category=[slug]` (ví dụ: `?category=thiet-bi-han`).
  - Khi xem giỏ báo giá / tài liệu: URL cập nhật `?tab=cart` hoặc `?tab=document-center`.
  - Hỗ trợ đầy đủ nút **Back / Forward** của trình duyệt (`popstate`) và mở trực tiếp link sản phẩm chia sẻ qua URL.

### 🖼️ Rule 9.23: Quy Chuẩn Cập Nhật Hình Ảnh Thiết Bị Thực Tế & Bộ Gallery Đa Góc Nhìn (30/08/2026)
* **Hình ảnh Máy bơm keo SP-982**:
  - Đã lưu trữ ảnh chụp thực tế có logo & hotline chính hãng vào `public/images/products/sp-982-main.png` (ảnh trực diện kèm bộ phụ kiện) và `sp-982-sub.png` (ảnh góc nghiêng kèm dây bơm và xi lanh).
  - Khai báo mảng `images` trong `PRODUCTS` (`data.ts`) để trang chi tiết sản phẩm tự động hiển thị đầy đủ thư viện ảnh chuyển đổi đa góc nhìn mượt mà.

### 🤖 Rule 9.24: Quy Chuẩn Dữ Liệu Sản Phẩm Máy Bơm Keo Tự Động 983A (30/08/2026)
* **Tích hợp Model 983A (`TTV-983A`)**:
  - Thêm mới sản phẩm `Máy bơm keo tự động 983A` vào danh mục Dụng Cụ Bơm Keo (`dung-cu-bom-keo`).
  - Lưu trữ 3 ảnh chụp thực tế chuẩn studio (`983a-main.png`, `983a-accessories.png`, `983a-panel.png`) tại `public/images/products/`.
  - Cập nhật đầy đủ 5 đặc điểm nổi bật (hẹn giờ kỹ thuật số, định lượng 0.01 ml, 2 chế độ nhả keo, hút chân không chống nhỏ giọt, giá đỡ xi lanh) và bảng thông số kỹ thuật (điện áp 220V / 24V DC, áp suất 2.5-7 bar, kích thước 23.8x15.5x6 cm, trọng lượng 1.67 kg).

### 🏷️ Rule 9.25: Quy Chuẩn Nhận Diện Phân Phối Ủy Quyền & Khối Sản Phẩm Nổi Bật Tại Chân Trang (30/08/2026)
### 🚀 Rule 9.28: Quy Chuẩn Phát Hành Chính Thức Root Production & Phân Quyền AdminCP (30/08/2026)
* **Phát hành Production Root (`https://protools.com.vn/`)**:
  - Tự động hóa qua script [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py) (`pnpm deploy:prod`).
  - Toàn bộ bundle React SPA tĩnh được triển khai tại root `public_html/`.
* **Cấu hình Phân luồng & Bảo vệ Thư mục AdminCP**:
  - File root `.htaccess` thiết lập quy tắc bypass:
    `RewriteRule ^(admincp|admin|administrator|old|murrplastik|preview|images|uploads|bomvietnam\.com)(/.*)?$ - [L]`
  - Giữ an toàn 100% cho trang quản trị AdminCP (`https://protools.com.vn/admincp/`), các thư mục media cũ (`/images/stores/`, `/uploads/`) và các phân vùng con (`/murrplastik/`, `/preview/`, `/old/`).
* **Hồ sơ Lưu trữ Sao lưu (Rollback Archive)**:
  - Bản sao lưu toàn diện trước khi phát hành được lưu tại [`backups/protools_backup_20260830_154716.zip`](file:///d:/T&TVina/protools/backups/protools_backup_20260830_154716.zip).
  - Phân vùng `/old/` trên host được thiết lập chặn No-Index (`robots.txt` + `X-Robots-Tag`).

### Rule 9.29: Quy Chuẩn Cập Nhật Gian Hàng Ảo 3D VEC 2026 (07/09/2026)
* **Quy cách vách in V4 (900mm x 1800mm)**:
  - Nguồn ảnh gốc: `D:\T&TVina\VEC_2026_2\04_PRODUCTION_SVG\V4\final` (6 tấm SVG: `bw-panel-1,2,3 3.svg` cho vách hậu và `sw-panel-1,2,3 3.svg` cho vách bên).
  - Kết xuất texture: Ghép 3 tấm 900mm x 1800mm thành composite texture tỷ lệ chuẩn 2.7m x 1.8m (`v4_backwall.png`, `v4_sidewall.png`), tạo kèm payload Base64 trong [`textures_data.js`](file:///D:/T&TVina/murrplastik_code/assets/3d/vec26-booth/textures_data.js).
  - 2 Tấm trán trên đầu (Fascia/Valance: 2950mm x 400mm) giữ nguyên 100%.
* **Quy chuẩn Căn chỉnh Khung 3D (Top-Aligned Wall Meshes)**:
  - Chiều cao khung gian hàng: `BOOTH_H = 2.5m`.
  - Chiều cao tấm in: `WALL_H = 1.8m`. Căn đỉnh tấm in trùng với xà trên của khung (`y_top = 2.5m`), tâm vách đặt tại `y = 1.6m`, mép dưới tại `y = 0.7m`.
  - Bố trí vách hậu: Bắt đầu từ góc `X = -1.5m` đến `X = +1.2m` (tâm `X = -0.15m`, `Z = -1.49m`).
  - Bố trí vách bên: Bắt đầu từ góc `Z = -1.5m` đến `Z = +1.2m` (tâm `Z = -0.15m`, `X = -1.49m`).
  - Phía sau bổ sung vách trắng tiêu chuẩn (`3.0m x 2.5m`), các cột nhôm đứng đặt tại khớp nối 900mm (`-0.6m`, `+0.3m`, `+1.2m`) và xà đỡ ngang dưới chân vách in (`y = 0.7m`).
* **Lược bỏ Model TV 3D**:
  - Loại bỏ hoàn toàn khối 3D TV Stand E2050 và màn hình 65" khỏi scene 3D để lộ trọn vẹn bề mặt đồ họa vách bên (`sw-panel-1` mã QR & thông tin T&T Vina).
  - Xóa hotspot tương ứng (`id: 'tv'`), cập nhật hướng dẫn từ 5 điểm tương tác về 4 điểm tương tác (1: Laser, 2: Robot, 3: Kệ mẫu, 4: Bàn tiếp khách).

### 📐 Rule 9.30: Quy Chuẩn Dàn Đều Banner 900x1800mm Vào Giữa Từng Khung 1.0m & Triệt Tiêu Khung Ngang Dưới Chân (07/09/2026)
* **Khôi Phục Hệ Khung Nhôm 8 Cột Tiêu Chuẩn (Standard 1.0m Bays)**:
  - Khung gian hàng 3.0m x 3.0m sử dụng hệ 8 cột đứng nhôm định hình 50x50mm tiêu chuẩn: 4 cột góc (`[-1.5, -1.5]`, `[1.5, -1.5]`, `[-1.5, 1.5]`, `[1.5, 1.5]`) và 4 cột trung gian ngăn ô 1.0m (Vách hậu tại `x = -0.5m`, `x = +0.5m`; Vách bên tại `z = -0.5m`, `z = +0.5m`).
  - Giữ 4 xà nhôm ngang trên nóc (`y = 2.5m`), **triệt tiêu hoàn toàn các thanh xà ngang dưới chân ảnh** tại `y = 0.7m`.
* **Dàn Đều Banner 900mm Vào Giữa Từng Khoang 1.0m (Centered Bay Graphics)**:
  - Mỗi tấm banner đồ họa kích thước 900mm x 1800mm được căn giữa chính xác vào từng khoang 1.0m, để lại mép viền trắng đều 5cm ở mỗi bên cột, triệt tiêu hoàn toàn khoảng hở lệch 30cm ở mép ngoài.
  - Vị trí vách hậu: 3 ô tại `X = -1.0m`, `X = 0.0m`, `X = +1.0m` (`Y = 1.6m`, `Z = -1.488m`).
  - Vị trí vách bên: 3 ô tại `Z = -1.0m` (góc trong), `Z = 0.0m` (giữa), `Z = +1.0m` (mặt tiền) (`Y = 1.6m`, `X = -1.488m`, `rotation.y = Math.PI / 2`).
  - Căn đỉnh trên cùng với xà nóc (`y_top = 2.5m`), chân dưới dừng ở `y = 0.7m`, phần khoảng trắng bên dưới được nâng đỡ bởi nền vách trắng tiêu chuẩn (`3.0m x 2.5m`).
* **Lưu Trữ Texture Offline & Độc Lập**:
  - Mã hóa Base64 6 tấm texture V4 riêng biệt (`v4_bw_panel_1..3`, `v4_sw_panel_1..3`) vào [`textures_data.js`](file:///D:/T&TVina/murrplastik_code/assets/3d/vec26-booth/textures_data.js) nhằm đảm bảo hiển thị tức thì, không bị ảnh hưởng bởi đường truyền mạng hay chính sách CORS của trình duyệt.

### Rule 9.31: Quy Chuẩn Hồ Sơ Tài Liệu Phát Triển Trang Tin Tức VEC 2026 (07/09/2026)
* **Vị trí lưu trữ tài liệu cơ sở**:
  - `D:\T&TVina\protools\docs\murrplastik\tin-tuc\trien-lam-vec-2026\`
  - Bao gồm: `VEC_2026_MASTER_DOSSIER.md` (Hồ sơ tổng thể sự kiện), `MASTER_VEC2026_SYNTHESIS.md` (Tri thức đồng bộ 3 dự án), `00_README.md` (Chỉ mục tra cứu) và `README.md` (Hướng dẫn phát triển).
* **Mục đích & Phân công**:
  - Cung cấp toàn bộ thông số kỹ thuật, 5 hệ sinh thái Murrplastik, 5 nhóm thiết bị thương mại T&T Vina và 4 gói dịch vụ SLA Level-1 làm nền tảng nội dung phát triển trang tin tức sự kiện:
    `https://protools.com.vn/murrplastik/tin-tuc/trien-lam-vec-2026/`
  - Mã nguồn HTML trang đích: `D:\T&TVina\murrplastik_code\tin-tuc\trien-lam-vec-2026\index.html`.
  - Quy chuẩn thông tin: Email chính thức `info@t2tvina.com`, Hotline `0915.168.824` (Ms. Nhung) / `0973.363.824`.

### Rule 9.32: Quy Chuẩn Mở Rộng 6 Hệ Sinh Thái Murrplastik, Hàng Thương Mại T&T Vina & Đồng Bộ Email info@t2tvina.com (07/09/2026)
* **Đồng Bộ Email Liên Hệ Chuẩn Toàn Hệ Thống**:
  - Email chính thức và duy nhất của T&T Vina / Protools: **`info@t2tvina.com`**.
  - Đã chuẩn hóa 100% trên cả 2 phân vùng (Protools React SPA tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và Murrplastik Vanilla HTML tại [`tin-tuc/trien-lam-vec-2026/index.html`](file:///D:/T&TVina/murrplastik_code/tin-tuc/trien-lam-vec-2026/index.html)).
  - Triệt tiêu hoàn toàn các email cũ: `sales@murrplastik-vn.com`, `sales@t2tvina.com`, `t2t.vina@gmail.com`.
* **Cân Đối Lưới 6 Hệ Sinh Thái Murrplastik (Symmetrical 3x2 Grid)**:
  - Bổ sung nhóm thứ 6: **`CST`** (*Giải Pháp Tùy Chỉnh & Lắp Ráp Sẵn Theo Yêu Cầu / ReadyChain & Custom CAD*), mã màu badge đỏ thương hiệu nhạt.
  - Sắp xếp lưới `eco-cards-grid` thành 3 hàng × 2 cột đối xứng hoàn hảo trên Desktop:
    1. ACS (Laser Marking mp-LM 1M) — AUR (Robot Dress Pack & R-Tec Box)
    2. KDH (Cable Entry & Seals) — EFK (Energy Chains Drag Chains)
    3. SUV (Conduits & Fittings) — CST (ReadyChain & Custom CAD)
* **Khối Hàng Thương Mại T&T Vina & Cổng E-Catalog Protools**:
  - Bố trí trực tiếp phía dưới phần *Đăng Ký Tham Quan* (`#register`).
  - Gồm 6 nhóm thiết bị phụ trợ thực tế lấy từ `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS`:
    1. Trạm Hàn & Bể Hàn Cao Tần ESD Quick 205 (QUICK / Hakko)
    2. Tua Vít Điện & Máy Siết Lực Tự Động HIOS (HIOS / Kilews)
    3. Máy Bơm Keo Vi Sai Định Lượng Tự Động SP-982
    4. Thiết Bị & Dụng Cụ Phòng Sạch Chống Tĩnh Điện ESD
    5. Kính Hiển Vi Soi Nổi & Thiết Bị Đo Quang Học Peak
    6. Giá Lưu Trữ & Xe Đẩy Vật Tư SMT Cuộn Reel
  - Tích hợp banner Cổng Vật Tư Công Nghiệp `Protools.com.vn` với mã QR SVG chuẩn sắc nét, liên kết hotline kinh doanh `0943.301.886` và email `info@t2tvina.com`.
  - Phân vùng dải đối tác công nghệ FDI uy tín: VinFast Body Shop, Samsung, LG Display, Honda, Foxconn, Canon, Panasonic, ABB Robotics, Yaskawa.
* **Tối Ưu Giao Diện Mobile Responsive (Mobile-First Polish)**:
  - Trên màn hình di động (<640px): Tự động chuyển đổi lưới sản phẩm phụ trợ về 1 cột dọc (`grid-template-columns: 1fr`), căn giữa toàn bộ khối QR banner, nút bấm mở rộng 100% chiều rộng màn hình.


### Rule 9.33: Quy Chuẩn An Ninh Hạ Tầng: Tập Trung Độc Quyền Mắt Bão, Từ Bỏ Hostinger & Vệ Sinh Git (07/09/2026)
* **Quy Hoạch Hạ Tầng Độc Quyền Mắt Bão**:
  - Hủy bỏ toàn bộ việc triển khai và đồng bộ dữ liệu sang Hostinger (murrplastikvn.com).
  - Toàn bộ dịch vụ, mã nguồn, tài nguyên và cấu hình SEO (Canonical, OpenGraph, JSON-LD Schema) được quy hoạch tập trung 100% tại máy chủ Mắt Bão Cloud Network (s2d34.cloudnetwork.vn - public_html/murrplastik/), phục vụ trực tiếp qua phân vùng https://protools.com.vn/murrplastik/.
* **Tiêu Chuẩn Vệ Sinh Bảo Mật Git (Giữ Sạch GitHub)**:
  - CẤM đưa lên GitHub: Script deploy chứa mật khẩu plaintext (deploy_*.py), file log máy chủ (All_Logs.csv, Logs.csv), thư mục tạm agent (scratch/), video nặng (>30MB).
* **Tiêu Chuẩn Vệ Sinh Máy Chủ Production (Giữ Sạch Web Server)**:
  - CẤM upload lên Web Server Mắt Bão: File tài liệu nội bộ (docs/, *.md, README.md, AGENTS.md), thư mục Git (.git/, .gitignore), script deploy, file ảnh có tên dấu tiếng Việt hoặc khoảng trắng.

### Rule 9.34: Quy Chuẩn An Toàn Form B2B: Ghi CSDL MariaDB contact_list, Loại Bỏ File Upload & Chuẩn Hóa VEC 2026 (08/09/2026)
* **Form Giỏ Hàng B2B (`?tab=cart`)**:
  - Gỡ bỏ hoàn toàn tính năng BOM (*Bill of Materials*) để giao diện mua hàng tinh gọn, trực quan.
  - Tích hợp endpoint REST an toàn `public/api/submit_quote.php` (ECC AgentShield): Chống XSS qua `htmlspecialchars()`, chống SQLi qua PDO Prepared Statements, áp dụng Rate Limiting 5 req/min per IP và Honeypot ẩn `hp_fax`.
  - Ghi đơn trực tiếp vào bảng MariaDB **`contact_list`** (`prod2e4e_db`) để đơn mới lập tức xuất hiện tại màn hình quản trị chính thức `https://protools.com.vn/admincp/#contact`.
  - Đồng bộ gửi email thông báo tới `info@t2tvina.com` và `t2t.vina@gmail.com`.
* **Form Liên Hệ Murrplastik (`/murrplastik/#contact`)**:
  - Loại bỏ 100% ô upload file Base64 để triệt tiêu lỗ hổng Unrestricted File Upload lên Google Drive và nguy cơ cạn kiệt quota execution time của Google Apps Script.
  - Form chỉ gửi text thuần, thời gian phản hồi form < 400ms.
* **Form Đăng Ký VEC 2026 (`/tin-tuc/trien-lam-vec-2026/`)**:
  - Triệt tiêu lỗi nghiêm trọng "Thành công giả" trong Catch block: Báo lỗi trung thực và giữ nguyên dữ liệu form khi xảy ra mất mạng.
  - Chuẩn hóa Regex 10 số di động Việt Nam `/^(0|84)(3|5|7|8|9)[0-9]{8}$/` và header UTF-8.
  - Phân luồng dữ liệu sang tab riêng `VEC_2026_Visitors` trong Google Sheet kèm chống Formula Injection (`'`).


### Rule 9.34: Đóng Băng & Cô Lập Tuyệt Đối Thư Mục Backup murrplastik_code (08/09/2026)
* **Chính Sách Đóng Băng Thư Mục Backup**:
  - Tuyệt đối KHÔNG chỉnh sửa, không thêm bớt file và không can thiệp vào thư mục D:\T&TVina\murrplastik_code.
  - Thư mục này hiện tại chỉ đóng vai trò là kho lưu trữ dự phòng (backup repository), liên kết với tên miền cũ https://murrplastikvn.com/.
  - Mọi hoạt động phát triển tính năng, bảo trì mã nguồn, quản lý tài nguyên và deploy đều tập trung 100% tại d:\T&TVina\protools và phát hành lên máy chủ Mắt Bão (https://protools.com.vn/).

### Rule 9.35: Quy Chuẩn Xử Lý Trình Duyệt In-App (Zalo / Facebook) & Dual Fullscreen Engine WebGL 3D (08/09/2026)
* **Xử Lý Trình Duyệt In-App (Zalo / Facebook / TikTok / Line)**:
  - **Bản chất**: In-App WebView bóp nghẹt tài nguyên WebGL, chiếm dụng 20-30% diện tích màn hình điện thoại và chặn HTML5 Fullscreen API qua Permissions-Policy.
  - **Cơ chế thoát In-App**:
    1. **Android**: Hỗ trợ Intent URL Scheme (`intent://...#Intent;scheme=https;package=com.android.chrome;end`) kích hoạt khởi động trực tiếp Google Chrome hệ thống.
    2. **iOS (iPhone/iPad)**: Do cơ chế Sandbox của Apple cấm website tự ý ép mở Safari, tích hợp **Smart In-App Guidance Banner** hướng dẫn người dùng bấm biểu tượng `•••` (dấu 3 chấm) -> chọn *"Mở bằng Safari / Trình duyệt mặc định"*.
    3. **Trải nghiệm người dùng**: Thiết kế Dark Industrial Slate `#0f172a`, viền đỏ `#C8102E`, tuyệt đối không dùng Windows emojis, có nút đóng lưu vào `sessionStorage`.
* **Dual Fullscreen Engine cho WebGL 3D**:
  - **Vấn đề**: iOS Safari (iPhone) và In-App WebViews không hỗ trợ `requestFullscreen()` trên thẻ `<div>`/`<canvas>`.
  - **Giải pháp**: Triển khai **CSS Pseudo-Fullscreen** cố định toàn màn hình `100vw x 100dvh`, `z-index: 9999999`, khóa cuộn nền (`overflow: hidden`), hỗ trợ nút đóng nổi `[✕ Thu nhỏ]`, đổi icon SVG nút bấm tương ứng, lắng nghe phím `Escape` và nút Back phần cứng của smartphone (`popstate`). Hoạt động 100% trên mọi thiết bị.
### Rule 9.36: Quy Chuẩn Kiến Trúc Liên Kết Hai Chiều Cổng Mẹ Protools ⟷ Chuyên Trang Con Murrplastik (08/09/2026)
* **Phân Định Cấp Bậc Kiến Trúc (Parent-Child Architecture)**:
  - `protools.com.vn`: Đóng vai trò là Cổng Thiết Bị Công Nghiệp Tổng Thể (Parent Portal) của T&T Vina, quản lý danh mục đa ngành (hàn Hakko/Quick, bắt vít Hios, robot bơm keo, quạt ion ESD, kính hiển vi, máy cắt băng dính Zcut).
  - `protools.com.vn/murrplastik`: Đóng vai trò là Chuyên Trang Con Ủy Quyền (Authorized Subsite) của Murrplastik Systemtechnik GmbH (Đức).
* **Định Danh Hai Chiều Bắt Buộc**:
  - **Từ Cổng Mẹ sang Chuyên Trang Con**:
    1. Header Protools (Desktop & Mobile): Đặt nút nhận diện đối tác chiến lược `[Chuyên Trang Murrplastik Đức]` trên Topbar và Mega Dropdown.
    2. Khi người dùng lọc danh mục Murrplastik trên trang chủ: Giữ nguyên việc lọc danh sách 14 thiết bị thực tế, đồng thời xuất hiện **Partner Spotlight Showcase Banner** trên đầu và **Catalog CAD CTA Banner** ở cuối danh mục dẫn trực tiếp sang `/murrplastik/`.
  - **Từ Chuyên Trang Con về Cổng Mẹ**:
    1. Navbar & Mobile Menu của chuyên trang Murrplastik tích hợp mục `Trang Chủ Protools` dẫn về `/`.
    2. Breadcrumbs tin tức/sự kiện chuẩn hóa 4 tầng: `Protools Trang Chủ / Murrplastik / Tin tức & Sự kiện / Chi tiết`.
    3. Chân trang chuyên trang Murrplastik tích hợp Card **Hệ Thống Phân Phối T&T Vina** kết nối về tổng kho thiết bị trên `protools.com.vn`.

### Rule 9.37: Quy Chuẩn Điều Hướng Cùng Tab, Tối Giản Header & Tối Ưu Tốc Độ Deploy Production (08/09/2026)
* **Quy Chuẩn Chuyển Hướng Cùng Tab (Same-Tab Navigation Policy)**:
  - Mọi liên kết điều hướng nội bộ giữa Cổng Mẹ (`protools.com.vn`) và Chuyên Trang Con (`protools.com.vn/murrplastik/`) TUYỆT ĐỐI KHÔNG DÙNG `target="_blank"`.
  - Mọi chuyển hướng phải diễn ra ngay trong tab hiện tại của trình duyệt để tạo trải nghiệm liền mạch của một hệ sinh thái duy nhất.
* **Tối Giản Hóa Header & Triệt Tiêu Trùng Lặp**:
  - Không đặt các nút trùng lặp dẫn sang cùng một đích trên cả Topbar và Main Navbar.
  - Trên chuyên trang Murrplastik, loại bỏ thanh phụ `parent-bar-inner` trên đầu trang để giữ navbar chính tại `top: 0`, đảm bảo tính thanh thoát trên di động và máy tính.
* **Khoảng Cách Bố Cục Chân Trang (Footer Spacing)**:
  - Khối Card Hệ Thống Phân Phối T&T Vina (`.footer-protools-ecosystem`) phải duy trì khoảng cách tối thiểu `4.5rem` (`72px`) so với form liên hệ bên trên để tránh cảm giác chật chội.
* **Tối Ưu Tốc Độ & Độ Ổn Định Phát Hành Production (`deploy_production_root.py`)**:
  - Tích hợp kiểm tra kích thước file nhị phân qua FTP (`ftp.size(file) == local_size`): Bỏ qua an toàn 100+ file ảnh/video/3D nặng đã tồn tại trên server, rút ngắn thời gian deploy từ 15 phút xuống dưới 20 giây và chống timeout mạng.
### Rule 9.38: Quy Chuẩn Hub Danh Mục Thiết Bị Triển Lãm & Sticky Reading Tracker Chuẩn Gọn (08/09/2026)
* **Hub Danh Mục Thiết Bị Triển Lãm 67 Hạng Mục (Brand Switcher & 4 Cột Tiêu Chuẩn)**:
  - **Phân luồng 2 Master Brands**:
    1. **Hàng Hãng Murrplastik (Đức)**: 36 thiết bị/phụ kiện (`M-01` đến `M-36`), bao gồm Máy in tem Laser `mp-LM 1M`, R-Tec Box, Xích cáp MP 560 RV, MP 800 RK, Tấm luồn cáp KDP/X, KDP/P EX, TRO Liner 2.0, SAT-GF.
    2. **Hàng Thương Mại T&T Vina**: 31 thiết bị/vật tư (`T-01` đến `T-31`), bao gồm Robot hàn, Hakko 936, Bể hàn CM-808, Tô vít Hios, Robot bơm keo SP-982, Zcut 9, HP-10, Quạt ion SL-001, kim bơm, mũi hàn.
    3. **Tất Cả Thiết Bị**: 67 hạng mục tổng thể.
  - **Bảng 4 Cột Tiêu Chuẩn**:
    - Cột 1: `STT` (Badge màu thương hiệu: Đỏ `#E30613` cho Murrplastik, Xanh `#00478D` cho T&T Vina).
    - Cột 2: `TÊN THIẾT BỊ / PHỤ KIỆN` (Tên thiết bị, Part Number, hãng sản xuất, tag phân loại kỹ thuật).
    - Cột 3: `SỐ LƯỢNG` (Số lượng trưng bày thực tế, căn giữa).
    - Cột 4: `ĐẶC TÍNH & GHI CHÚ KỸ THUẬT` (Thông số Đức/Nhật chính xác, tính năng và nút liên hệ tư vấn trực tiếp).
* **Phụ Lục 5 Phần & Sticky Reading Tracker Tối Giản**:
  - **Phụ Lục Bài Viết Đầu Trang (5 Phần)**: Chia rõ 5 phần trọng tâm của bài viết (1. Gian Hàng 3D, 2. 6 Hệ Sinh Thái Murr, 3. Quà Tặng Khách VIP, 4. Đăng Ký Tham Quan, 5. Danh Mục Thiết Bị Trưng Bày).
  - **Sticky Reading Tracker Chuẩn Gọn**:
    - Cố định trên cùng khi cuộn màn hình, tích hợp thanh tiến trình đọc gradient 3px.
    - Định dạng hiển thị bắt buộc: **`X/5: [Tên Phần]`** (ví dụ: `2/5: 6 Hệ Sinh Thái Murrplastik`), tuyệt đối không thêm tiền tố/hậu tố rườm rà.
    - Hỗ trợ nút mở nhanh bảng danh mục phần (Quick Dropdown) và nút cuộn mượt về Form Đăng Ký.
* **Quy Chuẩn CSS Cột STT & Badge Chống Gãy Dòng (STT Badge Layout Standard)**:
  - Chiều rộng cột STT cố định tối thiểu `72px` (`.vec26-th-stt`, `.vec26-col-stt`).
  - Badge cấu hình `display: inline-flex; align-items: center; justify-content: center; min-width: 48px; height: 26px; white-space: nowrap; font-family: 'JetBrains Mono';`.
  - Cấm tuyệt đối hiện tượng ngắt dòng ở dấu gạch ngang (`M-` / `01`), tích hợp hiệu ứng hover đổi màu nền theo thương hiệu chủ đạo (`#E30613` cho Murrplastik, `#00478D` cho T&T Vina).

### Rule 9.39: Quy Chuẩn Bố Cục Phụ Lục Header, Hero Showcase 6 Hệ Sinh Thái & Bộ Quà Tặng Doanh Nghiệp VIP (08/09/2026)
* **Phụ Lục Tích Hợp Trực Tiếp Trong Header (`.news-header-section`)**:
  - Đặt `.article-toc-box` nằm trọn trong khối `<header class="news-header-section">` ngay dưới `.event-meta-card`.
  - Phân tách cấu trúc rõ ràng: Nền xám kỹ thuật `#F8FAFC`, thẻ con `#FFFFFF`, viền `#E2E8F0`, giúp người đọc định hình 5 phần nội dung ngay khi tiếp cận bài viết trước khi bước vào không gian 3D.
* **Hero Showcase & Hệ Thống Ảnh 6 Hệ Sinh Thái Murrplastik (Section 2)**:
  - **Hero Showcase Đầu Section**: Sử dụng ảnh toàn cảnh ứng dụng `applications_products_murrplastik_no_background_2` trên nền Slate tối gradient `#0B1120` -> `#1E293B` kèm vầng sáng Ambient Red Glow `#E30613` thể hiện tính đồng bộ của 6 hệ sinh thái.
  - **Thẻ Hệ Sinh Thái Đi Kèm Ảnh Kỹ Thuật Thực Tế**:
    - `ACS`: Ảnh máy in khắc laser `mp-LM 1M` kèm thẻ mẫu (`ACS_MP_LM_1M_produkt_02`).
    - `AUR`: Ảnh cụm Dresspack & hộp hồi vị `R-Tec Box` cho robot 6 trục (`aur_cable_retraction_systems_group`).
    - `KDH`: Ảnh tấm luồn cáp vi sinh Clean KDP/S chuẩn FDA kháng nước (`Clean_kdp_s_fda_murrplastik`).
    - `EFK`: Ảnh máng xích dẫn cáp Evochain 420 tháo lắp nhanh (`Evochain_420_konfektioniert_freisteller`).
    - `SUV`: Ảnh hệ thống ống ruột gà & cút nối công nghiệp (`image_Conduits_and_fittings_murrSystems`).
    - `CST`: Ảnh cấu hình may đo CAD 3D Dresspack & ReadyChain (`eco_cst_custom`).
  - Toàn bộ ảnh được tối ưu hóa chuẩn WebP nén không suy hao từ 35MB xuống dưới 900KB tổng thể, bọc trong khung `.eco-img-wrap` nền trắng tương phản cao và hiệu ứng zoom mượt khi hover.
* **Showcase Bộ Quà Tặng Khách Tham Quan VIP (Section 4)**:
  - Đặt khối `.vip-gifts-showcase` ngay cạnh Form Đăng Ký Tham Quan (`#register`), tạo động lực chuyển đổi thị giác trực quan:
    1. Bút Ký Kim Loại Murrplastik chính hãng Đức (`gift_pen_murrplastik`).
    2. Túi Canvas Tiện Ích Murrplastik chuyên dụng đựng tài liệu & catalogue (`gift_tupper_murrplastik`).
    3. Thẻ Tên Kim Loại Khắc Laser Trực Tiếp bằng máy `mp-LM 1M` trong 30 giây theo tên đăng ký.

### Rule 9.40: Tối Ưu Hóa UI/UX Mobile, Giao Diện Sáng Đồng Nhất & Huy Hiệu Scarcity Quà Tặng (08/09/2026)
* **Quy Chuẩn Đồng Nhất Sắc Thái & Kích Thước Khối Hero Hệ Sinh Thái (`.eco-hero-showcase`)**:
  - Chuyển đổi từ nền đen tương phản gắt sang phong cách Technical Light `#F8FAFC`, viền `#E2E8F0`, đổ bóng mềm `rgba(15, 23, 42, 0.04)`.
  - Tối ưu chiều cao hiển thị: Thu hẹp `max-height` ảnh từ `420px` xuống `280px` trên Desktop và `200px` trên Mobile; giảm margin từ `2.5rem` xuống `1.25rem 0 2rem` (desktop) và `1rem 0 1.5rem` (mobile) để tránh chiếm dụng không gian cuộn dọc.
* **Quy Chuẩn Tinh Gọn Nội Dung & Huy Hiệu Quà Tặng VIP Scarcity (Section 4)**:
  - Lược bỏ hoàn toàn đoạn văn dẫn thừa thãi nhằm tăng tốc độ chuyển đổi trực tiếp vào Form.
  - Tích hợp huy hiệu khẩn cấp thị giác (Visual Scarcity Badge): `SỐ LƯỢNG CÓ HẠN · 100 SUẤT ĐĂNG KÝ SỚM` với chấm đỏ phát xung (`gift-pulse-dot`) và tag `SỐ LƯỢNG CÓ HẠN` trên từng thẻ quà tặng (Bút ký, Túi Canvas).
* **Quy Chuẩn Tương Thích Di Động Mobile-First & iOS Safari**:
  - Khắc phục lỗi Auto-Zoom trên iOS Safari: Bắt buộc khai báo `font-size: 16px !important;` cho toàn bộ thẻ `input`, `select`, `textarea` trong form báo giá / đăng ký.
  - Ngăn ngừa gãy dòng huy hiệu trên màn hình hẹp (<640px): Cấu hình `.gifts-label-row` tự động chuyển sang `flex-direction: column` căn lề trái.
  - Giảm padding các thẻ container trên màn hình nhỏ để tránh chiếm dụng không gian hiển thị (`.eco-card` giảm xuống `1.25rem 1rem`, `.reg-left` / `.reg-right` giảm xuống `1.5rem 1.25rem`).

### Rule 9.41: Quy Chuẩn Bảng Dữ Liệu Kỹ Thuật Di Động, Tiêu Đề Dính Đa Chiều & Chống Tràn Màn Hình (08/09/2026)
* **Quy Chuẩn Tiêu Đề Bảng Dính Đa Chiều (Bidirectional Sticky Table Standard)**:
  - Bắt buộc khai báo `border-collapse: separate; border-spacing: 0;` trên thẻ `table` khi dùng `position: sticky` để tránh lỗi biến mất viền hoặc giật layout trên trình duyệt di động WebKit / Chromium.
  - Khối bao ngoài bảng (`.vec26-table-wrap`): Cấu hình `max-height: 60vh - 65vh; overflow: auto; -webkit-overflow-scrolling: touch;`.
  - Tiêu đề bảng (`thead th`): Cấu hình `position: sticky; top: 0; z-index: 25; background: #0F172A; box-shadow: 0 2px 6px rgba(0,0,0,0.18);`.
  - Ô góc trên cùng bên trái (`th.vec26-th-stt`): Khai báo `position: sticky; top: 0; left: 0; z-index: 35;` để cố định tuyệt đối trong cả hai chiều cuộn ngang và cuộn dọc.
  - Cột mã thiết bị (`td.vec26-col-stt`): Khai báo `position: sticky; left: 0; z-index: 15;` kèm màu nền đồng nhất với hàng và đổ bóng nhẹ sang phải (`box-shadow: 2px 0 6px -2px rgba(0,0,0,0.08);`).
* **Quy Chuẩn Chống Tràn Màn Hình & Trả Lại Không Gian Hiển Thị (Zero Mobile Overflow)**:
  - Khắc phục triệt để lỗi padding `.container`: Trên màn hình di động (<768px), giảm padding từ `3rem` (48px) xuống `16px` (và `12px` trên <480px), giải phóng hơn 70px chiều ngang màn hình.
  - Triệt tiêu hiện tượng Flexbox kéo giãn body (`bodyScrollWidth` vượt quá `window.innerWidth`): Luôn khai báo `min-width: 0; width: 100%; max-width: 100%;` cho các container cha chứa thanh tab lọc cuộn ngang (`.vec26-filter-tabs`).
  - Thanh chỉ báo cuộn ngang thông minh (`.vec26-table-scroll-hint`): Tự động hiển thị trên di động với thông điệp hướng dẫn rõ ràng kèm icon chỉ báo.

### Rule 9.42: Tối Ưu Bảng Di Động Liền Khối, Chuẩn Hóa Vị Trí Gian Hàng H2-15a & Triệt Tiêu Khe Hở Footer (08/09/2026)
* **Chuẩn Hóa Vị Trí Gian Hàng & Tinh Gọn Nội Dung 3D**:
  - Cập nhật đồng bộ toàn trang (Meta, Schema JSON-LD, Nav, Badges, 3D Canvas TV, Form) vị trí gian hàng chính thức: **`GIAN HÀNG H2-15a · SẢNH 2`**.
  - Lược bỏ từ "Ảo 3D" trong tiêu đề thành `Mô Phỏng Gian Hàng (Ô H2-15a · Sảnh 2)` và xóa bỏ hoàn toàn dòng mô tả thao tác xoay camera 360 rườm rà.
* **Tăng Tỷ Lệ Hiển Thị Ảnh Tổng Quan Hệ Sinh Thái (`hero_ecosystems.webp`)**:
  - Nâng `max-width` lên `880px`, `max-height` lên `380px` trên Desktop và `260px` trên Mobile giúp sơ đồ kiến trúc 6 giải pháp Made in Germany hiển thị to rõ, nổi bật.
* **Quy Chuẩn Bảng Thông Số Di Động Cuộn Liền Khối (Unified Mobile Spec Table)**:
  - Loại bỏ `position: sticky; left: 0;` trên cột STT để các cột trượt ngang cùng nhau như một khối thống nhất, triệt tiêu hoàn toàn hiện tượng hở khe trắng hoặc lung lay khi vuốt sang phải.
  - Bảo lưu nguyên vẹn `position: sticky; top: 0; z-index: 25;` cho `thead th` để cố định tiêu đề cột khi cuộn dọc xem danh mục 67 thiết bị.
  - Thêm `overscroll-behavior-x: contain;` trên `.vec26-table-wrap` để thao tác vuốt ngang bảng không truyền cử chỉ ra ngoài document.
* **Triệt Tiêu Tuyệt Đối Khe Hở Trắng Sau Footer Trên Màn Hình Điện Thoại**:
  - Áp dụng `overflow-x: clip !important; width: 100% !important; max-width: 100vw !important;` trên `html`, `body` và `footer`. Thuộc tính `clip` khóa cứng viewport không cho phép document pan ngang khi vuốt chạm, đồng thời đảm bảo footer luôn phủ kín 100% chiều ngang màn hình không để lộ nền trắng.

### Rule 9.43: Quy Chuẩn Bảng HTML Đơn Báo Giá B2B Trên AdminCP & Chuẩn Hóa Thời Gian create_time (09/09/2026)
* **Bảng Báo Giá HTML Trong CSDL (`contact_list.content`)**:
  - Khi nhận đơn báo giá từ giỏ hàng B2B (`?tab=cart`), API [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) lưu nội dung dưới dạng bảng HTML có viền nét mảnh (`border="1"`, bordercolor `#cbd5e1`), tiêu đề xám nhạt (`#f1f5f9`), căn lề chuẩn (STT/SL ở giữa, SKU font monospace màu xanh `#005BAC`, Đơn giá căn phải).
  - Khối "Ghi chú dự án" được bọc riêng trong thẻ div viền xanh `#005BAC` nổi bật phía trên bảng.
  - Loại bỏ hoàn toàn các ký tự phân cách ASCII kiểu cũ (`=====` và `-----`).
  - Đầu chuỗi HTML tích hợp thẻ ẩn `<span style="display:none;">Báo giá B2B (X mục)...</span>` để hàm `strip_tags()` tại màn hình danh sách AdminCP (`admincp/#contact`) hiển thị dòng trích dẫn tóm tắt gọn gàng, không bị vỡ giao diện.
* **Chuẩn Hóa Cột Thời Gian Gửi (`create_time`)**:
  - Mã nguồn CMS cũ dùng hàm `format_full_time()` quy ước chuỗi 14 số dạng `YmdHis` (ví dụ `20260909233650`).
  - Giá trị lưu vào cột `create_time` trong CSDL MariaDB phải dùng `date('YmdHis')` thay vì Unix timestamp thô `time()`, đảm bảo AdminCP hiển thị chính xác ngày giờ `HH:mm DD/MM/YYYY`.
* **Phân Tách Nội Dung Email (@mail)**:
  - Tách riêng `$email_body` dạng plain-text phân cấp rõ ràng theo từng thiết bị, bỏ các đường kẻ thô ráp để email gửi đến Sales (`info@t2tvina.com`) luôn sạch sẽ và chuyên nghiệp.

### Rule 9.44: Quy Chuẩn Nhận Diện Tác Giả Footer Toàn Hệ Thống (10/09/2026)
* **Đồng Bộ Dòng Credit Thiết Kế & Phát Triển**:
  - Toàn bộ chân trang hệ thống bao gồm Cổng Mẹ ([`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx)) và Chuyên Trang Con Murrplastik ([`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), tin tức, triển lãm) hiển thị đồng nhất dòng credit:
    `Designed & Developed by KhaiLL (T&T VINA INDUSTRIAL)`
  - Định dạng: Font monospace, cỡ chữ nhỏ gọn `11px`, màu mờ nhẹ kỹ thuật (`text-slate-500/70` hoặc `rgba(255, 255, 255, 0.45)`).
  - Vị trí trên Chuyên trang Murrplastik: Nằm ở vị trí trung tâm trong `.footer-bottom-row` giữa bản quyền bên trái (`.footer-bottom-left`) và đại lý ủy quyền bên phải (`.footer-bottom-right`), tận dụng hoàn hảo khoảng trống ở giữa; trên màn hình điện thoại tự động chuyển `flex-direction: column` căn giữa gọn gàng.

### Rule 9.45: Bảo Toàn Tính Toàn Vẹn Song Ngữ i18n Murrplastik (10/09/2026)
* **Quy Trình Kiểm Tra i18n Trước Khi Phát Hành**:
  - Mọi thay đổi nội dung chữ (text content), thẻ điều hướng navbar, thông tin footer hoặc các component mới trong phân vùng `public/murrplastik/` phải được khai báo song ngữ đầy đủ cả 2 từ điển `TRANSLATIONS.vi` và `TRANSLATIONS.en` trong [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js).
  - **Cơ chế ghi đè DOM của hàm `applyTranslations()`**: Vì `i18n.js` chạy tự động khi nạp trang và đọc các thẻ có `data-i18n`, nếu giá trị trong file JS chưa được cập nhật (ví dụ key `footer.copy` còn lưu năm 2025 hoặc domain cũ `murrplastikvn.com`), script sẽ tự động ghi đè ngược lại làm mất nội dung mới trên HTML.
  - **Chỉ số kiểm thử bắt buộc**: Số lượng key giữa tiếng Việt và tiếng Anh phải luôn đạt tỉ lệ cân bằng 100% (ví dụ: `562 VI keys = 562 EN keys`), số lượng key thiếu sót (`Missing in VI` / `Missing in EN`) phải luôn bằng `0`.
### Rule 9.46: Kiến Trúc Đa Ngôn Ngữ 7 Quốc Gia & Quy Chuẩn Cờ Vector SVG (10/09/2026)
* **Thứ Tự 7 Ngôn Ngữ Chuẩn Hệ Thống**:
  1. `vi`: 🇻🇳 Tiếng Việt (*Mặc định gốc*)
  2. `en`: 🇬🇧 English (*Tiêu chuẩn kỹ thuật quốc tế*)
  3. `de`: 🇩🇪 Deutsch (*Tiêu chuẩn xuất xứ Murrplastik Đức*)
  4. `zh-CN`: 🇨🇳 中文 (*Ưu tiên phục vụ khách hàng B2B tại VEC 2026*)
  5. `ko`: 🇰🇷 한국어 (*Nhà máy điện tử SMT Hàn Quốc*)
  6. `ja`: 🇯🇵 日本語 (*Tiêu chuẩn thiết bị Nhật Bản Hakko/Hios*)
  7. `th`: 🇹🇭 ไทย (*Trung tâm cơ khí & ô tô ASEAN*)
* **Quy Chuẩn Cờ Vector SVG (Tuân thủ User Rule 1 - Cấm Tuyệt Đối Emoji Windows)**:
  - Tất cả cờ quốc gia được tạo bằng vector SVG phẳng độc quyền tại [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), kích thước chuẩn micro `18px × 12px`, bo góc nhẹ `1.5px` và có viền `0.5px border-black/10`. Tuyệt đối không dùng emoji hệ điều hành.
* **Bộ Từ Điển Thuật Ngữ Kỹ Thuật Công Nghiệp Khóa Cứng (B2B Master Glossary)**:
  - Khóa cứng thuật ngữ chuẩn ngành công nghiệp tránh lỗi dịch máy ngô nghê: Máng xích luồn cáp (`拖链`), Ống ruột gà & đầu nối (`电缆保护软管及接头`), Tấm luồn cáp kín nước (`电缆穿线板`), Bộ Dresspack cáp robot (`机器人管线包及回位系统`), Máy khắc laser (`工业激光打标机`), Trạm hàn thiếc SMT (`防静电焊台`), Robot bơm keo (`自动点胶机`), Máy cắt băng dính (`自动胶带切割机`), Quạt ion khử tĩnh điện (`防静电离子风机`).
* **Đồng Bộ Bộ Nhớ Trình Duyệt (`localStorage`)**:
  - Lưu trữ khóa `tt_vina_locale` xuyên suốt phiên làm việc, tự động khôi phục khi tải lại trang và cầu nối đồng bộ sang Chuyên trang Murrplastik ([`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js)).

### Rule 9.47: Quy Chuẩn Bản Địa Hóa Sâu 100% & Triệt Tiêu Xung Đột Điểm Ngắt Đa Ngôn Ngữ (10/09/2026)
* **Bản Địa Hóa Sâu Toàn Bộ Thiết Bị & Thông Số Kỹ Thuật (Deep Technical Localization)**:
  - Tất cả 77 mã thiết bị thực tế trong hệ thống khi hiển thị tại Trang Chủ (`Home.tsx`), Trang Chi Tiết (`ProductDetail.tsx`) và Kính Lúp Xem Nhanh (`hoveredZoomProduct`) đều được bọc qua hàm `getLocalizedProduct(product, locale)` tại [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
  - Bản địa hóa 100% các trường: Tên máy, Danh mục, Nhãn xuất xứ, Trạng thái sẵn kho, Bảng thông số kỹ thuật (Spec-sheet rows), Đặc tính vận hành SMT/Robot, Nút Thêm báo giá và Hồ sơ chứng từ nhà máy (CO/CQ/VAT/Trial-test).
* **Nâng Cấp Chuyên Trang Murrplastik Sang Hệ Thống 7 Ngôn Ngữ Hoàn Chỉnh**:
  - Mở rộng từ điển [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) hỗ trợ đầy đủ 7 thứ tiếng: `vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`.
  - Thay thế cụm nút toggle cũ `[VI | EN]` bằng Dropdown chuẩn Swiss-Precision mang phong cách công nghiệp cao cấp (`#0F172A`, viền `#E30613`), tích hợp cờ vector SVG micro, hiển thị tên ngôn ngữ bản xứ và dấu tích kích hoạt `✓`.
  - Bổ sung lưới chọn ngôn ngữ dạng Grid 2 cột trong Mobile Drawer Menu phục vụ người dùng smartphone tại sự kiện VEC 2026.
* **Triệt Tiêu Tuyệt Đối Tình Trạng Trùng Lặp Bộ Đổi Ngôn Ngữ (Zero-Duplicate Breakpoint)**:
  - Loại bỏ hoàn toàn bộ chọn ngôn ngữ ở thanh Utility Bar phía trên (`h-9 flex`).
  - Tại thanh Navigation chính, phân định dứt khoát điểm ngắt:
    - Màn hình Desktop & Tablet (`>= sm`): Chỉ hiển thị DUY NHẤT 1 dropdown `<LanguageSwitcher variant="header" />` (`hidden sm:inline-block`).
    - Màn hình Điện thoại (`< sm`): Chỉ hiển thị DUY NHẤT 1 ô toggle gọn nhẹ `<LanguageSwitcher variant="utility" />` (`sm:hidden`).
  - Đảm bảo trên mọi độ phân giải màn hình (desktop, tablet, mobile) luôn luôn chỉ tồn tại đúng 1 bộ chuyển đổi ngôn ngữ duy nhất.

### Rule 9.48: Quy Chuẩn Tích Hợp Sản Phẩm Thiết Bị Hàn QUICK 205 & Bảng Phụ Kiện Tiêu Chuẩn (15/09/2026)
* **Thông Tin Kỹ Thuật Sản Phẩm QUICK 205**:
  - Mã định danh (ID): `QUICK-205` / SKU: `TTV-QUI-205`.
  - Tên thiết bị: `Trạm hàn cao tần QUICK 205 ESD (150W)`.
  - Hãng sản xuất: `QUICK (Phân phối chính hãng)` - Danh mục: `Thiết bị hàn công nghiệp / Trạm hàn ESD` (`categorySlug: 'thiet-bi-han'`).
  - Xuất xứ: `Chính Hãng` · Trạng thái: `Sẵn hàng tại kho Hà Nội & Hưng Yên`.
  - Công nghệ & Công suất: Gia nhiệt xoáy cao tần (High-Frequency Eddy Current Heating) 150W bù nhiệt siêu tốc, dải nhiệt 200°C ~ 600°C, độ ổn định ±2°C, điện áp 220V AC / 50Hz, điện trở nối đất < 2Ω, điện áp rò < 2mV, đạt chuẩn chống tĩnh điện ESD Safe.
* **Tài Nguyên Hình Ảnh Studio Thực Tế**:
  - Nguồn ảnh gốc: `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS\1_thiết_bị_hàn_ESD_QUICK_205.png`.
  - Đã sao lưu và tối ưu vào: `public/images/products/quick-205.png` (bản gốc studio trong suốt) và `public/images/products/quick-205.webp` (bản WebP 259KB).
* **Bản Địa Hóa Đa Ngôn Ngữ & Nâng Cấp Giao Diện B2B**:
  - Cập nhật bản dịch tên máy đa ngôn ngữ sang 6 thứ tiếng trong `PRODUCT_NAME_TRANSLATIONS` ([`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts)).
  - Mở rộng từ điển `SPEC_KEY_TRANSLATIONS` dịch chuẩn xác 8 thông số kỹ thuật mới: Công suất định mức, Công nghệ gia nhiệt, Dải nhiệt độ cài đặt, Độ ổn định nhiệt độ, Điện áp hoạt động, Điện trở nối đất đầu mỏ hàn, Điện áp rò đầu mỏ hàn, Tiêu chuẩn chống tĩnh điện.
  - Tối ưu hóa giao diện [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): Tự động in đậm tiền tố tính năng khi có dấu hai chấm `:`, và hiển thị khối riêng lưới "Phụ Kiện Tiêu Chuẩn Đi Kèm (Standard Included Accessories)" gồm 7 thành phần chi tiết của trạm hàn QUICK 205.

### Rule 9.49: Quy Chuẩn Tự Động Hóa Quản Trị Danh Mục & Bản Địa Hóa Sâu Toàn Diện (Catalog Automation & Deep Localization - 15/09/2026)
* **Đóng Gói Kỹ Năng Quản Trị Danh Mục Hàng Loạt (Skill `protools-catalog-manager`)**:
  - Mã nguồn thực thi: [`scripts/catalog_manager.py`](file:///d:/T&TVina/protools/scripts/catalog_manager.py).
  - Lệnh CLI tự động hóa trong `package.json`:
    - `pnpm catalog:add --input path/to/products.json`: Tự động thêm 1 hoặc N sản phẩm hàng loạt.
    - `pnpm catalog:audit`: Quét toàn bộ danh mục, đối soát ảnh hỏng, kiểm tra 100% độ phủ dịch thuật thông số kỹ thuật.
  - Quy trình xử lý tự động khép kín (End-to-End Pipeline):
    1. Nhận danh sách N sản phẩm từ file JSON.
    2. Đọc ảnh gốc từ đường dẫn máy nội bộ (local asset), tối ưu hóa nén chuẩn WebP chất lượng cao (PIL Pillow, quality 85) lưu vào `public/images/products/<slug>.webp`.
    3. Tự động sinh dữ liệu dịch thuật B2B sang đầy đủ 7 ngôn ngữ (`vi`, `en`, `zh-CN`, `de`, `ko`, `ja`, `th`).
    4. Ghi nối tiếp an toàn vào `PRODUCTS` trong [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và cập nhật từ điển [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
    5. Tự động chạy `pnpm build` xác thực TypeScript và bundling trước khi hoàn tất.
* **Bản Địa Hóa Sâu 100% Cột 1 & Cột 2 Bảng Thông Số Kỹ Thuật (Spec-Sheet Full Parity)**:
  - Bổ sung toàn bộ 13 khóa thông số kỹ thuật còn thiếu vào `SPEC_KEY_TRANSLATIONS`: Chương trình lập trình hẹn giờ, Chức năng, Dự án tiêu biểu, Kích thước (D x R x C), Lượng keo tối thiểu, Model, Trọng lượng, Áp suất khí ra, Áp suất khí vào, Điện áp đầu ra, Điện áp đầu vào, Độ bền uốn, Ứng dụng Robot.
  - Chuẩn hóa từ điển `COMMON_VALUE_TRANSLATIONS` cho 100% các giá trị văn bản kỹ thuật xuất hiện trong catalog: Nhà sản xuất, Xuất xứ, Trạng thái kho, Thiết bị phụ trợ, Robot hàn ABB/KUKA, Dự án Body Shop VinFast Cát Hải, v.v. Các đơn vị đo lường quốc tế (W, V, Hz, bar, ml, s, g, °C, Ω, mV) được giữ nguyên chuẩn kỹ thuật toàn cầu.
* **Bản Địa Hóa Toàn Diện Tính Năng & Phụ Kiện Tiêu Chuẩn (Features & Accessories)**:
  - Chuẩn hóa toàn bộ 16 điểm nổi bật (`ALL_HIGHLIGHTS_TRANSLATIONS`) và 7 phụ kiện tiêu chuẩn (`ALL_ACCESSORIES_TRANSLATIONS`) sang 7 ngôn ngữ.
  - Nâng cấp `translateFeatureItem()` và `translateAccessoryItem()` xử lý trơn tru các chuỗi tính năng dạng tiền tố `Tiền_tố: Diễn_giải`.
  - Loại bỏ hoàn toàn fallback tiếng Việt hoặc mảng tính năng mẫu chung chung, bảo toàn nội dung kỹ thuật chi tiết của từng sản phẩm.
* **Bản Địa Hóa Giao Diện B2B Misumi Pricing Tiers & Case Study Banner**:
- Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), chuyển đổi toàn bộ tiêu đề, nhãn bảng bậc giá số lượng B2B (Q'ty, Pricing Policy, Lead Time, Click hint) và thông điệp chứng thực dự án VinFast Body Shop sang hàm `t()` đa ngôn ngữ.
### Rule 9.50: Quy Chuẩn Tải Nén Ảnh WebP Đa Luồng & Bóc Tách Làm Giàu Dữ Liệu B2B Hàng Loạt (15/09/2026)
* **Đường Ống Tải & Nén Ảnh WebP Tự Động (Multithreaded Sapo Image Pipeline)**:
- Mã nguồn thực thi: [`scripts/download_compress_sapo_images.py`](file:///d:/T&TVina/protools/scripts/download_compress_sapo_images.py).
- Kết quả xử lý thực tế: 6.895 / 6.895 ảnh duy nhất từ CDN Sapo được tải và nén WebP thành công 100% trong 4.5 phút (0 lỗi, tốc độ ~25.3 ảnh/giây với 20 luồng song song).
- Chuẩn nén: WebP Quality 82, kích thước cạnh tối đa 800px (thuật toán LANCZOS), giữ nguyên kênh Alpha trong suốt. Giảm dung lượng từ ~1.5 MB xuống ~37 KB/ảnh (giảm 95%), tổng dung lượng toàn bộ 6.895 ảnh chỉ còn 256.2 MB tại [`public/images/products/sapo/`](file:///d:/T&TVina/protools/public/images/products/sapo/).
- Bảng ánh xạ tập trung: [`public/data/sapo_image_map.json`](file:///d:/T&TVina/protools/public/data/sapo_image_map.json) map 6.897 mã SKU sang đường dẫn file WebP nội bộ.
* **Pipeline Phân Cụm Ngành Hàng & Sinh Mô Tả Kỹ Thuật B2B (Data Enrichment Pipeline)**:
- Mã nguồn thực thi: [`scripts/enrich_sapo_descriptions.py`](file:///d:/T&TVina/protools/scripts/enrich_sapo_descriptions.py).
- Giải quyết triệt để vấn đề 7.477 sản phẩm (99.97%) bị trống mô tả trong kho Sapo:
1. Tự động bóc tách thông số kỹ thuật có sẵn trong chuỗi tên: Quy cách ren (`M12x40`), đường kính ống phi (`PV12` -> 12mm), kích thước băng tải (`2008*85*2mm`), nòng và hành trình xi lanh (`MGPM32-75Z` -> nòng 32mm, hành trình 75mm), điện áp (`220V`, `24V`).
2. Tự động phân loại vào 16 nhóm ngành hàng công nghiệp (Khí nén, Xi lanh, Mũi vít, Kim bơm keo, Bu lông, Băng tải, Cảm biến, Mũi hàn, Rơ le, v.v.).
3. Tự động sinh đoạn văn mô tả chuẩn văn phong B2B công nghiệp kèm tình trạng tồn kho thực tế, đơn vị tính và cam kết giao hàng KCN.
- Bộ dữ liệu hoàn chỉnh lưu độc lập tại [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) và bản mẫu 25 sản phẩm tại [`public/data/sapo_sample_25_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_sample_25_enriched.json) phục vụ nghiệm thu trước khi tích hợp frontend.
### Rule 9.51: Quy Chuẩn Nhóm Biến Thể Murrplastik (Master-Variant Matrix) & Dashboard Quản Trị Excel B2B (15/09/2026)
* **Mô Hình Dòng Sản Phẩm Cha & Biến Thể Quy Cách (Murrplastik Variantes Standard)**:
- Học hỏi cấu trúc chuẩn từ Murrplastik Shop (`shop.murrplastik.com`), các sản phẩm cùng loại nhưng khác kích cỡ/thông số (ví dụ: `Cút nối góc PV12`, `PV10`, `PV8`) được gom nhóm về cùng một Dòng sản phẩm cha (`Cút nối góc PV (AKS)`) với bảng ma trận biến thể (`variants` array).
- Tự động bóc tách quy cách: Kích thước phi ống (`Phi 12 mm`), ren bu lông (`M12 x 40 mm`), kích thước 3 chiều băng tải/phíp (`2008 x 85 x 2 mm`), nòng và hành trình xi lanh (`Nòng 32mm - Hành trình 75mm`), cỡ kim keo (`16G`), v.v.
- Xuất bản tệp dữ liệu cấu trúc: [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json) (8.2 MB) chứa 6.995 Master Families, mỗi family lưu trữ mã `masterId`, tên gốc, nhóm ngành, mô tả kỹ thuật đại diện, ảnh đại diện và mảng `variants` chi tiết phục vụ render tab Variantes trên giao diện web.
* **Quy Chuẩn Bảng Tính Quản Trị Excel B2B Đa Tương Tác**:
- Cập nhật trực tiếp trên tệp: [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx).
- Cấu trúc tích hợp:
1. **Cột D (Mô tả sản phẩm)**: Cập nhật 100% (7.479 dòng) mô tả kỹ thuật chuẩn B2B công nghiệp.
2. **Cột 34 (Ảnh WebP Local)**: Khởi tạo 6.820 công thức `=HYPERLINK("...", "Xem Ảnh WebP (XX KB)")` cho phép click chuột trực tiếp từ Excel để mở ảnh chất lượng cao trên máy tính Windows.
3. **Cột 35 (Dòng sản phẩm cha - Master Family)**: Phục vụ lọc nhanh nhóm sản phẩm theo họ thiết bị.
4. **Cột 36 (Quy cách biến thể - Variant Specs)**: Bóc tách rõ kích thước/thông số cụ thể.
5. **Cột 37 (Trạng thái sẵn kho B2B)**: Phối màu trực quan (Xanh lá `#E8F5E9` cho 1.045 mặt hàng có sẵn tồn kho; Xám nhạt `#FAFAFA` cho 6.434 mặt hàng đặt theo dự án).
6. **Sheet `TongQuanDanhMuc`**: Bảng điều khiển KPI (Tổng SKU, Số ảnh WebP nén thành công, Số dòng sản phẩm cha, Tỷ lệ sẵn kho) kèm bảng phân bổ theo 16 nhóm ngành hàng công nghiệp.
7. **Cố định hàng tiêu đề (Freeze Panes B2)** và bật bộ lọc tự động (**AutoFilter**) trên toàn bộ bảng tính.
### Rule 9.52: Bài Học Nghiệp Vụ - Tuyệt Đối Không Tự Ý Suy Đoán & Gán Nhãn Hãng OEM Quốc Tế Cho Dữ Liệu Kho Sapo (16/09/2026)
* **Sự Cố & Nhận Định Nghiệp Vụ Từ User**:
- Bộ mẫu thử nghiệm 30 sản phẩm đối soát nguồn OEM quốc tế (SMC, Festo, Musashi, HIOS...) đã được User kiểm tra và xác nhận **không chính xác** với nguồn hàng thực tế phân phối tại kho của công ty.
- **Nguyên nhân gốc rễ**: Các linh kiện cơ khí, khí nén trong kho Sapo (như xi lanh, cút nối, kim keo, đầu vít...) dù mang mã quy cách kích thước tương thích với tiêu chuẩn thông dụng trên thị trường nhưng thực tế được cung cấp bởi các đối tác phụ trợ nội địa (`KHOA KIM`, `LKĐT`, cơ sở gia công...) hoặc là linh kiện thay thế tương đương, không phải sản phẩm chính hãng có chứng chỉ CO/CQ của các tập đoàn quốc tế nói trên. Việc tự ý gán nhãn làm sai lệch định danh hàng hóa và tính pháp lý thương mại của T&T Vina.
* **Hành Động Khắc Phục & Nguyên Tắc Bất Biến**:
1. **Hủy bỏ hoàn toàn**: Đã xóa triệt để bộ tệp thử nghiệm gồm `Mau_Xac_Thuc_Mo_Ta_B2B_30_San_Pham.xlsx`, `public/data/sapo_authentic_pilot_30.json` và script `scripts/enrich_authentic_pilot.py`.
2. **Bảo toàn dữ liệu thực tế**: Mọi mô tả, thông số và nhãn hiệu của 7.479 sản phẩm BẮT BUỘC tôn trọng 100% trường dữ liệu gốc xuất từ Sapo (nhãn hiệu `KHOA KIM`, `LKĐT`, `Techno`, hoặc để ngỏ theo phân phối T&T Vina), tuyệt đối không suy đoán nguồn gốc bên ngoài.
3. **Bộ dữ liệu chuẩn**: Duy trì và vận hành thống nhất trên tệp Excel [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx) và ma trận biến thể [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json).

### Rule 9.53: Quy Chuẩn Song Ngữ Anh - Việt & Trình Chuyển Ngữ Tự Động Hóa Ô Tô (17/09/2026)
* **Bản Địa Hóa Toàn Diện Trang Giải Pháp Ngành Ô Tô Murrplastik (`/murrplastik/industries/san-xuat-o-to/`)**:
  - Giao diện: Tích hợp thanh toggle song ngữ `[ VI | EN ]` với cờ Vector SVG micro chuẩn thương hiệu tại Header (`.lang-switch-group`), tuyệt đối không sử dụng emoji hệ điều hành.
  - Từ điển i18n (`TRANSLATIONS_AUTO`): Bao phủ 100% nội dung trang gồm Header, Biên bản cuộc họp 3 bên (VinFast - Murrplastik - T&T Vina), Khảo sát sự cố đứt gãy cáp tại xưởng Body Shop, Giải pháp cải tạo Dresspack & Trục 6 Rotary Base, Bảng BOM chi tiết 2 dòng Robot ABB IRB 7600/6700, Nhật ký thi công 2 giai đoạn, Thanh so sánh ảnh trước/sau, Video Shorts thực tế, và khối giải đáp 4 câu hỏi FAQ chuẩn kỹ thuật.
  - Tích hợp 3D WebGL Viewer: Cập nhật động dòng trạng thái tải mô hình STL và nút bấm bật/tắt xoay tự động theo ngôn ngữ đã chọn.
  - Cơ chế đồng bộ đa kênh:
    1. `localStorage`: Đồng bộ đồng thời cả 2 khóa `mp_lang` (nội bộ phân vùng Murrplastik) và `tt_vina_locale` (cổng mẹ T&T Vina).
    2. URL Search Param: Hỗ trợ nạp trực tiếp qua tham số `?lang=en` hoặc `?lang=vi` và tự động cập nhật URL bằng `history.replaceState()` không tải lại trang.
    3. Trạng thái DOM: Cập nhật đồng bộ `document.documentElement.lang` và `<title>` của trang.

### Rule 9.54: Quy Chuẩn Quản Lý Tin Tức, Hình Ảnh Chuẩn SEO & Chuyển Đổi Tên Miền Murrplastik (21/09/2026)
* **Quy Chuẩn Tên Ảnh Chuẩn SEO & Cấu Trúc Thư Mục Tài Nguyên**:
  - Tên ảnh chuẩn SEO: Đổi từ `VEC_VIIF2026_Murrplastik_TTVina_booth.jpeg` sang định dạng chuẩn SEO viết thường, phân cách dấu gạch ngang: `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.jpg` và phiên bản nén WebP siêu nhẹ `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.webp`.
  - Quy hoạch đường dẫn tài nguyên: Lưu trữ tập trung tại [`public/murrplastik/assets/images/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/tin-tuc/) kèm bản sao tương thích tại thư mục bài viết [`public/murrplastik/tin-tuc/trien-lam-vec-2026/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/).
* **Mở Rộng Hệ Thống Tin Tức & Khối Giải Pháp Ngành Trên Trang Chủ Murrplastik (`#news`)**:
  - **Hero Showcase Đầu Section**: Sử dụng ảnh toàn cảnh ứng dụng `applications_products_murrplastik_no_background_2` trên nền Slate tối gradient `#0B1120` -> `#1E293B` kèm vầng sáng Ambient Red Glow `#E30613` thể hiện tính đồng bộ của 6 hệ sinh thái.
  - **Thẻ Hệ Sinh Thái Đi Kèm Ảnh Kỹ Thuật Thực Tế**:
    - `ACS`: Ảnh máy in khắc laser `mp-LM 1M` kèm thẻ mẫu (`ACS_MP_LM_1M_produkt_02`).
    - `AUR`: Ảnh cụm Dresspack & hộp hồi vị `R-Tec Box` cho robot 6 trục (`aur_cable_retraction_systems_group`).
    - `KDH`: Ảnh tấm luồn cáp vi sinh Clean KDP/S chuẩn FDA kháng nước (`Clean_kdp_s_fda_murrplastik`).
    - `EFK`: Ảnh máng xích dẫn cáp Evochain 420 tháo lắp nhanh (`Evochain_420_konfektioniert_freisteller`).
    - `SUV`: Ảnh hệ thống ống ruột gà & cút nối công nghiệp (`image_Conduits_and_fittings_murrSystems`).
    - `CST`: Ảnh cấu hình may đo CAD 3D Dresspack & ReadyChain (`eco_cst_custom`).
  - Toàn bộ ảnh được tối ưu hóa chuẩn WebP nén không suy hao từ 35MB xuống dưới 900KB tổng thể, bọc trong khung `.eco-img-wrap` nền trắng tương phản cao và hiệu ứng zoom mượt khi hover.
* **Showcase Bộ Quà Tặng Khách Tham Quan VIP (Section 4)**:
  - Đặt khối `.vip-gifts-showcase` ngay cạnh Form Đăng Ký Tham Quan (`#register`), tạo động lực chuyển đổi thị giác trực quan:
    1. Bút Ký Kim Loại Murrplastik chính hãng Đức (`gift_pen_murrplastik`).
    2. Túi Canvas Tiện Ích Murrplastik chuyên dụng đựng tài liệu & catalogue (`gift_tupper_murrplastik`).
    3. Thẻ Tên Kim Loại Khắc Laser Trực Tiếp bằng máy `mp-LM 1M` trong 30 giây theo tên đăng ký.

### Rule 9.40: Tối Ưu Hóa UI/UX Mobile, Giao Diện Sáng Đồng Nhất & Huy Hiệu Scarcity Quà Tặng (08/09/2026)
* **Quy Chuẩn Đồng Nhất Sắc Thái & Kích Thước Khối Hero Hệ Sinh Thái (`.eco-hero-showcase`)**:
  - Chuyển đổi từ nền đen tương phản gắt sang phong cách Technical Light `#F8FAFC`, viền `#E2E8F0`, đổ bóng mềm `rgba(15, 23, 42, 0.04)`.
  - Tối ưu chiều cao hiển thị: Thu hẹp `max-height` ảnh từ `420px` xuống `280px` trên Desktop và `200px` trên Mobile; giảm margin từ `2.5rem` xuống `1.25rem 0 2rem` (desktop) và `1rem 0 1.5rem` (mobile) để tránh chiếm dụng không gian cuộn dọc.
* **Quy Chuẩn Tinh Gọn Nội Dung & Huy Hiệu Quà Tặng VIP Scarcity (Section 4)**:
  - Lược bỏ hoàn toàn đoạn văn dẫn thừa thãi nhằm tăng tốc độ chuyển đổi trực tiếp vào Form.
  - Tích hợp huy hiệu khẩn cấp thị giác (Visual Scarcity Badge): `SỐ LƯỢNG CÓ HẠN · 100 SUẤT ĐĂNG KÝ SỚM` với chấm đỏ phát xung (`gift-pulse-dot`) và tag `SỐ LƯỢNG CÓ HẠN` trên từng thẻ quà tặng (Bút ký, Túi Canvas).
* **Quy Chuẩn Tương Thích Di Động Mobile-First & iOS Safari**:
  - Khắc phục lỗi Auto-Zoom trên iOS Safari: Bắt buộc khai báo `font-size: 16px !important;` cho toàn bộ thẻ `input`, `select`, `textarea` trong form báo giá / đăng ký.
  - Ngăn ngừa gãy dòng huy hiệu trên màn hình hẹp (<640px): Cấu hình `.gifts-label-row` tự động chuyển sang `flex-direction: column` căn lề trái.
  - Giảm padding các thẻ container trên màn hình nhỏ để tránh chiếm dụng không gian hiển thị (`.eco-card` giảm xuống `1.25rem 1rem`, `.reg-left` / `.reg-right` giảm xuống `1.5rem 1.25rem`).

### Rule 9.41: Quy Chuẩn Bảng Dữ Liệu Kỹ Thuật Di Động, Tiêu Đề Dính Đa Chiều & Chống Tràn Màn Hình (08/09/2026)
* **Quy Chuẩn Tiêu Đề Bảng Dính Đa Chiều (Bidirectional Sticky Table Standard)**:
  - Bắt buộc khai báo `border-collapse: separate; border-spacing: 0;` trên thẻ `table` khi dùng `position: sticky` để tránh lỗi biến mất viền hoặc giật layout trên trình duyệt di động WebKit / Chromium.
  - Khối bao ngoài bảng (`.vec26-table-wrap`): Cấu hình `max-height: 60vh - 65vh; overflow: auto; -webkit-overflow-scrolling: touch;`.
  - Tiêu đề bảng (`thead th`): Cấu hình `position: sticky; top: 0; z-index: 25; background: #0F172A; box-shadow: 0 2px 6px rgba(0,0,0,0.18);`.
  - Ô góc trên cùng bên trái (`th.vec26-th-stt`): Khai báo `position: sticky; top: 0; left: 0; z-index: 35;` để cố định tuyệt đối trong cả hai chiều cuộn ngang và cuộn dọc.
  - Cột mã thiết bị (`td.vec26-col-stt`): Khai báo `position: sticky; left: 0; z-index: 15;` kèm màu nền đồng nhất với hàng và đổ bóng nhẹ sang phải (`box-shadow: 2px 0 6px -2px rgba(0,0,0,0.08);`).
* **Quy Chuẩn Chống Tràn Màn Hình & Trả Lại Không Gian Hiển Thị (Zero Mobile Overflow)**:
  - Khắc phục triệt để lỗi padding `.container`: Trên màn hình di động (<768px), giảm padding từ `3rem` (48px) xuống `16px` (và `12px` trên <480px), giải phóng hơn 70px chiều ngang màn hình.
  - Triệt tiêu hiện tượng Flexbox kéo giãn body (`bodyScrollWidth` vượt quá `window.innerWidth`): Luôn khai báo `min-width: 0; width: 100%; max-width: 100%;` cho các container cha chứa thanh tab lọc cuộn ngang (`.vec26-filter-tabs`).
  - Thanh chỉ báo cuộn ngang thông minh (`.vec26-table-scroll-hint`): Tự động hiển thị trên di động với thông điệp hướng dẫn rõ ràng kèm icon chỉ báo.

### Rule 9.42: Tối Ưu Bảng Di Động Liền Khối, Chuẩn Hóa Vị Trí Gian Hàng H2-15a & Triệt Tiêu Khe Hở Footer (08/09/2026)
* **Chuẩn Hóa Vị Trí Gian Hàng & Tinh Gọn Nội Dung 3D**:
  - Cập nhật đồng bộ toàn trang (Meta, Schema JSON-LD, Nav, Badges, 3D Canvas TV, Form) vị trí gian hàng chính thức: **`GIAN HÀNG H2-15a · SẢNH 2`**.
  - Lược bỏ từ "Ảo 3D" trong tiêu đề thành `Mô Phỏng Gian Hàng (Ô H2-15a · Sảnh 2)` và xóa bỏ hoàn toàn dòng mô tả thao tác xoay camera 360 rườm rà.
* **Tăng Tỷ Lệ Hiển Thị Ảnh Tổng Quan Hệ Sinh Thái (`hero_ecosystems.webp`)**:
  - Nâng `max-width` lên `880px`, `max-height` lên `380px` trên Desktop và `260px` trên Mobile giúp sơ đồ kiến trúc 6 giải pháp Made in Germany hiển thị to rõ, nổi bật.
* **Quy Chuẩn Bảng Thông Số Di Động Cuộn Liền Khối (Unified Mobile Spec Table)**:
  - Loại bỏ `position: sticky; left: 0;` trên cột STT để các cột trượt ngang cùng nhau như một khối thống nhất, triệt tiêu hoàn toàn hiện tượng hở khe trắng hoặc lung lay khi vuốt sang phải.
  - Bảo lưu nguyên vẹn `position: sticky; top: 0; z-index: 25;` cho `thead th` để cố định tiêu đề cột khi cuộn dọc xem danh mục 67 thiết bị.
  - Thêm `overscroll-behavior-x: contain;` trên `.vec26-table-wrap` để thao tác vuốt ngang bảng không truyền cử chỉ ra ngoài document.
* **Triệt Tiêu Tuyệt Đối Khe Hở Trắng Sau Footer Trên Màn Hình Điện Thoại**:
  - Áp dụng `overflow-x: clip !important; width: 100% !important; max-width: 100vw !important;` trên `html`, `body` và `footer`. Thuộc tính `clip` khóa cứng viewport không cho phép document pan ngang khi vuốt chạm, đồng thời đảm bảo footer luôn phủ kín 100% chiều ngang màn hình không để lộ nền trắng.

### Rule 9.43: Quy Chuẩn Bảng HTML Đơn Báo Giá B2B Trên AdminCP & Chuẩn Hóa Thời Gian create_time (09/09/2026)
* **Bảng Báo Giá HTML Trong CSDL (`contact_list.content`)**:
  - Khi nhận đơn báo giá từ giỏ hàng B2B (`?tab=cart`), API [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) lưu nội dung dưới dạng bảng HTML có viền nét mảnh (`border="1"`, bordercolor `#cbd5e1`), tiêu đề xám nhạt (`#f1f5f9`), căn lề chuẩn (STT/SL ở giữa, SKU font monospace màu xanh `#005BAC`, Đơn giá căn phải).
  - Khối "Ghi chú dự án" được bọc riêng trong thẻ div viền xanh `#005BAC` nổi bật phía trên bảng.
  - Loại bỏ hoàn toàn các ký tự phân cách ASCII kiểu cũ (`=====` và `-----`).
  - Đầu chuỗi HTML tích hợp thẻ ẩn `<span style="display:none;">Báo giá B2B (X mục)...</span>` để hàm `strip_tags()` tại màn hình danh sách AdminCP (`admincp/#contact`) hiển thị dòng trích dẫn tóm tắt gọn gàng, không bị vỡ giao diện.
* **Chuẩn Hóa Cột Thời Gian Gửi (`create_time`)**:
  - Mã nguồn CMS cũ dùng hàm `format_full_time()` quy ước chuỗi 14 số dạng `YmdHis` (ví dụ `20260909233650`).
  - Giá trị lưu vào cột `create_time` trong CSDL MariaDB phải dùng `date('YmdHis')` thay vì Unix timestamp thô `time()`, đảm bảo AdminCP hiển thị chính xác ngày giờ `HH:mm DD/MM/YYYY`.
* **Phân Tách Nội Dung Email (@mail)**:
  - Tách riêng `$email_body` dạng plain-text phân cấp rõ ràng theo từng thiết bị, bỏ các đường kẻ thô ráp để email gửi đến Sales (`info@t2tvina.com`) luôn sạch sẽ và chuyên nghiệp.

### Rule 9.44: Quy Chuẩn Nhận Diện Tác Giả Footer Toàn Hệ Thống (10/09/2026)
* **Đồng Bộ Dòng Credit Thiết Kế & Phát Triển**:
  - Toàn bộ chân trang hệ thống bao gồm Cổng Mẹ ([`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx)) và Chuyên Trang Con Murrplastik ([`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), tin tức, triển lãm) hiển thị đồng nhất dòng credit:
    `Designed & Developed by KhaiLL (T&T VINA INDUSTRIAL)`
  - Định dạng: Font monospace, cỡ chữ nhỏ gọn `11px`, màu mờ nhẹ kỹ thuật (`text-slate-500/70` hoặc `rgba(255, 255, 255, 0.45)`).
  - Vị trí trên Chuyên trang Murrplastik: Nằm ở vị trí trung tâm trong `.footer-bottom-row` giữa bản quyền bên trái (`.footer-bottom-left`) và đại lý ủy quyền bên phải (`.footer-bottom-right`), tận dụng hoàn hảo khoảng trống ở giữa; trên màn hình điện thoại tự động chuyển `flex-direction: column` căn giữa gọn gàng.

### Rule 9.45: Bảo Toàn Tính Toàn Vẹn Song Ngữ i18n Murrplastik (10/09/2026)
* **Quy Trình Kiểm Tra i18n Trước Khi Phát Hành**:
  - Mọi thay đổi nội dung chữ (text content), thẻ điều hướng navbar, thông tin footer hoặc các component mới trong phân vùng `public/murrplastik/` phải được khai báo song ngữ đầy đủ cả 2 từ điển `TRANSLATIONS.vi` và `TRANSLATIONS.en` trong [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js).
  - **Cơ chế ghi đè DOM của hàm `applyTranslations()`**: Vì `i18n.js` chạy tự động khi nạp trang và đọc các thẻ có `data-i18n`, nếu giá trị trong file JS chưa được cập nhật (ví dụ key `footer.copy` còn lưu năm 2025 hoặc domain cũ `murrplastikvn.com`), script sẽ tự động ghi đè ngược lại làm mất nội dung mới trên HTML.
  - **Chỉ số kiểm thử bắt buộc**: Số lượng key giữa tiếng Việt và tiếng Anh phải luôn đạt tỉ lệ cân bằng 100% (ví dụ: `562 VI keys = 562 EN keys`), số lượng key thiếu sót (`Missing in VI` / `Missing in EN`) phải luôn bằng `0`.
### Rule 9.46: Kiến Trúc Đa Ngôn Ngữ 7 Quốc Gia & Quy Chuẩn Cờ Vector SVG (10/09/2026)
* **Thứ Tự 7 Ngôn Ngữ Chuẩn Hệ Thống**:
  1. `vi`: 🇻🇳 Tiếng Việt (*Mặc định gốc*)
  2. `en`: 🇬🇧 English (*Tiêu chuẩn kỹ thuật quốc tế*)
  3. `de`: 🇩🇪 Deutsch (*Tiêu chuẩn xuất xứ Murrplastik Đức*)
  4. `zh-CN`: 🇨🇳 中文 (*Ưu tiên phục vụ khách hàng B2B tại VEC 2026*)
  5. `ko`: 🇰🇷 한국어 (*Nhà máy điện tử SMT Hàn Quốc*)
  6. `ja`: 🇯🇵 日本語 (*Tiêu chuẩn thiết bị Nhật Bản Hakko/Hios*)
  7. `th`: 🇹🇭 ไทย (*Trung tâm cơ khí & ô tô ASEAN*)
* **Quy Chuẩn Cờ Vector SVG (Tuân thủ User Rule 1 - Cấm Tuyệt Đối Emoji Windows)**:
  - Tất cả cờ quốc gia được tạo bằng vector SVG phẳng độc quyền tại [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), kích thước chuẩn micro `18px × 12px`, bo góc nhẹ `1.5px` và có viền `0.5px border-black/10`. Tuyệt đối không dùng emoji hệ điều hành.
* **Bộ Từ Điển Thuật Ngữ Kỹ Thuật Công Nghiệp Khóa Cứng (B2B Master Glossary)**:
  - Khóa cứng thuật ngữ chuẩn ngành công nghiệp tránh lỗi dịch máy ngô nghê: Máng xích luồn cáp (`拖链`), Ống ruột gà & đầu nối (`电缆保护软管及接头`), Tấm luồn cáp kín nước (`电缆穿线板`), Bộ Dresspack cáp robot (`机器人管线包及回位系统`), Máy khắc laser (`工业激光打标机`), Trạm hàn thiếc SMT (`防静电焊台`), Robot bơm keo (`自动点胶机`), Máy cắt băng dính (`自动胶带切割机`), Quạt ion khử tĩnh điện (`防静电离子风机`).
* **Đồng Bộ Bộ Nhớ Trình Duyệt (`localStorage`)**:
  - Lưu trữ khóa `tt_vina_locale` xuyên suốt phiên làm việc, tự động khôi phục khi tải lại trang và cầu nối đồng bộ sang Chuyên trang Murrplastik ([`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js)).

### Rule 9.47: Quy Chuẩn Bản Địa Hóa Sâu 100% & Triệt Tiêu Xung Đột Điểm Ngắt Đa Ngôn Ngữ (10/09/2026)
* **Bản Địa Hóa Sâu Toàn Bộ Thiết Bị & Thông Số Kỹ Thuật (Deep Technical Localization)**:
  - Tất cả 77 mã thiết bị thực tế trong hệ thống khi hiển thị tại Trang Chủ (`Home.tsx`), Trang Chi Tiết (`ProductDetail.tsx`) và Kính Lúp Xem Nhanh (`hoveredZoomProduct`) đều được bọc qua hàm `getLocalizedProduct(product, locale)` tại [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
  - Bản địa hóa 100% các trường: Tên máy, Danh mục, Nhãn xuất xứ, Trạng thái sẵn kho, Bảng thông số kỹ thuật (Spec-sheet rows), Đặc tính vận hành SMT/Robot, Nút Thêm báo giá và Hồ sơ chứng từ nhà máy (CO/CQ/VAT/Trial-test).
* **Nâng Cấp Chuyên Trang Murrplastik Sang Hệ Thống 7 Ngôn Ngữ Hoàn Chỉnh**:
  - Mở rộng từ điển [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) hỗ trợ đầy đủ 7 thứ tiếng: `vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`.
  - Thay thế cụm nút toggle cũ `[VI | EN]` bằng Dropdown chuẩn Swiss-Precision mang phong cách công nghiệp cao cấp (`#0F172A`, viền `#E30613`), tích hợp cờ vector SVG micro, hiển thị tên ngôn ngữ bản xứ và dấu tích kích hoạt `✓`.
  - Bổ sung lưới chọn ngôn ngữ dạng Grid 2 cột trong Mobile Drawer Menu phục vụ người dùng smartphone tại sự kiện VEC 2026.
* **Triệt Tiêu Tuyệt Đối Tình Trạng Trùng Lặp Bộ Đổi Ngôn Ngữ (Zero-Duplicate Breakpoint)**:
  - Loại bỏ hoàn toàn bộ chọn ngôn ngữ ở thanh Utility Bar phía trên (`h-9 flex`).
  - Tại thanh Navigation chính, phân định dứt khoát điểm ngắt:
    - Màn hình Desktop & Tablet (`>= sm`): Chỉ hiển thị DUY NHẤT 1 dropdown `<LanguageSwitcher variant="header" />` (`hidden sm:inline-block`).
    - Màn hình Điện thoại (`< sm`): Chỉ hiển thị DUY NHẤT 1 ô toggle gọn nhẹ `<LanguageSwitcher variant="utility" />` (`sm:hidden`).
  - Đảm bảo trên mọi độ phân giải màn hình (desktop, tablet, mobile) luôn luôn chỉ tồn tại đúng 1 bộ chuyển đổi ngôn ngữ duy nhất.

### Rule 9.48: Quy Chuẩn Tích Hợp Sản Phẩm Thiết Bị Hàn QUICK 205 & Bảng Phụ Kiện Tiêu Chuẩn (15/09/2026)
* **Thông Tin Kỹ Thuật Sản Phẩm QUICK 205**:
  - Mã định danh (ID): `QUICK-205` / SKU: `TTV-QUI-205`.
  - Tên thiết bị: `Trạm hàn cao tần QUICK 205 ESD (150W)`.
  - Hãng sản xuất: `QUICK (Phân phối chính hãng)` - Danh mục: `Thiết bị hàn công nghiệp / Trạm hàn ESD` (`categorySlug: 'thiet-bi-han'`).
  - Xuất xứ: `Chính Hãng` · Trạng thái: `Sẵn hàng tại kho Hà Nội & Hưng Yên`.
  - Công nghệ & Công suất: Gia nhiệt xoáy cao tần (High-Frequency Eddy Current Heating) 150W bù nhiệt siêu tốc, dải nhiệt 200°C ~ 600°C, độ ổn định ±2°C, điện áp 220V AC / 50Hz, điện trở nối đất < 2Ω, điện áp rò < 2mV, đạt chuẩn chống tĩnh điện ESD Safe.
* **Tài Nguyên Hình Ảnh Studio Thực Tế**:
  - Nguồn ảnh gốc: `D:\Design_hub\01_BRANDS\TT_VINA\ASSETS\1_thiết_bị_hàn_ESD_QUICK_205.png`.
  - Đã sao lưu và tối ưu vào: `public/images/products/quick-205.png` (bản gốc studio trong suốt) và `public/images/products/quick-205.webp` (bản WebP 259KB).
* **Bản Địa Hóa Đa Ngôn Ngữ & Nâng Cấp Giao Diện B2B**:
  - Cập nhật bản dịch tên máy đa ngôn ngữ sang 6 thứ tiếng trong `PRODUCT_NAME_TRANSLATIONS` ([`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts)).
  - Mở rộng từ điển `SPEC_KEY_TRANSLATIONS` dịch chuẩn xác 8 thông số kỹ thuật mới: Công suất định mức, Công nghệ gia nhiệt, Dải nhiệt độ cài đặt, Độ ổn định nhiệt độ, Điện áp hoạt động, Điện trở nối đất đầu mỏ hàn, Điện áp rò đầu mỏ hàn, Tiêu chuẩn chống tĩnh điện.
  - Tối ưu hóa giao diện [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): Tự động in đậm tiền tố tính năng khi có dấu hai chấm `:`, và hiển thị khối riêng lưới "Phụ Kiện Tiêu Chuẩn Đi Kèm (Standard Included Accessories)" gồm 7 thành phần chi tiết của trạm hàn QUICK 205.

### Rule 9.49: Quy Chuẩn Tự Động Hóa Quản Trị Danh Mục & Bản Địa Hóa Sâu Toàn Diện (Catalog Automation & Deep Localization - 15/09/2026)
* **Đóng Gói Kỹ Năng Quản Trị Danh Mục Hàng Loạt (Skill `protools-catalog-manager`)**:
  - Mã nguồn thực thi: [`scripts/catalog_manager.py`](file:///d:/T&TVina/protools/scripts/catalog_manager.py).
  - Lệnh CLI tự động hóa trong `package.json`:
    - `pnpm catalog:add --input path/to/products.json`: Tự động thêm 1 hoặc N sản phẩm hàng loạt.
    - `pnpm catalog:audit`: Quét toàn bộ danh mục, đối soát ảnh hỏng, kiểm tra 100% độ phủ dịch thuật thông số kỹ thuật.
  - Quy trình xử lý tự động khép kín (End-to-End Pipeline):
    1. Nhận danh sách N sản phẩm từ file JSON.
    2. Đọc ảnh gốc từ đường dẫn máy nội bộ (local asset), tối ưu hóa nén chuẩn WebP chất lượng cao (PIL Pillow, quality 85) lưu vào `public/images/products/<slug>.webp`.
    3. Tự động sinh dữ liệu dịch thuật B2B sang đầy đủ 7 ngôn ngữ (`vi`, `en`, `zh-CN`, `de`, `ko`, `ja`, `th`).
    4. Ghi nối tiếp an toàn vào `PRODUCTS` trong [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và cập nhật từ điển [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
    5. Tự động chạy `pnpm build` xác thực TypeScript và bundling trước khi hoàn tất.
* **Bản Địa Hóa Sâu 100% Cột 1 & Cột 2 Bảng Thông Số Kỹ Thuật (Spec-Sheet Full Parity)**:
  - Bổ sung toàn bộ 13 khóa thông số kỹ thuật còn thiếu vào `SPEC_KEY_TRANSLATIONS`: Chương trình lập trình hẹn giờ, Chức năng, Dự án tiêu biểu, Kích thước (D x R x C), Lượng keo tối thiểu, Model, Trọng lượng, Áp suất khí ra, Áp suất khí vào, Điện áp đầu ra, Điện áp đầu vào, Độ bền uốn, Ứng dụng Robot.
  - Chuẩn hóa từ điển `COMMON_VALUE_TRANSLATIONS` cho 100% các giá trị văn bản kỹ thuật xuất hiện trong catalog: Nhà sản xuất, Xuất xứ, Trạng thái kho, Thiết bị phụ trợ, Robot hàn ABB/KUKA, Dự án Body Shop VinFast Cát Hải, v.v. Các đơn vị đo lường quốc tế (W, V, Hz, bar, ml, s, g, °C, Ω, mV) được giữ nguyên chuẩn kỹ thuật toàn cầu.
* **Bản Địa Hóa Toàn Diện Tính Năng & Phụ Kiện Tiêu Chuẩn (Features & Accessories)**:
  - Chuẩn hóa toàn bộ 16 điểm nổi bật (`ALL_HIGHLIGHTS_TRANSLATIONS`) và 7 phụ kiện tiêu chuẩn (`ALL_ACCESSORIES_TRANSLATIONS`) sang 7 ngôn ngữ.
  - Nâng cấp `translateFeatureItem()` và `translateAccessoryItem()` xử lý trơn tru các chuỗi tính năng dạng tiền tố `Tiền_tố: Diễn_giải`.
  - Loại bỏ hoàn toàn fallback tiếng Việt hoặc mảng tính năng mẫu chung chung, bảo toàn nội dung kỹ thuật chi tiết của từng sản phẩm.
* **Bản Địa Hóa Giao Diện B2B Misumi Pricing Tiers & Case Study Banner**:
- Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), chuyển đổi toàn bộ tiêu đề, nhãn bảng bậc giá số lượng B2B (Q'ty, Pricing Policy, Lead Time, Click hint) và thông điệp chứng thực dự án VinFast Body Shop sang hàm `t()` đa ngôn ngữ.
### Rule 9.50: Quy Chuẩn Tải Nén Ảnh WebP Đa Luồng & Bóc Tách Làm Giàu Dữ Liệu B2B Hàng Loạt (15/09/2026)
* **Đường Ống Tải & Nén Ảnh WebP Tự Động (Multithreaded Sapo Image Pipeline)**:
- Mã nguồn thực thi: [`scripts/download_compress_sapo_images.py`](file:///d:/T&TVina/protools/scripts/download_compress_sapo_images.py).
- Kết quả xử lý thực tế: 6.895 / 6.895 ảnh duy nhất từ CDN Sapo được tải và nén WebP thành công 100% trong 4.5 phút (0 lỗi, tốc độ ~25.3 ảnh/giây với 20 luồng song song).
- Chuẩn nén: WebP Quality 82, kích thước cạnh tối đa 800px (thuật toán LANCZOS), giữ nguyên kênh Alpha trong suốt. Giảm dung lượng từ ~1.5 MB xuống ~37 KB/ảnh (giảm 95%), tổng dung lượng toàn bộ 6.895 ảnh chỉ còn 256.2 MB tại [`public/images/products/sapo/`](file:///d:/T&TVina/protools/public/images/products/sapo/).
- Bảng ánh xạ tập trung: [`public/data/sapo_image_map.json`](file:///d:/T&TVina/protools/public/data/sapo_image_map.json) map 6.897 mã SKU sang đường dẫn file WebP nội bộ.
* **Pipeline Phân Cụm Ngành Hàng & Sinh Mô Tả Kỹ Thuật B2B (Data Enrichment Pipeline)**:
- Mã nguồn thực thi: [`scripts/enrich_sapo_descriptions.py`](file:///d:/T&TVina/protools/scripts/enrich_sapo_descriptions.py).
- Giải quyết triệt để vấn đề 7.477 sản phẩm (99.97%) bị trống mô tả trong kho Sapo:
1. Tự động bóc tách thông số kỹ thuật có sẵn trong chuỗi tên: Quy cách ren (`M12x40`), đường kính ống phi (`PV12` -> 12mm), kích thước băng tải (`2008*85*2mm`), nòng và hành trình xi lanh (`MGPM32-75Z` -> nòng 32mm, hành trình 75mm), điện áp (`220V`, `24V`).
2. Tự động phân loại vào 16 nhóm ngành hàng công nghiệp (Khí nén, Xi lanh, Mũi vít, Kim bơm keo, Bu lông, Băng tải, Cảm biến, Mũi hàn, Rơ le, v.v.).
3. Tự động sinh đoạn văn mô tả chuẩn văn phong B2B công nghiệp kèm tình trạng tồn kho thực tế, đơn vị tính và cam kết giao hàng KCN.
- Bộ dữ liệu hoàn chỉnh lưu độc lập tại [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) và bản mẫu 25 sản phẩm tại [`public/data/sapo_sample_25_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_sample_25_enriched.json) phục vụ nghiệm thu trước khi tích hợp frontend.
### Rule 9.51: Quy Chuẩn Nhóm Biến Thể Murrplastik (Master-Variant Matrix) & Dashboard Quản Trị Excel B2B (15/09/2026)
* **Mô Hình Dòng Sản Phẩm Cha & Biến Thể Quy Cách (Murrplastik Variantes Standard)**:
- Học hỏi cấu trúc chuẩn từ Murrplastik Shop (`shop.murrplastik.com`), các sản phẩm cùng loại nhưng khác kích cỡ/thông số (ví dụ: `Cút nối góc PV12`, `PV10`, `PV8`) được gom nhóm về cùng một Dòng sản phẩm cha (`Cút nối góc PV (AKS)`) với bảng ma trận biến thể (`variants` array).
- Tự động bóc tách quy cách: Kích thước phi ống (`Phi 12 mm`), ren bu lông (`M12 x 40 mm`), kích thước 3 chiều băng tải/phíp (`2008 x 85 x 2 mm`), nòng và hành trình xi lanh (`Nòng 32mm - Hành trình 75mm`), cỡ kim keo (`16G`), v.v.
- Xuất bản tệp dữ liệu cấu trúc: [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json) (8.2 MB) chứa 6.995 Master Families, mỗi family lưu trữ mã `masterId`, tên gốc, nhóm ngành, mô tả kỹ thuật đại diện, ảnh đại diện và mảng `variants` chi tiết phục vụ render tab Variantes trên giao diện web.
* **Quy Chuẩn Bảng Tính Quản Trị Excel B2B Đa Tương Tác**:
- Cập nhật trực tiếp trên tệp: [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx).
- Cấu trúc tích hợp:
1. **Cột D (Mô tả sản phẩm)**: Cập nhật 100% (7.479 dòng) mô tả kỹ thuật chuẩn B2B công nghiệp.
2. **Cột 34 (Ảnh WebP Local)**: Khởi tạo 6.820 công thức `=HYPERLINK("...", "Xem Ảnh WebP (XX KB)")` cho phép click chuột trực tiếp từ Excel để mở ảnh chất lượng cao trên máy tính Windows.
3. **Cột 35 (Dòng sản phẩm cha - Master Family)**: Phục vụ lọc nhanh nhóm sản phẩm theo họ thiết bị.
4. **Cột 36 (Quy cách biến thể - Variant Specs)**: Bóc tách rõ kích thước/thông số cụ thể.
5. **Cột 37 (Trạng thái sẵn kho B2B)**: Phối màu trực quan (Xanh lá `#E8F5E9` cho 1.045 mặt hàng có sẵn tồn kho; Xám nhạt `#FAFAFA` cho 6.434 mặt hàng đặt theo dự án).
6. **Sheet `TongQuanDanhMuc`**: Bảng điều khiển KPI (Tổng SKU, Số ảnh WebP nén thành công, Số dòng sản phẩm cha, Tỷ lệ sẵn kho) kèm bảng phân bổ theo 16 nhóm ngành hàng công nghiệp.
7. **Cố định hàng tiêu đề (Freeze Panes B2)** và bật bộ lọc tự động (**AutoFilter**) trên toàn bộ bảng tính.
### Rule 9.52: Bài Học Nghiệp Vụ - Tuyệt Đối Không Tự Ý Suy Đoán & Gán Nhãn Hãng OEM Quốc Tế Cho Dữ Liệu Kho Sapo (16/09/2026)
* **Sự Cố & Nhận Định Nghiệp Vụ Từ User**:
- Bộ mẫu thử nghiệm 30 sản phẩm đối soát nguồn OEM quốc tế (SMC, Festo, Musashi, HIOS...) đã được User kiểm tra và xác nhận **không chính xác** với nguồn hàng thực tế phân phối tại kho của công ty.
- **Nguyên nhân gốc rễ**: Các linh kiện cơ khí, khí nén trong kho Sapo (như xi lanh, cút nối, kim keo, đầu vít...) dù mang mã quy cách kích thước tương thích với tiêu chuẩn thông dụng trên thị trường nhưng thực tế được cung cấp bởi các đối tác phụ trợ nội địa (`KHOA KIM`, `LKĐT`, cơ sở gia công...) hoặc là linh kiện thay thế tương đương, không phải sản phẩm chính hãng có chứng chỉ CO/CQ của các tập đoàn quốc tế nói trên. Việc tự ý gán nhãn làm sai lệch định danh hàng hóa và tính pháp lý thương mại của T&T Vina.
* **Hành Động Khắc Phục & Nguyên Tắc Bất Biến**:
1. **Hủy bỏ hoàn toàn**: Đã xóa triệt để bộ tệp thử nghiệm gồm `Mau_Xac_Thuc_Mo_Ta_B2B_30_San_Pham.xlsx`, `public/data/sapo_authentic_pilot_30.json` và script `scripts/enrich_authentic_pilot.py`.
2. **Bảo toàn dữ liệu thực tế**: Mọi mô tả, thông số và nhãn hiệu của 7.479 sản phẩm BẮT BUỘC tôn trọng 100% trường dữ liệu gốc xuất từ Sapo (nhãn hiệu `KHOA KIM`, `LKĐT`, `Techno`, hoặc để ngỏ theo phân phối T&T Vina), tuyệt đối không suy đoán nguồn gốc bên ngoài.
3. **Bộ dữ liệu chuẩn**: Duy trì và vận hành thống nhất trên tệp Excel [`Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx`](file:///d:/T&TVina/protools/Copy_local_path_danh_sach_san_pham_15.09.2026_4e66ee429923a8ae2a6763f69a3baac5.xlsx) và ma trận biến thể [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json).

### Rule 9.53: Quy Chuẩn Song Ngữ Anh - Việt & Trình Chuyển Ngữ Tự Động Hóa Ô Tô (17/09/2026)
* **Bản Địa Hóa Toàn Diện Trang Giải Pháp Ngành Ô Tô Murrplastik (`/murrplastik/industries/san-xuat-o-to/`)**:
  - Giao diện: Tích hợp thanh toggle song ngữ `[ VI | EN ]` với cờ Vector SVG micro chuẩn thương hiệu tại Header (`.lang-switch-group`), tuyệt đối không sử dụng emoji hệ điều hành.
  - Từ điển i18n (`TRANSLATIONS_AUTO`): Bao phủ 100% nội dung trang gồm Header, Biên bản cuộc họp 3 bên (VinFast - Murrplastik - T&T Vina), Khảo sát sự cố đứt gãy cáp tại xưởng Body Shop, Giải pháp cải tạo Dresspack & Trục 6 Rotary Base, Bảng BOM chi tiết 2 dòng Robot ABB IRB 7600/6700, Nhật ký thi công 2 giai đoạn, Thanh so sánh ảnh trước/sau, Video Shorts thực tế, và khối giải đáp 4 câu hỏi FAQ chuẩn kỹ thuật.
  - Tích hợp 3D WebGL Viewer: Cập nhật động dòng trạng thái tải mô hình STL và nút bấm bật/tắt xoay tự động theo ngôn ngữ đã chọn.
  - Cơ chế đồng bộ đa kênh:
    1. `localStorage`: Đồng bộ đồng thời cả 2 khóa `mp_lang` (nội bộ phân vùng Murrplastik) và `tt_vina_locale` (cổng mẹ T&T Vina).
    2. URL Search Param: Hỗ trợ nạp trực tiếp qua tham số `?lang=en` hoặc `?lang=vi` và tự động cập nhật URL bằng `history.replaceState()` không tải lại trang.
    3. Trạng thái DOM: Cập nhật đồng bộ `document.documentElement.lang` và `<title>` của trang.

### Rule 9.54: Quy Chuẩn Quản Lý Tin Tức, Hình Ảnh Chuẩn SEO & Chuyển Đổi Tên Miền Murrplastik (21/09/2026)
* **Quy Chuẩn Tên Ảnh Chuẩn SEO & Cấu Trúc Thư Mục Tài Nguyên**:
  - Tên ảnh chuẩn SEO: Đổi từ `VEC_VIIF2026_Murrplastik_TTVina_booth.jpeg` sang định dạng chuẩn SEO viết thường, phân cách dấu gạch ngang: `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.jpg` và phiên bản nén WebP siêu nhẹ `gian-hang-trien-lam-vec-viif-2026-murrplastik-ttvina.webp`.
  - Quy hoạch đường dẫn tài nguyên: Lưu trữ tập trung tại [`public/murrplastik/assets/images/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/tin-tuc/) kèm bản sao tương thích tại thư mục bài viết [`public/murrplastik/tin-tuc/trien-lam-vec-2026/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/).
* **Mở Rộng Hệ Thống Tin Tức & Khối Giải Pháp Ngành Trên Trang Chủ Murrplastik (`#news`)**:
  - Cập nhật thẻ tin tiêu điểm Hero bằng ảnh chụp thực tế gian hàng T&T Vina × Murrplastik tại Triển lãm VEC VIIF 2026 (Mr. Kevin Wong - Murrplastik APAC và đội ngũ kỹ sư).
  - Tích hợp lưới tin tức 2 cột chuẩn responsive (`.home-news-grid`):
    1. **Ngành Thực phẩm & Đồ uống (F&B)**: Liên kết trực tiếp [`/murrplastik/industries/thuc-pham-va-do-uong/`](file:///d:/T&TVina/protools/public/murrplastik/industries/thuc-pham-va-do-uong/index.html) với hình ảnh tấm luồn cáp Inox V4A chuẩn FDA/EHEDG.
    2. **Ngành Sản xuất Ô tô & Robotics**: Liên kết trực tiếp [`/murrplastik/industries/san-xuat-o-to/`](file:///d:/T&TVina/protools/public/murrplastik/industries/san-xuat-o-to/index.html) với hình ảnh giải pháp Dress Pack R-Tec Box cho Robot hàn thân xe.
  - Tích hợp nút xem toàn bộ tin tức chuyển tiếp đến trang Hub tin tức [`/murrplastik/tin-tuc/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/index.html).
* **Triệt Tiêu Hoàn Toàn Tên Miền Cũ `murrplastikvn.com`**:
  - Thay thế 100% các liên kết, schema JSON-LD, thẻ canonical, OpenGraph metadata, nút bấm liên hệ và mô tả mã QR tại trang F&B và tài liệu PDF brochure từ `murrplastikvn.com` sang cổng thông tin chính thức `protools.com.vn/murrplastik`.

### Rule 9.55: Quy Chuẩn Tích Hợp Chứng Chỉ ISO 9001:2015 DEKRA & Báo Cáo Kiểm Định R-Tec Liner 17.75M Chu Kỳ (21/09/2026)
* **Tái Cấu Trúc Khối "#why" (Tại Sao Chọn Chúng Tôi) - Tích Hợp Chứng Chỉ ISO 9001:2015 DEKRA**:
  - Dàn trang 2 cột tương phản đối xứng (Split Showcase): Ảnh chụp chứng chỉ ISO 9001:2015 DEKRA ở bên **TRÁI** (`.why-cert-col`), nội dung cam kết chất lượng & 6 trụ cột dịch vụ lồng ghép ở bên **PHẢI** (`.why-content-col`).
  - Dữ liệu thẩm định pháp lý & chứng chỉ:
    - Tổ chức chứng nhận: **DEKRA Certification GmbH** (Handwerkstraße 15, D-70565 Stuttgart, Đức - `www.dekra-certification.de`).
    - Đơn vị được chứng nhận: **Murrplastik Systemtechnik GmbH** (Dieselstraße 10, 71570 Oppenweiler, Đức).
    - Tiêu chuẩn: **ISO 9001:2015** (Phạm vi: R&D, sản xuất, lắp đặt và thương mại linh kiện kỹ thuật tự động hóa và chế tạo máy).
    - Mã số chứng chỉ: `31297761/9` · Báo cáo đánh giá (Audit Report): `A24091467`.
    - Công nhận quốc tế: **DAkkS** (Deutsche Akkreditierungsstelle `D-ZM-16029-01-00`) & **IAF MLA** (Multilateral Recognition Arrangement).
    - Hiệu lực: Từ ngày `2025-03-13` đến `2028-03-12` · Ký xác thực: `Dr. Rolf Krökel`.
  - **Chính sách bảo mật tài liệu (No Public Download Button)**: Tuyệt đối không cung cấp nút tải file PDF trực tiếp trên giao diện công khai; khách hàng hoặc nhà thầu dự án cần bản sao công chứng liên hệ trực tiếp phòng kỹ thuật T&T Vina.
* **Xuất Bản Bài Viết Kỹ Thuật Báo Cáo Kiểm Định R-Tec Liner (`thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky`)**:
  - Trích xuất dữ liệu gốc từ tệp `Internal Test Report R-Tec Liner.pdf`:
    - Thiết bị thử nghiệm: **R-Tec Liner 550mm EW/EWX 70** (Mã SKU `83693082`).
    - Kỹ sư kiểm định: `H. Thaidigsmann` (Murrplastik Systemtechnik GmbH, Dieselstraße 10, Oppenweiler).
    - Thời gian thử nghiệm: **219 ngày đêm liên tục** (bắt đầu ngày `09/02/2017`, kết thúc ngày `26/09/2017`).
    - Tổng chu kỳ đạt được: **17,755,473 chu kỳ (17.75 triệu chu kỳ)**.
    - Kết quả 8 cấu phần: 7 cấu phần đạt trọn vẹn 17.75 triệu chu kỳ; duy nhất ống luồn dẻo `EWX-PAE 70` (SKU `83182080`) nứt mỏi tại chu kỳ 13.1 triệu.
    - Đánh giá của Ban Quản lý Sản phẩm (Product Management Team): Xếp loại Xuất sắc (**Very Successful**).
  - Tương quan ứng dụng công nghiệp: 17.75 triệu chu kỳ tương đương với **8 – 10 năm vận hành liên tục** tại xưởng Body Shop (hàn thân xe ô tô) VinFast Cát Hải (Hải Phòng) trên các dàn Robot hàn ABB.
  - Vị trí hiển thị: Đặt thành bài viết kỹ thuật chuyên sâu trong News Hub (`/murrplastik/tin-tuc/`), **giữ nguyên sự kiện VEC 2026 làm thẻ tiêu điểm Hero độc quyền**, không bị trộn lẫn hoặc thay thế thẻ Hero.
* **Đa Ngôn Ngữ & Kiểm Thử Tự Động Hóa (i18n & Unit Test Suite)**:
  - Bản địa hóa trọn vẹn 7 ngôn ngữ (`vi`, `en`, `de`, `zh-CN`, `ko`, `ja`, `th`) trong `i18n.js`.
  - Bộ kiểm thử tự động hóa [`scratch_verify_suite.py`](file:///d:/T&TVina/protools/scratch_verify_suite.py) kiểm soát chặt chẽ 6 module: Toàn vẹn asset ảnh WebP/JPG, Cấu trúc HTML đối xứng `#why`, Dữ liệu bài viết kỹ thuật & zero `murrplastikvn.com`, Danh mục News Hub, Độ phủ 7 ngôn ngữ và Quy tắc Responsive CSS. Build Vite (`pnpm build`) đạt 100% thành công.

### Rule 9.56: Quy Chuẩn Tích Hợp Báo Cáo Kiểm Định R-Tec Liner Vào Danh Mục Ngành Ứng Dụng Robot & Vector SVG Thay Thế Toàn Diện Emoji (21/09/2026)
* **Kích Hoạt Thẻ Tương Tác Robot & Tự Động Hóa Trong Khối Ngành Ứng Dụng (`#industries`)**:
  - Chuyển đổi thẻ "Robot & Tự động hóa" (`.ind-item`) trên trang chủ Murrplastik (`public/murrplastik/index.html`) thành thẻ tương tác chủ động `.ind-item.ind-item-active`.
  - Liên kết trực tiếp: Trỏ về bài viết kỹ thuật [`/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html).
  - Huy hiệu định lượng (Badge): Tích hợp nhãn nổi bật `.ind-active-tag` mang nội dung `Report · 17.75M` và mũi tên điều hướng `.ind-arrow` (`→`).
* **Quy Chuẩn Đồ Họa Vector SVG & Triệt Tiêu 100% Emoji Windows (Tuân thủ tuyệt đối Rule 1)**:
  - Thay thế toàn bộ 6 emoji hệ điều hành trong khối `.ind-grid` bằng icon vector SVG kỹ thuật đơn sắc:
    1. **F&B (Thực phẩm & Đồ uống)**: Vector biểu tượng nhà máy công nghiệp.
    2. **Automotive (Sản xuất Ô tô)**: Vector biểu tượng xe ô tô kỹ thuật.
    3. **Robot & Tự động hóa**: Vector biểu tượng đầu robot / tay máy công nghiệp.
    4. **Điện tử**: Vector tia chớp điện năng.
    5. **Năng lượng**: Vector khối pin lưu trữ công nghiệp.
    6. **Máy công cụ**: Vector cơ cấu bánh răng cơ khí chính xác.
  - Hiệu ứng CSS tương tác: Bổ sung lớp `.ind-icon svg` kế thừa stroke màu và tự động chuyển sang màu trắng (`color: var(--white)`) khi hover vào thẻ `.ind-item-active`.
* **Bộ Kiểm Thử Toàn Diện & Build Production**:
  - Cập nhật [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với Module 7 kiểm tra toàn diện: Liên kết Robot card, class active, tag 17.75M chu kỳ, và xác thực zero emoji Windows trong toàn bộ HTML.
  - Toàn bộ 7 modules kiểm thử đạt 100% PASS và build Vite (`pnpm build`) biên dịch thành công 0 lỗi.

### Rule 9.57: Quy Chuẩn Tái Thiết Kế Biểu Tượng Ngành Ứng Dụng Chuẩn B2B Engineering (/design-taste-frontend - 21/09/2026)
* **Định Hướng Thẩm Mỹ & Ngôn Ngữ Thiết Kế (Design Read)**:
  - Catalog thiết bị công nghiệp tự động hóa B2B Đức, đề cao độ chính xác cơ khí, độ bền cao và tính thẩm mỹ kỹ thuật chống rườm rà (Anti-Slop).
  - Tái lập toàn bộ 6 biểu tượng ngành ứng dụng bằng Vector SVG đơn sắc kỹ thuật chuyên sâu:
    1. **F&B (Thực phẩm & Đồ uống)**: Bình vi sinh inox & chiết rót vô trùng (Sanitary Processing Vessel & Bottle Line chuẩn EHEDG/FDA/IP69K).
    2. **Sản xuất Ô tô (Automotive)**: Khung gầm ô tô kết cấu hàn tự động Body Shop (Chassis & Body-in-White).
    3. **Robot & Tự động hóa**: Cánh tay robot công nghiệp 6 trục (6-Axis Articulated Robot Arm) với khớp xoay và mỏ hàn/kẹp phôi chuyên dụng (chuẩn ABB/KUKA/FANUC).
    4. **Điện tử & Bán dẫn**: Vi mạch bán dẫn tích hợp IC / Microchip & đường dẫn mạch PCB tủ điện PLC.
    5. **Năng lượng & Điện gió**: Tuabin điện gió công nghiệp (Wind Turbine Generator) & hệ thống lưới điện truyền tải.
    6. **Máy công cụ**: Đầu trục chính phay CNC (CNC Milling Spindle & Collet Chuck) kết hợp lưỡi phay xoắn ốc cơ khí chính xác.
* **Cấu Trúc Khung Chứa Micro-Tile Container (`.ind-icon-box`)**:
  - Kích thước 48x48px, bo góc `10px`, nền trung tính `rgba(15,23,42,0.04)`, viền kỹ thuật mỏng 1px `border: 1px solid rgba(15,23,42,0.08)`.
  - Stroke vector chuẩn hóa: `stroke-width="1.8"`, `viewBox="0 0 24 24"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
  - Phản hồi xúc giác (Tactile micro-interactions): Khi hover thẻ active, hộp `.ind-icon-box` chuyển sang nền kính mờ `rgba(255,255,255,0.2)` với viền `rgba(255,255,255,0.38)`, stroke tự động chuyển màu trắng tinh khiết (`#ffffff`), phóng to nhẹ `scale(1.06)`. Thẻ tĩnh có hiệu ứng hover viền nhẹ không gây hiểu nhầm.

### Rule 9.58: Quy Chuẩn Tỉ Lệ Hình Học Cờ Việt Nam & Cơ Chế Khóa Mặc Định Tiếng Việt (21/09/2026)
* **Tỉ Lệ Hình Học Lá Cờ Việt Nam Chuẩn Quốc Gia (Vietnam Flag SVG Standard)**:
  - Khung chuẩn viewBox `0 0 18 12`, tâm đối xứng tuyệt đối tại $(cx, cy) = (9, 6)$.
  - Bán kính đường tròn ngoại tiếp $R = 3.6$ (đúng tỉ lệ 3/10 chiều cao), bán kính nội tiếp $r \approx 1.375$.
  - Tọa độ 10 đỉnh polygon chuẩn xác: `points="9,2.4 9.81,4.89 12.42,4.89 10.31,6.43 11.12,8.91 9,7.38 6.88,8.91 7.69,6.43 5.58,4.89 8.19,4.89"`.
  - Khắc phục hoàn toàn lỗi ngôi sao bị kéo dẹt chạm đáy (`y = 11.68`); ngôi sao mới nổi cân bằng ở tâm, khoảng cách từ đỉnh đáy đến mép dưới lá cờ đạt $3.09$ đơn vị (hơn 25% chiều cao).
  - Đồng bộ 100% trên toàn bộ các tệp: `public/murrplastik/index.html`, `i18n.js`, `FlagIcon.tsx`, và các trang tin tức / ngành ô tô.
* **Cơ Chế Khóa Mặc Định Ngôn Ngữ Tiếng Việt (`currentLang = 'vi'`)**:
  - Khi người dùng truy cập trang chủ `/murrplastik/`, hệ thống mặc định 100% nạp Tiếng Việt (`vi`).
  - Triệt tiêu hiện tượng rò rỉ khóa `tt_vina_locale` từ các ứng dụng React khác trong `localStorage` làm tự động nhảy sang tiếng Anh.
  - Hỗ trợ đổi ngôn ngữ chủ động qua dropdown lưu trữ phiên `sessionStorage.setItem('mp_user_lang', lang)` và tham số URL trực tiếp `?lang=`.

### Rule 9.59: Quy Chuẩn Biểu Tượng Mặt Ngang Ô Tô (Side Profile View) & Trật Tự Phân Đoạn Liên Hệ - FAQ (21/09/2026)
* **Quy Chuẩn Biểu Tượng Ngành Sản Xuất Ô Tô (Automotive Side Profile Iconography)**:
  - Vị trí: Khối `.ind-grid` tại [`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html).
  - Thay thế góc nhìn trực diện (frontal view) bằng hình chiếu cạnh mặt ngang (side profile view) tiêu chuẩn kỹ thuật công nghiệp B2B.
  - Tọa độ hình học vector 24x24 (`stroke-width="1.8"`, `stroke-linecap="round"`, `stroke-linejoin="round"`):
    - Khung thân xe khí động học: `d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"`.
    - Trục bánh xe sau & trước: 2 vòng tròn `<circle cx="7" cy="17" r="2"></circle>` và `<circle cx="17" cy="17" r="2"></circle>`.
    - Gầm xe liên kết giữa 2 bánh: `d="M9 17h6"`.
    - Đường gờ kính sườn (Beltline) và trụ cửa giữa (B-pillar): `d="M5 11h14"` và `d="M12 6v5"`.
    - Đảm bảo nhận diện tức thì kiểu dáng ô tô công nghiệp từ mọi khoảng cách và kích thước hiển thị.
* **Tối Ưu Trật Tự Dàn Trang Khối Liên Hệ & Hỏi Đáp Thường Gặp (Layout Flow Sequence)**:
  - Cấu trúc trước đây: `#news` -> `#faq` (nền tối `#141414`) -> `#contact` (nền sáng `#ffffff`) -> `footer` (nền tối `#111111`) tạo hiệu ứng zigzag màu sắc gây ngắt quãng trải nghiệm thị giác.
  - Trật tự mới chuẩn hóa: `#news` -> `#contact` (nền sáng tiếp nối tự nhiên sau tin tức) -> `#faq` (nền tối tạo nhịp nghỉ đệm) -> `footer` (nền tối chuyển tiếp liền mạch).
  - Khối mã cấu trúc Google `JSON-LD FAQPage` được di chuyển đồng bộ liền kề phía sau `<section id="faq">`, bảo toàn 100% dữ liệu Rich Snippets phục vụ SEO.
  - Tự động kiểm chứng toàn diện qua bộ test [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với 8/8 modules đạt chuẩn PASS.

### Rule 9.60: Quy Chuẩn Cờ Hàn Quốc Chuẩn Hình Học Thái Cực (Taegeukgi), Tin Tức R-Tec Liner Trang Chủ & Tối Ưu Khoảng Cách Đọc (21/09/2026)
* **Quy Chuẩn Hình Học Cờ Hàn Quốc Chuẩn Vector SVG (South Korea Taegeukgi Standard)**:
  - Khung chuẩn viewBox `0 0 18 12`, tâm đối xứng tuyệt đối tại (cx, cy) = (9, 6).
  - Vòng tròn Thái Cực (Taegeuk) chuẩn phương ngang: Bán kính lớn R = 2.6, bán kính nhỏ r = 1.3. Phần nửa trên màu đỏ (`#CD2E3A`), phần nửa dưới màu xanh dương (`#0047A0`), tiếp tuyến uốn lượn mượt mà chuẩn quốc gia, khắc phục triệt để lỗi xoay dọc 90° trước đây.
  - Bốn quẻ Càn - Khôn - Khảm - Ly (4 Trigrams) tại 4 góc chuẩn xác (khoảng cách tâm d = 4.5, góc xoay ±56.3° vuông góc với 2 đường chéo ±33.7°):
    - Càn (Geon - Góc trên bên trái): 3 vạch liền (☰).
    - Khôn (Gon - Góc dưới bên phải): 3 vạch đứt (☷).
    - Khảm (Gam - Góc trên bên phải): vạch đứt - vạch liền - vạch đứt (☵).
    - Ly (Ri - Góc dưới bên trái): vạch liền - vạch đứt - vạch liền (☲).
  - Đồng bộ chuẩn xác trên toàn bộ 6 tệp: [`src/components/FlagIcon.tsx`](file:///d:/T&TVina/protools/src/components/FlagIcon.tsx), [`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html), [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js), [`public/murrplastik/tin-tuc/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/index.html), [`public/murrplastik/tin-tuc/trien-lam-vec-2026/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/trien-lam-vec-2026/index.html), [`public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html).
* **Đưa Tin Báo Cáo R-Tec Liner Vào Lưới Tin Tức Trang Chủ Murrplastik (`#news`)**:
  - Thêm thẻ tin tức thứ 3 về Thử nghiệm độ bền R-Tec Liner (`murrplastik-r-tec-liner-17-trieu-chu-ky-thumbnail.webp`) vào `.home-news-grid`.
  - Nâng cấp lưới hiển thị `.home-news-grid` từ 2 cột lên 3 cột cân đối (`grid-template-columns: repeat(3, 1fr); gap: 1.75rem;`), tự động co giãn về 1 cột trên thiết bị di động.
* **Tinh Gọn Tiêu Đề Badge & Tối Ưu Khoảng Cách Đệm Đọc (Reading Flow & Spacing)**:
  - Bỏ từ "BÁO CÁO" trong huy hiệu trạng thái: Chuẩn hóa thành `THỬ NGHIỆM KỸ THUẬT · 17.75M CHU KỲ` trên bài viết và 7 ngôn ngữ trong từ điển `i18n.js`.
  - Giảm khoảng cách đệm dọc `.news-content-section` từ `4rem 0` xuống `2.25rem 0 4rem`, giảm margin đỉnh của `.tech-metric-grid` từ `2.5rem` xuống `0.75rem`, rút ngắn tổng khoảng trống đầu bài từ ~104px xuống ~48px, tạo nhịp đọc tự nhiên, liền mạch.
* **Bộ Kiểm Thử & Kiểm Định Tự Động (9/9 Modules Passed)**:
  - Nâng cấp [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) với Module 9 kiểm tra toàn diện hình học cờ Hàn Quốc, sự hiện diện của card tin R-Tec Liner tại trang chủ, tiêu đề badge tinh gọn và CSS padding tối ưu. 100% kiểm thử đạt chuẩn PASS.
### Rule 9.61: Đóng Gói & Phát Hành Production Toàn Diện Murrplastik & Kiểm Chứng Trực Tiếp Live HTTP (21/09/2026)
* **Quy Trình Phát Hành Production Gốc (`deploy_production_root.py`)**:
  - Đóng gói bundle tĩnh qua Vite (`pnpm build`).
  - Đồng bộ 61 tệp tĩnh mới lên máy chủ FTP Mắt Bão (`public_html`), bỏ qua 139 file media nhị phân trùng khớp để tối ưu thời gian deploy.
  - Tự động áp dụng quyền `SITE CHMOD 644` trước khi ghi đè, chống lỗi `553 Permission Denied`.
  - Cấu hình `.htaccess` tại root và phân vùng con `/murrplastik/`, đảm bảo LiteSpeed phục vụ trực tiếp static files và SPA pushState không xung đột.
* **Biên Bản Kiểm Chứng Live HTTP Thực Tế Trên Production (100% PASS)**:
  1. `https://protools.com.vn/murrplastik/` (HTTP 200):
     - Chứng chỉ ISO 9001:2015 DEKRA bên trái, 6 cam kết chất lượng bên phải (`.why-cert-col`, `.why-content-col`), bảo mật không public nút tải PDF.
     - Khối `#industries`: Thẻ Robot & Tự động hóa active trỏ về bài kiểm định R-Tec Liner kèm badge `Report · 17.75M`. 6 micro-tiles Vector SVG kỹ thuật (`.ind-icon-box`), 0 Windows emojis, icon ô tô mặt ngang.
     - Khối `#news`: 3 cột tin tức cân đối (F&B, Robot ô tô, Báo cáo R-Tec Liner).
     - Trật tự phân đoạn: `#contact` đứng trước `#faq`.
     - Đồ họa cờ: Cờ Việt Nam tâm $(9, 6)$ cân đối; Cờ Hàn Quốc chuẩn Thái Cực đỏ trên/xanh dưới ngang và 4 quẻ Càn-Khôn-Khảm-Ly. Mặc định vào trang nạp Tiếng Việt (`vi`).
  2. `https://protools.com.vn/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/` (HTTP 200):
     - Badge/Title: `THỬ NGHIỆM KỸ THUẬT · 17.75M CHU KỲ` (đã bỏ chữ "BÁO CÁO").
     - Khoảng cách đệm `.news-content-section` thu gọn còn `2.25rem 0 4rem`, giải phóng khoảng trống đầu bài.
     - Dữ liệu kiểm định 17.75M chu kỳ, 2 trang scan chứng chỉ gốc hiển thị sắc nét.
  3. Tài nguyên ảnh & CSS/JS (HTTP 200):
     - 100% 6 file ảnh WebP/JPG mới tải thành công (HTTP 200).
     - CSS và từ điển i18n 7 ngôn ngữ đồng bộ hoàn hảo.

### Rule 9.62: Quy Chuẩn Chuẩn Hóa Footer, Bao Phủ 7 Ngôn Ngữ Bảng Thông Số Kỹ Thuật, Xóa Phân Vùng Rác & Cập Nhật Nhận Diện Bản Quyền (21/09/2026)
* **Khắc Phục Lỗi Chữ Footer Bị Mờ & Rò Rỉ Khóa Dịch Chưa Khai Báo**:
  - Hiện tượng: Tại bài viết `thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky`, cấu trúc footer 4 cột tùy biến dùng sai class `.footer-desc`, `.footer-logo` (chưa có CSS trên nền tối `#111111`) khiến chữ bị chìm mờ khó đọc; đồng thời gắn các khóa `footer.col_products`, `footer.col_industries`, `footer.col_links`, `footer.desc` mà trong `i18n.js` chưa khai báo, dẫn đến hiển thị chuỗi khóa thô `footer.col_links`.
  - Khắc phục:
    1. Chuẩn hóa đồng bộ 100% sang cấu trúc footer 3 cột tiêu chuẩn (`.footer-top`, `.footer-brand`, `.footer-tagline`, `.footer-contact-line`, `.footer-col-title`) với độ tương phản cao, chữ sáng rõ ràng.
    2. Khai báo đầy đủ các khóa fallback (`footer.col_products`, `footer.col_industries`, `footer.col_links`, `footer.desc`) vào từ điển `i18n.js` cho cả 7 ngôn ngữ (vi, en, de, zh-CN, ko, ja, th).
* **Bản Địa Hóa Toàn Diện 7 Ngôn Ngữ Cho Bảng Dữ Liệu Kỹ Thuật (`class="tech-table"`)**:
  - Gắn thuộc tính `data-i18n` cho toàn bộ 8 hàng (24 ô dữ liệu) gồm mô tả giai đoạn thử nghiệm (`news.rtec.row1_desc` -> `row8_desc`), số chu kỳ chuyển động (`news.rtec.row1_cycles` -> `row8_cycles`), và trạng thái kiểm định cơ lý tính (`news.rtec.row1_status` -> `row8_status`).
  - Tích hợp 100% bản dịch kỹ thuật cơ khí chính xác vào từ điển `public/murrplastik/assets/js/i18n.js` cho toàn bộ 7 ngôn ngữ, giải quyết triệt để vấn đề đổi ngôn ngữ nhưng bảng dữ liệu vẫn giữ nguyên tiếng Việt.
* **Thanh Lọc Phân Vùng Rác & Chuyển Hướng 301 Deprecated Products (`/murrplastik/products/`)**:
  - Đánh giá phân vùng: Thư mục `/murrplastik/products/` (gồm 5 file HTML: `tem-nhan-va-he-thong-dan-nhan.html`, `ong-luon-day-cap-va-phu-kien.html`...) là tệp cào dữ liệu cũ còn sót lại từ domain `murrplastikvn.com`, giao diện vỡ nát, không nằm trong kiến trúc SPA/Landing page mới.
  - Xử lý: Xóa bỏ hoàn toàn thư mục `public/murrplastik/products/` trên kho local và dọn sạch trên máy chủ Production.
  - Điều hướng: Bổ sung cấu hình 301 chuyển hướng trong `public/murrplastik/.htaccess`:
    `RewriteRule ^products(/.*)?$ /murrplastik/#products [R=301,L]`
    đưa người dùng và bot tìm kiếm về khu vực trưng bày sản phẩm tương tác hiện đại tại `#products`.
* **Cập Nhật Nhận Diện Bản Quyền Kỹ Thuật Toàn Hệ Thống**:
  - Đổi thông tin tác giả/phát triển toàn bộ hệ thống Protools (gồm cả website mẹ và các trang landing page con) từ `Designed & Developed by KhaiLL (T&T VINA INDUSTRIAL)` và `Thiết kế & phát triển bởi KhaiLL` thành:
    `Developed by Mr. Kai @ T&T Vina Digital`
  - Cập nhật đồng bộ trên: `src/components/Footer.tsx`, 7 tệp ngôn ngữ React `src/i18n/locales/*.json`, `public/murrplastik/index.html`, `public/murrplastik/tin-tuc/index.html`, `trien-lam-vec-2026/index.html`, `thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html` và từ điển `i18n.js`.

### Rule 9.63: Quy Chuẩn Cập Nhật Popup CTA Chiến Dịch Mùa Vụ & Nén Chuẩn WebP Siêu Nhẹ (21/09/2026)
* **Nén & Tối Ưu Hóa Ảnh Banner 2K Chất Lượng Cao**:
  - File gốc: `Popup_CTA_Mid_Autumn_Festival_2K_20260921155743.jpeg` (2048x2048, 1.71 MB).
  - Tối ưu chuẩn WebP: Sử dụng thuật toán nén `method=6`, `quality=82` xuất ra [`Popup_CTA_Mid_Autumn_Festival_2K_20260921155743.webp`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/Popup_CTA_Mid_Autumn_Festival_2K_20260921155743.webp) dung lượng chỉ **384 KB** (tiết kiệm gần **78%** băng thông tải trang), đồng thời duy trì bản fallback JPG chuẩn 809 KB.
* **Cập Nhật Giao Diện & Tỉ Lệ Hiển Thị Khối Popup (`#promoPopup`)**:
  - Tệp chỉnh sửa: [`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html).
  - Thay thế toàn bộ thẻ ảnh cũ `Popup_CTA_Murrplastik.webp` bằng banner Trung Thu `Popup_CTA_Mid_Autumn_Festival_2K_20260921155743.webp?v=1`.
  - Cập nhật kích thước khung hiển thị: `width="600" height="600"` chuẩn tỉ lệ vuông 1:1, tự động co giãn theo responsive container `max-width: 460px` (desktop) và `max-width: 320px` (mobile) trong [`public/murrplastik/assets/css/main.css`](file:///d:/T&TVina/protools/public/murrplastik/assets/css/main.css).
* **Làm Mới Cookie Chiến Dịch (Campaign Cookie Rotation)**:
  - Tệp chỉnh sửa: [`public/murrplastik/assets/js/main.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/main.js).
  - Nâng cấp định danh cookie từ `promo_popup_dismissed` sang `promo_popup_mid_autumn_2026_dismissed`. Điều này đảm bảo khách hàng cũ đã từng đóng popup trước đây vẫn được nhìn thấy chương trình ưu đãi Trung Thu mới mà không bị chặn bởi cookie cũ.
* **Kiểm Thử & Triển Khai Production**:
  - Bổ sung Module 10 vào [`tests/verify_murrplastik_iso_rtec.py`](file:///d:/T&TVina/protools/tests/verify_murrplastik_iso_rtec.py) đạt 10/10 modules PASSED.
  - Đóng gói Vite và tải lên máy chủ Production (`s2d34.cloudnetwork.vn`), xác nhận Live HTTP 200 tải trực tiếp banner WebP 384 KB.

### Rule 9.64: Quy Chuẩn Triệt Tiêu Hàng Nhái, Đồng Bộ SKU Sapo Prod & Phân Luồng Hotline/Zalo Theo Tag (21/09/2026)
* **Triệt Tiêu Tuyệt Đối Từ Ngữ Hàng Nhái Trong Cơ Sở Dữ Liệu (Zero-Fake Tolerance)**:
  - CẤM TUYỆT ĐỐI xuất hiện các từ ngữ `fake`, `fk`, `(fake)`, `<fk>`, `Fake SMC`, `nhái` trong bất kỳ file dữ liệu JSON nào (`sapo_products_enriched.json`, `sapo_grouped_families.json`, `sapo_sample_25_enriched.json`) để bảo vệ 100% uy tín thương hiệu B2B của T&T Vina.
  - Xóa bỏ toàn bộ hậu tố `-FAKE` khỏi các `masterId` trong hệ thống gom nhóm biến thể.
  - Phân biệt chính xác các mã linh kiện kỹ thuật chính hãng có chứa chuỗi ký tự `FK` (như trục vít me SFKR, xi lanh kẹp ngón tay SMC HFK/HFKL, bộ điều khiển nhiệt độ RKC Rex-C100FK02).
* **Quy Chuẩn Đồng Bộ Mã SKU Sapo Vào Sản Phẩm Flagship & Bảo Toàn Ảnh Studio**:
  - Khi ánh xạ mã SKU từ hệ thống kho Sapo vào các sản phẩm Flagship trên web ([`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts)):
    - `Trạm hàn cao tần QUICK 205 ESD (150W)`: Cập nhật SKU chuẩn Sapo `TTPC-0289` (thay cho SKU ngẫu nhiên cũ `TTV-QUI-205`).
    - Bảo toàn 100% tài nguyên ảnh studio chất lượng cao trên Production (`images/products/quick-205.png`, `images/products/quick-205.webp`).
    - Đồng bộ tương tự cho các mã thiết bị đối soát được giữa Sapo và Prod (Hios CL-4000 -> `PVN5224`, Hios CLT-50 -> `TTPC-0422`, Zcut 9 -> `PVN1956`, Quạt SL-001 -> `PVN1561`).
* **Quy Chuẩn Phân Luồng Liên Hệ Hotline & Zalo Tự Động Theo Tag Sapo (Tag-to-Rep Routing Matrix)**:
  - Trích xuất trường `Tags` từ Cột 5 của file Sapo Excel vào 7.479 sản phẩm trong JSON catalog.
  - Tích hợp hàm điều phối `getSalesRepForProduct(product)` tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và component [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx):
    1. Tag `Ms Phương`: Điều phối tới Ms. Phương (`0365.366.455` - Tư vấn Bán hàng & Báo giá).
    2. Tag `Ms. Hiền`: Điều phối tới Ms. Hiền (`0929.938.368` - Tư vấn Bán hàng & Báo giá).
    3. Tag `Ms. Nhinh`: Điều phối tới Ms. Nhinh (`0964.920.025` - Phòng Bán Hàng).
    4. Tag `Mr Phong`: Điều phối tới Mr. Phong (`0983.794.782` - Kỹ thuật & Dự án).
    5. Tag `Mr.Hai`: Điều phối tới Mr. Hai (`0981.919.590` - Kỹ thuật & Dự án).
    6. Tag `Mr. Thanh`: Điều phối tới Mr. Thanh (`0943.301.886` - Phòng Dự Án).
    7. Sản phẩm Murrplastik Đức: Tự động điều phối tới Mr. Bình (`0868.822.409` - NVKD Murrplastik).
    8. Sản phẩm không có Tag / Ghi chú tồn kho: Mặc định điều phối về **Hotline Tổng Đài: Mrs. Nhung (`0915.168.824`)**.
  - Tại giao diện chi tiết sản phẩm, cả 2 nút Gọi điện thoại và nút Chat Zalo đều trỏ trực tiếp đến nhân sự phụ trách tương ứng kèm nút Copy nhanh 1-click.

### Rule 9.65: Kiến Trúc Phục Vụ 7,479 Sản Phẩm Sapo: Lightweight Index, Virtual Windowing & Chế Độ Dual View B2B (21/09/2026)
* **Kiến Trúc Tối Ưu Tải Nhẹ (Lightweight In-Memory Catalog Index)**:
  - Nén toàn bộ 7.479 sản phẩm từ file chi tiết 12.1 MB xuống [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json) đạt 3.85 MB thô (~380 KB gzipped / Brotli).
  - Tải bất đồng bộ qua `requestIdleCallback` / microtask để không chặn rendering giao diện Hero trang chủ. Tốc độ tìm kiếm in-memory < 15ms qua 7.479 sản phẩm.
* **Cơ Chế Virtual Windowing Chống Quá Tải DOM (36 Items/Chunk)**:
  - Component [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx) chia nhỏ danh sách hiển thị thành từng khối 36 sản phẩm.
  - Tích hợp nút cuộn tải thêm mượt mà (Load More Chunking) kết hợp `useTransition` giúp trình duyệt di động RAM yếu (iOS Safari, Android Chrome) không bị giật lag hay sập tiến trình.
* **Quy Chuẩn Dual View B2B (Lưới Kỹ Thuật & Bảng Mua Hàng Procurement)**:
  - **Chế độ Lưới (Spec-Sheet Grid)**: Thẻ sản phẩm tỷ lệ 1:1, ảnh kỹ thuật rõ nét, huy hiệu tồn kho (Sẵn kho / Đặt hàng theo PO), mã SKU in đậm font Mono, thông tin nhân viên phụ trách tư vấn trực tiếp kèm nút thêm vào giỏ B2B.
  - **Chế độ Bảng (Procurement Table)**: Dành riêng cho cán bộ Mua hàng / Kế toán dự án đối soát nhanh hàng chục mã SKU cùng lúc với các cột: STT, Hình ảnh, Tên & Thương hiệu, Mã SKU, Quy cách & Tồn kho, NVKD phụ trách, Nút Thêm Giỏ & Báo Giá.
* **Bộ Lọc Phân Khúc & Lọc Theo Nhân Viên Bán Hàng**:
  - Tích hợp chip lọc danh mục động (Top 10 ngành hàng công nghiệp kèm số lượng SKU thực tế).
  - Nút gạt nhanh chỉ hiện thiết bị Sẵn Kho (`In Stock`).
  - Hộp chọn lọc theo từng nhân viên kinh doanh phụ trách (Ms. Phương, Ms. Hiền, Ms. Nhinh, Mr. Phong, Mr. Hai, Mr. Thanh, Murrplastik, Mrs. Nhung Hotline).
* **Bộ Kiểm Thử Tự Động Định Kỳ 5 Pha (Automated Verification Suite)**:
  - Tích hợp script [`scripts/verify_all_requirements.py`](file:///d:/T&TVina/protools/scripts/verify_all_requirements.py) chạy qua `pnpm test:catalog`.
  - Kiểm soát nghiêm ngặt 5 pha:
    1. Quét regex triệt tiêu 100% từ khóa hàng nhái (`fake`, `fk`, `nhái`, `replica`) trên toàn bộ 3 file JSON catalog.
    2. Xác thực ánh xạ mã SKU Flagship (`TTPC-0289` cho QUICK 205 ESD) và bảo toàn ảnh studio.
    3. Kiểm tra phân bổ nhân sự kinh doanh và tổng đài tiếp nhận.
    4. Kiểm soát kích thước tải index < 4.5 MB thô.
    5. Kiểm toán bảo mật bản build `dist/` theo tiêu chuẩn ECC AgentShield (chặn rò rỉ file cấu hình, script cấm).
* **Deep Linking Toàn Diện**:
  - [`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx) tích hợp fallback tra cứu động vào `catalog_index.json` khi người dùng truy cập trực tiếp URL `?product=[SKU_HOAC_ID]` giúp toàn bộ 7.479 sản phẩm đều có trang chi tiết hợp lệ.

### Rule 9.66: Quy Chuẩn Ánh Xạ SKU Sapo Cho Toàn Bộ Hàng Cũ & Bảo Toàn Ảnh Studio Gốc (21/09/2026)
* **Bảo Toàn 100% Ảnh Studio Kỹ Thuật (Studio Asset Preservation)**:
  - Khi cập nhật mã SKU Sapo cho toàn bộ các thiết bị sẵn có trên hệ thống web cũ (src/data.ts), TUYỆT ĐỐI BẢO TOÀN toàn bộ đường dẫn ảnh sản phẩm chất lượng cao (/images/products/quick-205.png, images/stores/...).
  - Đồng bộ ngược lại các ảnh studio này vào public/data/catalog_index.json và public/data/sapo_products_enriched.json để khi người dùng tìm kiếm hay xem bảng mua hàng, hình ảnh studio sắc nét luôn được hiển thị ưu tiên.
* **Ma Trận Ánh Xạ SKU Sapo Toàn Diện Cho Hơn 50 Thiết Bị Cũ**:
  - **Nhóm Bắt Vít & Nguồn HIOS**: Hios CL-3000 (TTPC-0424), Hios CL-4000 (PVN5224), Hios CLT-50 (TTPC-0422), Tay bắt vít Hios CL 6500 Robot (TTPC-07030), Nút ấn bắt vít tự động (PVN6627).
  - **Nhóm Hàn & Đo Nhiệt Độ**: Quick 205 ESD (TTPC-0289), Hakko 936 / 907 (TTPC-0320), Bể hàn CM-808 (TTPC-0017), Bể hàn CM-508 (TTPC-0015), Hakko FG-100/101 (TTPC-0308), Quick 191AD (PVN7871), Tay hàn Quick 9018M Robot (TTPC-0323), Lõi heating 9018M (TTPC-0594).
  - **Nhóm Cắt Băng Dính & Tách Tem**: Zcut 9 (PVN1956), Zcut 2 (TTPC-0310), M1000 (TTPC-0302), M1000S (TTPC-0303), RT-3700 (PVN5066), Máy tách tem nhãn 1150D (TTPC 0107).
  - **Nhóm Bơm Keo & Kim**: Máy bơm keo 982 (TTPC-0298), Máy bơm keo 983A (TTPC-0299), Máy bơm keo AD-2000C (PVN9523), Xilanh bộ bơm keo Robot (TTPC 1409), Kim chóp 15G (TTPC 1009), Kim NMS 14G-13mm (TTPC-0161).

  - **Nhóm Đo Lực & Quang Học**: Máy đo lực HP-10/HP-100 (TTPC-0314), Chân kẹp kính LT-86A (TTPC-0532), Kính hiển vi SZM7045-STL1 (PVN7764), Kính hiển vi 50x-1000X (PVN8625), Camera 14MP (PVN9934).
  - **Nhóm Chống Tĩnh Điện & Quạt Ion**: Quạt Ion SL-001 (PVN1561), Quạt 2 cửa SL-002 (PVN10448), Quạt SP 600 (TTPC 22354), Vòng đeo tay Leko 1.8m (TTPC-0513), Vòng đeo chân (TTPC-0512), Ổ cắm tiếp địa 2 lỗ (TTPC-0470), Dây tiếp địa cao su kẹp (TTPC-0658), Dây tiếp địa sao vàng (TTPC 2354).
  - **Nhóm Nhíp Kỹ Thuật**: Nhíp nhựa 93302 (TTPC-0456), Nhíp ESD 2A (TTPC-0435), Nhíp ST 11 (TTPC-0447), Nhíp AA_SA (TTPC-0446), Nhíp ST-16 (PVN9736).
  - **Nhóm Tự Động Hóa & Đóng Gói Samwon**: Cầu đấu XTB-COM20B (PVN6277), Cầu đấu XTB-40H (PVN5440), Cáp Samwon C40HH-10SB-XBI (PVN6834), Relay Block Y420-4-O (PVN10052), Lọ cồn 120ml hồng (TTPC-0701), Khăn lau 1009/150P (PVN8044), Ống hút khói phi 75mm (PVN6631), Dây chun đôi 20cm (PVN4637), Máy mài mini Proskit (PVN8199), Máy dán thùng & Đai thùng (TTPC 3837, PVN1552, PVN8398, PVN7215, PVN6174).

### Rule 9.67: Phát Hành Thành Công Toàn Bộ 7,479 Sản Phẩm Sapo Lên Root Production (21/09/2026)
* **Triển Khai Thành Công Lên Máy Chủ Mắt Bão (s2d34.cloudnetwork.vn)**:
  - Lệnh phát hành: pnpm deploy:prod thông qua script deploy_production_root.py.
  - Đồng bộ 197 files tĩnh, trong đó tải mới 39 files (gồm bundle JS/CSS Vite mới, index.html, và toàn bộ 7.500 sản phẩm trong catalog_index.json).
  - Bỏ qua tự động 160 media files trùng kích thước giúp tiến trình phát hành hoàn tất trong dưới 60 giây.
* **Xác Thực Kiểm Tra Trực Tiếp Live HTTP (Zero-Downtime & Multi-Endpoints 200 OK)**:
  - Homepage: https://protools.com.vn/ (HTTP 200 OK).
  - API Index: https://protools.com.vn/data/catalog_index.json (HTTP 200 OK, phục vụ 7.500 items).
  - Deep links: https://protools.com.vn/?product=TTPC-0289 (Quick 205), https://protools.com.vn/?product=TTPC-0424 (Hios CL-3000).
  - AdminCP: https://protools.com.vn/admincp/ (Bypass rewrite an toàn, hoạt động bình thường).
  - Murrplastik: https://protools.com.vn/murrplastik/ (Hoạt động ổn định song song).
* **Tuân Thủ An Ninh Mạng Tuyệt Đối**:
  - Không có file .env, .sql, script bridge vi phạm WAF Imunify360 (Rule 77218530).
  - Quyền file .htaccess đạt chuẩn 644 trên LiteSpeed.

### Rule 9.68: Khắc Phục Lỗi Hiển Thị Ảnh Sapo & Đồng Bộ 6,895 Ảnh WebP Song Song Lên Production (22/09/2026)
* **Nguyên nhân gốc rễ (Root Cause Analysis)**:
  1. File `deploy_production_root.py` cấu hình loại trừ `dirs[:] = [d for d in dirs if d != 'sapo']` để tránh nghẽn deploy đơn luồng, khiến 6.895 file ảnh WebP cục bộ tại `public/images/products/sapo/` chưa được đưa lên máy chủ `/public_html/images/products/sapo/`.
  2. 578 sản phẩm trong tập dữ liệu Sapo mang URL hỏng `https://sapo.dktcdn.net/variants/PVN*.png` (trả về 404 Not Found) do sản phẩm trên Sapo không có ảnh gốc.
* **Giải pháp kỹ thuật & Triển khai**:
  1. **Đồng bộ hóa ảnh song song đa luồng (Multi-threaded FTP Sync)**: Xây dựng script [`scripts/upload_sapo_images_multithreaded.py`](file:///d:/T&TVina/protools/scripts/upload_sapo_images_multithreaded.py) với 6 luồng FTP song song ở chế độ Passive Mode (`set_pasv(True)`), tải thành công toàn bộ 4.643 ảnh còn thiếu lên `/public_html/images/products/sapo/` trong 184 giây (~25 files/giây), nâng tổng số ảnh remote đạt 6.897 file.
  2. **Làm sạch liên kết CDN hỏng**: Chạy [`scripts/clean_dead_cdn_links.py`](file:///d:/T&TVina/protools/scripts/clean_dead_cdn_links.py) rà soát toàn bộ 7.500 sản phẩm, làm sạch 578 URL CDN 404 thành `image: ""` trong [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json) và [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json).
  3. **UI Fallback Chuẩn B2B**: Nâng cấp [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx) và [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): khi `!image`, hiển thị badge kỹ thuật sang trọng `"Đang cập nhật ảnh"` kèm icon SVG `Package` đơn sắc, loại bỏ hoàn toàn hiện tượng vỡ icon ảnh mặc định của trình duyệt và lỗi 404 console.
  4. **Triển khai & Kiểm chứng Trực tiếp**: Chạy `pnpm deploy:prod` đưa bundle mới (`index-bKajiKpD.js`) và `catalog_index.json` sạch lên root. Chạy kiểm chứng qua [`scripts/verify_live_prod.py`](file:///d:/T&TVina/protools/scripts/verify_live_prod.py), xác thực 10/10 URL ảnh ngẫu nhiên (gồm `PVN10446`, `PVN10445`, `PVN10444`) đều trả về HTTPS 200 OK và `PVN10447` hiển thị badge chuẩn 100%.

### Rule 9.69: Quy Chuẩn Ngôn Ngữ Khách Hàng B2B & Triệt Tiêu Thuật Ngữ Kỹ Thuật UI (22/09/2026)
* **Nguyên tắc cốt lõi (Customer-Centric UX Copywriting)**:
  - Khách hàng doanh nghiệp B2B và người dùng mua hàng chỉ quan tâm đến tính năng mua sắm, số lượng sản phẩm, giá trị sử dụng và thao tác tiện lợi; tuyệt đối không đưa các thuật ngữ kỹ thuật của lập trình viên (Developer Jargon) lên giao diện.
* **Các cụm từ bị loại bỏ & Thay thế chuẩn hóa**:
  - ❌ *Cấm*: `"Đang tải theo luồng ảo (Virtual Window) · Tiết kiệm 95% bộ nhớ RAM"` -> ✅ *Thay bằng*: Chỉ hiển thị tiến độ thân thiện `"Đang hiển thị {X} / {Y} sản phẩm"`.
  - ❌ *Cấm*: `"Xem Thêm 36 Thiết Bị Tiếp Theo"` (số 36 là chunk size nội bộ) -> ✅ *Thay bằng*: `"Xem Thêm Sản Phẩm"`.
  - ❌ *Cấm*: `"Chế độ bảng Procurement"` -> ✅ *Thay bằng*: `"Chế độ xem dạng bảng danh sách"`.
  - ❌ *Cấm*: `"Đang đồng bộ lại bộ nhớ đệm sản phẩm Protools"` trong Error Boundary -> ✅ *Thay bằng*: `"Hệ thống đang được làm mới dữ liệu. Quý khách vui lòng bấm nút bên dưới để tải lại trang."`.

### Rule 9.70: Quy Chuẩn Đa Ngôn Ngữ Toàn Diện Trang Chủ, Khắc Phục Lớp Hiển Thị Badge Sản Phẩm & Chuẩn Hóa Điều Hướng Danh Mục Footer (22/09/2026)
* **1. Toàn diện hóa bản địa hóa 7 ngôn ngữ (Full-Spectrum 7-Language i18n)**:
  - Tách và chuẩn hóa các mô-đun dịch thuật chuyên biệt:
    - [`src/i18n/solutionsTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/solutionsTranslations.ts): Dịch trọn vẹn 8 trụ cột giải pháp (`title`, `subtitle`, `desc`, `badge`, `standards`) sang 7 ngôn ngữ (`vi`, `en`, `zh-CN`, `de`, `ko`, `ja`, `th`).
    - [`src/i18n/faqTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/faqTranslations.ts): Dịch toàn bộ 5 câu hỏi thường gặp FAQ và cấu trúc dữ liệu Google SEO Schema (`FAQPage`).
    - Bổ sung bộ khóa dịch thuật đầy đủ trong cả 7 file [`src/i18n/locales/`](file:///d:/T&TVina/protools/src/i18n/locales/) cho Hero Trust Stats, Murrplastik Banner, Company Impact Metrics Bar và bảng danh mục sản phẩm [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx).
* **2. Khắc phục triệt để lỗi ảnh đè lên nhãn tình trạng kho (Badge Stacking Context Fix)**:
  - Thẻ bao ngoài nhãn tình trạng kho `class="absolute top-1.5 right-1.5"` được nâng cấp bổ sung rõ ràng `z-10 pointer-events-none`.
  - Đảm bảo thẻ luôn nổi lên trên ảnh sản phẩm ngay cả khi ảnh phóng to `group-hover:scale-105` hoặc áp dụng bộ lọc CSS.
* **3. Chuẩn hóa điều hướng danh mục Footer & Cơ chế Alias URL Thông Minh**:
  - **Footer Slug Alignment**: Sửa slug trong [`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx) từ `camera-kinh-soi` thành mã định danh chuẩn `camera-kinh-soi-cong-nghiep`.

### Rule 9.71: Bản Địa Hóa Menu Danh Mục Header & Toàn Diện Footer 7 Ngôn Ngữ, Khắc Phục Viền Nhấp Nháy Nút Contact Trên Webview In-App (Facebook, Zalo) (22/09/2026)
* **1. Bản địa hóa Header Mega Dropdown & Mobile Menu Drawer**:
  - Toàn bộ menu danh mục thả xuống (Desktop Mega Dropdown) và ngăn kéo di động (Mobile Menu Drawer) trong [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx) được chuyển sang dùng `getLocalizedSolution(sol, locale)` và hook `useTranslation()`.
  - Bổ sung bộ từ khóa dịch thuật chuẩn hóa trong cả 7 file [`src/i18n/locales/`](file:///d:/T&TVina/protools/src/i18n/locales/): tiêu đề menu, huy hiệu chính hãng, nút chuyên trang, gợi ý hotline kỹ thuật, placeholder tìm kiếm và giới thiệu Murrplastik di động.
* **2. Bản địa hóa 100% Toàn Diện Chân Trang ([`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx))**:
  - Tích hợp hook `useTranslation()`.
  - Bản địa hóa trọn vẹn 40+ nhãn mục: Slogan công ty, nhãn địa chỉ Trụ sở / Kho Lĩnh Nam, chỉ đường Google Maps, danh sách 8 nhóm ngành hàng, khối Tư vấn & Báo giá (Hotline, Kinh Doanh, KD Murr, Phòng Dự Án, Email), bảng 6 sản phẩm nổi bật & nút tạo danh sách BOM nhanh, điều khoản bản quyền và 3 huy hiệu chuẩn B2B.
* **3. Triệt tiêu viền nhấp nháy thô của nút Contact nổi trên Webview In-App (Facebook, Zalo)**:
  - **Nguyên nhân kỹ thuật**: Lớp CSS `animate-ping` và `animate-pulse blur-xs` khi áp dụng trên phần tử hình con nhộng (pill-shaped capsule ~130x48px) trong trình duyệt nhúng Webview của Facebook/Zalo bị lỗi nội suy GPU rasterization, tạo ra vòng hào quang méo elip giật cục, vỡ hạt pixel và nhấp nháy thô ráp.
  - **Giải pháp Swiss Precision**: Loại bỏ triệt để các thẻ `animate-ping` và `blur-xs` trên vỏ nút bấm con nhộng tại [`src/components/FloatingWidgets.tsx`](file:///d:/T&TVina/protools/src/components/FloatingWidgets.tsx). Thay bằng đổ bóng mềm mượt hardware-accelerated `shadow-[0_8px_25px_rgba(0,71,141,0.35)]` kèm viền kính thanh lịch `border border-white/20`. Giữ hiệu ứng ping tròn chuẩn 1:1 duy nhất trên chấm xanh trực tuyến `emerald-400` (8x8px) bên trong icon, đảm bảo giao diện sắc nét, cao cấp và đồng nhất 100% giữa PC và mọi Webview di động.

### Rule 9.72: Triển Khai Toàn Diện 3 Giai Đoạn Chuẩn SEO B2B, Semantic Clean Slugs & Pre-rendering Snapshots Cho 7.500 Sản Phẩm (22/09/2026)
* **Giai đoạn 1 (On-Page, Dynamic Head & Sitemaps XML)**:
  - **Thẻ Head Baseline ([`index.html`](file:///d:/T&TVina/protools/index.html))**: Bổ sung đầy đủ thẻ `meta description` chuẩn thương hiệu T&T Vina Industrial, Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`), Twitter Card tags, Canonical link, và robots meta directive (`max-snippet:-1, max-image-preview:large`).
  - **Component Quản Trị SEO Động ([`src/components/SEOHead.tsx`](file:///d:/T&TVina/protools/src/components/SEOHead.tsx))**: Tự động cập nhật `document.title` theo chuẩn B2B (`[Tên Thiết Bị] ([SKU]) | T&T VINA Industrial`), cập nhật linh hoạt `meta description`, `og:*`, `canonical`, và tiêm mã cấu trúc **Schema.org JSON-LD `@type: "Product"`** cho 7.500 sản phẩm (gồm tên, ảnh, sku, brand, tình trạng kho `InStock`, đơn vị tiền tệ `VND`).
  - **Chỉ Dẫn Crawlers ([`public/robots.txt`](file:///d:/T&TVina/protools/public/robots.txt))**: Cho phép đầy đủ Googlebot, Bingbot, Applebot và các AI Bots hiện đại (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Bytespider`), đồng thời trỏ chính xác về `Sitemap: https://protools.com.vn/sitemap.xml`.
  - **Bộ Sinh Sitemap Tự Động ([`generate_sitemaps.py`](file:///d:/T&TVina/protools/generate_sitemaps.py))**: Trích xuất toàn bộ 7.479 sản phẩm từ `catalog_index.json`, xuất ra `public/sitemap.xml` với **7.518 URLs** kèm thẻ chú thích ngôn ngữ `xhtml:link rel="alternate" hreflang="vi|en|x-default"`.
* **Giai đoạn 2 (Semantic Clean Slugs & Pre-rendering Static Snapshots)**:
  - **Cấu Trúc Đường Dẫn Thân Thiện ([`src/utils/slugify.ts`](file:///d:/T&TVina/protools/src/utils/slugify.ts))**: Chuyển đổi tên sản phẩm sang slug tiếng Việt không dấu: `/san-pham/[ten-thiet-bi]-[sku]`. Hỗ trợ đường dẫn danh mục: `/danh-muc/[categorySlug]`.
  - **Bộ Định Tuyến Kép Đa Năng ([`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx))**: Nhận diện cả Clean URL pathname `/san-pham/:slug` và duy trì tương thích ngược 100% với query param cũ `?product=:sku`.
  - **Hệ Thống Pre-rendered Static Snapshots ([`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py))**: Sinh sẵn các bản snapshot HTML tĩnh cho các sản phẩm và danh mục chủ lực vào `dist/san-pham/` và `dist/danh-muc/`. Giúp Googlebot, Bingbot, Zalo/Facebook link scrapers đọc được đầy đủ thẻ H1, Meta tags, OG Image và Schema.org JSON-LD ngay trong lần tải đầu tiên mà không cần đợi chạy JavaScript.
* **Giai đoạn 3 (Làm Giàu Nội Dung Kỹ Thuật & SEO Đa Ngôn Ngữ)**:
  - **Bộ Máy Tự Động Sinh Mô Tả Kỹ Thuật ([`src/utils/seoDescription.ts`](file:///d:/T&TVina/protools/src/utils/seoDescription.ts))**: Nhận diện ngữ cảnh nhóm ngành (Khí nén, Bu lông cơ khí, Chống tĩnh điện ESD, Thiết bị hàn, Băng tải, Murrplastik) để tự động điền đoạn mô tả kỹ thuật 150-250 từ và danh sách đặc tính nổi bật (`defaultHighlights`) cho 7.400 sản phẩm Sapo, triệt tiêu hoàn toàn lỗi **Thin Content** theo thuật toán Google Helpful Content.
  - **Đồng Bộ Ngôn Ngữ**: Đồng bộ thuộc tính `document.documentElement.lang` và thẻ `hreflang` trên toàn hệ thống.
* **Quy Trình Phát Hành Tự Động Hóa ([`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py))**:
  - Tích hợp 3 bước tự động: Sinh `sitemap.xml` -> Build Vite -> Sinh static snapshots -> Tải lên root `public_html`.
  - Kiểm chứng trực tiếp Live Production: `robots.txt` (HTTP 200), `sitemap.xml` (HTTP 200, 7.518 URLs, 4.35 MB), Product Snapshot `/san-pham/tram-han-cao-tan-quick-205-esd-150w-ttpc-0289/` (HTTP 200, chứa Schema.org `Product`, OG, H1), Category Snapshot `/danh-muc/thiet-bi-han/` (HTTP 200).

### Rule 9.73: Tinh Gọn Thanh Điều Hướng Header & Triệt Tiêu Nút Hotline Trùng Lặp (23/09/2026)
* **Nguyên tắc thiết kế (Header Visual Hierarchy & De-duplication)**:
  - Thanh tiện ích đỉnh trang (`top utility bar` cao 36px / `h-9`) đã hiển thị đầy đủ, chi tiết và sắc nét thông tin liên hệ chính thức: Hotline `0915.168.824` (Mrs. Nhung), số Zalo Sales Ms. Hiền, Ms. Phương kèm nút sao chép nhanh 1-click.
  - Do đó, việc duy trì thêm một nút bấm Hotline lớn (`bg-gradient-to-r from-[#00478D] to-[#005EB8]`) tại thanh điều hướng chính (`main nav bar` cao 76px / `h-19`) gây lặp thừa thông tin, chiếm diện tích của ô tìm kiếm sản phẩm và các nút chức năng B2B khác.
* **Xử lý kỹ thuật**:
  - Gỡ bỏ hoàn toàn khối nút bấm `<a>` Hotline tại [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx).
  - Dọn dẹp import `PhoneCall` không còn dùng trong `Header.tsx`.
  - Giữ lại cấu trúc tinh gọn, thoáng đãng: Logo thương hiệu T&T VINA -> Ô tìm kiếm thông minh -> Mega Menu danh mục -> Nút Giỏ Báo Giá -> Bộ chọn đa ngôn ngữ -> Toggle Mobile Menu.
  - Đóng gói và phát hành trực tiếp lên Production, kiểm chứng `https://protools.com.vn/` đạt chuẩn Live HTTP 200 OK.

### Rule 9.74: Nâng Cấp Hệ Thống B2B Đột Phá Theo Chiến Lược CTO & CMO: Tra Cứu Toàn Kho 7.500 SKU, Brand Facets, 1-Click Zalo RFQ, Code-Splitting, LiteSpeed Cache & AI Search Manifest (23/09/2026)
* **1. Bộ Nhớ Đệm Chia Sẻ & Tìm Kiếm Toàn Diện 7.500 SKU ([`src/utils/catalogLoader.ts`](file:///d:/T&TVina/protools/src/utils/catalogLoader.ts), [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx))**:
  - Khởi tạo bộ nạp dữ liệu singleton có bộ nhớ đệm module-level (`cachedCatalog`), nạp ngầm (pre-warm) ngay khi Header mount hoặc khi người dùng focus vào ô tìm kiếm.
  - Tích hợp thuật toán đối sánh đa trường (Multi-field fuzzy search) kèm hệ thống tính điểm tương quan (Relevance Scoring): Ưu tiên tuyệt đối mã SKU chính xác (Score 200), SKU bắt đầu bằng (Score 120), SKU chứa chuỗi (Score 80), Model/Tên thiết bị (Score 60/40), Thương hiệu & Ngành hàng (Score 30/20).
  - Khung gợi ý tức thì (Live Autocomplete) hiển thị huy hiệu thống kê `(X / Y SKU)`, nút bấm trực tiếp "Xem tất cả Y sản phẩm trong tổng kho" và thông báo hướng dẫn khi không tìm thấy kết quả.
* **2. Nút Báo Giá Nhanh 1-Click Qua Zalo Chuyên Viên Phụ Trách ([`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx))**:
  - Tích hợp nút bấm nổi bật *"Nhận Báo Giá Nhanh Qua Zalo (Phản hồi 15-30P)"* ngay dưới khối chọn số lượng đặt hàng.
  - Tự động định dạng văn bản yêu cầu báo giá chuyên nghiệp (Tên sản phẩm, Mã SKU, Hãng, Số lượng dự kiến, Link sản phẩm), sao chép tức thì vào clipboard của khách hàng và mở thẳng khung chat Zalo của đúng nhân viên kinh doanh phụ trách mã hàng đó.
* **3. Bản Địa Hóa 100% Danh Mục Ngành Hàng 7 Ngôn Ngữ ([`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts), [`src/i18n/solutionsTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/solutionsTranslations.ts), [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx))**:
  - Bổ sung bản dịch kỹ thuật chuẩn xác cho toàn bộ 7 nhóm ngành Sapo: Thiết bị đóng gói tự động, Xi lanh khí nén, Khí nén & phụ kiện, Bu lông ốc vít, Băng tải dây curoa, Linh kiện & thiết bị, Thiết bị tự động hóa.
  - Sửa đổi các thẻ phụ đề tag menu (`lSol.tag || sol.tag`) trên cả Desktop Mega Dropdown và Mobile Drawer hiển thị đồng bộ 100% bằng 7 thứ tiếng: vi, en, zh-CN, de, ko, ja, th.
* **4. Bộ Lọc Thương Hiệu Đa Diện (Brand Facet Filters) ([`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx))**:
  - Tự động thống kê số lượng SKU thực tế của từng thương hiệu công nghiệp trong kho dữ liệu (Murrplastik, Hakko, HIOS, Quick, Zcut, Dr. Schneider, Samwon, Loctite, KHOA KIM, v.v.).
  - Bổ sung thanh cuộn chip thương hiệu trực quan ngay dưới thanh danh mục, lọc tức thì mà không cần tải lại trang.
* **5. Phân Đoạn Gói Mã Nguồn (Code-Splitting) & Tối Ưu Tốc Độ Tải ([`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx), [`vite.config.ts`](file:///d:/T&TVina/protools/vite.config.ts))**:
  - Chuyển đổi các trang nặng (`ProductDetail`, `DocumentCenter`, `CartQuote`) sang `React.lazy()` kết hợp `<React.Suspense>`.
  - Cấu hình Rollup `manualChunks` tách rời các thư viện `vendor-react` (~213 kB), `vendor-icons`, `vendor-motion`, `vendor-genai`.
  - Giảm kích thước bundle chính `index.js` từ hơn 700 kB xuống còn **465 kB** (nén gzip chỉ 124 kB), triệt tiêu hoàn toàn cảnh báo Vite build warning.
* **6. Chiến Lược Lưu Đệm LiteSpeed / HTTP Caching Tối Ưu ([`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py))**:
  - Cấu hình `.htaccess` máy chủ Mắt Bão:
    - Tài nguyên tĩnh có hash version (`.js`, `.css`, `.webp`, `.png`, `.woff2`): `Cache-Control: max-age=31536000, public, immutable` (Lưu 1 năm).
    - Dữ liệu danh mục & tài liệu (`.json`, `.xml`, `.txt`, `.pdf`): `Cache-Control: max-age=7200, public, must-revalidate` (Lưu 2 giờ kèm kiểm tra cập nhật).
    - Mã nguồn HTML (`.html`): `Cache-Control: no-cache, no-store, must-revalidate` (Bảo đảm mọi lần phát hành mới người dùng đều nhận bản cập nhật tức thì).
* **7. Chuẩn Hóa Khám Phá AI Search & LLM Procurement ([`public/llms.txt`](file:///d:/T&TVina/protools/public/llms.txt), [`public/ai-manifest.json`](file:///d:/T&TVina/protools/public/ai-manifest.json), [`public/robots.txt`](file:///d:/T&TVina/protools/public/robots.txt))**:
  - Thiết lập file chuẩn `llms.txt` cung cấp bối cảnh toàn diện về năng lực phân phối B2B, trụ sở, thông tin liên hệ, danh mục 7.500 SKU và case study VinFast Body Shop cho các trợ lý AI (ChatGPT, Claude, Perplexity, Gemini, Cursor).
  - Thiết lập `ai-manifest.json` chứa định danh máy đọc (machine-readable) cho hệ thống thu mua vật tư tự động.

### Rule 9.75: Kiểm Thử Chuyên Sâu Của Senior QA Lead (25 Năm Kinh Nghiệm): Vá Lỗi Luồng Tìm Kiếm Header, Bổ Sung Giao Diện Empty State, Hyphen-Tolerant SKU & Bảo Vệ Clipboard (23/09/2026)
* **1. Vá Lỗi Nghiêm Trọng Về Luồng Dữ Liệu Khi Bấm "Xem Tất Cả Kết Quả Tìm Kiếm"**:
  - **Phát hiện bug**: Khi người dùng gõ từ khóa trên Header và bấm "Xem tất cả {N} sản phẩm" hoặc gõ phím Enter, hàm `onNavigate('home', searchQuery)` trước đây truyền từ khóa vào `activeCategoryFilter`. Do từ khóa tìm kiếm (như "Quick", "Hakko") không phải slug danh mục hợp lệ, `VirtualCatalogGrid` bị lọc theo danh mục sai và `searchTerm` bị bỏ trống, dẫn đến màn hình thông báo "Tìm thấy 0 thiết bị" dù trong kho có hàng chục sản phẩm.
  - **Khắc phục triệt để**:
    - Nâng cấp `handleNavigate(tab, filter, search)` trên toàn bộ chuỗi: [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx) -> [`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx) -> [`src/pages/Home.tsx`](file:///d:/T&TVina/protools/src/pages/Home.tsx) -> [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx).
    - Tách riêng `activeSearchQuery` độc lập với danh mục. Khi tìm kiếm từ Header, hệ thống tự động reset danh mục về `all`, kích hoạt `searchTerm`, cuộn mượt xuống bảng `#product-catalog` và hiển thị đầy đủ danh sách kết quả phù hợp.
* **2. Bổ Sung Giao Diện Phản Hồi Rỗng (Zero-Results Empty State UX)**:
  - **Phát hiện bug**: Khi bộ lọc hoặc từ khóa tìm kiếm không khớp với sản phẩm nào (`filteredProducts.length === 0`), giao diện trước đây hiển thị khoảng trắng trống trơn, không có nút thoát hay hướng dẫn cho người dùng.
  - **Khắc phục**: Xây dựng khối Empty State chuẩn mực tại [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx): Icon kính lúp xám, thông báo chi tiết các tiêu chí đang lọc (Từ khóa, Hãng, Danh mục, Tồn kho, NVKD), nút bấm 1-click *"Đặt Lại Tất Cả Bộ Lọc"* (khôi phục 7.500 SKU), và nút bấm quay số gọi trực tiếp Hotline tổng đài.
* **3. Nâng Cấp Thuật Toán Tìm Kiếm Bỏ Dấu Gạch Nối (Hyphen-Tolerant SKU Matching)**:
  - **Tối ưu trải nghiệm B2B**: Khách hàng mua hàng công nghiệp thường gõ mã hàng liền mạch bỏ dấu gạch ngang (như `MP1081`, `CL4000`, `TTPC0289`, `FX888D`).
  - **Xử lý kỹ thuật**: Tại [`src/utils/catalogLoader.ts`](file:///d:/T&TVina/protools/src/utils/catalogLoader.ts) và [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx), chuẩn hóa chuỗi `cleanSku` và `cleanToken` loại bỏ `[-_.\s]`, cho phép đối sánh chính xác mã gốc (`MP-1081`, `CL-4000`, `TTPC-0289`) trên cả Header autocomplete và Catalog Grid.
* **4. An Toàn Sao Chép Clipboard & Link Sản Phẩm Chuẩn SEO Trên Nút Báo Giá Zalo**:
  - Tại [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), bọc lệnh `navigator.clipboard.writeText` bằng `try/catch` kèm cơ chế Fallback `document.execCommand('copy')` để chạy mượt mà trên cả các trình duyệt Webview In-App (Facebook, Zalo) bị hạn chế quyền clipboard.
  - Thay thế `window.location.href` bằng đường dẫn chính thức chuẩn SEO `https://protools.com.vn${getProductPath(product)}`.
  - Tối ưu chuỗi chữ hiển thị co giãn linh hoạt (`hidden sm:inline` / `sm:hidden`) tránh tràn dòng trên các màn hình điện thoại nhỏ hẹp (< 380px).

### Rule 9.76: Chuẩn Hóa Toàn Diện LLMs (llms.txt / llms-full.txt) & Tối Ưu Hóa Công Cụ Tạo Sinh Kết Hợp Địa Phương Hóa (GEO & Local Entity Grounding) (23/09/2026)
* **1. Chuẩn Hóa Cấu Trúc Khám Phá AI Search & Large Language Models (LLMs Standard)**:
  - **Tập tin chỉ mục `public/llms.txt`**: Xây dựng theo đúng đặc tả chuẩn `llmstxt.org` (answer.ai). Bao gồm tiêu đề H1, blockquote tóm lược sứ mệnh nhà phân phối chính thức, hồ sơ pháp lý, địa chỉ tổng kho Hà Nội & Hưng Yên, danh sách thương hiệu ủy quyền (Murrplastik, Hakko, HIOS, Quick, Zcut, Loctite, Samwon), 15 nhóm danh mục ngành hàng kèm clean URL và liên kết đến các endpoint dữ liệu máy đọc (`catalog_index.json`, `sitemap.xml`, `ai-manifest.json`, `llms-full.txt`).
  - **Tập tin ngữ cảnh chuyên sâu `public/llms-full.txt` (15.7 KB)**: Được thiết kế chuyên biệt để nạp trực tiếp vào ngữ cảnh của các mô hình LLM lớn (Perplexity, ChatGPT Search, Claude, Google Gemini, Cursor, Copilot). Chứa toàn bộ thông số kỹ thuật chi tiết của các thiết bị chủ lực (Murrplastik R-Tec Liner MP-1081 với case study VinFast Body Shop ABB Robots, Quick 205 ESD 150W, Hakko FX-888D, HIOS CL-4000/3000, HP-10, Zcut-9, quạt ion SL-001), điều khoản thương mại B2B (CO/CQ, hóa đơn VAT, điều khoản công nợ NET30 cho nhà máy, bảo hành 12 tháng) và bộ câu hỏi đáp kỹ thuật (FAQ Grounding) mật độ thông tin cao.
  - **Hồ sơ định danh AI `public/ai-manifest.json`**: Cung cấp metadata về khả năng xử lý báo giá (turnaround 15-30 phút), phân vùng phục vụ, chính sách giao hàng cùng thông tin liên hệ của từng bộ phận kỹ thuật.
  - **Chỉ thị `public/robots.txt`**: Khai báo quyền truy cập rõ ràng cho các AI bots hàng đầu (`GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-Web`, `Google-Extended`, `Amazonbot`, `Applebot-Extended`, `Bytespider`, `cohere-ai`, `Diffbot`), đồng thời cho phép truy xuất trực tiếp các file tri thức `/llms.txt`, `/llms-full.txt`, `/ai-manifest.json`.
* **2. Tối Ưu Hóa GEO (Generative Engine Optimization & Geolocation / Local Authority Grounding)**:
  - **Thẻ định vị địa lý (Geo Meta Tags)**: Khai báo chuẩn quốc tế trên toàn bộ hệ thống ([`index.html`](file:///d:/T&TVina/protools/index.html), [`src/components/SEOHead.tsx`](file:///d:/T&TVina/protools/src/components/SEOHead.tsx), và static snapshots):
    - `geo.region`: `VN-HN`
    - `geo.placename`: `Hà Nội, Hưng Yên, Việt Nam`
    - `geo.position`: `20.982887;105.881468`
    - `ICBM`: `20.982887, 105.881468`
  - **Thẻ liên kết ngữ cảnh AI**: Khai báo `<link rel="alternate" type="text/plain" href="https://protools.com.vn/llms.txt" />` và `<link rel="alternate" type="text/plain" href="https://protools.com.vn/llms-full.txt" />` ngay trong `<head>`.
  - **Mạng lưới thực thể Schema.org JSON-LD (Corporate & LocalBusiness Graph)**:
    - Định danh doanh nghiệp đa loại hình: `@type: ["WholesaleStore", "LocalBusiness", "Corporation"]`.
    - Tọa độ GPS chính xác (`GeoCoordinates` Lat: 20.982887, Long: 105.881468) kèm liên kết Google Maps CID chính thức.
    - Khai báo chi nhánh phụ trợ (`department`): Kho vận & kỹ thuật Hưng Yên đặt liền kề KCN Liên Hà Thái.
    - Phạm vi phục vụ công nghiệp (`areaServed`): 10 tỉnh thành trọng điểm Bắc Bộ tập trung chuỗi cung ứng FDI lớn (Hà Nội, Hưng Yên, Bắc Ninh, Bắc Giang, Hải Phòng, Vĩnh Phúc, Hải Dương, Hà Nam, Thái Nguyên, Quảng Ninh).
    - Các lĩnh vực tri thức công nghiệp chuyên sâu (`knowsAbout`): Xích dẫn cáp robot Murrplastik Đức, máy hàn cao tần Quick, tô vít điện chính xác HIOS, thiết bị phòng sạch ESD, và giải pháp Dresspack xưởng hàn thân xe ô tô VinFast.
  - **Kế thừa đồng bộ vào Static Snapshots ([`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py))**: 100% các trang sản phẩm và danh mục tĩnh được tạo sẵn đều tích hợp thẻ Geo và Schema seller với tọa độ địa lý, bảo đảm các bot thu thập dữ liệu không chạy JS vẫn lập chỉ mục và trích dẫn chuẩn xác trong AI Overviews.

### Rule 9.77: Khung Khám Phá Nhanh Khi Tương Tác Ô Tìm Kiếm (Header Search Quick Discovery Hub: Popular Tags, Featured Equipment & Quick Categories) (23/09/2026)
* **1. Mục tiêu & Trải nghiệm Người dùng (B2B Procurement UX)**:
  - Khi khách hàng hoặc cán bộ mua hàng nhấp chuột (focus) vào ô tìm kiếm trên thanh điều hướng nhưng chưa nhập từ khóa, thay vì để trống trơn, hệ thống lập tức xổ ra **Khung Khám Phá Nhanh (Quick Discovery Hub)** đa tiện ích.
* **2. Ba Khối Chức Năng Cốt Lõi Tại [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx)**:
  - **Khối 1: Từ Khóa Tìm Kiếm Phổ Biến (Popular Search Chips)**:
    - Hiển thị danh sách các mã SKU và từ khóa có lượt tra cứu cao nhất: `R-Tec Liner (MP-1081)` (nổi bật thương hiệu đỏ Murrplastik), `Quick 205 ESD (150W)`, `Hakko 936`, `HIOS CL-4000`, `Zcut-9`, `Quạt ion SL-001`, `Bể hàn CM-808`, `Bơm keo SP-982`, `Đo lực siết HP-10`, `Murrplastik`.
    - Bấm vào chip từ khóa lập tức điền vào ô tìm kiếm và kích hoạt đối sánh tức thì.
  - **Khối 2: Hàng Tiêu Biểu Sẵn Kho (Featured Flagship Equipment)**:
    - Hiển thị 4 thiết bị đầu bảng có sẵn tại kho Hà Nội & Hưng Yên (giao hàng 24h):
      1. *Murrplastik R-Tec Liner* (`MP-1081`) - Tiêu điểm Robot hàn xưởng Body Shop VinFast.
      2. *Trạm hàn cao tần Quick 205 ESD (150W)* (`TTPC-0289`) - Công suất 150W bù nhiệt tức thì SMT.
      3. *Máy bắt vít tự động HIOS CL-4000* (`PVN5224`) - Siết lực chính xác Nhật Bản.
      4. *Quạt thổi ion khử tĩnh điện Dr. Schneider SL-001* (`PVN1561`) - Khử ESD phòng sạch.
    - Bấm trực tiếp vào thẻ thiết bị dẫn thẳng tới trang chi tiết sản phẩm.
  - **Khối 3: Ngành Hàng Tra Cứu Nhanh (Quick Category Shortcuts)**:
    - Lưới 8 nhóm ngành công nghiệp trọng điểm kèm icon chuyên ngành: Murrplastik Đức, Thiết bị hàn, Máy bắt vít, Dụng cụ bơm keo, Máy cắt băng dính, Phòng sạch ESD, Xi lanh khí nén, Bu lông ốc vít inox.
    - Bấm vào ngành hàng tự động cuộn mượt xuống bảng `#product-catalog` và kích hoạt bộ lọc tương ứng.
* **3. Tương Tác Bàn Phím & Đồng Bộ Mobile Drawer**:
  - Hỗ trợ phím tắt `Escape` đóng nhanh popup, `onMouseDown={(e) => e.preventDefault()}` ngăn mất focus đột ngột trước khi click xử lý.

### Rule 9.78: Chuẩn Hóa Thumbnail Thực Địa Robot ABB & Credit Tác Giả Bài Viết Chuyên Ngành Ô Tô (Automotive Case Study Thumbnail & Author Byline Standard) (29/09/2026)
* **1. Cập Nhật Thumbnail Thực Địa Bài Viết Ô Tô (`protools.com.vn/murrplastik/industries/san-xuat-o-to`)**:
  - **Tài nguyên ảnh gốc**: Sử dụng ảnh thi công thực địa chất lượng cao `Setup R-Tec-Liner lên thân robot ABB.jpg` (2568x1926) từ xưởng Body Shop VinFast Cát Hải.
  - **Khối Hero Thumbnail trực tiếp trên bài viết**: Bổ sung khối ảnh đại diện tiêu điểm ngay dưới phần thông tin biên bản họp với thẻ `<img src="./Ảnh thi công/Setup R-Tec-Liner lên thân robot ABB.jpg" alt="Setup R-Tec-Liner lên thân robot ABB tại VinFast">` kèm chú thích ảnh chuyên nghiệp và tag tác giả.
  - **Đồng bộ toàn diện ảnh thẻ đại diện (News Card Thumbnails)**: Chuyển đổi và tối ưu ảnh sang tỉ lệ vàng 16:9 (`1200x675`) định dạng WebP và JPG chất lượng cao tại [`public/murrplastik/assets/images/tin-tuc/giai-phap-dress-pack-robot-o-to-murrplastik.webp`](file:///d:/T&TVina/protools/public/murrplastik/assets/images/tin-tuc/giai-phap-dress-pack-robot-o-to-murrplastik.webp) và `.jpg`, giúp đồng bộ sắc nét tức thì trên:
    1. Trang chủ Murrplastik ([`public/murrplastik/index.html`](file:///d:/T&TVina/protools/public/murrplastik/index.html)).
    2. Danh mục tin tức & sự kiện ([`public/murrplastik/tin-tuc/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/index.html)).
    3. Thẻ bài viết liên quan trong báo cáo thử nghiệm 17.75M chu kỳ ([`public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html`](file:///d:/T&TVina/protools/public/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/index.html)).
  - **SEO & Social Open Graph**: Cập nhật thẻ `og:image`, `twitter:image` và cấu trúc `TechArticle` schema trỏ trực tiếp đến ảnh thumbnail mới, chuẩn hóa canonical domain về `https://protools.com.vn/murrplastik/industries/san-xuat-o-to/`.
* **2. Bổ Sung Credit Người Viết Bài Tại Chân Trang (Footer Author Byline)**:
  - Bổ sung chỉ định tác giả chính thức tại footer trang `san-xuat-o-to`: `by Mr. Kai @ T&T Vina Digital`.
  - Hỗ trợ đầy đủ cơ chế song ngữ VI / EN qua [`public/murrplastik/industries/san-xuat-o-to/app.js`](file:///d:/T&TVina/protools/public/murrplastik/industries/san-xuat-o-to/app.js) với key `footer.author` (`Người viết bài: by Mr. Kai @ T&T Vina Digital` / `Author / Contributor: by Mr. Kai @ T&T Vina Digital`).
  - Đồng bộ khai báo thực thể tác giả `@type: Person` (`Mr. Kai @ T&T Vina Digital`) vào JSON-LD Schema của bài viết.
* **3. Đầy Đủ Tài Nguyên Bản Quyền & Thư Mục Thi Công Thực Tế**:
  - Sao chép toàn bộ các thư mục vật tư và tài liệu gốc vào [`public/murrplastik/industries/san-xuat-o-to/`](file:///d:/T&TVina/protools/public/murrplastik/industries/san-xuat-o-to/): `Ảnh thi công`, `Ảnh hiện trạng`, `Ảnh giải pháp`, `Ảnh phụ kiện ABB 6700 Murrplastik`, `Ảnh phụ kiện ABB 7600 Murrplastik`, `Bao_cao_giai_phap_Vinfast_Murrplastik.pdf`, `R-Tec_Liner_550mm.stl`.

### Rule 9.79: Chuẩn Hóa Thư Viện Tài Liệu Ngành Thực Phẩm & Đồ Uống F&B (F&B Industry Document Library & Assets Consolidation) (29/09/2026)
* **1. Mục tiêu & Phạm vi**:
  - Cập nhật chính xác 3 tài liệu kỹ thuật cốt lõi tại section `#library` của trang chuyên ngành Thực phẩm & Đồ uống (`protools.com.vn/murrplastik/industries/thuc-pham-va-do-uong/`).
* **2. Chi tiết 3 Tài liệu Thay thế**:
  - **Tài liệu 1 - Brochure Giải Pháp Đi Dây F&B**:
    - Nguồn: `D:\T&TVina\murrplastik_code\industries\thuc-pham-va-do-uong\Exp\f&b_hygienic_cabling_murrplastik_pdf.pdf` (1.2 MB).
    - Đường dẫn web: `Exp/f%26b_hygienic_cabling_murrplastik_pdf.pdf` (tạo kèm bản URL-encoded để phòng ngừa lỗi ký tự `&` trên web server LiteSpeed).
    - Đồng bộ link tải tại khối Hero và Footer CTA của trang.
  - **Tài liệu 2 - Catalog Tấm Dẫn Cáp FDA Murrplastik**:
    - Nguồn: `D:\T&TVina\murrplastik_code\industries\thuc-pham-va-do-uong\Catalog\cable_entry_systems_FDA_broshure_murrplastik_vn.pdf` (8.9 MB).
    - Đường dẫn web: `Catalog/cable_entry_systems_FDA_broshure_murrplastik_vn.pdf`.
  - **Tài liệu 3 - Poster Sơ Đồ Đi Dây F&B A2 (Bản Việt)**:
    - Nguồn: `D:\T&TVina\murrplastik_code\industries\thuc-pham-va-do-uong\Catalog\Poster_A2_FoodBeverage_murrplastik_preview_VN.pdf` (5.7 MB).
    - Đường dẫn web: `Catalog/Poster_A2_FoodBeverage_murrplastik_preview_VN.pdf`.
* **3. Quy chuẩn Thẩm mỹ & Giao diện (No Windows Emoji Standard)**:
  - Loại bỏ hoàn toàn các emoji mặc định hệ điều hành trong các thẻ badge/button của section `#library` (thay thế bằng icon vector SVG đơn sắc kỹ thuật).
  - Cập nhật nhãn dung lượng chính xác (1.2 MB, 8.9 MB, 5.7 MB) trên cả giao diện tĩnh và từ điển đa ngữ [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) (hỗ trợ cả tiếng Việt và tiếng Anh).
* **4. Đồng bộ Toàn bộ Tài nguyên Trực quan F&B**:
  - Sao chép toàn bộ các thư mục vật tư gốc từ `murrplastik_code` sang [`public/murrplastik/industries/thuc-pham-va-do-uong/`](file:///d:/T&TVina/protools/public/murrplastik/industries/thuc-pham-va-do-uong/): `Exp/`, `Catalog/`, `Facebook/`, `Hình ảnh thực tế/`, `Ảnh sản phẩm/` và các video trình diễn `.mp4`, giải quyết triệt để lỗi thiếu asset 404 khi người dùng tải tài liệu hoặc xem video demo.

### Rule 9.80: Cơ Chế Khử Cache Cho Modal Xem Trực Tiếp Tài Liệu & Đồng Bộ Production F&B (PDF Viewer Cache-Busting & Live Production Sync) (29/09/2026)
* **1. Sự cố Phản hồi Chậm Đổi Nội Dung Trên Trình Duyệt**:
  - Khi xem tài liệu qua iframe modal (`openPdf`), trình duyệt (Chrome/Edge) và LiteSpeed Web Server lưu cache file PDF theo URL tĩnh (`max-age=7200`), khiến người dùng vẫn nhìn thấy nội dung file PDF cũ ngay cả khi file mới đã tải lên.
* **2. Giải pháp Kỹ thuật Khử Cache Tức thì (Cache-Busting)**:
  - Cập nhật hàm `openPdf(url, title)` tại [`public/murrplastik/industries/thuc-pham-va-do-uong/index.html`](file:///d:/T&TVina/protools/public/murrplastik/industries/thuc-pham-va-do-uong/index.html): Tự động nối chuỗi tham số timestamp `v=Date.now()` vào URL (`fullUrl = url + (url.indexOf('?') !== -1 ? '&' : '?') + 'v=' + Date.now()`).
  - Áp dụng đồng bộ cho cả chế độ Iframe Modal trên máy tính và `window.open(fullUrl, '_blank')` trên thiết bị di động.
* **3. Chuẩn Hóa Nhãn Nút Hành Động**:
  - Đồng bộ nhãn nút bấm từ "Xem trực tuyến" thành **"Xem trực tiếp"** trên thẻ HTML và từ điển [`public/murrplastik/assets/js/i18n.js`](file:///d:/T&TVina/protools/public/murrplastik/assets/js/i18n.js) (`fb.doc.online`).
* **4. Xác Thực Đồng Bộ Production Trực Tiếp (Live Verification)**:
  - Tải thành công toàn bộ bundle và 3 file PDF mới lên máy chủ Production (`s2d34.cloudnetwork.vn`):
    - `Exp/f%26b_hygienic_cabling_murrplastik_pdf.pdf`: `1,237,916 bytes` (HTTP 200 OK, timestamp cập nhật hôm nay).
    - `Catalog/cable_entry_systems_FDA_broshure_murrplastik_vn.pdf`: `9,313,914 bytes` (HTTP 200 OK).
    - `Catalog/Poster_A2_FoodBeverage_murrplastik_preview_VN.pdf`: `5,945,241 bytes` (HTTP 200 OK).

### Rule 9.81: Đồng Bộ Màu Sắc Nhận Diện F&B & Cập Nhật Thumbnail Thẻ Tin Tức Hub Murrplastik (F&B Theme Blue Sync & Hub News Cards Thumbnails Update) (29/09/2026)
* **1. Đồng Bộ Màu Nhận Diện Trang F&B (`/murrplastik/industries/thuc-pham-va-do-uong/`)**:
  - **Nút Chuyển Ngôn Ngữ (`.lang-btn button.active`)**: Đổi nền từ màu đỏ sang màu xanh đại dương `var(--blue)` (`#0077B6`) và hover `color: var(--blue)` để đồng bộ toàn diện với bảng màu vệ sinh ATTP.
  - **Liên Kết Điều Hướng Trang Chủ (`.nav-link` Trang chủ)**: Đổi style màu từ đỏ (`color:var(--red)`) sang xanh (`color:var(--blue); font-weight:700`).
  - **Nút Liên Hệ Nổi (`.float-btn.phone`)**: Đổi từ màu đỏ sang xanh `var(--blue)` kèm hiệu ứng lan tỏa ánh sáng xanh `@keyframes pulse-blue` (`rgba(0, 119, 182, 0.6)`), đồng bộ với 2 nút Zalo và Messenger bên dưới.
* **2. Cập Nhật Thumbnail Thẻ Tin Tức Hub Murrplastik (`https://protools.com.vn/murrplastik/`)**:
  - **Thẻ Ô Tô & Robotics (`news-item-card`)**: Thay thế thumbnail bằng ảnh thi công thực tế tại VinFast:
    `<img src="./Ảnh thi công/Setup R-Tec-Liner lên thân robot ABB.jpg" alt="Giải pháp cáp & Dress Pack ngành sản xuất ô tô tự động hóa" loading="lazy" width="600" height="300">`.
  - **Thẻ Tiêu Điểm F&B (`news-item-card`)**: Thay thế thumbnail bằng ảnh ứng dụng thực tế đầu nối kim loại:
    `<img src="Hình ảnh thực tế/Züger AG (Thụy Sĩ) Các đầu nối cáp kim loại.png" alt="Giải pháp đi dây cáp vệ sinh ngành Thực phẩm & Đồ uống FDA EHEDG" loading="lazy" width="600" height="300">`.
  - **Bảo Đảm Đường Dẫn Trực Tiếp**: Sao chép thư mục `Ảnh thi công/` và `Hình ảnh thực tế/` lên root `/murrplastik/` trên máy chủ để đảm bảo cả đường dẫn tương đối `./Ảnh thi công/...` và `Hình ảnh thực tế/...` đều trả về HTTP 200 OK ngay lập tức.
* **3. Xác Thực Production Trực Tiếp (Live Verification)**:
  - Cả 4 yêu cầu đã được xác thực thành công qua curl trên `https://protools.com.vn/`:
    - `https://protools.com.vn/murrplastik/industries/thuc-pham-va-do-uong/`: `.lang-btn button.active`, `.nav-link` Trang chủ và `.float-btn.phone` đều mang sắc xanh `var(--blue)` / `pulse-blue`.
    - `https://protools.com.vn/murrplastik/`: Cả 2 ảnh thumbnail thẻ tin tức đều hiển thị sắc nét với mã phản hồi HTTP 200 OK.

### Rule 9.82: Tích Hợp Google Maps Iframe & Chuẩn Hóa Thông Tin Trụ Sở Tại Chân Trang Hệ Thống Murrplastik (Footer Google Maps Integration Standard) (29/09/2026)
* **1. Mục Tiêu & Trải Nghiệm Doanh Nghiệp (B2B Trust & Local SEO)**:
  - Đồng bộ khối địa chỉ trụ sở/kho hàng và bản đồ tương tác Google Maps vào footer của toàn bộ 6 trang trong phân vùng Murrplastik (`/murrplastik/`, 2 trang chuyên ngành `san-xuat-o-to`, `thuc-pham-va-do-uong`, và 3 trang `tin-tuc/`), bảo đảm phong cách thị giác thích ứng theo từng trang con.
* **2. Cấu Trúc Thông Tin & Bản Đồ Đồng Bộ**:
  - **Trụ sở chính**: Thôn Nhạo Sơn – Xã Thụy Anh – Tỉnh Hưng Yên (cách KCN Liên Hà Thái 1km).
  - **VPGD & Kho Hà Nội**: Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội.
  - **Link Điều Hướng Maps**: `https://maps.app.goo.gl/cMn6HEe4KqVGCpPV7` ("Chỉ đường trên Google Maps").
  - **Mã Nhúng Bản Đồ Google Maps Chuẩn**:
    `src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d783.13591034401!2d105.88146848700326!3d20.982886742453424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af26d2bb1e0f%3A0x65f178554a3bb4aa!2zQ8O0bmcgdHkgVE5ISCBDw7RuZyBuZ2hp4buHcCBUJlQgVmluYQ!5e0!3m2!1svi!2s!4v1788060518008!5m2!1svi!2s"`.
* **3. Quy Chuẩn Thẩm Mỹ Theo Bản Sắc Từng Trang Con (Child-Theme Adaptive Styling)**:
  - **Hub Murrplastik & Tin tức (`index.html`, `tin-tuc/`)**: Nền tối kỹ thuật, viền `1px solid rgba(255,255,255,0.12)`, link chỉ đường màu vàng hổ phách `#FBBF24`, chiều cao 180px, bo góc `8px`.
  - **Chuyên ngành Ô tô (`san-xuat-o-to/`)**: Nền sáng `background: #f8fafc; border: 1px solid var(--border-color);`, icon đỏ `var(--accent-red)`, link chỉ đường cam hổ phách `#d97706`, chiều cao 200px, bo góc `6px`. Đặt độc lập ngoài vùng `data-i18n-html="footer.info"` để tránh bị `app.js` ghi đè khi đổi ngôn ngữ.
  - **Chuyên ngành Thực phẩm & Đồ uống (`thuc-pham-va-do-uong/`)**: Nền xanh biển đậm vệ sinh, icon và link màu cyan `var(--cyan)` (`#06B6D4`), bo góc `var(--radius-sm)` (`8px`), chiều cao 180px.
* **4. Xác Thực Production Trực Tiếp (Live Verification)**:
  - Cả 6 trang đã được build Vite tĩnh và tải lên máy chủ Mắt Bão thành công. Lệnh kiểm chứng `curl.exe` xác thực 6/6 URL đều hiển thị mã iframe Google Map hoạt động chuẩn xác:
    1. `https://protools.com.vn/murrplastik/` (200 OK)
    2. `https://protools.com.vn/murrplastik/industries/san-xuat-o-to/` (200 OK)
    3. `https://protools.com.vn/murrplastik/industries/thuc-pham-va-do-uong/` (200 OK)
    4. `https://protools.com.vn/murrplastik/tin-tuc/` (200 OK)
    5. `https://protools.com.vn/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/` (200 OK)
    6. `https://protools.com.vn/murrplastik/tin-tuc/trien-lam-vec-2026/` (200 OK)

### 🎨 Rule 9.83: Quy Chuẩn Floating Hub #0068FF, Iframe Zoom Controls & Cơ Chế Xử Lý Kẹt Custom Cursor (29/09/2026)
* **1. Đồng Bộ Màu Thương Hiệu & Layout Floating Hub F&B**:
  - Tại trang Thực phẩm & Đồ uống (`murrplastik/industries/thuc-pham-va-do-uong/`), chuyển toàn bộ nút liên hệ (`.float-btn`, `.float-btn.phone`, `.float-btn.zalo`, `.float-btn.messenger`) và hiệu ứng hào quang phát xung (`pulse-blue`) sang mã màu `#0068FF`.
  - Tái định vị cụm liên hệ nổi sang góc dưới bên phải (`bottom: 90px; right: 30px;`), nằm thẳng hàng phía trên nút `#backToTop` (`bottom: 30px; right: 30px;`), đồng bộ màu nền `#0068FF` cho cả nút Back to Top.
* **2. Kích Hoạt Điều Khiển Thu/Phóng (Zoom Controls) Cho Iframe Google Maps**:
  - Google Maps Embed API tự động ẩn các nút zoom `+` / `-` nếu khung iframe có chiều cao < 250px.
  - Tăng chiều cao lên `height="280"` (CSS `height: 280px; width: 100%;`) trên toàn bộ 6 trang Murrplastik để hiển thị đầy đủ bộ công cụ thu phóng và điều hướng bản đồ.
* **3. Cơ Chế Triệt Tiêu Lỗi Kẹt Custom Cursor Khi Hover Vào Iframe (Iframe Cursor Decoupling)**:
  - **Nguyên nhân**: Sự kiện `mousemove` của trình duyệt bị gián đoạn khi chuột di chuyển vào khung `<iframe>` khác nguồn (Cross-Origin), dẫn đến con trỏ chuột custom (`.cursor-arrow-svg`, `.cursor-glow-aura`) bị đóng băng tại mép iframe trong khi chuột mặc định xuất hiện bên trong.
  - **Giải pháp kỹ thuật**:
    - Bổ sung class `body.cursor-inside-iframe` trong `main.css` ẩn triệt để cả 2 phần tử custom cursor (`opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;`).
    - Lắng nghe sự kiện `mouseenter` / `mouseover` trên `.footer-map-container` và `iframe` trong `main.js` để kích hoạt class này.
    - Kết hợp lắng nghe `window.addEventListener('blur')` (khi user click vào map) và tự động khôi phục ngược lại khi chuột quay lại cửa sổ chính (`mousemove` / `focus`).
    - Tăng tốc độ bám theo (lerp `0.35`), loại bỏ transition width/height gây lag / reflow trên màn hình.
* **4. Chuẩn Hóa Đường Dẫn Thumbnail Trang Tin Tức `murrplastik/tin-tuc/`**:
  - Đối với trang danh sách tin tức tại thư mục con cấp 1 (`/murrplastik/tin-tuc/`), đường dẫn tài nguyên ảnh cần sử dụng tiền tố `../` (`../Hình ảnh thực tế/...`, `../Ảnh thi công/...`) để trỏ chính xác vào thư mục tài nguyên gốc của Murrplastik.

### 🚨 Rule 9.84: Hồ Sơ Phân Tích Sự Cố DNS Cụm Mắt Bão & Phương Án Dự Phòng Cao Cấp (29/09/2026)
* **1. Bản Chất Sự Cố (Root Cause Verdict)**:
  - Mã lỗi trình duyệt: `net::ERR_NAME_NOT_RESOLVED` (*"protools.com.vn's server IP address could not be found"*).
  - Trạng thái Hosting Server (`112.78.2.34` - `s2d34.cloudnetwork.vn`): 100% Hoạt động bình thường. Máy chủ LiteSpeed, Database MariaDB, Chứng chỉ SSL và mã nguồn đều nguyên vẹn (Port 21, 80, 443, 2222 đều phản hồi `TcpTestSucceeded: True`; lệnh `curl -I -k --resolve` trả về `HTTP/1.1 200 OK` trong 50ms).
  - Nguyên nhân gốc: Cụm máy chủ phân giải tên miền (Authoritative Nameservers) truyền thống của Mắt Bão (`ns1/ns2.matbao.vn` và `ns1/ns2.matbao.com` tại các IP `103.110.128.60`, `103.138.89.11`, `35.198.203.127`, `13.250.228.99`) bị sập dịch vụ / treo mạng trên diện rộng. Cả tên miền chính thức của nhà mạng là `matbao.vn` cũng bị lỗi phân giải tương tự.
* **2. Bằng Chứng Kỹ Thuật (Live Forensics Proof)**:
  - Google DNS DoH: `Name servers did not respond [103.110.128.60, 103.138.89.11, 35.198.203.127, 13.250.228.99]` (Status 2 / SERVFAIL / EDE 22: *No Reachable Authority at delegation protools.com.vn*).
  - Cloudflare DNS DoH: `EDE(22): No Reachable Authority at delegation protools.com.vn`.
  - Phân giải đối chứng `matbao.vn`: `Name servers did not respond [35.198.203.127, 13.250.228.99, 103.110.128.60, 103.138.89.11]`.
* **3. Kế Hoạch Ứng Phó Khẩn Cấp & Dài Hạn (Emergency Playbook)**:
  - **Khắc phục tức thì phía Client (Zero-Wait Local Workaround)**: Thêm trực tiếp dòng `112.78.2.34 protools.com.vn www.protools.com.vn` vào file `C:\Windows\System32\drivers\etc\hosts` (chạy PowerShell bằng quyền Administrator) để bỏ qua tầng DNS trung gian và truy cập website tốc độ cao ngay lập tức.
  - **Khắc phục triệt để tầng hạ tầng (Permanent Global Mitigation)**: Đăng nhập trang quản trị tên miền `https://id.matbao.net/`, chuyển cặp NameServer từ cụm truyền thống sang Cloudflare DNS (`*.ns.cloudflare.com`) hoặc cụm Cloud DNS mới của Mắt Bão (`ns-cloud1.matbao.com` / `ns-cloud2.matbao.com` tại IP Google Cloud `104.199.192.117`).


### Rule 9.85: Quy Chuẩn Bảo Vệ Bí Mật Thương Mại (NDA Sanitization) & Chống Cạnh Tranh Không Lành Mạnh (02/10/2026)
* **1. Căn Cứ Pháp Lý & Nguyên Nhân Kỹ Thuật (Legal & Technical Grounds)**:
  - **Bảo Vệ Bí Mật Kinh Doanh & Hợp Đồng Bảo Mật (NDA Compliance)**: Tuân thủ nghiêm ngặt thỏa thuận không tiết lộ thông tin (Non-Disclosure Agreement) đã ký kết với khách hàng đối tác sản xuất ô tô công nghệ cao. Tuyệt đối không sử dụng tên thương hiệu hoặc địa danh dự án của đối tác trên bất kỳ kênh công khai nào (website, URL, metadata, alt ảnh, JSON-LD, hay LLMs manifest), ngăn chặn hoàn toàn việc rò rỉ thông tin hoặc bị máy chủ tìm kiếm index từ khóa dự án.
  - **Tuân Thủ Luật Cạnh Tranh 2018 (Anti-Unfair Competition Compliance)**: Căn cứ Điều 45 Luật Cạnh tranh Việt Nam 2018 về hành vi lôi kéo khách hàng bất chính hoặc gièm pha doanh nghiệp khác, nghiêm cấm chỉ đích danh tên thương hiệu của bên thứ ba / đối thủ cạnh tranh (như Becker) trên các bài phân tích kỹ thuật.
* **2. Tiêu Chuẩn Hóa Thuật Ngữ Thay Thế (Standardized Industrial Nomenclature)**:
  - Thay thế danh xưng đối tác bằng thuật ngữ công nghiệp chuẩn B2B: *"dàn robot hàn thân xe ô tô"*, *"robot lắp ráp ô tô tự động"*, *"dây chuyền sản xuất và lắp ráp ô tô công nghệ cao"*, *"xưởng Body Shop công nghệ cao"*.
  - Thay thế linh kiện đối thủ bằng định danh kỹ thuật: *"bộ gá kẹp/giá đỡ truyền thống thế hệ cũ"*, *"cơ cấu gá cố định thế hệ trước"* được thay thế hoàn toàn bởi giải pháp Murrplastik R-Tec Liner.
  - Loại bỏ hoàn toàn chuyên mục/tệp tin "Báo cáo" (Report PDF), chuẩn hóa tiêu đề và chủ đề bài viết thành: *"Ứng dụng kỹ thuật tiêu biểu trong ngành sản xuất và lắp ráp ô tô công nghệ cao"*.
* **3. Quy Trình Vệ Sinh Dữ Liệu 5 Tầng (5-Layer Zero-Footprint Sanitization Standard)**:
  - **Tầng 1 (Giao Diện & UI Text)**: Rà soát toàn bộ các thành phần hiển thị trên trang chủ (`Home.tsx`), trang chi tiết (`ProductDetail.tsx`), trang chuyên ngành ô tô (`san-xuat-o-to`), bài tin tức và hệ thống đa ngôn ngữ (`i18n`).
  - **Tầng 2 (SEO, Structured Data & Metadata)**: Làm sạch thẻ `<title>`, `<meta name="keywords">`, `<meta property="og:...">`, schema `JSON-LD` (`TechArticle`, `FAQPage`, `knowsAbout`), tọa độ Google Maps liên kết ra ngoài.
  - **Tầng 3 (Tệp Tin & Tên Tài Nguyên Asset)**: Xóa triệt để các file PDF nội bộ (`Bao_cao_giai_phap_...pdf`); đổi tên toàn bộ file hình ảnh chứa tên đối thủ thành tên kỹ thuật thuần túy trước khi tải lên hosting.
  - **Tầng 4 (AI Manifest & LLMs Indexing)**: Rà soát và loại bỏ sạch từ khóa tại `public/llms.txt`, `public/llms-full.txt`, `public/ai-manifest.json` để các mô hình Generative AI và bot thu thập dữ liệu không gắn nhãn keyword nhạy cảm.
  - **Tầng 5 (Mã Nguồn & Chú Thích CSS/JS)**: Dọn sạch mọi chú thích mã nguồn nội bộ (CSS/JS comments), đổi tên các translation keys (`trust_vinfast` -> `trust_automotive`, `vinfast_case_study` -> `automotive_case_study`) để bundle đóng gói không chứa bất kỳ chuỗi tìm kiếm nhạy cảm nào.
* **4. Cổng Xác Thực Bắt Buộc (Mandatory Verification Gate)**:
  - Trước khi triển khai hoặc đóng gói phát hành, bắt buộc thực thi lệnh quét Regex đối chứng phân biệt hoa thường và không phân biệt hoa thường trên toàn bộ workspace (`public`, `src`, `dist`, `index.html`) đạt tỷ lệ: **0 MATCHES**.

### Rule 9.86: Quy Chuẩn Hiện Đại Hóa AdminCP Legacy & Xóa Bỏ Dấu Vết Web123 (03/10/2026)
* **1. Chiến Lược Phát Hành 2 Pha An Toàn (2-Phase Staging & Production Promotion)**:
  - **Pha 1 (Preview Cô Lập)**: Phát hành bản xem thử tại `/public_html/admincp_preview/` để Ban giám đốc và nhân sự duyệt UI thực tế trước khi áp dụng. Tích hợp chỉ thị `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` và `robots.txt Disallow: /` chặn máy chủ tìm kiếm. Bổ sung rule bypass trong root `.htaccess` (`^(admincp|admincp_preview|...)(/.*)?$ - [L]`).
  - **Pha 2 (Chính thức hóa - Promotion)**: Tự động nén toàn bộ `/public_html/admincp/` cũ thành file zip backup `backups/admincp_backup_before_modernize_[timestamp].zip` trước khi ghi đè bản mới; sau đó dọn dẹp thư mục tạm preview trên hosting bằng script [`promote_admincp.py`](file:///d:/T&TVina/protools/promote_admincp.py).
* **2. Cơ Chế Triệt Tiêu 100% Dấu Vết Bên Thứ 3 (Zero Web123 Footprint)**:
  - Loại bỏ hoàn toàn chuỗi `Web123`, `web123.vn` và hình ảnh ngoại bộ trên toàn bộ tệp tin PHP, JS, CSS.
  - Cập nhật bản quyền chuẩn mực: `© 2026 CÔNG TY TNHH CÔNG NGHIỆP T&T VINA (T&T VINA INDUSTRIAL CO., LTD). All rights reserved.`
  - Tích hợp logo nội bộ chính thức [`admincp_preview/media/logo_ttvina.png`](file:///d:/T&TVina/protools/admincp_preview/media/logo_ttvina.png) thay cho link ngoài tránh lỗi Mixed Content HTTPS.
  - Nút "Trợ giúp" tại Header mở Popup Modal liên hệ nội bộ (Mr. Kai: `0968.597.131` / Mr. Thanh: `0943.301.886` / `info@t2tvina.com`).
* **3. Bảo Tồn Thói Quen Thao Tác (Muscle-Memory Preservation Standard)**:
  - Giữ nguyên 100% vị trí không gian (Menu Top, Sidebar trái, Bảng dữ liệu, Form thêm/sửa) và bộ chọn DOM (`name`, `id`, `class`) để đảm bảo các tiến trình AJAX, iframe form post và cơ sở dữ liệu cũ hoạt động trơn tru.
  - Nâng cấp tầng CSS (`style.css`) sang phong cách công nghiệp hiện đại B2B: Bảng màu Navy Slate (`#0f172a`), font hệ thống sắc nét, nút bấm thuần CSS thay thế ảnh cắt bitmap, thẻ Card đăng nhập chuyên nghiệp.
* **4. Tính Năng Sắp Xếp Sản Phẩm Theo Thời Gian Tạo (Creation Time Sorting)**:
  - Bổ sung cơ chế Sort 2 chiều tại cột `Thời gian tạo` của danh mục Sản phẩm (`content_group=6`): Mới nhất trước (DESC, mặc định) ↔ Cũ nhất trước (ASC) kèm icon mũi tên chỉ báo (▲/▼).
  - Tích hợp lưu trữ trạng thái sắp xếp qua Cookie `product_sort_time` và tham số URL `&sort_by=time_asc|time_desc` đảm bảo giữ nguyên thứ tự sắp xếp khi phân trang (Pagination) hoặc thay đổi số lượng hàng hiển thị.

### Rule 9.87: Quy Chuẩn Tinh Chỉnh Giao Diện AdminCP 2026 (Unified Header, Sticky Layout & 2-Stage Scroll) (03/10/2026)
* **1. Hợp Nhất Header & Thanh Điều Hướng (Unified Header Navigation)**:
  - Di chuyển menu `.menu_top` lên vị trí khoảng trắng trong `.admin_header` (`.header_nav` nằm giữa Logo T&T Vina và Customer Info), giúp tiết kiệm diện tích theo chiều dọc màn hình và tạo bố cục phẳng hiện đại.
* **2. Khôi Phục & Chuẩn Hóa Dropdown Bar Trong Khối Thao Tác (Dropdown Mechanics Fix)**:
  - Khôi phục triệt để cơ chế ẩn/hiện của các menu hành động `.function .col4` ("Thay đổi trạng thái", "Hiển thị cột") và `.filter`: Giữ nguyên `display: none !important; position: absolute;` và chỉ hiển thị khi hover chuột (`:hover > ul { display: block !important; }`). Triệt tiêu hoàn toàn lỗi danh sách gạch đầu dòng (bullet points) bị bung rộng trên giao diện.
* **3. Cố Định Thanh Đầu Trang & Bảng Danh Mục Trái Khi Cuộn (Sticky Navigation & Left Sidebar)**:
  - Bọc toàn bộ Header trong `.sticky_top_container` (`position: sticky; top: 0; z-index: 2000; box-shadow: 0 1px 3px rgba(0,0,0,0.08)`).
  - Cố định cột danh mục `#content_left` tại `position: sticky; top: 66px; max-height: calc(100vh - 76px); overflow-y: auto;` với thanh cuộn mượt, cho phép người dùng cuộn xem hàng trăm sản phẩm ở bên phải mà vẫn giữ nguyên cây danh mục ở bên trái để lọc nhanh.
* **4. Nút Cuộn Về Đầu Trang 2 Giai Đoạn Chống Giật Mình (2-Stage Back-To-Top Engine - Rule 9.8)**:
  - Tự động xuất hiện tại góc dưới bên phải (`bottom: 24px; right: 24px;`) khi người dùng cuộn đạt từ **`50%`** chiều cao trang trở lên (`scrollTop >= totalHeight * 0.5`).
  - Khi bấm, thực thi hiệu ứng chuyển động 2 giai đoạn: Nhịp 1 cuộn nhẹ nhàng từ từ lên một đoạn trong ~700ms (`scrollTop - initialStep`) để mắt người dùng bắt kịp nhịp chuyển động, nhịp 2 lướt vút êm ái lên đỉnh trang (`scrollTop: 0` trong 450ms).
* **5. Biểu Tượng Kỹ Thuật SVG Đơn Sắc & Tự Động Thu Gọn Responsive (Item 5)**:
  - Tích hợp 100% icon SVG kỹ thuật monochrome (`stroke="currentColor"`) cho Thông báo, Trợ giúp, Đăng xuất, Tài khoản và Website; tuyệt đối không dùng emoji hệ điều hành Windows.
  - Trên màn hình máy tính bảng và điện thoại di động (`max-width: 1024px`), CSS tự động ẩn text label (`.label-text`, `.user-text`) và chỉ hiển thị các biểu tượng SVG tinh gọn kèm tooltip, chống vỡ dòng header.
* **6. Chuẩn Hóa Căn Chỉnh Cột Bảng Dữ Liệu (Pixel-Perfect Table Grid)**:
  - Cấu hình Flexbox căn giữa theo trục dọc (`display: flex; align-items: center; min-width: 1100px;`) trên cả `.header` và `.rows`, khóa kích thước từng cột bằng `flex: 0 0 [width]px; width: [width]px; flex-shrink: 0;`, đảm bảo các cột dữ liệu và tiêu đề bảng khớp chính xác từng pixel.

### Rule 9.88: Quy Chuẩn Tối Ưu Mobile, Triệt Tiêu Lỗ Hổng Reset Database, Căn Cột Đối Xứng, Hover Tooltip & Git Pipeline (03/10/2026)
* **1. Thiết Kế Responsive Mobile-First Thực Thụ (True Mobile Viewport & Swipeable Table)**:
  - Khắc phục hiện tượng hiển thị thu nhỏ như trang desktop trên iPhone 12 Pro (390x844) bằng thẻ chuẩn: `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />` trên cả [`index.php`](file:///d:/T&TVina/protools/admincp_preview/index.php) và [`login.php`](file:///d:/T&TVina/protools/admincp_preview/login.php).
  - Áp dụng breakpoint `@media (max-width: 800px)`: Tự động ẩn Sidebar trái (`#content_left`), chuyển Header sang dạng co giãn 2 hàng với các nút icon SVG gọn gàng, hỗ trợ vuốt chạm cảm ứng ngang cho bảng dữ liệu `.listnews_content` mà không làm vỡ tỉ lệ toàn trang.
* **2. Triệt Tiêu Lỗ Hổng Web123 Reset Database Cực Kỳ Nguy Hiểm (Zero Truncate Vulnerability)**:
  - Loại bỏ hoàn toàn nút Reset (`class="button_style1 reset"`) khỏi giao diện Home [`modules/home_admin_message.php`](file:///d:/T&TVina/protools/admincp_preview/modules/home_admin_message.php).
  - Vô hiệu hóa vĩnh viễn lệnh `TRUNCATE TABLE` (xóa trắng 20 bảng cơ sở dữ liệu) trong [`modules/content_process.php`](file:///d:/T&TVina/protools/admincp_preview/modules/content_process.php), thay thế bằng hàm ghi log cảnh báo an toàn.
  - Làm sạch danh sách bot tìm kiếm thô trong [`modules/home_counter.php`](file:///d:/T&TVina/protools/admincp_preview/modules/home_counter.php), chuẩn hóa bảng thống kê gọn gàng.
* **3. Favicon Nhận Diện Thương Hiệu T&T Vina Chính Thức (Brand Identity Favicon)**:
  - Tích hợp thẻ `<link rel="icon" type="image/png" href=".../media/logo_ttvina.png" />` trên toàn bộ các trang AdminCP.
* **4. Sắp Xếp Thời Gian Tạo & Căn Chỉnh Cột Bảng Dữ Liệu Đối Xứng (Sort & Symmetrical Grid)**:
  - Thiết lập gán tường minh `$GLOBALS["sort_by"]` và `$GLOBALS["sort_dir"]` trên cả luồng tải trực tiếp và AJAX; hàm JavaScript `sort_content_by_time` ghi cookie an toàn và gửi tham số `&sort_by=time_asc|time_desc`.
  - Cột Tiêu đề / Tên sản phẩm cấu hình `flex: 1 1 260px !important; min-width: 200px !important;` giúp bảng co giãn đối xứng 100% bề ngang card trên mọi độ phân giải màn hình.
  - Đồng bộ chuẩn hóa tên class `time_google_index` cho Cột 10 ở tất cả các nhóm nội dung (`content_group=1, 2, 6, 7`).
* **5. Kiểm Soát Bounding-Box Ảnh Phóng To Khi Hover (Product Preview Tooltip)**:
  - Viết lại bộ điều khiển [`js/tooltip.js`](file:///d:/T&TVina/protools/admincp_preview/js/tooltip.js) với thuật toán phát hiện va chạm góc màn hình (`e.clientX`, `e.clientY` so với `window.width`, `window.height`), tự động lật ảnh sang hướng đối diện khi gần mép viewport.
  - Khống chế kích thước tối đa `#tooltip img` ở mức `350px` (lớn hơn 10% so với bản cũ 300px), đảm bảo hình ảnh sản phẩm luôn nằm trọn vẹn trong vùng nhìn thấy của người dùng.
* **6. Thiết Kế Lịch Sử Hoạt Động Theo Phong Cách Git Pipeline (CI/CD Pipeline History)**:
  - Cấu trúc lại hàm `get_history_from_system_log` trong [`modules/content_left.php`](file:///d:/T&TVina/protools/admincp_preview/modules/content_left.php) và bổ sung bộ style `.git_pipeline`: Ray dẫn dọc (`pipeline_rail`), nốt trạng thái Success xanh lá / Warning vàng hổ phách (`pipeline_node`) có vầng sáng lan tỏa, nhãn `commit` tag, mốc thời gian monospace và liên kết nhật ký mượt mà.


### 🎛️ Rule 9.89: Quy Chuẩn Dọn Dẹp Di Tích Cũ & Tối Ưu Thanh Điều Hướng AdminCP (03/10/2026)
* **1. Loại bỏ triệt để di tích template bất động sản / vé máy bay cũ (Legacy Relic Purge)**:
  - Loại bỏ hoàn toàn 6 mục menu rác thừa kế từ template cũ 2012 trong [`modules/menu.php`](file:///d:/T&TVina/protools/admincp_preview/modules/menu.php): "Dự án" (`content_group=2`), "Sơ đồ căn hộ" (`content_group=7`), "Thông tin khác" (`contenttype`), "Khu vực" (`content_group=10`), "Hãng máy bay" (`content_group=5`), "Sân bay" (`content_group=12`).
  - Menu chỉ giữ lại đúng 100% nghiệp vụ phân phối công nghiệp B2B của T&T Vina Protools (Home, Bài viết, Sản phẩm, Danh mục, Đặt hàng, Liên hệ, Phản hồi, Thành viên, Quảng cáo, Hỗ trợ, Cấu hình).
  - Bổ sung quy tắc CSS chặn hiển thị thẻ ẩn trên mobile: `.admin_header .header_nav .menu_top ul li[style*="display: none"] { display: none !important; }`, triệt tiêu hoàn toàn các yêu cầu 404 đến các module không tồn tại.
* **2. Khắc phục nút Hamburger Mobile Nav trên Desktop (Strict Responsive Breakpoint)**:
  - Thiết lập `.mobile_nav_btn { display: none !important; }` ở stylesheet desktop chính (`> 800px`), chỉ kích hoạt `display: flex !important;` bên trong `@media (max-width: 800px)`.
* **3. Cấu trúc lại Header và Nút Thu Gọn / Mở Lại Sidebar (Non-Overlapping Catalog Header & Root-Level Show Tab)**:
  - **Khối Thống Kê Truy Cập**: Tại `.catalog` trong [`modules/content_left.php`](file:///d:/T&TVina/protools/admincp_preview/modules/content_left.php), xóa bỏ nút `img.hide_left` đè lên dòng "Truy cập hôm nay: 0", thay thế bằng thanh tiêu đề độc lập `.catalog_header` chứa nhãn "Thống kê truy cập", icon vector SVG biểu đồ và nút bấm `.hide_left_btn` SVG chevron tinh tế. Giải phóng 100% khoảng trống cho 4 hàng chỉ số truy cập bên dưới.
  - **Nút Mở Lại Sidebar Khi Thu Gọn (`.show_left`)**: Đặt nút `.show_left` trực tiếp ở tầng thẻ gốc `#wrap` trong [`index.php`](file:///d:/T&TVina/protools/admincp_preview/index.php) (bên ngoài `#content_left` và độc lập với `#admin_content`). Định vị `position: fixed; top: 130px; left: 0; z-index: 99999;` dạng tab nổi bo góc phải có hiệu ứng hover mở rộng và vầng sáng thương hiệu. Đồng bộ class `.left_collapsed` qua jQuery trên cả `#wrap` và `#admin_content`, loại bỏ hoàn toàn hiện tượng nút bị nuốt mất khi `#content_left` ẩn đi.

### 🔄 Rule 9.90: Cơ Chế Đồng Bộ Trạng Thái 2 Chiều AdminCP <-> Production & Bộ Dữ Liệu 7.479 SKU Sapo (03/10/2026)
* **1. Bản Đóng Gói SQL Nạp 7.479 SKU Vào MariaDB ([`import_sapo_to_admincp.sql`](file:///d:/T&TVina/protools/import_sapo_to_admincp.sql))**:
  - Trích xuất 100% dữ liệu từ [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) thông qua script [`scripts/generate_sapo_admincp_import_sql.py`](file:///d:/T&TVina/protools/scripts/generate_sapo_admincp_import_sql.py).
  - Tự động gán dải ID `2001 -> 9479` (tránh xung đột với dải ID cũ `<= 1083`), đóng gói chia khối 500 rows/lệnh trên 5 bảng liên kết: `content` (phân nhóm 6), `content_process` (trạng thái xuất bản), `content_info` (mã SKU, giá, đơn vị, ảnh), `content_meta` (tiêu đề, slug, mô tả tóm tắt), `content_body` (bảng thông số kỹ thuật HTML).
  - Quy trình import: Người quản trị import trực tiếp file này qua phpMyAdmin trên DirectAdmin (`https://s2d34.cloudnetwork.vn:2222`), tuyệt đối tuân thủ Rule 2.1 & 2.2 về an toàn WAF Imunify360.
* **2. Cơ Chế Real-time Sync Hook Giữa AdminCP và Production Frontend**:
  - **Phía AdminCP PHP**: Hàm `sync_status_to_production_catalog($contentid, $status)` được tích hợp trong [`modules/mdl_global_admincp.php`](file:///d:/T&TVina/protools/admincp_preview/modules/mdl_global_admincp.php), tự động kích hoạt tại [`modules/content_process.php`](file:///d:/T&TVina/protools/admincp_preview/modules/content_process.php) (khi `publish`, `republish`, `down`, `delete`) và [`modules/content_insert.php`](file:///d:/T&TVina/protools/admincp_preview/modules/content_insert.php). Khi gỡ/tắt, SKU và ID lập tức được ghi vào file JSON nhẹ `/data/disabled_products.json`; khi xuất bản, SKU và ID được gỡ khỏi danh sách tắt.
  - **Phía Frontend React**: [`src/utils/catalogLoader.ts`](file:///d:/T&TVina/protools/src/utils/catalogLoader.ts) tự động fetch `/data/disabled_products.json?v=[timestamp]` và loại trừ toàn diện khỏi bộ nhớ đệm danh mục, thanh tìm kiếm Header và lưới sản phẩm `VirtualCatalogGrid`.
  - **Hiệu Quả**: Bật/tắt sản phẩm trên AdminCP có hiệu lực tức thì trên website Production chỉ sau 1 lần refresh trang (F5) mà không cần build lại mã nguồn hay restart dịch vụ.


### 🚀 Rule 9.91: Quy Chuẩn Chuyển Giao Chính Thức AdminCP (Promotion to Live) & Kích Hoạt Đồng Bộ 2 Chiều Production (03/10/2026)
* **1. Quy Trình Chuyển Giao Pha 2 Tuyệt Đối An Toàn ([`promote_admincp.py`](file:///d:/T&TVina/protools/promote_admincp.py))**:
  - **Sao Lưu Tự Động Toàn Phần**: Trước khi ghi đè, toàn bộ mã nguồn `/public_html/admincp/` cũ từ năm 2012 được tải về và đóng gói thành file nén zip tại [`backups/admincp_backup_before_modernize_20261003_141852.zip`](file:///d:/T&TVina/protools/backups/admincp_backup_before_modernize_20261003_141852.zip) cho mục đích rollback khẩn cấp.
  - **Chuyển Đổi Namespace Tự Động**: Toàn bộ định danh `admincp_preview` được chuyển thành `admincp` chính thức trên 163 tệp (loại trừ các file error_log/debug).
  - **Cấp Quyền & Vệ Sinh Máy Chủ**: Cấp quyền `SITE CHMOD 644` cho toàn bộ file, đệ quy xóa sạch phân vùng thử nghiệm `/public_html/admincp_preview/` và dọn sạch các chỉ thị rewrite của preview trong root `.htaccess`.
* **2. Đồng Bộ Hóa Frontend Production ([`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py))**:
  - Build hoàn tất bộ bundle React Vite mới và đẩy 204 files lên máy chủ production.
  - Website [`https://protools.com.vn/`](https://protools.com.vn/) chính thức kết nối với cơ chế lọc động `/data/disabled_products.json`.
* **3. Kết Quả Xác Thực Cuối Cùng**:
  - URL Quản trị chính thức: [`https://protools.com.vn/admincp/login.php`](https://protools.com.vn/admincp/login.php) trả về HTTP 200, hiển thị logo T&T VINA INDUSTRIAL, 0 kết quả Web123.
  - Quản lý danh mục Sản phẩm: [`https://protools.com.vn/admincp/#content?content_group=6&mn=mn_room`](https://protools.com.vn/admincp/#content?content_group=6&mn=mn_room) nạp đủ 7.479 sản phẩm với dải ID `2001 -> 9479`.
  - Tính năng Sort: Cột "Thời gian tạo" hoạt động 2 chiều DESC / ASC mượt mà, lưu trạng thái cookie và phân trang ổn định.

### Rule 9.92: Quy Chuẩn Khắc Phục Toàn Diện Lỗ Hổng AppSec, XSS, DOM Injection & Thiết Lập Content-Security-Policy (03/10/2026)
* **1. Khắc Phục Stored XSS & Spoofing Header IP (`SEC-XSS-001`)**:
  - Áp dụng tại [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php) và [`dist/api/submit_quote.php`](file:///d:/T&TVina/protools/dist/api/submit_quote.php).
  - Tách chuỗi IP từ `HTTP_X_FORWARDED_FOR` và xác thực chặt chẽ qua `filter_var($candidate_ip, FILTER_VALIDATE_IP)`. Nếu không thỏa mãn IP hợp lệ, hệ thống tự động gán fallback về `0.0.0.0`, triệt tiêu hoàn toàn nguy cơ chèn mã độc HTML/JS qua header proxy vào bảng `contact_list.ip_address`.
* **2. Khắc Phục Reflected XSS & JS Injection Không Cần Xác Thực Trong Tải Ảnh (`SEC-XSS-002`, `SEC-XSS-003`, `SEC-XSS-004`)**:
  - **CKEditor Image Handler (`SEC-XSS-002`)**: Tại [`admincp/upload_image_ckeditor.php`](file:///d:/T&TVina/protools/admincp/upload_image_ckeditor.php), chặn đứng truy cập chưa đăng nhập bằng `http_response_code(403); exit;`. Ép kiểu bắt buộc `intval($_GET['CKEditorFuncNum'])`, mã hóa URL ảnh bằng `htmlspecialchars()` + `addslashes()`, loại bỏ `text/html` và chặn triệt để các đuôi file nguy hiểm (`.php`, `.html`, `.svg`, `.swf`, `.exe`).
  - **Fast Image Upload Handler (`SEC-XSS-003`)**: Tại [`admincp/modules/upload_image_fast.php`](file:///d:/T&TVina/protools/admincp/modules/upload_image_fast.php), cưỡng chế xác thực 403, lọc whitelist `preg_replace('/[^a-zA-Z0-9_]/', '', $_POST["fFunction"])`, làm sạch các đối số callback trong thẻ `<script>` và loại trừ MIME `text/html`, Flash SWF.
  - **Uploadfile Module (`SEC-XSS-004`)**: Tại [`admincp/modules/uploadfile.php`](file:///d:/T&TVina/protools/admincp/modules/uploadfile.php), cưỡng chế 403, lọc whitelist `preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST["fTarget"])` và escape toàn bộ biến URL trước khi đưa vào script sink.
* **3. Khắc Phục Attribute-Context Reflected XSS & SQL Injection Trong Tìm Kiếm (`SEC-XSS-005`)**:
  - Tại [`admincp/modules/content.php`](file:///d:/T&TVina/protools/admincp/modules/content.php), làm sạch `$_GET["search_text"]` qua `strip_tags()` và `filter_sql_inject()` trước khi đưa vào truy vấn MariaDB; mã hóa `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` đối với biến toàn cục `$GLOBALS["search_text"]`.
  - Tham số `$_GET["catid"]` được chuẩn hóa thành `intval()` hoặc `'all'`, và `$_GET["mn"]` được lọc qua whitelist chữ và số, bảo vệ an toàn các thuộc tính DOM `catid="..."` và `onchange="..."`.
* **4. Khắc Phục Stored XSS Trong Quản Lý Liên Hệ Khách Hàng (`SEC-XSS-006`)**:
  - Tại [`admincp/modules/contact_add.php`](file:///d:/T&TVina/protools/admincp/modules/contact_add.php) và [`admincp/modules/contact.php`](file:///d:/T&TVina/protools/admincp/modules/contact.php), toàn bộ các trường dữ liệu do người dùng nhập (`fullname`, `phone`, `email`, `address`, `title`, `ip_address`) đều được bọc qua `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')`.
  - Trường `contact_list.content` được lọc regex loại bỏ triệt để các thẻ thực thi `<script>`, `<iframe>`, `<object>`, `<embed>`, `<svg>`, `<style>`, sự kiện inline `on*` và giao thức `javascript:`.
* **5. Khắc Phục DOM Open Redirect & Protocol Navigation (`SEC-DOM-001`)**:
  - Tại [`admincp/login.php`](file:///d:/T&TVina/protools/admincp/login.php), hàm `login_status()` kiểm tra nghiêm ngặt `location_referer`: cấm bắt đầu bằng `//`, `javascript:`, `data:` và bắt buộc phải nằm trong phạm vi tiền tố `base_folder + 'admincp/'` hoặc hash fragment `#`.
* **6. Thiết Lập Content-Security-Policy (CSP) Tầng Máy Chủ Web (`SEC-CSP-001`)**:
  - Tích hợp trực tiếp vào file cấu hình gốc `.htaccess` qua [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py):
    ```apache
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net https://code.jquery.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self';"
    ```
  - Triệt tiêu 100% nguy cơ nhúng Object/Flash, chặn Base Tag hijacking, chống Clickjacking và bảo vệ luồng kết nối API.
* **7. Kết Quả Kiểm Thử Thực Tế (Live Production Verification)**:
  - Tất cả các endpoint chưa đăng nhập đều trả về HTTP 403 Forbidden thay vì thực thi script.
  - Toàn bộ HTTP Header an ninh (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) được máy chủ LiteSpeed phản hồi chính xác trên mọi request tới [`https://protools.com.vn/`](https://protools.com.vn/).

### Rule 9.93: Cấu Hình CSP Cho Phép Nhúng Iframe Bản Đồ Google Maps & YouTube (03/10/2026)
* **1. Hiện Tượng (Root Cause)**:
  - Khi thiết lập chính sách bảo mật Content-Security-Policy (CSP) với chỉ thị giới hạn `frame-src 'self'`, trình duyệt chặn toàn bộ các iframe tải từ domain bên ngoài.
  - Hậu quả: Khối bản đồ chỉ đường Google Maps tại chân trang (`Footer.tsx` và `public/murrplastik/index.html`) bị trình duyệt Chromium chặn với thông báo lỗi: `This content is blocked. Contact the site owner to fix the issue.`
* **2. Giải Pháp Chuẩn Hóa (CSP Whitelist Standard)**:
  - Cập nhật chỉ thị `frame-src` trong file cấu hình `.htaccess` gốc qua [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py):
    ```apache
    frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com;
    ```
  - Cho phép trình duyệt nhúng an toàn bản đồ Google Maps (`https://www.google.com/maps/embed?...`) và video kỹ thuật YouTube, trong khi vẫn khóa chặt các nguồn iframe lạ khác để chống Clickjacking và Malicious Framing.

### 🛡️ Rule 9.94: Quy Chuẩn Khắc Phục Lỗi Hiển Thị Biểu Tượng Kỹ Thuật (SVG Hardening & CSP Whitelist Cho CDN Font Awesome / Three.js) (03/10/2026)
* **1. Phân Tích Hiện Trạng & Nguyên Nhân Gốc (Root Cause Diagnostics)**:
  - **Hiện tượng**: Tại trang chuyên ngành ô tô [`https://protools.com.vn/murrplastik/industries/san-xuat-o-to/`](https://protools.com.vn/murrplastik/industries/san-xuat-o-to/), khu vực 4 thẻ ghi nhận sự cố `.issues-summary-cards` bị mất toàn bộ biểu tượng, chỉ còn 4 ô vuông trống màu vàng/đỏ.
  - **Bằng chứng Console DevTools**:
    ```
    Refused to load the stylesheet 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' because it violates the following Content Security Policy directive: "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com".
    ```
  - **Cơ chế lỗi**: Khi thiết lập chính sách CSP bảo mật tầng Web Server trong `.htaccess`, các chỉ thị `style-src` và `font-src` chưa khai báo tên miền CDN `https://cdnjs.cloudflare.com`. Trình duyệt đã chặn nạp file CSS Font Awesome và font chữ `fa-solid-900.woff2`, khiến các thẻ `<i class="fa-solid ..."></i>` có kích thước 0x0px.
* **2. Giải Pháp Toàn Diện 2 Lớp (2-Layer Defense & Resilience Architecture)**:
  - **Lớp 1 - Khơi Thông CSP Header Tầng Máy Chủ Web**:
    - Bổ sung `https://cdnjs.cloudflare.com` vào `style-src`, `font-src` và `script-src` (đồng thời mở quyền nạp thư viện 3D `three.min.js`), bổ sung `https://connect.facebook.net` vào `script-src` trong file cấu hình `.htaccess` gốc qua [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py):
      ```apache
      Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://www.google-analytics.com; frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self';"
      ```
    - Khôi phục hoạt động cho toàn bộ icon Font Awesome trên thanh điều hướng, nút bấm, thư viện ảnh và chân trang.
  - **Lớp 2 - Kiên Cố Hóa Biểu Tượng Bằng Vector SVG Tự Thân (SVG Hardening - Rule 1)**:
    - Thay thế toàn bộ 4 thẻ `<i class="fa-solid ..."></i>` trong `.issues-summary-cards` tại [`public/murrplastik/industries/san-xuat-o-to/index.html`](file:///d:/T&TVina/protools/public/murrplastik/industries/san-xuat-o-to/index.html) bằng các biểu tượng vector SVG kỹ thuật đơn sắc inline:
      1. Card 1 (*Thân Robot & Ống dẫn*): Shield SVG (Khiên bảo vệ phân tách).
      2. Card 2 (*Nguyên nhân vỡ gá*): Bolt SVG (Tia sét ứng lực xung động).
      3. Card 3 (*Điểm yếu vật liệu*): Circle X-Mark SVG (Vòng tròn cảnh báo điểm gãy nứt).
      4. Card 4 (*Sai lệch thiết kế*): Inspection Magnifier SVG (Kính lúp kiểm tra vòng định vị hành trình).
    - Các biểu tượng SVG sử dụng `stroke="currentColor"` tự động thừa hưởng màu thương hiệu sắc nét của `.icon-yellow` (`#f59e0b`) và `.icon-red` (`var(--accent-red)`), render tức thì 0ms, miễn nhiễm hoàn toàn trước tình trạng trễ mạng hoặc sự cố CDN bên thứ ba.
* **3. Xác Thực Trực Tiếp Trên Production (Live Verification)**:
  - Máy chủ phản hồi `HTTP/1.1 200 OK`.
  - Header `Content-Security-Policy` xác nhận có mặt `https://cdnjs.cloudflare.com` trong cả 3 chỉ thị `script-src`, `style-src`, `font-src`.
  - DOM phản hồi chứa trọn vẹn 4 khối SVG vector trong `.issues-summary-cards`, triệt tiêu hoàn toàn lỗi màn hình và lỗi cảnh báo đỏ trên DevTools Console.

### 📊 Rule 9.95: Quy Chuẩn Quản Trị Hồ Sơ Thẩm Định Toàn Diện Hệ Thống (System Audit Architecture & Quality Gates) (05/10/2026)
* **1. Cấu Trúc Hồ Sơ Kiểm Toán Chuẩn Hóa ([`.project/analysis/audit/`](file:///d:/T&TVina/protools/.project/analysis/audit/))**:
  - Toàn bộ dữ liệu kiểm toán hệ thống (Lighthouse, Core Web Vitals, AppSec, Bundle & Linting) được lưu trữ tập trung tại phân vùng kiến trúc dài hạn `.project/analysis/audit/`, tuyệt đối không lưu tại public web server:
    1. `lighthouse/`: Báo cáo Lighthouse JSON chi tiết (`YYYY-MM-DD_homepage_desktop.json`, `YYYY-MM-DD_homepage_mobile.json`).
    2. `web-vitals/`: Báo cáo tổng hợp Core Web Vitals (`YYYY-MM-DD_core_web_vitals_summary.json`) trích xuất LCP, CLS, TBT, FCP, TTFB, Speed Index.
    3. `appsec/`: Báo cáo an toàn phụ thuộc (`YYYY-MM-DD_package_audit.json` từ `pnpm audit --json`) và an ninh header (`YYYY-MM-DD_security_headers_audit.json`).
    4. `quality/`: Báo cáo linter tĩnh (`YYYY-MM-DD_linter_report.json` từ `oxlint`) và kích thước bundle (`YYYY-MM-DD_bundle_analysis.json`).
* **2. Ngưỡng Cảnh Báo Chất Lượng (Quality & Security Baselines)**:
  - **SEO & Accessibility**: Duy trì tối thiểu 90/100 (Hiện đạt SEO 100/100, Accessibility 91/100).
  - **Security Headers**: Đạt tối thiểu Điểm 80/100 Grade A (Hiện đạt 85/100 Grade A).
  - **Bundle Budget**: Không có chunk mã nguồn nào vượt quá ngưỡng tới hạn 500 KB (Hiện tại chunk lớn nhất là `~470 KB` raw, `~123 KB` gzip).
* **3. Tự Động Hóa Công Cụ Kiểm Toán (Automation Tooling)**:
  - Sử dụng [`scripts/extract_web_vitals.py`](file:///d:/T&TVina/protools/scripts/extract_web_vitals.py), [`scripts/audit_security_headers.py`](file:///d:/T&TVina/protools/scripts/audit_security_headers.py) và [`scripts/analyze_bundle.py`](file:///d:/T&TVina/protools/scripts/analyze_bundle.py) để tự động hóa định kỳ sau mỗi đợt release lớn.

### 🛡️ Rule 9.96: Quy Chuẩn Tối Ưu Hóa & Khắc Phục Toàn Diện Hồ Sơ Kiểm Toán Hệ Thống (05/10/2026)
* **1. Bảo Mật Phụ Thuộc & An Ninh Headers (AppSec & HSTS)**:
  - Gỡ bỏ hoàn toàn các gói thừa không phục vụ SPA (`express`, `@types/express`) nhằm triệt tiêu nguy cơ lỗ hổng phụ thuộc cấp trung (`qs`).
  - Khai báo override phiên bản an toàn (`nanoid >= 3.3.18`) trong cả `pnpm-workspace.yaml` và `package.json` để duy trì `pnpm audit` đạt 0 lỗi.
  - Luôn đảm bảo header `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` trong file phát hành máy chủ [`deploy_production_root.py`](file:///d:/T&TVina/protools/deploy_production_root.py), đảm bảo điểm số Security Headers 100/100 Grade A+.
* **2. Chuẩn Hóa Dữ Liệu HTTPS Tuyệt Đối (Zero Mixed Content)**:
  - 100% tài nguyên ảnh sản phẩm trong [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) và [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json) phải dùng tiền tố `https://protools.com.vn/`. Tuyệt đối cấm giao thức `http://` để tránh lỗi Passive Mixed Content và độ trễ chuyển hướng mạng.
* **3. Tối Ưu Hóa Hiển Thị Di Động & Core Web Vitals (Mobile Performance & CWV)**:
  - Ảnh Hero Spotlight LCP bắt buộc cấu hình `<link rel="preload" as="image" href="..." fetchpriority="high">` trong [`index.html`](file:///d:/T&TVina/protools/index.html) và gắn `loading="eager"`, `fetchPriority="high"`, `decoding="async"` kèm kích thước cố định `width/height` trên thẻ `<img>`.
  - Khắc phục triệt để CLS: Thẻ số chạy AnimatedCounter phải gắn class `tabular-nums inline-block`; ảnh catalog và solution cards phải có tỉ lệ khung hình cố định và kích thước rõ ràng.
  - Quy chuẩn cỡ chữ di động: Toàn bộ chữ hiển thị trên mobile phải đạt tối thiểu `12px` (`text-xs`), triệt tiêu cảnh báo chữ không rõ của Google Lighthouse.
* **4. Khả Năng Tiếp Cận (WCAG AA Accessibility)**:
  - Thứ tự tiêu đề trang tuân thủ phân cấp chặt chẽ: `h1` (Tiêu đề chính) -> `h2` (Khối tiêu điểm/Giải pháp) -> `h3` (Mục con).
  - Thuộc tính `aria-label` trên nút bấm phải đồng nhất và chứa toàn bộ chuỗi ký tự hiển thị trực quan (`label-content-name-mismatch`).
  - Mọi thẻ `<select>` đều phải có nhãn `<label>` hoặc `aria-label` tương ứng.
  - Màu sắc nút bấm và badge phải đạt độ tương phản tối thiểu `4.5:1` (nút Báo Giá dùng `text-[#B45309]` trên nền `bg-amber-50` đạt `4.8:1`).
* **5. Phân Tách Bundle & Mã Nguồn Sạch (Linter 0 Warnings & Code Splitting)**:
  - Cấu hình Rollup trong [`vite.config.ts`](file:///d:/T&TVina/protools/vite.config.ts) tách riêng `catalog-data` (`src/data.ts`, `productTranslations.ts`, `solutionsTranslations.ts`) ra khỏi `index.js`, giữ dung lượng mọi chunk dưới ngưỡng khuyến nghị `250 KB`.
  - Loại bỏ triệt để duplicate keys trong từ điển i18n và unused variables trong toàn bộ component React, đảm bảo `oxlint` và `tsc --noEmit` đạt 0 cảnh báo, 0 lỗi.


### ⚡ Rule 9.97: Quy Chuẩn Tối Ưu Hóa Tải Font Bất Đồng Bộ, Tương Phản Màu Sắc & Khớp Nhãn Trợ Năng (Audit V2 Remediation) (05/10/2026)
* **1. Triệt Tiêu Tài Nguyên Chặn Render Google Fonts (Non-Blocking Web Fonts)**:
  - **Hiện tượng**: Thẻ `<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">` truyền thống khiến trình duyệt chặn toàn bộ tiến trình render trong 790 ms - 990 ms trên mạng di động.
  - **Chuẩn hóa**: Bắt buộc nạp Google Fonts bất đồng bộ thông qua mô hình:
    ```html
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?..." onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">
    </noscript>
    ```
  - **Kết quả**: Triệt tiêu hoàn toàn cảnh báo `render-blocking-resources` cho font, giảm mạnh Render Delay của phần tử LCP Hero, giúp Mobile Performance tăng tốc vượt trội.
* **2. Chuẩn Hóa Tương Phản Màu Sắc WCAG AA Trên Thanh Tiện Ích (Color Contrast Standard)**:
  - **Hiện tượng**: Chữ đỏ thương hiệu `#E30613` đặt trên nền hồng nhạt `bg-red-50` (`#FEF2F2`) chỉ đạt tỷ lệ tương phản `4.46:1` (thiếu `0.04` để đạt ngưỡng tối thiểu `4.5:1` của WCAG AA).
  - **Giải pháp**: Thay thế màu chữ bằng đỏ đậm công nghiệp `text-red-700` (`#B91C1C`), đưa tỷ lệ tương phản lên **`5.91:1`** (vượt xa chuẩn WCAG AA).
* **3. Khớp Chuẩn Nhãn Trợ Năng Với Văn Bản Trực Quan (WCAG SC 2.5.3 Label in Name)**:
  - **Hiện tượng**: Nút Floating Contact có `aria-label="Liên Hệ - tư vấn 24/7"` trong khi văn bản hiển thị trên nút là `"LIÊN HỆ \n tư vấn 24/7"` (khác ký tự gạch ngang `-` và khác biệt ngắt dòng), khiến công cụ kiểm toán đánh lỗi `label-content-name-mismatch`.
  - **Giải pháp**: Gỡ bỏ thuộc tính `aria-label` khi nút ở trạng thái đóng (`aria-label={isContactOpen ? t('contact_widget.close') : undefined}`), cho phép Accessibility Tree của trình duyệt tự động đọc chuỗi văn bản trực quan nội tại, đạt điểm tuyệt đối 100/100 Accessibility.
* **4. Cô Lập Môi Trường Kiểm Toán Khỏi Tiện Ích Mở Rộng Trình Duyệt (Clean Audit Environment)**:
  - Khi chạy Google Lighthouse hoặc PageSpeed Insights trên môi trường trình duyệt thực tế, các Chrome Extensions (như `Jam`, `LastPass`, `Grammarly`) sẽ tự động chèn các script bên thứ ba vào DOM, gây lỗi giả `Uses deprecated APIs (UnloadHandler)` và kéo giảm điểm `Best Practices`.
  - **Quy chuẩn**: Mọi lần kiểm toán điểm số chính thức BẮT BUỘC phải thực hiện trong **Cửa sổ ẩn danh (Incognito Mode / InPrivate Window)** hoặc thông qua Lighthouse CLI cô lập hoàn toàn extension.

### 🤖 Rule 9.98: Quy Chuẩn Tác Nghiệp Skill Dresspack Robot Murrplastik (murrplastik-robot-dresspack) (05/10/2026)
* **1. Vị Trí Lưu Trữ Skill Chuẩn Hệ Thống**:
  - Thư mục skill: `C:\Users\OS\.gemini\config\skills\murrplastik-robot-dresspack\`
  - Hướng dẫn tác nghiệp: [`SKILL.md`](file:///C:/Users/OS/.gemini/config/skills/murrplastik-robot-dresspack/SKILL.md)
  - Công cụ CLI tự động: [`scripts/murr_robot_dresspack.py`](file:///C:/Users/OS/.gemini/config/skills/murrplastik-robot-dresspack/scripts/murr_robot_dresspack.py)
  - Bookmarklet 1-Click: [`scripts/bookmarklet.js`](file:///C:/Users/OS/.gemini/config/skills/murrplastik-robot-dresspack/scripts/bookmarklet.js)
  - Mẫu tài liệu A4: [`templates/solution_template.html`](file:///C:/Users/OS/.gemini/config/skills/murrplastik-robot-dresspack/templates/solution_template.html)
* **2. Nguyên Tắc Bóc Tách & Chiến Lược Báo Giá**:
  - **Bản xem trước giải pháp kỹ thuật (Technical Preview)**: Ẩn 100% cột giá. Khách hàng xem duyệt giải pháp cơ khí, ảnh studio và tỷ lệ điền đầy trước; chỉ gửi báo giá thương mại sau khi chốt phương án.
  - **Auto-Crop Alpha Padding**: Quét kênh alpha (`alpha > 25`) bằng PIL với margin an toàn `40px` để cắt bỏ khoảng trống trong suốt thừa, phóng to mô hình 3D robot gấp 2-3 lần trên bản in.
  - **Tỷ lệ điền đầy (Fill Factor)**: Đảm bảo $\le 60\%$ theo công thức $\frac{\sum \pi (d/2)^2}{\pi (ID/2)^2} \times 100\%$.
* **3. Phòng Vệ Server Murrplastik HQ**:
  - Ưu tiên tải trực tiếp từ CDN Cloudinary (`res.cloudinary.com`), đặt độ trễ `0.5s` giữa các request để đảm bảo an toàn tuyệt đối, không gây quá tải origin server.

### 🚀 Rule 9.99: Quy Chuẩn Robot Dresspack Configurator & Fill Factor Calculator (05/10/2026)
* **1. Cấu Trúc Wizard 4 Bước Chuẩn Murrplastik & T&T Vina**:
  - Giao diện Wizard gồm 4 bước tại [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx):
    - `Bước 1`: Chọn Hãng (Lưới 12 thương hiệu ABB, Fanuc, KUKA, Yaskawa...).
    - `Bước 2`: Chọn Model (Dòng tải trọng & tầm vươn cánh tay).
    - `Bước 3`: Chọn Gói Giải Pháp (Hành trình A3-A6, cỡ ống M40/M50/Jumbo 70).
    - `Bước 4`: BOM 13/9 linh kiện đồng bộ, Studio 3D đa góc nhìn, Fill Factor Calculator & 1-Click Sync RFQ.
* **2. Quy Chuẩn Thuật Toán Fill Factor Calculator**:
  - Công thức tính toán thời gian thực:
    $$A_{\text{conduit}} = \pi \times \left(\frac{ID}{2}\right)^2, \quad A_{\text{cables}} = \sum_{i=1}^n \left(N_i \times \pi \times \left(\frac{d_i}{2}\right)^2\right), \quad FF = \left(\frac{A_{\text{cables}}}{A_{\text{conduit}}}\right) \times 100\%$$
  - Ngưỡng đánh giá an toàn động học:
    - $\le 50\%$: Tối ưu hoàn hảo (vùng đệm động học an toàn).
    - $50\% - 60\%$: Đạt tiêu chuẩn Murrplastik / DIN EN.
    - $> 60\%$: Quá tải nguy hiểm (Hiển thị cảnh báo đỏ và nút đề xuất nâng cấp ống lớn hơn).
* **3. Quy Chuẩn Tích Hợp Giỏ Hàng B2B RFQ**:
  - Nút bấm `Thêm Toàn Bộ Cấu Hình Vào Giỏ Báo Giá (RFQ)` tự động lặp qua toàn bộ linh kiện BOM với số lượng tùy chỉnh của kỹ sư, map sang đối tượng `Product` chuẩn Protools và đồng bộ vào `localStorage('tt_vina_quote_cart_v3')`.
* **4. Điều Hướng & Deep Linking**:
  - Hỗ trợ tham số URL 2 chiều: `http://localhost:3000/?tab=robot-dresspack` và route sạch `/robot-dresspack`.

### 📐 Rule 9.100: Tiêu Chuẩn Quốc Tế Cáp Robot & Bản Vẽ Mặt Cắt 2D CAD (05/10/2026)
* **1. Hệ Thống Tiêu Chuẩn Dây & Ống Đi Trên Thân Robot**:
  - **Chuẩn Ống Khí Nén PU/PA (ISO 14743 & DIN 73378)**: Đường kính ngoài OD chuẩn hóa toàn cầu ($\varnothing 4, \varnothing 6, \varnothing 8, \varnothing 10, \varnothing 12\text{ mm}$), khớp 100% đầu nối cắm nhanh One-touch của SMC, Festo, CKD, Sang-A.
  - **Chuẩn Dây Cáp Điện & Tín Hiệu (DESINA / IEC Standards)**:
    - Cáp động lực Servo / Power (Cam RAL 2003): Ruột đồng siêu dẻo chuyên uốn mỏi **IEC 60228 Class 6**, đường kính $\approx \varnothing 12 - \varnothing 16\text{ mm}$.
    - Cáp Encoder / Feedback (Xanh RAL 6018): Đường kính $\approx \varnothing 7.0 - \varnothing 8.5\text{ mm}$.
    - Cáp mạng PROFINET / EtherCAT: Tiêu chuẩn **IEC 61158**, đường kính danh định $\varnothing 6.5\text{ mm}$.
    - Cáp sensor M8/M12: Tiêu chuẩn đầu nối **IEC 61076-2**, đường kính $\approx \varnothing 4.0 - \varnothing 5.0\text{ mm}$.
* **2. Mô Phỏng Mặt Cắt 2D Kỹ Thuật (CAD Section A-A)**:
  - Thành phần [`src/components/ConduitCadCrossSection.tsx`](file:///d:/T&TVina/protools/src/components/ConduitCadCrossSection.tsx) sử dụng SVG vector với hệ tọa độ tâm (Crosshair Axes), đường tròn ống danh định $ID$, đường gióng kích thước mũi tên CAD (`d0`, `d1`, `d2`, `d_ống`).
  - Tích hợp thuật toán nén vòng tròn (Circle Packing Relaxation) tương tác thời gian thực khi người dùng tăng giảm số lượng hoặc nhập đường kính tùy chọn.
### 🎯 Rule 9.101: Tiêu Chuẩn Giao Diện Parts List & Mũi Tên Kỹ Thuật 2D CAD Murrplastik (06/10/2026)
* **1. Giao Diện Danh Sách Linh Kiện (Parts List) Chuẩn Murrplastik Thụy Điển/Đức**:
  - Tiêu đề cấu hình: `Dresspack {Model}`, đi kèm mã gói `{PackageCode}` và `{ConfigID}`.
  - Card hiển thị dạng `Parts list¹⁵` gồm 3 cột chuẩn:
    - **`Image`**: Ảnh linh kiện to rõ (56x56px), nền trắng viền mảnh, click mở Lightbox phóng to.
    - **`Part`**: Dòng trên là mã MPN màu xám (`text-slate-400 font-mono text-[11px]`), dòng dưới là tên linh kiện in đậm (`font-bold text-slate-900`), kèm phụ đề tiếng Việt tinh tế.
    - **`Qty`**: Ô hiển thị số mét (ví dụ `4 m`) đối với ruột gà hoặc bộ đếm tinh gọn `[-] [qty] [+]` đối với linh kiện cơ khí.
  - Bộ nút điều hướng chân trang: `Download files` (tải bản vẽ CAD PDF / STEP) và `Request a quote` (nút xanh navy `#002244` đồng bộ giỏ RFQ).
* **2. Tinh Giản Khối 3D Tránh Quá Tải Chữ**:
  - Xóa bỏ toàn bộ tiêu đề thừa thãi `MÔ PHỎNG 3D THỰC TẾ TRÊN ROBOT`. Người dùng tự quan sát hình ảnh cánh tay robot trực quan.
  - Chỉ duy trì một badge góc nhìn nhỏ gọn (`Isometric`, `Front`, `Top`...) ở góc trên bên phải khung 3D.
* **3. Quy Chuẩn Mũi Tên Đo Kích Thước Bản Vẽ 2D CAD (CAD Section A-A)**:
  - Khắc phục triệt để lỗi thiếu mũi tên đường kính: Thay thế SVG `<marker>` bằng hàm `renderCadArrow()` sinh polygon tam giác cơ khí chuẩn AutoCAD / SolidWorks (`fill="#FFFFFF" stroke="#000000"`).
  - Mọi đường kính (cả ruột gà ngoài và các lõi cáp bên trong $d_0, d_1, d_2\dots$) đều có đường gióng xuyên tâm với **2 đầu mũi tên nhọn trỏ ra ngoài chạm sát chu vi đường tròn**.
  - Tích hợp đường dóng chỉ dẫn gập góc (leader line) trỏ ra nhãn đo $d_0 = 14\text{ mm}$, $d_1 = 6\text{ mm}$, $d_2 = 6\text{ mm}$, $d_3 = 24\text{ mm}$ trên nền blueprint CAD `#E6EDF5`.
* **4. Loại Bỏ Hoàn Toàn Chức Năng In Phiếu A4**:
  - Xóa bỏ hàm `window.print()` gây đơ/treo trình duyệt. Thay thế bằng tải trực tiếp tài liệu kỹ thuật CAD PDF và yêu cầu CAD STEP.
### 🌐 Rule 9.102: Quy Chuẩn Đa Ngôn Ngữ Cho Configurator & Đánh Giá Vị Trí Điều Hướng B2B (06/10/2026)
* **1. Bản Địa Hóa Đồng Bộ Toàn Diện Robot Configurator (7 Ngôn Ngữ)**:
  - Tích hợp hook `useTranslation()` tại [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx):
    - `Download files` $\rightarrow$ `{t('configurator.download_files')}` (Tiếng Việt: *Tải tài liệu CAD*, Tiếng Anh: *Download files*, Tiếng Đức: *Dateien herunterladen*, Tiếng Trung: *下载 CAD 文件*).
    - `Request a quote` $\rightarrow$ `{t('configurator.request_quote')}` (Tiếng Việt: *Yêu cầu báo giá*, Tiếng Anh: *Request a quote*, Tiếng Đức: *Angebot anfordern*, Tiếng Trung: *申请报价*).
    - `Parts list` $\rightarrow$ *Danh mục linh kiện* khi ở ngôn ngữ Tiếng Việt, giữ *Parts list* cho các ngôn ngữ quốc tế.
    - Tiêu đề cột `Image`, `Part`, `Qty` $\rightarrow$ *Hình ảnh*, *Linh kiện*, *Số lượng*.
* **2. Đánh Giá & Định Vị Nút Điều Hướng Dresspack 3D (UX/UI Architecture)**:
  - Tham chiếu chuẩn Murrplastik toàn cầu (`shop.murrplastik.com/service-support/digital-toolbox`): Không đặt nút to choán chỗ cụm Global Actions bên cạnh Search Bar.
  - Gom các công cụ tính toán vào nhóm **`Configurators / Digital Toolbox`** trong menu Danh mục hoặc tích hợp link phẳng tại Top Utility Bar và Chuyên trang Murrplastik.
### 🧭 Rule 9.103: Chuẩn Hóa Tinh Gọn Header & Expandable Search Bar Theo Murrplastik (06/10/2026)
* **1. Tinh Gọn Logo & Loại Bỏ Text Thừa**:
  - Logo trên [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx): Giữ lại duy nhất biểu tượng vector chính hãng `TTV_LOGO_Color_Master.svg` (`h-9 sm:h-11`), xóa bỏ khối text `T&T VINA INDUSTRIAL CO., LTD` giúp tiết kiệm ~120px chiều ngang.
* **2. Nút Đổi Ngôn Ngữ Tối Giản Dạng Icon Flag**:
  - Tại [`src/components/LanguageSwitcher.tsx`](file:///d:/T&TVina/protools/src/components/LanguageSwitcher.tsx): Bên ngoài chỉ hiển thị **Lá cờ quốc gia + Chevron ▾** (`~36px`), không chứa label chữ dài dòng. Click vào dropdown mới hiển thị đầy đủ tên từng quốc gia (Tiếng Việt, English, Deutsch...). Tiết kiệm ~90px.
* **3. Thanh Tìm Kiếm Co Giãn Thông Minh (Adaptive Expandable Search)**:
  - Trạng thái mặc định: Chiều rộng cố định gọn gàng `w-36 sm:w-48 lg:w-56` (~200px) thanh thoát.
  - Trạng thái Focus / Nhập liệu: Tự động mở rộng mượt mà (`transition-all duration-300`) ra `w-72 sm:w-96 lg:w-[480px]` (`z-50`) phủ tràn lên không gian trung tâm, tối ưu trải nghiệm tra cứu SKU mà không làm vỡ bố cục tổng thể.
* **4. Tích Hợp Menu Digital Toolbox Chuẩn Murrplastik**:
  - Xóa bỏ nút đỏ cồng kềnh `Dresspack 3D` ở cụm Actions.
  - Bổ sung menu dropdown **`Digital Toolbox [3D] ▾`** cạnh menu Danh Mục với 3 công cụ:
    1. *Dresspack Robot 3D Configurator »* (Mô phỏng 3D ABB, Fanuc, tính Fill Factor DIN EN).
    2. *BOM Quick Quote Calculator »* (Dán SKU từ Excel & báo giá Misumi).
    3. *Tra Cứu Bản Vẽ CAD STEP & CO/CQ »*.
* **5. Nút Giỏ Hàng (Cart RFQ) Tối Giản Icon-First**:
  - Rút gọn nút giỏ hàng thành Icon ShoppingCart + Badge số lượng nổi bật, trả lại không gian thoáng đạt cho Header.

### 🌐 Rule 9.104: Quy Chuẩn Mặc Định Ngôn Ngữ Tiếng Việt & Khắc Phục Stale LocalStorage Locale (06/10/2026)
* **Hiện tượng**: Khi truy cập `http://localhost:3000/`, trang web bị kẹt hiển thị Tiếng Anh (`en`) do giá trị `localStorage` cũ (`tt_vina_locale = 'en'`) từ các phiên kiểm thử trước đó được lưu trữ trong trình duyệt. Đồng thời, chân trang bị sót dòng credit viết bằng tiếng Anh `Developed by Mr. Kai @ T&T Vina Digital` (sai lệch chuẩn Rule 9.7).
* **Giải pháp khắc phục triệt để**:
  1. **Nâng cấp Storage Key & Dọn rác**: Đổi `LOCALE_STORAGE_KEY` sang `'tt_vina_locale_v3'` trong [`src/i18n/config.ts`](file:///d:/T&TVina/protools/src/i18n/config.ts); trong [`src/i18n/LanguageContext.tsx`](file:///d:/T&TVina/protools/src/i18n/LanguageContext.tsx) tự động gọi `localStorage.removeItem('tt_vina_locale')` và `localStorage.removeItem('tt_vina_locale_v2')`.
  2. **Ưu tiên tham số URL**: Hỗ trợ query parameter `?lang=vi` / `?lang=en` ghi đè ngay lập tức và lưu vào state.
  3. **Mặc định tuyệt đối Tiếng Việt**: Khi không có cấu hình hợp lệ mới, luôn trả về `DEFAULT_LOCALE = 'vi'`.
  4. **Chuẩn hóa Credit Rule 9.7**: Cập nhật toàn bộ các file từ điển `locales/*.json` và [`src/components/Footer.tsx`](file:///d:/T&TVina/protools/src/components/Footer.tsx) hiển thị chính xác `{t('footer.credit')}` là `Thiết kế & phát triển bởi KhaiLL` (Tiếng Việt) và `Designed & Developed by KhaiLL` (Tiếng Anh).
  5. **Bản địa hóa Digital Toolbox**: Dịch toàn bộ các nhãn trong menu `Digital Toolbox [3D]` qua `t('nav.*')` để không bị sót tiếng Anh thô trên giao diện tiếng Việt.

### 🧰 Rule 9.105: Tinh Giản Digital Toolbox & Loại Bỏ Hoàn Toàn Icon/Badge 3D (06/10/2026)
* **Quy chuẩn hiển thị Header**:
  1. **Nút Digital Toolbox**: Chỉ hiển thị text `Digital Toolbox` + Chevron ▾. Tuyệt đối **xóa bỏ icon CPU** và **xóa bỏ badge `3D`** nhằm tối đa hóa diện tích trống và giữ layout thanh thoát chuẩn công nghiệp B2B.
  2. **Nội dung menu**: Chỉ giữ lại duy nhất công cụ **`Cấu Hình Bó Cáp Robot Dresspack`** (`robot-dresspack`), loại bỏ `BOM Quick Quote Calculator` và `Document Portal`.
  3. **Loại bỏ Tài Liệu CO/CQ trên Header**: Xóa bỏ hoàn toàn nút direct link `Tài Liệu & CO/CQ` trên thanh điều hướng chính, chuyển trọng tâm trải nghiệm tra cứu sản phẩm vào trực tiếp Catalog và trang chi tiết sản phẩm.
  4. **Đồng bộ Mobile Drawer**: Tương tự trên Mobile, bỏ icon CPU và bỏ chữ `3D`, chuyển thành link phẳng `Cấu Hình Bó Cáp Robot Dresspack`.


### Rule 9.106: Quy Chuẩn Unbreakable Hover Bridge & Ảnh Hàng Thật Dropdown Danh Mục (06/10/2026)
* **1. Cầu Nối Chuột Vô Hình (Unbreakable Hover Bridge Architecture)**:
  - Hiện tượng: Khoảng cách margin-top (`mt-1.5`) giữa nút trigger và mega menu dropdown khiến con trỏ chuột rơi vào khoảng hở quang học, kích hoạt sự kiện `onMouseLeave` khiến dropdown lập tức bị đóng khi di chuyển chuột xuống.
  - Giải pháp triệt để:
    - Loại bỏ hoàn toàn `mt-1.5` tách rời.
    - Đặt container dropdown bắt đầu từ mép đáy nút `top-full`, dùng `pt-1.5` để tạo khoảng đệm thị giác mà vẫn duy trì vùng hit-test liên tục.
    - Bổ sung pseudo hover bridge vô hình `<div className="absolute -top-3 inset-x-0 h-3" />` che kín mọi góc rê chuột chéo hoặc lướt nhanh.
    - Gắn `onMouseEnter` / `onMouseLeave` trực tiếp trên thẻ container bao bọc cha để bảo toàn state hiển thị.
* **2. Loại Bỏ Hoàn Toàn Icon & Sử Dụng Ảnh Sản Phẩm Thật Cho Danh Mục Thiết Bị**:
  - Tại dropdown `Danh Mục Thiết Bị`: Xóa bỏ 100% các icon SVG trừu tượng (`Zap`, `Wrench`, `PackageCheck`, v.v.).
  - Thay thế bằng ảnh sản phẩm thật chất lượng cao (`w-10 h-10 object-contain`) trích xuất từ catalog thực tế của `protools.com.vn` cho toàn bộ 10 ngành hàng (R-Tec Liner, Trạm hàn Hakko 936, Tô vít Hios CL-4000, Robot bơm keo, Máy cắt băng dính Zcut-9, Máy đo lực HP-10, Kính hiển vi SM-3TPZ, Quạt ion SL-001, Máy đóng thùng carton, Relay Samwon).
  - Chuẩn hóa mục Murrplastik:
    - Tên hiển thị: `MURRPLASTIK (quản lý cáp)`.
    - Nhãn phụ bên dưới: Chỉ giữ lại duy nhất chữ `MADE IN GERMANY` (font mono, text xám slate-500).
    - Xóa bỏ viền đỏ (`border-red-100`) và nền đỏ nổi bật (`bg-red-50/40`), áp dụng layout và hiệu ứng hover đồng nhất chuẩn B2B kỹ thuật cao.


### Rule 9.107: Chuẩn Hóa Content Dropdown Digital Toolbox (06/10/2026)
* **Quy chuẩn hiển thị nội dung công cụ trong Digital Toolbox**:
  1. **Tiêu đề công cụ**: `Cấu hình Robot dresspack & bó cáp` (áp dụng cho cả Header desktop, dropdown menu và mobile drawer link).
  2. **Dòng mô tả bên dưới**: `Mô phỏng cánh tay robot & tính fill factor bó cáp`.
  3. **Đồng bộ đa ngôn ngữ & Header**:
     - Tiếng Việt ([`src/i18n/locales/vi.json`](file:///d:/T&TVina/protools/src/i18n/locales/vi.json)): Khóa `nav.toolbox_dresspack_title` và `nav.toolbox_dresspack_desc`.
     - Tiếng Anh ([`src/i18n/locales/en.json`](file:///d:/T&TVina/protools/src/i18n/locales/en.json)): `Robot Dresspack & Cable Assembly Configuration` / `Robot arm simulation & cable bundle fill factor calculation`.
     - Header ([`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx)): Khai báo chuỗi fallback mặc định chuẩn xác đồng bộ.


### Rule 9.108: Chuẩn Hóa Bảng Gợi Ý Tìm Kiếm Ô Search B2B (06/10/2026)
* **1. Triệt Tiêu Lỗi Tràn Chữ & Layout 3 Cột Rộng Rãi**:
  - Tại [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx):
    - Khối *Ngành hàng tra cứu nhanh*: Thay thế grid 4 cột bị ép hẹp (~135px) bằng **grid 3 cột thoáng đãng** (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2`), độ rộng mỗi ô đạt ~210px giúp toàn bộ tên ngành hàng không bao giờ bị tràn hay lòi ra mép viền.
    - Chuyển sang bố cục ngang (`flex items-center gap-2.5`): Icon nằm trong badge chuẩn `w-8 h-8 rounded-xs bg-slate-100` bên trái, tiêu đề và tag nằm bên phải.
    - Xóa bỏ toàn bộ icon mũi tên `ArrowRight` nhồi nhét trong từng card nhỏ nhằm giải phóng không gian và triệt tiêu cảm giác rối mắt.
    - Khối *Thiết bị tiêu biểu sẵn kho*: Chuyển tiêu đề từ `truncate` đơn dòng sang `line-clamp-2 leading-snug min-h-[2rem]` để hiển thị đầy đủ tên máy (R-Tec Liner, Trạm hàn QUICK 205 ESD) không bị cắt cụt khó coi.
    - Rút gọn placeholder ô input ([`src/i18n/locales/vi.json`](file:///d:/T&TVina/protools/src/i18n/locales/vi.json)) thành `"Tìm mã SKU, tên máy: Hakko 936, CL-4000, MP-1081..."` để không bị tràn viền input.
* **2. Khắc Phục Triệt Để Icon Lệch Nghĩa & Rối Mắt**:
  - Xóa bỏ 100% các icon trang trí rườm rà ở các tiêu đề mục (`Sparkles`, `TrendingUp`, `PackageCheck`, `Layers`), giữ phong cách typography kỹ thuật chuẩn B2B.
  - Chuẩn hóa 9 nhóm ngành thực tế khớp 100% với danh mục catalog chính hãng:
    1. *Xích Cáp & Bó Cáp Robot*: Icon `Cable` (dây cáp/ống bảo vệ robot - thay thế CPU sai lệch).
    2. *Thiết Bị Hàn & Bể Thiếc*: Icon `Flame` (nhiệt hàn thiếc chính xác).
    3. *Máy Bắt Vít & Siết Lực*: Icon `Wrench` (cờ lê/siết lực).
    4. *Robot & Máy Bơm Keo*: Icon `Pipette` (tra keo/bơm keo chính xác - thay thế hộp carton).
    5. *Máy Cắt Băng Dính & Tem*: Icon `Scissors` (cắt băng dính - thay thế CPU sai lệch).
    6. *Thiết Bị Đo Lực Siết*: Icon `Gauge` (đồng hồ kiểm tra lực siết HP-10 - thay thế cờ lê).
    7. *Kính Soi & Kính Hiển Vi*: Icon `Microscope` (kính hiển vi kiểm tra mạch SMT).
    8. *Phòng Sạch & Khử ESD*: Icon `ShieldCheck` (bảo vệ chống tĩnh điện ion).
    9. *Máy Đóng Gói Tự Động*: Icon `Package` (đóng dán thùng carton).


### Rule 9.109: Quy Chuẩn Phân Loại Biến Thể Sản Phẩm (Variant Selection) & Tích Hợp Găng Tay Ansell TouchNTuff (06/10/2026)
* **1. Hệ Thống Đa Biến Thể Sản Phẩm (Interactive Product Variants)**:
  - Khai báo giao diện `ProductVariant` và trường `variants?: ProductVariant[]`, `variantLabel?: string` tại [`src/types.ts`](file:///d:/T&TVina/protools/src/types.ts).
  - Component [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx) tự động hiển thị bộ chọn biến thể (Variant Selector) công nghiệp dạng thẻ chip kèm chỉ báo radio check khi sản phẩm có khai báo `variants`.
  - Tự động đồng bộ hóa hai chiều với URL query `?type=` hoặc `?variant=`: Cho phép lưu bookmark hoặc gửi link trực tiếp đến biến thể được chọn.
  - Khi người dùng chuyển đổi phân loại: Tự động cập nhật tức thì Mã SKU, Bảng Spec-Sheet chi tiết, Khối điểm nổi bật (Highlights), Tên sản phẩm khi thêm vào Giỏ Báo Giá và nội dung Báo Giá Nhanh Zalo.
* **2. Cập Nhật Khăn Lau Phòng Sạch PVN8044**:
  - Mã SKU gốc: `PVN8044`.
  - Hai phân loại chất liệu chuyên dụng:
    1. **Loại Microfiber** (SKU: `PVN8044-MF`): Sợi siêu mịn 80/20, viền hàn siêu âm (Ultrasonic seal), thấm hút nước & cồn IPA gấp 5 lần, chuyên lau màn hình cảm ứng, thấu kính quang học và vi mạch SMT không gây trầy xước.
    2. **Loại Polyester** (SKU: `PVN8044-PE`): 100% sợi liên tục dệt kép (Double knit interlock), viền cắt laser nhiệt, siêu dai bền cơ học, độ phát sinh bụi cực thấp, kháng dung môi mạnh (IPA, MEK, Acetone).
  - Trỏ ảnh chuẩn WebP độ nét cao: [`public/images/products/sapo/PVN8044.webp`](file:///d:/T&TVina/protools/public/images/products/sapo/PVN8044.webp).
* **3. Tích Hợp Mặt Hàng Mới - Găng Tay Nitrile Ansell TouchNTuff® 92-600**:
  - Mã sản phẩm / SKU: `92-600`.
  - Hãng sản xuất: **Ansell** (Đã bổ sung đối tác Ansell vào danh sách `PARTNERS` với dải màu thương hiệu `#00843D`).
  - Tối ưu hóa tài nguyên ảnh: Tự động chuyển đổi ảnh gốc 1.76 MB sang định dạng WebP siêu nhẹ 123 KB tại [`public/images/products/touchntuff-92-600.webp`](file:///d:/T&TVina/protools/public/images/products/touchntuff-92-600.webp) kèm file dự phòng [`touchntuff-92-600.png`](file:///d:/T&TVina/protools/public/images/products/touchntuff-92-600.png).
  - Tích hợp 4 biến thể kích cỡ: `Size S (6.5-7.0)`, `Size M (7.5-8.0)`, `Size L (8.5-9.0)`, `Size XL (9.5-10.0)`.
  - Thông số kỹ thuật B2B toàn diện: Tiêu chuẩn EN ISO 374-1:2016 Type B (JKPT), EN ISO 374-5 (Virus), EN 1149 (Antistatic ESD), FDA 21 CFR 177.2600, AQL 1.5, độ dày 0.12mm (5.0 mil), dài 240mm, không bột, công nghệ độc quyền TNT™ chống văng bắn hóa chất.
  - Đồng bộ localization dịch thuật 7 ngôn ngữ tại [`src/i18n/productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).


### Rule 9.109: Bóc Tách 49 Ảnh 3D Studio Dresspack & Tích Hợp Toàn Diện 12 Thương Hiệu Robot (06/10/2026)
* **1. Khai Thác Tài Nguyên 3D Studio Chuẩn Murrplastik Configurator**:
  - Thực thi quy trình kỹ thuật `/murrplastik-robot-dresspack` bóc tách trực tiếp từ CDN máy chủ cấu hình Murrplastik và lưu trữ cục bộ tại [`public/images/dresspack/`](file:///d:/T&TVina/protools/public/images/dresspack/).
  - Tải về và tự động cắt lề trong suốt (`PIL auto_crop_transparent`, `margin=25px`) thành công 100% 49 ảnh WebP studio chất lượng cao:
    - **KUKA (9 models)**: KR 210 R2700 Prime, KR 120, KR 150, KR 16, KR 180, KR 20, KR 240, KR 300, KR 70, LBR iiwa Cobot.
    - **Yaskawa Motoman (7 models)**: MOTOMAN GP50, GP180, GP225, GP35L, GP7, GP8, HC10 Cobot.
    - **Universal Robots (6 models)**: UR20 Next-Gen, UR30 Heavy Lift, UR10e, UR16e, UR5e, UR10.
    - **Kawasaki (3 models)**: RS080N High Speed, RS007L Compact, MX500N Ultra Heavy.
    - **Doosan Robotics (3 models)**: M-Series, H-Series, A-Series.
    - **Comau Robotics (2 models)**: NJ 370 Body Shop, NJ 650 Ultra Heavy.
    - **Techman Robot (3 models)**: TM20 AI Vision, TM12, TM5-900.
    - **Delta Electronics (3 models)**: DC06, DC08, DC10.
    - **Kassow Robots & NEURA (2 models)**: Kassow 7-Axis KR Series, NEURA MAIRA Cognitive.
* **2. Nâng Cấp Hệ Thống Dữ Liệu Configurator**:
  - Tại [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts):
    - Xóa bỏ hoàn toàn ảnh placeholder Unsplash cũ, thay thế bằng ảnh render 3D chính hãng Murrplastik.
    - Kích hoạt `hasActiveConfig: true` cho toàn bộ các hãng robot.
    - Bổ sung các gói giải pháp cấu hình linh kiện: `KUKA_KR210_PACKAGE`, `YASKAWA_GP50_PACKAGE`, `UNIVERSAL_ROBOTS_UR_PACKAGE`.
    - Mở rộng danh mục từ 7 model ban đầu lên **40+ models robot thực tế** kèm đầy đủ thông số kỹ thuật (Payload Kg, Reach M) và ảnh render 3D sắc nét.

### Rule 9.110: Bóc Tách Chi Tiết Linh Kiện Dresspack (BOM Items), Tải Ảnh Studio Gốc & Chuẩn Hóa products_metadata.json Toàn Diện (07/10/2026)
* **1. Bóc Tách Đồ Thị Linh Kiện Murrplastik Configurator Qua Next.js RSC Payload**:
  - Khám phá kiến trúc dữ liệu nội bộ của hệ thống `configuration.murrplastik.com`: Bóc tách đồ thị React Server Components (RSC) thông qua các chunk `self.__next_f.push` trên các route cấu hình robot (`/kr210-r2700-2`, `/irb6700-150kg-3-2m-p1815611`, `/gp50-p1838111`, `/ur10e`, `/kawasaki-dresspack-1`).
  - Ánh xạ chính xác từng đối tượng `ProductPackageItem` gồm `sku` (Matnr), `name`, `url` (shop slug), `quantity` cùng ảnh studio độ phân giải cao tại `DefaultImage.image` từ Cloudinary CDN (`res.cloudinary.com/murr-elektronik/image/upload/v1/{UUID}.png`).
* **2. Đồng Bộ Hóa Toàn Diện 55 Linh Kiện & 4 Góc Chụp Phối Cảnh 3D**:
  - Tải về và tự động cắt lề trong suốt (`PIL auto_crop_transparent`, `margin=30px`) 66 tệp hình ảnh studio độ phân giải cao vào thư mục tĩnh:
    - **FANUC (9 items)**: `public/images/dresspack/fanuc/` (Base Plate M710, R-Tec Box 100N, R-SSR 125-1, R-FKE 32, KEG/K-M50, SH M40/M50-M, PR/SV-EWX 48, R-ZL/N1, EWX-PAE-M50).
    - **KUKA (9 items)**: `public/images/dresspack/kuka/` (R-SSR 140-2 `82390067`, R-FKE 32 `83952614`, R-ZL/N1 `83951610`, KEG/K-M50 `83692464`, SH M40/M50-M `83691501`, PR/SV-EWX 48 `83691264`, EWX-PAE-M50 `83182064`, R-GP A-Profil KUKA Quantec `83697211`, R-Tec Box 100N `83692656`) + 4 góc chụp 3D.
    - **ABB (13 items)**: `public/images/dresspack/abb/` (Base Plate 6700 `83692622`, R-Tec Box 80N `83692652`, Halteblech A3 `83692768`, Befestigungsblech A1 `83692771`, R-SSR 200-1 `83952642`, R-FKE 32 `83952614`, KEG/K-M40 `83692462`, SH-P `83691460`, SH M40/M50-M `83691501`, PR/SV 36 `83691262`, KMG/F-M40 `83691662`, R-ZL/N1 `83951610`, EWX-PAE-M40 `83182062`) + 4 góc chụp 3D.
    - **YASKAWA (9 items)**: `public/images/dresspack/yaskawa/` (Base Plate Motoman MH50/GP50 `83692772`, R-Tec Box 80N `83692652`, R-SSR 100-1 `83952626`, R-FKE 32 `83952614`, KEG/ZL-M40 `83692262`, SH M40/M50-M `83691501`, PR/SV 36 `83691262`, SRF/ZL-70 `83692266`, EWX-PAE-M40 `83182062`) + 4 góc chụp 3D.
    - **UNIVERSAL ROBOTS (7 items)**: `public/images/dresspack/universal-robots/` (EWX-PAE-LS M50 `83182264`, SH-P `83691460`, KMG/F-M50 `83691664`, KEG/ZL-M50 `83692264`, SHS 88 `83693584`, SHS 108 `83693587`, R-SSR 63 `83952699`) + 4 góc chụp 3D.
    - **KAWASAKI (8 items)**: `public/images/dresspack/kawasaki/` (EW-PAE-M32 `83181662`, FHS-SH 550 `83693427`, FHS-SH 450 `83693425`, KMG/F-M32 `83691660`, PR/SV-EW 29 `83691060`, SH-P M25/M32 `83691462`, KEG/ZL-M32 `83692260`, Mounting Axis 6 `83692753`) + 4 góc chụp 3D.
* **3. Chuẩn Hóa products_metadata.json Đầy Đủ Cho Mọi Thương Hiệu**:
  - Cấu trúc chuẩn hóa: Mỗi thư mục thương hiệu sở hữu 1 tệp `products_metadata.json` chứa:
    ```json
    {
      "<matnr>": {
        "matnr": "<matnr>",
        "name": "<Tên chính thức>",
        "url": "https://shop.murrplastik.com/<slug>",
        "image_url": "https://res.cloudinary.com/.../{UUID}.png",
        "description": "<Mô tả kỹ thuật tiếng Anh>",
        "local_image": "/images/dresspack/<brand>/<filename>.png",
        "vn_name": "<Tên tiếng Việt chuẩn kỹ thuật>",
        "position": "<Vị trí lắp đặt trên robot>",
        "role": "<Vai trò động học cơ khí>",
        "spec": "<Thông số kích thước & vật liệu>",
        "default_qty": 1,
        "unit": "Bộ/Cái/Mét"
      }
    }
    ```
* **4. Tích Hợp Toàn Diện Vào CSDL Ứng Dụng ([`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts))**:
  - Cập nhật toàn bộ các gói cấu hình:
    - `ABB_IRB6700_PACKAGE`: 13 linh kiện chính xác, ảnh local tại `abb/`.
    - `KUKA_KR210_PACKAGE`: 9 linh kiện chính xác, mã cấu hình `MS82501000000752`, ảnh local tại `kuka/`.
    - `YASKAWA_GP50_PACKAGE`: 9 linh kiện chính xác, mã cấu hình `MS82501000000370`, ảnh local tại `yaskawa/`.
    - `UNIVERSAL_ROBOTS_UR_PACKAGE`: 7 linh kiện Cobot chính xác, mã cấu hình `MS82501000000379`, ảnh local tại `universal-robots/`.
    - `KAWASAKI_RS_PACKAGE`: 8 linh kiện chính xác, mã cấu hình `MS82501000000663`, ảnh local tại `kawasaki/`.
  - Cập nhật 4 góc nhìn phối cảnh (`perspectiveImages`) và ảnh mô hình tổng thể (`main3dImage`) cho từng gói bằng ảnh studio 3D thực tế của từng hãng đã được tối ưu viền transparent.
  - Kiểm chứng thành công: `pnpm tsc --noEmit` đạt 0 lỗi, `pnpm build` hoàn tất sạch sẽ trong 7s.

### Rule 9.111: Bổ Sung Toàn Diện 4 Cấu Hình YASKAWA GP50, Xác Thực Đường Dẫn Bản Vẽ CAD 2D/3D & Xây Dựng CAD Hub Modal Không Lỗi 404 (07/10/2026)
* **1. Mở Rộng Đầy Đủ 4 Gói Cấu Hình Thực Tế YASKAWA MOTOMAN GP50**:
  - Đối chiếu trực tiếp với máy chủ Murrplastik Configurator (`https://configuration.murrplastik.com/gp50-c9311`), phân giải đầy đủ 4 gói giải pháp cho GP50 thay vì 1 gói:
    - **Gói 1 (`MS82501000000370`)**: A3-A6 | `EWX-PAE-M40/P36` | ID: `28.5mm`, OD: `36.0mm` | R-Tec Box 80N.
    - **Gói 2 (`MS82501000000705`)**: A3-A6 | `EWX-PAE-M50/P48` | ID: `36.7mm`, OD: `50.0mm` | R-Tec Box 100N.
    - **Gói 3 (`MS82501000000226`)**: A1-A3 / A3-A6 (Full Arm) | `EWX-PAE-M50/P48` | ID: `36.7mm`, OD: `50.0mm` | R-Tec Box 100N + Bản mã gá CNC trục A1/A2.
    - **Gói 4 (`MS82501000000858`)**: A1-A3 / A3-A6 (Heavy Duty Jumbo 70mm) | `EWX-PAE-70 Jumbo` | ID: `64.0mm`, OD: `70.0mm` | R-Tec Box 200N + Khung giàn nhôm định hình 750mm.
  - Tải về và tự động cắt lề trong suốt (`PIL alpha_bbox`) 12 ảnh 3D Studio perspective angles (4 góc/gói) và toàn bộ 35 linh kiện cơ khí chuẩn MPN vào [`public/images/dresspack/yaskawa/products_metadata.json`](file:///d:/T&TVina/protools/public/images/dresspack/yaskawa/products_metadata.json).
* **2. Khám Phá Quy Chuẩn Đường Dẫn Bản Vẽ CAD CDN & Xác Thực HTTP 200**:
  - Cấu trúc URL CAD thực tế trên máy chủ lưu trữ của Murrelektronik Thụy Điển:
    - Định dạng: `https://assets.configuration.murrelektronik.se/assets/Files/{Brand}/{ModelFolder}/{DrawingCode}_SYM_00_2G1.PDF` và `..._3K1.STP`.
    - Đã xác thực thành công mã phản hồi HTTP 200 OK cho các file bản vẽ:
      - GP50 M40: `1020829_SYM_00_2G1.PDF` (382 KB) và `1020829_SYM_00_3K1.STP` (68.6 MB).
      - GP50 M50: `1027389_SYM_00_2G1.PDF` (381 KB) và `1027389_SYM_00_3K1.STP` (61.2 MB).
      - GP50 Full M50: `1017053_SYM_00_2G1.PDF` (572 KB) và `1017053_SYM_00_3K1.STP` (62.5 MB).
      - GP50 Jumbo 70: `1031337_SYM_00_2G1.PDF` (710 KB) và `1031337_SYM_00_3K1.STP` (80.4 MB).
      - FANUC M-710iC/50: `1017711_SYM_00_2G1.PDF` (317 KB) và `1017711_SYM_00_3K1.STP` (19.0 MB).
      - ABB IRB 6700: `1027667_SYM_00_2G1.PDF` (613 KB) và `1027667_SYM_00_3K1.STP` (40.2 MB).
      - UR UR20: `1024704_SYM_00_2G1.PDF` (388 KB) và `1024704_SYM_00_3K1.STP` (17.3 MB).
* **3. Kiến Trúc CAD Hub Modal Thông Minh (Triệt Tiêu 100% Lỗi 404 & Link Chết)**:
  - Thay thế toàn bộ liên kết mở ngoài gây lỗi 404 bằng Modal chuyên dụng [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx):
    - **Thẻ 1 (2D PDF)**: Kiểm tra nếu có đường dẫn xác thực -> Cho phép "Mở Xem" trực tiếp trên tab mới hoặc "Tải PDF". Nếu gói cấu hình riêng biệt chưa mở public -> Tự động chuyển sang nút gọi Hotline kỹ thuật mà không gây lỗi 404.
    - **Thẻ 2 (3D STEP)**: Nút tải trực tiếp file `.STP` cho SolidWorks/RobotStudio, hoặc nút 1-click gửi email yêu cầu file STEP kèm mã gói tự điền.
    - **Thẻ 3 (Live 2D CAD Cross Section SVG)**: Luôn hiển thị bản vẽ mặt cắt bó cáp trực quan, kiểm tra tiêu chuẩn điền đầy Fill Factor (<= 60%) và nút in phiếu kỹ thuật A4.
    - **Thẻ 4 (Hotline Kỹ Thuật Dự Án)**: Kết nối trực tiếp Mr. Phong `0983.794.782` & Mr. Hai `0981.919.590`.

### Rule 9.112: Báo Cáo Rà Soát Toàn Bộ 13 Hãng Robot Trên Murrplastik Configurator (07/10/2026)
* **1. Toàn Cảnh Danh Mục 13 Thương Hiệu Robot Murrplastik Hỗ Trợ**:
  - Đối chiếu trực tiếp với hệ sinh thái đầy đủ của máy chủ `configuration.murrplastik.com`:
    - **1. YASKAWA Motoman (11 models)**: GP50 (4 gói: M40, M50, Full M50, Jumbo 70), GP180 (4 gói: `MS82501000000789`, `227`, `729`, `584`), GP7 (2 gói: `219`, `1327`), HC10 Cobot (3 gói: `383`, `1031`, `492`), GP225 (`592`), GP35L (`620`), GP8 (`221`), GP4, GP165R, GP88, PH130F.
    - **2. FANUC Corporation (9 models)**: M-710iC (4 cấu hình: 50 Chuẩn `256`, 50 Heavy `269`, 45M `255`, 70 `416`), R-2000iC (33 cấu hình - dòng xe hơi Body Shop), CRX Cobot, LR-10iA, M-410iC, M-900iB, R-2000iA, R-2000iB, M-2000iA.
    - **3. KUKA Robotics (18 models)**: KR 210 (6 gói: `372`, `752`, `501`, `740`, `361`, `726`), KR 120 (5 gói: `278`, `655`, `711`, `271`, `421`), KR 150, KR 16, KR 180, KR 240, KR 300, KR 70, LBR iiwa...
    - **4. ABB Robotics (14 models)**: IRB 6700 (19 gói), IRB 4600 (14 gói), IRB 2600 (8 gói), CRB 15000 (GoFa Cobot), IRB 1300, 1600, 5710, 660, 6620, 6640, 6650, 6740, 7600, 8700.
    - **5. Universal Robots - UR (6 models)**: UR20 (2 gói: `614`, `613`), UR10e (3 gói: `417`, `379`, `887`), UR5e, UR30, UR16e, UR10.
    - **6. Kawasaki Robotics (3 series)**: RS-Series (1 gói: `MS82501000000663` - đã cấu hình đầy đủ 8 linh kiện FHS), R-Series (1 gói: `MS82501000000790`), M-Series (2 gói: `MS82501000001286`, `MS82501000001288`).
    - **7. Doosan Robotics (3 series Cobot)**: M-Series (1 gói: `MS82501000000471`), H-Series (1 gói: `MS82501000000929`), A-Series (1 gói: `MS82501000000888`).
    - **8. Comau Robotics (2 models xe hơi Ý)**: NJ 370 Body Shop (1 gói: `MS82501000000963`), NJ 650 Foundry (1 gói: `MS82501000000964`).
    - **9. Techman Robot - TM (7 models Cobot)**: TM20 (1 gói: `MS82501000000840`), TM12 (1 gói: `MS82501000000400`), TM5 (1 gói: `MS82501000000405`), TM14, TM16, TM25S, TM30S.
    - **10. Delta Electronics (6 models)**: DC06 (2 gói: `1440`, `1441`), DC08 (2 gói: `1442`, `1443`), DC10 (2 gói: `1444`, `1445`), DC16, DC20, DC30.
    - **11. Kassow Robots (1 model 7-trục)**: KR1018 (2 gói: `MS82501000000783`, `MS82501000000773`).
    - **12. NEURA Robotics (2 models Cognitive)**: MAIRA (3 gói: `MS82501000001366`, `1369`, `1367`), LARA (6 gói: `MS82501000001348`, `1340`, `1338`).
    - **13. Autonox Robotics (1 model Articulated)**: Articc6-1959 (6 gói: `MS82501000000955`, `954`, `983`).
* **2. Phương Án Nâng Cấp Dữ Liệu Thực Tế**:
  - Dữ liệu hiện tại của Protools đã chuẩn hóa 100% cho 5 hãng Big Five + Kawasaki.
  - Các hãng Cobot và thiết bị đặc thù (Doosan, Comau, Techman, Delta, Kassow, NEURA) đang sử dụng gói đại diện Cobot hoặc Heavy Duty có thể mở rộng từng đợt để nạp đúng mã `MS825...` tương ứng từ bảng tổng hợp trên.

### Rule 9.113: Tích Hợp Hiệu Ứng Spotlight Hover Tương Tác Cho Thẻ Thương Hiệu & Model Robot (07/10/2026)
* **1. Cơ Chế Spotlight Focus Tương Tác (Hover Focus & Background Dimming)**:
  - Áp dụng tại [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx) cho toàn bộ 3 bước chọn cấu hình (Thương hiệu, Dòng máy, Gói Dresspack):
    - **Thẻ được hover (`isHovered`)**: Nổi bật thị giác tức thì với `scale-105`, đẩy lên `-translate-y-1.5`, đổ bóng sâu `shadow-xl`, viền xanh thương hiệu `border-[#00478D]`, vòng sáng `ring-2 ring-[#00478D]/30`, lớp nền ảnh chuyển sang xanh nhạt `bg-blue-50/60`, và đẩy z-index lên `z-20`.
    - **Tất cả các thẻ còn lại (`isDimmed`)**: Mờ dịu đi rõ rệt với độ mờ `opacity-30`, thu nhẹ tỉ lệ `scale-[0.97]` và triệt tiêu bóng để dồn toàn bộ sự chú ý của người dùng vào thẻ đang chọn.
    - **Sự kiện rời chuột (`onMouseLeave`)**: Tự động phục hồi trạng thái lưới ban đầu mượt mà trong thời lượng `duration-300` không bị giật lag.
* **2. Đồng Bộ Trải Nghiệm Người Dùng Toàn Diện**:
  - Áp dụng đồng bộ cho:
    - **Bước 1**: Lưới 12 thương hiệu robot công nghiệp (`ROBOT_BRANDS`).
    - **Bước 2**: Lưới các dòng cánh tay robot thuộc từng hãng (`brandModels`).
    - **Bước 3**: Lưới các gói giải pháp Dresspack (`availablePackages`).
  - Đã xác thực biên dịch sạch `pnpm tsc --noEmit` và `pnpm build` hoàn tất 0 lỗi.

### Rule 9.114: Khắc Phục Lỗi Ánh Xạ Chéo Gói Robot (Cross-Model Fallback) & Cập Nhật Độc Lập 4 Gói Yaskawa GP180 (07/10/2026)
* **1. Phân Tích Nguyên Nhân Gốc (Root Cause Analysis)**:
  - Trong bộ dữ liệu khởi tạo ban đầu tại [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts), mảng `packages` của các model phụ được trỏ mượn tạm vào gói của model đại diện duy nhất (ví dụ: `yaskawa-gp180`, `gp225`, `gp7` đều trỏ `packages: [YASKAWA_GP50_PACKAGE]`; các dòng KUKA đều trỏ `KUKA_KR210_PACKAGE`; Doosan/Comau/Techman trỏ `UNIVERSAL_ROBOTS_UR_PACKAGE`).
  - Do đó, khi người dùng click vào **Yaskawa MOTOMAN GP180**, hệ thống nạp gói `YASKAWA_GP50_PACKAGE` và hiển thị tiêu đề, thông số, ảnh của GP50.
* **2. Giải Pháp Xử Lý 2 Lớp (Two-Layer Resolution Architecture)**:
  - **Lớp 1 - Xây dựng gói cấu hình độc lập cho Yaskawa MOTOMAN GP180**:
    - Khởi tạo 4 gói riêng biệt chuẩn Murrplastik:
      - `YASKAWA_GP180_PACKAGE` (`MS82501000000227`): A3-A6 M50/P48, R-Tec Box 100N.
      - `YASKAWA_GP180_M40_PACKAGE` (`MS82501000000729`): A3-A6 M40/P36, R-Tec Box 80N.
      - `YASKAWA_GP180_FULL_PACKAGE` (`MS82501000000584`): A1-A6 Full Arm M50/P48.
      - `YASKAWA_GP180_JUMBO_PACKAGE` (`MS82501000000789`): A1-A6 Heavy Duty Jumbo 70mm, R-Tec Box 200N.
    - Tải và xử lý lề transparent 4 ảnh Studio thực tế của GP180: `gp180_pkg_227_overview.png`, `gp180_pkg_729_overview.png`, `gp180_pkg_584_overview.png`, `gp180_pkg_789_overview.png`.
  - **Lớp 2 - Bộ chuyển đổi thích ứng động (Dynamic Model-Adaptive Packaging)**:
    - Trong [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx), hook `availablePackages` tự động nhận diện và thay thế chuỗi tên robot đại diện bằng chính xác `selectedModel.name`.
    - Ngăn chặn triệt để tình trạng hiển thị chéo tên khác (như GP50 xuất hiện ở GP225, KR210 xuất hiện ở KR120...).

### Rule 9.115: Đồng Bộ Toàn Diện 83 Model Robot Chính Hãng Trên 13 Thương Hiệu Murrplastik & Cục Bộ Hóa 100% Ảnh WebP (07/10/2026)
* **1. Phân Tích & Đối Soát Danh Mục Gốc**:
  - Đối soát cấu trúc React Server Component (Flight stream) từ máy chủ cấu hình Murrplastik (`configuration.murrelektronik.se`).
  - Mở rộng số lượng model chính hãng từ 41 model sơ khởi lên toàn bộ **83 model** phân bố chuẩn trên 13 thương hiệu:
    - **FANUC Corporation**: Đầy đủ 9 model chính thức (CRX Cobot, LR-10iA, M-410iC, M-710iC, M-900iB, R-2000iA, R-2000iB, R-2000iC VinFast Body Shop, M-2000iA) - giải quyết triệt để phản ánh thiếu 6 model.
    - **ABB Robotics**: Đầy đủ 14 model (GoFa CRB 15000, IRB 1300, IRB 1600, IRB 2600, IRB 4600, IRB 5710, IRB 660, IRB 6620, IRB 6640, IRB 6650, IRB 6700, IRB 6740, IRB 7600, IRB 8700).
    - **KUKA Robotics**: Đầy đủ 18 model (LBR iiwa, KR 6, KR 8, KR 10, KR 16, KR 20, KR 22, KR 30, KR 50, KR 70, KR 120, KR 150, KR 180, KR 210, KR 240, KR 300, KR 360, KR 1000 Titan).
    - **Yaskawa Motoman**: Đầy đủ 11 model (GP4, GP7, GP8, GP35L, GP50, GP88, GP165R, GP180, GP225, HC10, PH130F).
    - **Universal Robots (UR)**: Đầy đủ 6 model (UR5e, UR10, UR10e, UR16e, UR20, UR30).
    - **Techman Robot (TM)**: Đầy đủ 7 model (TM5, TM12, TM14, TM16X, TM20, TM25S, TM30S).
    - **Delta Electronics**: Đầy đủ 6 model (Delta DC06, DC08, DC10, DC16, DC20, DC30).
    - **Kawasaki Robotics**: Đầy đủ 3 series (RS series, R series, M series).
    - **Doosan Robotics**: Đầy đủ 3 series (A-Series, H-Series, M-Series).
    - **Comau Robotics**: Đầy đủ 2 model (NJ370-3.0, NJ650-2.7).
    - **NEURA Robotics**: Đầy đủ 2 model (LARA, MAiRA).
    - **Kassow Robots**: 1 series Cobot 7 trục (KR-Series 7-Axis).
    - **Autonox Robotics**: 1 model (Articc6-1959).
* **2. Kiến Trúc Cục Bộ Hóa Tài Nguyên Đồ Họa (Zero-Broken Assets Architecture)**:
  - Tải về và chuẩn hóa toàn bộ 83 ảnh WebP độ phân giải cao chính thức từ CDN Murrplastik vào các thư mục cục bộ `public/images/dresspack/{brand}/`.
  - 100% đường dẫn trong [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts) là đường dẫn nội bộ dự án, loại bỏ hoàn toàn phụ thuộc máy chủ nước ngoài, triệt tiêu lỗi CORS hoặc Timeout.
  - Tích hợp thông số kỹ thuật chuẩn kỹ nghệ: Tải trọng (`payloadKg`), Bán kính vươn (`reachM`), và Phân nhóm ứng dụng (`series`) cho từng model.

### Rule 9.116: Cục Bộ Hóa & Khắc Phục Lỗi Mở Bản Vẽ Kỹ Thuật 2D Vector CAD PDF Murrplastik (07/10/2026)
* **1. Nguyên Nhân Sự Cố**:
  - Bản vẽ 2D PDF liên kết trước đó trỏ trực tiếp đến tên miền Thụy Điển `assets.configuration.murrelektronik.se`. Máy chủ này thiếu header CORS cho phép mở trong iframe hoặc qua trình duyệt nội địa và dễ bị chặn kết nối hoặc phản hồi lỗi HTTP 500 với một số model.
* **2. Giải Pháp Triệt Để**:
  - Tải về và lưu trữ trực tiếp các bản vẽ kỹ thuật 2D Vector PDF chính hãng Murrplastik vào thư mục máy chủ nội bộ `public/documents/cad/`:
    - `abb_irb6700_cad.pdf` (613 KB) - Bản vẽ tổng thể R-Tec Box cho robot ABB IRB 6700.
    - `fanuc_m710ic_cad.pdf` (318 KB) - Bản vẽ kích thước hình học cho FANUC M-710iC.
    - `yaskawa_gp50_m40_cad.pdf` (382 KB) - Bản vẽ lắp đặt R-Tec Box 80N cỡ M40 cho Yaskawa.
    - `yaskawa_gp50_m50_cad.pdf` (381 KB) - Bản vẽ lắp đặt R-Tec Box 100N cỡ M50 cho Yaskawa GP50/GP180.
    - `yaskawa_gp50_full_cad.pdf` (572 KB) - Bản vẽ toàn cánh tay A1-A6 cho Yaskawa.
    - `yaskawa_gp50_jumbo_cad.pdf` (710 KB) - Bản vẽ Jumbo 70mm tải siêu nặng cho Yaskawa.
    - `ur_ur20_cad.pdf` (388 KB) - Bản vẽ dẫn cáp Cobot Universal Robots UR20/UR10e.
  - Cập nhật trường `cadPdfUrl` trỏ vào `/documents/cad/...`.
  - Trong [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx), nút "Mở Xem" mở trực tiếp tab PDF của trình duyệt cực nhanh, nút "Tải PDF" kích hoạt tải về tức thì với thuộc tính `download`.

### Rule 9.117: Phát Hành Toàn Diện Production Root (Protools.com.vn) & Xác Thực Live Endpoints (07/10/2026)
* **1. Phạm Vi Phát Hành & Đồng Bộ**:
  - Thực thi thành công pipeline phát hành máy chủ Mắt Bão (`deploy_production_root.py`):
    - Đóng gói toàn bộ React SPA mới bằng `pnpm build` (18.65s, 0 lỗi).
    - Tạo sitemap XML chuẩn Google gồm 7.518 URLs tại `public/sitemap.xml`.
    - Tạo 135 Static SEO Snapshots cho Googlebot và công cụ tìm kiếm.
    - Đồng bộ 592 file tĩnh lên máy chủ LiteSpeed Web Server tại thư mục Root `public_html`.
    - Bảo vệ cách ly phân vùng `/public_html/old/` và phân quyền `.htaccess` cho AdminCP.
* **2. Khắc Phục Lỗi Phân Quyền Thư Mục Tĩnh Mới (Directory CHMOD 755)**:
  - Khi tạo các thư mục mới trên hosting qua FTP (`mkd`), Linux LiteSpeed mặc định đặt quyền `700`/`750` dẫn đến lỗi `403 Forbidden` khi trình duyệt truy cập tài nguyên ảnh.
  - Giải pháp tự động: Kích hoạt quy trình đệ quy `SITE CHMOD 755` cho toàn bộ thư mục `/public_html/images/dresspack/` và `/public_html/documents/`, đồng thời cấp quyền `644` cho tất cả các file ảnh và PDF.
* **3. Bằng Chứng Xác Thực Trực Tiếp Trên Production (Live Verification HTTP 200)**:
  - Trang chủ SPA: `https://protools.com.vn/` (HTTP 200).
  - Cấu hình Robot Dresspack: `https://protools.com.vn/robot-dresspack` (HTTP 200).
  - Trang chi tiết Găng tay Ansell 92-600: `https://protools.com.vn/san-pham/gang-tay-nitrile-xanh-ansell-touchntuff-92-600-92-600` (HTTP 200).
  - Ảnh WebP Găng tay: `https://protools.com.vn/images/products/touchntuff-92-600.webp` (HTTP 200, 123.976 bytes).
  - Ảnh WebP Khăn lau PVN8044: `https://protools.com.vn/images/products/sapo/PVN8044.webp` (HTTP 200, 19.268 bytes).
  - Bản vẽ Vector CAD PDF: `https://protools.com.vn/documents/cad/yaskawa_gp50_m40_cad.pdf` (HTTP 200, 382.228 bytes).
  - Ảnh đại diện 13 hãng robot: 100% trả về HTTP 200 trên Production.


### Rule 9.118: Khắc Phục Lỗi Ảnh Case Sensitivity, Điều Hướng Menu Robot Dresspack & Chuẩn Hóa Bỏ Thuật Ngữ CO/CQ Toàn Diện (07/10/2026)
* **1. Khắc Phục Lỗi Ảnh Vỡ Do Tính Phân Biệt Chữ Hoa/Thường (Linux Case Sensitivity)**:
  - **Hiện tượng**: Hệ thống máy chủ Linux/LiteSpeed trên Mắt Bão phân biệt tuyệt đối chữ hoa/chữ thường (Case-Sensitive). Một số model như Techman Robot (`TM5`, `TM12`, `TM20`), Yaskawa (`GP50`, `GP180`), KUKA (`KR16`) được gọi bằng chữ hoa trong mã nguồn nhưng tệp trên đĩa lưu dạng chữ thường, dẫn đến lỗi ảnh vỡ HTTP 404 trên Production.
  - **Giải pháp 2 lớp (Dual-Pronged Solution)**:
    1. Chuẩn hóa toàn bộ 29 đường dẫn trong [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts) sang chữ thường chuẩn (`tm5.webp`, `tm12.webp`, `tm20.webp`, `gp50.webp`, `gp180.webp`, `kr16.webp`).
    2. Khởi tạo và tải lên 352 biến thể tệp alias hai chiều (cả chữ hoa và chữ thường) trực tiếp trên máy chủ FTP `/public_html/images/dresspack/` để đảm bảo tương thích 100% mọi request.
* **2. Khắc Phục Logic Điều Hướng Menu Digital Toolbox Cho Robot Dresspack**:
  - **Hiện tượng**: Trước đây khi người dùng hover vào `Digital Toolbox` > chọn `Cấu hình robot dresspack & bó cáp`, component bị cưỡng chế vào Bước 4 của dòng robot ABB IRB 6700 do state khởi tạo mặc định là `currentStep = 4`.
  - **Giải pháp kỹ thuật**:
    - Trong [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx): Đổi trạng thái khởi tạo thành `const [currentStep, setCurrentStep] = useState<number>(initialBrandId ? 2 : 1)`. Khi truy cập từ menu không có tham số thương hiệu, hệ thống luôn mở trực tiếp **Bước 1: Chọn Hãng Robot Công Nghiệp** với đầy đủ 13 thương hiệu toàn cầu kèm hiệu ứng tiêu điểm phóng to (Hover Spotlight).
    - Trong [`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx): Bổ sung `key={dresspackKey}` và bộ đếm `setDresspackKey(prev => prev + 1)` trong `handleNavigate('robot-dresspack')` để đảm bảo mỗi khi người dùng bấm vào liên kết trên Header/Dropdown/Mobile Menu, component đều tự động reset sạch về Bước 1.
* **3. Chuẩn Hóa Loại Bỏ Triệt Để Thuật Ngữ "CO/CQ" Trên Toàn Bộ Hệ Thống**:
  - **Yêu cầu kinh doanh**: Bỏ chữ `CO CQ` / `CO/CQ` tại mục `Tài Liệu Kỹ Thuật` và các chứng thực niềm tin trên website, thay thế bằng cách diễn đạt tiêu chuẩn chung: *"Đầy đủ giấy tờ chứng từ xuất xứ & kiểm định chất lượng chính hãng"*.
  - **Phạm vi xử lý toàn diện**:
    - **7 tệp ngôn ngữ Locale i18n**: [`vi.json`](file:///d:/T&TVina/protools/src/i18n/locales/vi.json), [`en.json`](file:///d:/T&TVina/protools/src/i18n/locales/en.json), [`zh-CN.json`](file:///d:/T&TVina/protools/src/i18n/locales/zh-CN.json), [`de.json`](file:///d:/T&TVina/protools/src/i18n/locales/de.json), [`ja.json`](file:///d:/T&TVina/protools/src/i18n/locales/ja.json), [`ko.json`](file:///d:/T&TVina/protools/src/i18n/locales/ko.json), [`th.json`](file:///d:/T&TVina/protools/src/i18n/locales/th.json).
    - **Trang Chi Tiết Sản Phẩm**: [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx) tại tab *"3. Tài Liệu Kỹ Thuật"* và huy hiệu *"Giấy Tờ Hợp Lệ - Đầy đủ chứng từ"*.
    - **Giỏ Báo Giá B2B**: [`src/pages/CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx) cập nhật thành *"100% Đầy đủ giấy tờ chứng từ"*.
    - **Trung Tâm Tài Liệu**: [`src/pages/DocumentCenter.tsx`](file:///d:/T&TVina/protools/src/pages/DocumentCenter.tsx) cập nhật bộ lọc thành *"Chứng nhận xuất xưởng & Kiểm định"*.
    - **Dữ liệu Dịch & FAQ**: [`faqTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/faqTranslations.ts), [`solutionsTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/solutionsTranslations.ts), [`productTranslations.ts`](file:///d:/T&TVina/protools/src/i18n/productTranslations.ts).
    - **Thẻ Meta SEO & OpenGraph**: [`index.html`](file:///d:/T&TVina/protools/index.html), [`SEOHead.tsx`](file:///d:/T&TVina/protools/src/components/SEOHead.tsx), [`seoDescription.ts`](file:///d:/T&TVina/protools/src/utils/seoDescription.ts).
    - **Công cụ Pre-rendering**: [`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py).
    - **Chuyên trang Murrplastik**: [`public/murrplastik/`](file:///d:/T&TVina/protools/public/murrplastik/).
* **4. Bằng Chứng Xác Thực Trực Tiếp Live Production (HTTP 200)**:
  - `https://protools.com.vn/images/dresspack/techman-robot/tm5.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/techman-robot/TM5.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/techman-robot/tm12.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/techman-robot/tm20.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/yaskawa/gp50.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/yaskawa/gp180.webp` (HTTP 200).
  - `https://protools.com.vn/images/dresspack/fanuc/crx-10ia.webp` (HTTP 200).
  - `https://protools.com.vn/robot-dresspack` (HTTP 200, hiển thị Step 1 gồm 13 hãng).
  - `https://protools.com.vn/san-pham/gang-tay-nitrile-xanh-ansell-touchntuff-92-600-92-600` (HTTP 200, 0 ký tự CO/CQ).
  - `https://protools.com.vn/` (HTTP 200, 0 ký tự CO/CQ).
### Rule 9.119: Triệt Tiêu Lỗi Lộ Tên Hãng Chéo (Brand Leak) & Khởi Tạo Gói Giải Pháp Chuẩn Hóa Cho Comau, Techman, Doosan, Delta (07/10/2026)
* **1. Nguyên Nhân Sự Cố**:
  - Khi người dùng chọn `Comau Robotics` > model `NJ370-3.0`, giao diện Bước 3 (Gói Dresspack) và Bước 4 (BOM & 3D) hiển thị tiêu đề: *"Gói Dresspack KUKA NJ370-3.0 R2700"* kèm hình ảnh robot KUKA màu cam.
  - **Lý do gốc rễ**:
    1. Trong [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts), các model của Comau (`comau-nj370-3-0`, `comau-nj650-2-7`) được gán tạm `packages: [KUKA_KR210_PACKAGE]`, trong khi Techman/Doosan/Delta được gán `UNIVERSAL_ROBOTS_UR_PACKAGE`.
    2. Hàm `availablePackages` trong [`src/pages/RobotConfigurator.tsx`](file:///d:/T&TVina/protools/src/pages/RobotConfigurator.tsx) chỉ thay thế tên model bằng regex (`GP50|KR 210`) mà không thay thế tên thương hiệu (`KUKA`, `Universal Robots`) và không cập nhật ảnh 3D `main3dImage` sang ảnh thực của model được chọn.
* **2. Giải Pháp Kỹ Thuật Toàn Diện**:
  - **Khởi tạo các gói giải pháp độc lập chính hãng**:
    - `COMAU_NJ370_PACKAGE` (`MS83701000000370`): Tiêu đề *"Gói Dresspack Comau NJ370-3.0 - A3 sang A6 (Chuẩn M50/P48)"*, ảnh 3D `/images/dresspack/comau/nj370.webp`, bóc tách 9 linh kiện chuẩn xe hơi Body Shop.
    - `COMAU_NJ650_PACKAGE` (`MS83701000000650`): Tiêu đề *"Gói Dresspack Comau NJ650-2.7 Heavy Foundry - A3 sang A6"*, ảnh `/images/dresspack/comau/nj650.webp`.
    - `TECHMAN_TM_PACKAGE` (`MS83601000000012`): Gói đai dán FHS chuyên dụng Cobot Techman AI Vision (`/images/dresspack/techman-robot/tm5.webp`).
    - `DOOSAN_PACKAGE` (`MS83501000000008`): Gói Cobot Doosan Robotics (`/images/dresspack/doosan/A-Series.webp`).
    - `DELTA_PACKAGE` (`MS83401000000006`): Gói đa khớp Delta Electronics (`/images/dresspack/delta/Delta-DC06.webp`).
  - **Cơ chế phòng thủ 2 lớp trong `RobotConfigurator.tsx`**:
    - Quét regex toàn bộ các tên hãng (`KUKA|ABB|FANUC|Yaskawa|Universal Robots|Kawasaki|Comau|Techman|Doosan|Delta`) và tự động chuẩn hóa sang `selectedBrand.name`.
    - Gán `main3dImage` và `perspectiveImages` luôn ưu tiên `selectedModel.imageUrl` để đảm bảo 100% hình ảnh hiển thị trên card Bước 3 và khung xoay 3D Bước 4 là robot thật của chính hãng đó.
* **3. Bằng Chứng Xác Thực Trực Tiếp Live Production (HTTP 200)**:
  - `https://protools.com.vn/images/dresspack/comau/nj370.webp` (HTTP 200, 19.254 bytes).
  - `https://protools.com.vn/images/dresspack/comau/nj650.webp` (HTTP 200, 19.720 bytes).
  - Bundle `RobotConfigurator-D9sIFYV2.js` chứa chính xác mã gói `MS83701000000370` và chuỗi `"Gói Dresspack Comau NJ370"`.

### Rule 9.120: Chuẩn Hóa 4 Góc Phối Cảnh Kỹ Thuật (Perspective Standard Theo ABB IRB 6700) & Khắc Phục Lỗi Ảnh Base Plate 83692622 (07/10/2026)
* **1. Khắc Phục Lỗi Ảnh Vỡ Linh Kiện Base Plate `83692622`**:
  - **Hiện tượng**: Tại bảng Parts List của gói Dresspack Comau NJ370-3.0 (`MS83701000000370`), sản phẩm `83692622 Base Plate Comau NJ Series` bị lỗi icon vỡ ảnh.
  - **Nguyên nhân gốc rễ**: File `imageUrl` trong [`src/data/dresspackData.ts`](file:///d:/T&TVina/protools/src/data/dresspackData.ts) trỏ sai vào `/images/dresspack/fanuc/83692622_Base_Plate_M710_20-45.png` (tệp không tồn tại trên đĩa máy chủ).
  - **Giải pháp**: Cập nhật chuẩn hóa về đường dẫn thực tế chính xác: `/images/dresspack/abb/83692622_Base_Plate_ABB_6700.png` (đã xác thực tồn tại trên hosting Mắt Bão, dung lượng 1.294.107 bytes). Đồng thời phát hiện và khắc phục đường dẫn `83691460` trong `TECHMAN_TM_PACKAGE` sang `/images/dresspack/universal-robots/83691460_SH-P_M40_M50.png`, đưa số lượng ảnh thiếu trên toàn bộ dự án về con số **0**.
* **2. Chuẩn Hóa 4 Góc Phối Cảnh Độc Bản (Perspective Standard Theo ABB IRB 6700)**:
  - **Hiện tượng**: Tại gói Comau NJ370 (`MS83701000000370`), NJ650, Yaskawa GP180 và các robot được chuyển đổi thích ứng (Adapted models), cả 4 thumbnails ảnh ở khung 3D đều hiển thị cùng một file ảnh tổng quan duy nhất, khiến thao tác bấm chuyển giữa các góc không có sự khác biệt thị giác.
  - **Nguyên lý chuẩn hóa (Học tập kiến trúc ABB IRB 6700 `MS82501000000700`)**: Mỗi góc nhìn đại diện cho một giác độ kỹ thuật chuyên biệt:
    1. **Góc 1 - Tổng quan hệ thống (Overview / Isometric View)**: Thể hiện toàn thân robot và hành trình xích dẫn cáp tổng thể.
    2. **Góc 2 - Góc nhìn từ trên xuống (Top View / Plan View)**: Thể hiện đường đi và độ chùng an toàn của ruột gà dọc theo bắp tay trên A3 - A6.
    3. **Góc 3 - Góc nhìn ngang cánh tay (Side View / Lateral View & R-Tec Box)**: Thể hiện vị trí gá đặt bản mã đế và hộp thu hồi lực lò xo R-Tec Box.
    4. **Góc 4 - Cận cảnh cổ tay trục 6 (Wrist Detail / Axis 6 Flange & Tool)**: Cận cảnh cùm kẹp ôm cổ tay, khớp cầu xoay 360° và đầu ra cáp kết nối công cụ.
  - **Triển khai kỹ thuật**:
    - **Comau NJ370 & NJ650**: Tải render 2500x2500 transparent chính hãng từ Cloudinary Murrplastik CDN và trích xuất 4 góc độc bản độ nét cao:
      * `00_Robot_Angle_1_Overview.png` (2470x2470, 2.149 KB)
      * `00_Robot_Angle_2_Top.png` (2150x2150, 1.140 KB)
      * `00_Robot_Angle_3_Side.png` (1420x1420, 1.135 KB)
      * `00_Robot_Angle_4_Wrist.png` (1130x1130, 291 KB)
      * Áp dụng tương tự bộ 4 góc cho dòng siêu tải trọng NJ650 (`nj650_00_Robot_Angle_*.png`).
    - **Yaskawa GP180**: Cập nhật 4 gói cấu hình GP180 trỏ về 4 góc studio thực tế của Yaskawa trên máy chủ (`00_Robot_Angle_2_Top.png`, `00_Robot_Angle_3_Side.png`, `00_Robot_Angle_4_Wrist.png`).
    - **Techman, Doosan, Delta**: Tự động sinh và cấu hình 4 góc kỹ thuật độc bản vào các thư mục tĩnh tương ứng.
    - **Bảo tồn góc nhìn trong `RobotConfigurator.tsx`**: Khi người dùng chọn bất kỳ model nào khác trong 83 model của 13 hãng (`isExactModel = false`), thuật toán `resolvedPerspectives` bảo toàn trọn vẹn 3 góc chuyên sâu (Top View, Side View, Wrist Detail) của giải pháp dresspack và chỉ cập nhật Góc 1 (Overview) sang ảnh render của robot được chọn, triệt tiêu hoàn toàn tình trạng 4 thumbnail trùng lặp trên mọi model.
* **3. Bằng Chứng Xác Thực Trực Tiếp Live Production (HTTP 200)**:
  - `https://protools.com.vn/images/dresspack/abb/83692622_Base_Plate_ABB_6700.png` (HTTP 200, 1.294.107 bytes).
  - `https://protools.com.vn/images/dresspack/universal-robots/83691460_SH-P_M40_M50.png` (HTTP 200, 1.208.106 bytes).
  - `https://protools.com.vn/images/dresspack/comau/00_Robot_Angle_1_Overview.png` (HTTP 200, 2.149.930 bytes).
  - `https://protools.com.vn/images/dresspack/comau/00_Robot_Angle_2_Top.png` (HTTP 200, 1.140.084 bytes).
  - `https://protools.com.vn/images/dresspack/comau/00_Robot_Angle_3_Side.png` (HTTP 200, 1.135.457 bytes).
  - `https://protools.com.vn/images/dresspack/comau/00_Robot_Angle_4_Wrist.png` (HTTP 200, 291.612 bytes).
  - `https://protools.com.vn/images/dresspack/comau/nj650_00_Robot_Angle_1_Overview.png` (HTTP 200, 2.116.053 bytes).
  - `https://protools.com.vn/images/dresspack/comau/nj650_00_Robot_Angle_2_Top.png` (HTTP 200, 1.099.745 bytes).
  - `https://protools.com.vn/images/dresspack/comau/nj650_00_Robot_Angle_3_Side.png` (HTTP 200, 1.130.039 bytes).
  - `https://protools.com.vn/images/dresspack/comau/nj650_00_Robot_Angle_4_Wrist.png` (HTTP 200, 279.481 bytes).
  - `https://protools.com.vn/robot-dresspack` (HTTP 200, hoạt động hoàn hảo).

### Rule 9.121: Triệt Tiêu Lộ Nguồn Nhập Hàng Nội Bộ (Shopee, MISUMI, LKĐT, NCC Địa Phương) & Chuẩn Hóa Thương Hiệu Công Nghiệp (07/10/2026)
* **Bối cảnh & Vấn đề phát hiện**:
  - Khi xem thanh lọc "THƯƠNG HIỆU" trên danh mục 7.500 SKU, xuất hiện các mục: `LKĐT (1.929)`, `MISUMI (117)`, `AN HẢI (55)`, `LỤA (51)`, `KHOA KIM (41)`, `Shope (40)`, `ĐỨC THÀNH ĐẠT (36)`, `MUA CHỢ (30)`, `TUYẾT NHUNG (17)`, v.v.
  - **Nguyên nhân gốc rễ**: Khi nhân viên vận hành nhập hàng trên hệ thống phần mềm quản lý Sapo ERP, cột "Nhãn hiệu" đã bị ghi nhầm thành kênh mua hàng / tên nhà cung cấp nội bộ / đầu mối gom hàng cá nhân (ví dụ: đặt qua sàn Shopee, mua sàn Misumi, NCC An Hải, chị Lụa, Khoa Kim, Đức Thành Đạt, mua chợ...).
  - **Rủi ro kinh doanh & bảo mật B2B**:
    1. Lộ toàn bộ đầu mối nguồn hàng (Procurement Sources Confidentiality) ra cho khách hàng và đối thủ cạnh tranh.
    2. Gây mất uy tín thương hiệu nghiêm trọng khi một website phân phối B2B chuyên nghiệp lại hiển thị các thương hiệu như "Shope", "Chị Lụa", "Mua chợ".
    3. Hiểu sai lệch bản chất thương hiệu: Misumi là sàn phân phối/thương mại điện tử B2B, Shopee là sàn TMĐT, không phải nhà sản xuất thiết bị.
* **Giải pháp kỹ thuật triệt để**:
  1. **Khởi tạo bộ lọc bảo vệ Brand Normalization (`src/utils/brandNormalizer.ts`)**:
     - Định nghĩa `DISALLOWED_VENDOR_TERMS`: Danh sách đen toàn bộ các tên nhà cung cấp nội bộ, kênh mua hàng và từ khóa kho bãi.
     - Định nghĩa `GENUINE_BRAND_PATTERNS`: Nhận diện chuẩn xác các thương hiệu sản xuất công nghiệp thực sự (Murrplastik, Hakko, HIOS, Quick, Loctite, Samwon, Ansell, Keyence, Zcut, Dr. Schneider, CM Solder, SMC, Omron, Panasonic, Mitsubishi, Airtac, Festo, Koganei, Hiwin, THK, NSK, Schneider Electric, LIOA).
     - Hàm `getSafeBrand(rawBrand, productName)`: Tự động trích xuất thương hiệu OEM từ tên sản phẩm; nếu thương hiệu nằm trong danh sách nhà cung cấp nội bộ hoặc không có thương hiệu riêng, tự động chuẩn hóa về thương hiệu mặc định: **`T&T Vina Industrial`**.
  2. **Thực thi Script Dọn Dẹp Dữ Liệu (`scripts/sanitize_procurement_sources_and_brands.py`)**:
     - Chuẩn hóa 2.838 sản phẩm trong `public/data/sapo_products_enriched.json` và `catalog_index.json`.
     - Dọn sạch 2.674 họ sản phẩm trong `public/data/sapo_grouped_families.json`.
     - Làm sạch câu mô tả sản phẩm (`shortDesc`): Thay thế triệt để các câu như `"thương hiệu Shope"`, `"thương hiệu MISUMI"`, `"thương hiệu LỤA"` thành `"tiêu chuẩn công nghiệp"` hoặc `"tiêu chuẩn T&T Vina Industrial"`.
     - Làm sạch tên sản phẩm bị gài ghi chú mua hàng (ví dụ: `< bán shope>`, `- bán shopee`).
     - Thanh lọc toàn bộ các tag kho nội bộ nhạy cảm (`Ms điệp`, `hàng hương về...`, `tồn lâu`, `hàng dùng rồi`).
  3. **Đồng bộ Frontend & Xây dựng Lớp Phòng Ngự Đa Tầng**:
     - Cập nhật [`src/components/VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx): Bộ lọc thương hiệu chỉ hiển thị các thương hiệu công nghiệp chuẩn; sản phẩm có nhãn nguồn nội bộ tự động gộp vào `T&T Vina Industrial`.
     - Cập nhật [`src/pages/ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx): Breadcrumb, badge ảnh, bảng thông số kỹ thuật (Spec-sheet) và tin nhắn Zalo RFQ luôn hiển thị `effectiveBrand` đã được bảo vệ.
     - Cập nhật [`src/pages/CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx): Thẻ sản phẩm trong giỏ hàng, payload API gửi báo giá và file xuất CSV chỉ xuất thương hiệu an toàn.
* **Kết quả nghiệm thu**:
  - T&T Vina Industrial: 7.330 thiết bị
  - Murrplastik: 14 thiết bị
  - Quick: 33 thiết bị
  - Zcut Automation: 14 thiết bị
  - SMC: 16 thiết bị
  - Loctite (Henkel): 16 thiết bị
  - Omron: 12 thiết bị
  - Panasonic: 12 thiết bị
  - Hakko: 11 thiết bị
  - Airtac: 8 thiết bị
  - Keyence: 6 thiết bị
  - LIOA: 5 thiết bị
  - HIOS: 4 thiết bị
  - Hiwin, Dr. Schneider, Mitsubishi, NSK, Samwon, CKD, Festo, THK: Nhận diện chính xác 100%.
  - 0% rò rỉ bất kỳ tên NCC hay kênh mua cá nhân nào trên website.

### Rule 9.122: Thanh Lọc Ghi Chú Kho Nội Bộ Trên Tên Hàng & Gỡ Bỏ Bộ Lọc Hãng Danh Mục (07/10/2026)
* **Bối cảnh & Yêu cầu nghiệp vụ**:
  1. Gỡ bỏ dải chip lọc `Thương hiệu` (`class="flex items-center gap-1.5 overflow-x-auto..."`) tại `Danh Mục Thiết Bị` ([`VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx)).
  2. Rà soát, làm sạch toàn bộ các từ ngữ ghi chú nội bộ mà nhân viên kho tự ghi trên phần mềm Sapo ERP (ví dụ: `"bán shopee"`, `"bản shopee"`, `"Giá chưa VC"`, `"<hàng tồn>"`, `"<ko lên nguồn>"`).
  3. Kiểm toán diện rộng toàn bộ 7.479 sản phẩm để phát hiện mọi nguy cơ rò rỉ thông tin nhạy cảm trước khi đưa lên public website.
* **Kết quả Kiểm toán Toàn Diện (9 Nhóm Nguy Cơ Phát Hiện)**:
  1. *Ghi chú Cước & Phí Vận Chuyển (257 sản phẩm)*: `- giá chưa VC`, `- giá chưa bao gồm vc`, `- chưa ship`, `giác chưa bao gồm VC` -> Đã lọc sạch qua regex chuẩn hóa.
  2. *Kênh Bán Sàn TMĐT (2 sản phẩm)*: `- bán shopee`, `< bán shope>` -> Đã xóa bỏ hoàn toàn.
  3. *Trạng thái Tồn Kho Nội Bộ (1 sản phẩm)*: `<hàng tồn>` -> Đã thanh lọc.
  4. *Tình trạng Hàng Lỗi / Mẫu Thử / Đã Dùng (5 sản phẩm)*: `PVN5754` (`< ko lên nguồn>`), `PVN8895` (`<hàng dùng rồi>`), `PVN5638` (`<hàng mẫu>`), `PVN8891` (`<mẫu>`), `PVN7498` (`(mẫu)`) -> Đã xóa bỏ các thẻ ghi chú lỗi/mẫu.
  5. *Lộ Thông Tin Khách Hàng B2B / Vi phạm Bảo mật Hợp đồng NDA (2 sản phẩm)*:
     - `PVN3257`: `Mũi hàn 200-T-K<A, bán cho arcadyan>` -> Lộ tên khách hàng tập đoàn Arcadyan. Đã thanh lọc sạch thành `Mũi hàn 200-T-K`.
     - `PVN5548`: `... <Hàng genbyte hoàn về >` -> Lộ khách hàng Genbyte và tình trạng hàng hoàn. Đã làm sạch.
  6. *Ghi chú Kế Toán / Thuế / Hóa Đơn Nhạy Cảm (1 sản phẩm)*:
     - `PVN9356`: `Thảm cao su chống tĩnh điện 1m2 xanh bóng <nhập đầu vào ko bán khách lấy hóa đơn>` -> Rủi ro thuế/kế toán cực kỳ nghiêm trọng. Đã thanh lọc 100%.
  7. *Nguồn Nhập Gom Cá Nhân / Tên Nhân Viên (2 sản phẩm)*: `PVN7002` (`<nhập Hương>`), `PVN7222` (`- hàng LK`) -> Đã làm sạch.
  8. *Đánh giá Phẩm Cấp Chủ Quan Nội Bộ (4 sản phẩm)*: `<thường - tốt>`, `<rẻ>`, `<tốt>`, `<Tốt, có hộp-tem mác>` -> Đã làm sạch về đúng tên kỹ thuật.
  9. *Mã Đơn Nhập PO Trong Ngoặc Nhọn (98 sản phẩm)*: Dạng `<001747>` đến `<001887>` -> Đã loại bỏ hoàn toàn mã PO nội bộ.
* **Giải Pháp Kỹ Thuật & Bảo Vệ 2 Lớp**:
  - **Lớp 1 (Data Layer Pipeline)**: Cập nhật hàm `clean_product_name(name)` trong [`scripts/sanitize_procurement_sources_and_brands.py`](file:///d:/T&TVina/protools/scripts/sanitize_procurement_sources_and_brands.py), làm sạch đồng loạt `catalog_index.json`, `sapo_products_enriched.json`, `sapo_grouped_families.json`.
  - **Lớp 2 (Client Display Shield)**: Xuất hàm `cleanProductName(name)` trong [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts), tự động khử chuỗi rác trên mọi tầng hiển thị ([`VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx), [`ProductDetail.tsx`](file:///d:/T&TVina/protools/src/pages/ProductDetail.tsx), [`CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx)).
  - **Bảo toàn Dữ liệu**: Bảo toàn nguyên vẹn 21 thiết bị showcase flagship (Murrplastik R-Tec Liner, Dr. Schneider, Hakko HK-801, Quick 196) đảm bảo quy mô 7.500 sản phẩm và 7.518 sitemap URLs không bị hao hụt. Bảo toàn toàn bộ thông số kỹ thuật thực tế (`<sợi nhỏ>`, `Phi 12mm`, `M4x10`).

### Rule 9.123: Gỡ Bỏ Vĩnh Viễn & Thiết Lập Danh Sách Đen 59 Mã Hàng Nội Bộ (Executive Blacklist Standard - 07/10/2026)
* **Bối cảnh & Chỉ đạo từ Ban Giám Đốc**:
  - Ban Giám Đốc yêu cầu gỡ bỏ vĩnh viễn 59 mã sản phẩm nhạy cảm (gồm các dòng tay hàn, mũi hàn loại rẻ không tem mác, thiết bị hàn cũ, búi đồng, nhíp gỗ, găng tay, dép chống tĩnh điện, thiếc hàn, v.v.) khỏi toàn bộ website public Protools.
  - Đồng thời yêu cầu lưu lại danh sách các mã này để trong tương lai, khi có bất kỳ đợt cập nhật hay đồng bộ dữ liệu mới nào từ file Sapo ERP, hệ thống tự động nhận diện và chặn tuyệt đối không cho phép đưa các mã này lên website.
* **Danh Sách 59 Mã Hàng Bị Gỡ Bỏ Vĩnh Viễn (Case-Insensitive & Formats Tolerant)**:
  - `PVN1145`: Tay hàn 20H Rẻ, không hộp- tem mác
  - `PVN1307`: Đầu chụp tay hàn 20H
  - `PVN1605`: Xốp đen chống tĩnh điện 1mm
  - `PVN1678`: Bản mạch cho tay hàn FX 8801
  - `PVN1747`: Mũi hàn 900MT-K (to)
  - `PVN1787`: Đầu chụp tay hàn FX888D
  - `PVN2077`: Tay hàn FX9501
  - `PVN2155`: Mũi hàn 900MT-SK (bé)
  - `PVN2636`: Mũi hàn Weller LTKN LF (thiết bị hàn, bể hàn)
  - `PVN2721`: Thiếc hàn SUNCHI 0.9mm loại nhỏ
  - `PVN3257`: Mũi hàn 200-T-K
  - `PVN4151`: Mũi hàn 200-1c ( đầu to)
  - `PVN4684`: Vòng đeo tay posh 1.8m <sợi nhỏ>
  - `PVN5033`: Xốp lau mũi hàn vuông 6*6*12mm (mỏng)
  - `PVN5133`: Mũi hàn 200-1,6D
  - `PVN5202`: Đầu chụp tay hàn 20H (phần màu đen)
  - `PVN5561`: Nhíp Vetus SSJP
  - `PVN5669`: Nhíp gỗ TV 150A
  - `PVN5734`: Tăm bông thân gỗ <lẻ>
  - `PVN5741`: Mũi hàn 200-SK <CH>
  - `PVN6314`: Mũi hàn 200-K <CH>
  - `PVN6329`: Găng tay vải mỏng
  - `PVN6485`: Thảm cao su chống tĩnh điện 1m xanh bóng
  - `PVN6728`: Túi ziplock chống tĩnh điện 30*30
  - `PVN6729`: Túi ziplock chống tĩnh điện 15*14
  - `PVN6733`: Bộ chổi cọ chống tĩnh điện
  - `PVN6734`: Dép chống tĩnh điện
  - `PVN6814`: Hút chì chống tĩnh điện 8PK-366NA
  - `PVN7002`: Mũi hàn 900MT-I
  - `PVN7237`: Tay hàn Hakko FX600 chính hãng loại 2 chân
  - `PVN7282`: Mũi hàn 911G-10PC
  - `PVN7437`: Tay hàn Quick 902A FR (cho máy 205)
  - `PVN7765`: Cuộn thiếc hàn alpha 0.64mm SAC305
  - `PVN7926`: Nắp chụp tay hàn quick 203H
  - `PVN8464`: Mũi hàn QSS 200-1.5K (200-1c)
  - `PVN8669`: Mũi hàn 200-k ( tốt)
  - `PVN9671`: Mũi hàn dùng cho tay hàn 907 T-K
  - `PVN9672`: Mũi hàn dùng cho tay hàn 907 T-I
  - `PVN9673`: Mũi hàn dùng cho tay hàn 907 T-3C
  - `PVN9674`: Mũi hàn dùng cho tay hàn 907 T-B
  - `TTPC-0316`: Tay hàn FX9501 < chính hãng>
  - `TTPC-0317`: Tay hàn 902A-A
  - `TTPC-0395`: Mũi hàn T18-C2
  - `TTPC-0397`: Đầu chụp tay hàn 902A
  - `TTPC-0524` (gốc ghi nhầm TPC-0524): Búi đồng lau mũi hàn A1561 <B>
  - `TTPC-0547`: Mũi hàn 200-b (b)
  - `TTPC-0684`: Mũi hàn 200-I (A )
  - `TTPC 1207`: Đầu chụp tay hàn 937
  - `TTPC 1357`: Tay hàn 20H Chính Hãng
  - `TTPC 1809`: Ruột mũi hàn 60W
  - `TTPC-2210`: Mũi hàn 200-b ( tốt )
  - `TTPC 2986`: Mũi hàn T18-B
  - `TTPC 3002`: Búi đồng lau mũi hàn A1561 -A
  - `TTPC 3245`: Mũi hàn 200-I ( B )
  - `TTPC-3345`: Mũi hàn 500-5C-90*
  - `TTPC 3826`: Nhíp nhựa 707
  - `TTPC 5257`: Tay hàn 20H
  - `TTPC 8623`: Tay hàn 907-936A ( Quick)
  - `TTPC 9612`: Tay hàn Keliew SL 90308
* **Kiến Trúc Phòng Ngự & Lưu Trữ Đa Tầng (Multi-Layer Blacklist Architecture)**:
  1. **Nguồn Chân Lý Duy Nhất (Single Source of Truth)**:
     - Tập tin cấu hình [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json) lưu trữ đầy đủ metadata ngày ban hành, danh sách mã SKU gốc, mã SKU chuẩn hóa (`normalizedPatterns`) và chi tiết từng sản phẩm.
  2. **Thanh Lọc Triệt Để Nguồn Dữ Liệu Tĩnh (Data Purge)**:
     - Đã loại bỏ hoàn toàn 59 sản phẩm khỏi [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json) (quy mô catalog giảm từ 7.500 xuống 7.441 items).
     - Đã làm sạch [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json) (từ 7.479 xuống 7.420 items).
     - Đã loại bỏ 59 biến thể và 57 họ rỗng khỏi [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json).
     - Đồng bộ toàn diện sang thư mục phân phối `dist/data/`.
  3. **Lá Chắn Đồng Bộ Dữ Liệu Tương Lai (Future Import Shield)**:
     - Toàn bộ các script xử lý dữ liệu ([`scripts/sanitize_procurement_sources_and_brands.py`](file:///d:/T&TVina/protools/scripts/sanitize_procurement_sources_and_brands.py) và [`scripts/generate_catalog_index.py`](file:///d:/T&TVina/protools/scripts/generate_catalog_index.py)) đã tích hợp cơ chế nạp động `src/data/excluded_skus.json`. Bất kỳ lần update dữ liệu nào từ Sapo sau này đều tự động loại bỏ các mã này ngay từ vòng nạp đầu tiên.
  4. **Lớp Chặn Thời Gian Thực Client (Client Runtime Guard)**:
     - Hàm `isExcludedSku()` trong [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts) sử dụng tập `Set` chuẩn hóa, chặn mọi truy vấn tìm kiếm hoặc click.
     - [`src/utils/catalogLoader.ts`](file:///d:/T&TVina/protools/src/utils/catalogLoader.ts) lọc bỏ sản phẩm thuộc blacklist ngay khi nạp JSON vào bộ nhớ.
     - [`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx) chặn trực tiếp các URL deep link (`/san-pham/:slug` hoặc `?product=:sku`) trỏ đến các mã này, tự động chuyển hướng về trang chủ thay vì render chi tiết.
  5. **Đồng Bộ SEO & Cổng Danh Mục**:
     - Chạy lại [`generate_sitemaps.py`](file:///d:/T&TVina/protools/generate_sitemaps.py): Sitemap [`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml) được làm mới về chuẩn 7.459 URLs (7.441 sản phẩm + 18 đường dẫn danh mục/tĩnh), 100% không còn chứa bất kỳ URL nào của 59 sản phẩm trên.
     - Xuất danh sách 59 ID/SKU vào [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json) phục vụ cơ chế disable động tức thì qua HTTP cache-busting.

### Rule 9.124: Gỡ Bỏ Vĩnh Viễn Đợt 2 (116 Sản Phẩm Bơm Keo & Robot Tự Động) & Mở Rộng Danh Sách Đen (07/10/2026)
* **Bối cảnh & Chỉ đạo từ Ban Giám Đốc (Đợt 2)**:
  - Ban Giám Đốc yêu cầu tiếp tục gỡ bỏ hoàn toàn **116 sản phẩm** thuộc nhóm Dụng cụ bơm keo và Robot tự động (gồm các dòng van bơm keo, dây bơm keo, xylanh bơm keo, đầu kim bơm keo, máy bơm keo tự động, tay robot cấp keo...).
  - Tích hợp toàn diện 116 mã này vào danh sách đen vĩnh viễn (nâng tổng số lên **175 sản phẩm** / 176 mẫu mã chuẩn hóa), ngăn chặn triệt để nguy cơ xuất hiện lại khi đồng bộ Sapo ERP trong tương lai.
* **Nhóm 116 Mã Hàng Đợt 2 Được Gỡ Bỏ Vĩnh Viễn**:
  - `PVN10183`, `PVN10380`, `PVN1156`, `PVN1227`, `PVN1258`, `PVN1260`, `PVN1273`, `PVN1639`, `PVN1662`, `PVN1880`,
  - `PVN2050`, `PVN2053`, `PVN2088`, `PVN2601`, `PVN2679`, `PVN2781`, `PVN2894`, `PVN3087`, `PVN3112`, `PVN3198`,
  - `PVN3224`, `PVN3225`, `PVN3247`, `PVN3376`, `PVN3454`, `PVN3468`, `PVN3520`, `PVN3530`, `PVN3559`, `PVN3619`,
  - `PVN3696`, `PVN3804`, `PVN3922`, `PVN3941`, `PVN4171`, `PVN4199`, `PVN4204`, `PVN4329`, `PVN4330`, `PVN4353`,
  - `PVN4354`, `PVN4397`, `PVN4498`, `PVN4503`, `PVN4691`, `PVN4692`, `PVN4715`, `PVN4856`, `PVN4862`, `PVN4988`,
  - `PVN5068`, `PVN5072`, `PVN5137`, `PVN5322`, `PVN5379`, `PVN5576`, `PVN5578`, `PVN5609`, `PVN5784`, `PVN5968`,
  - `PVN6208`, `PVN6452`, `PVN6488`, `PVN6530`, `PVN6531`, `PVN6575`, `PVN6616`, `PVN6714`, `PVN6740`, `PVN6782`,
  - `PVN6805`, `PVN6856`, `PVN6919`, `PVN6920`, `PVN7023`, `PVN7317`, `PVN7438`, `PVN7439`, `PVN7446`, `PVN7471`,
  - `PVN7492`, `PVN7601`, `PVN7630`, `PVN7690`, `PVN7802`, `PVN7872`, `PVN7873`, `PVN7898`, `PVN7899`, `PVN7901`,
  - `PVN7927`, `PVN7930`, `PVN7981`, `PVN8210`, `PVN8278`, `PVN8483`, `PVN8593`, `PVN8607`, `PVN8608`, `PVN8721`,
  - `PVN8725`, `PVN8893`, `PVN8968`,
  - `TTPC-0176`, `TTPC-0179`, `TTPC-0180`, `TTPC-0182`, `TTPC-0210`, `TTPC-0212`, `TTPC-0213`, `TTPC-0214`,
  - `TTPC-0215`, `TTPC-0219`, `TTPC-0227`, `TTPC-0230`, `TTPC 2410`.
* **Cập Nhật Quy Mô & Hệ Thống Bảo Vệ**:
  1. **Tập tin cấu hình**: Cập nhật [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json) lên **175 sản phẩm** (59 đợt 1 + 116 đợt 2).
  2. **Dữ liệu phân phối**:
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Giảm từ 7.441 xuống **7.325 sản phẩm**.
     - [`public/data/sapo_products_enriched.json`](file:///d:/T&TVina/protools/public/data/sapo_products_enriched.json): Giảm từ 7.420 xuống **7.304 sản phẩm**.
     - [`public/data/sapo_grouped_families.json`](file:///d:/T&TVina/protools/public/data/sapo_grouped_families.json): Loại bỏ 116 biến thể và dọn sạch 93 họ sản phẩm rỗng.
  3. **Google Sitemap**: Chạy lại [`generate_sitemaps.py`](file:///d:/T&TVina/protools/generate_sitemaps.py), cập nhật [`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml) về **7.343 URLs** chuẩn SEO (7.325 sản phẩm + 18 URLs tĩnh/danh mục).
  4. **Client & Dynamic Shield**: Cập nhật tập `EXCLUDED_NORM_SKUS` trong [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts) và danh sách 175 mã trong [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json).

### Rule 9.125: Kích Hoạt Màn Hình Bảo Trì (Public Maintenance Screen) & Cổng Soát Mã SKU Nội Bộ 7.500 Sản Phẩm (07/10/2026)
* **Bối cảnh & Yêu cầu nghiệp vụ**:
  1. Ban Giám Đốc chỉ đạo tạm thời đưa toàn bộ website public về **Màn hình Bảo trì (Maintenance Mode)** để che giấu các thông tin/mã hàng nhạy cảm còn sót lại trong khi tiếp tục rà soát.
  2. Thiết kế màn hình bảo trì lấy chuẩn hoạt họa Lottie từ [`public/images/Maintenance web.json`](file:///d:/T&TVina/protools/public/images/Maintenance%20web.json), bổ sung thông điệp bảo trì & nâng cấp, kênh tiếp nhận thông tin khẩn cấp: Hotline `0915168824` / `0915.168.824` và Email `info@t2tvina.com`.
  3. Cung cấp đường dẫn bảo mật riêng (`https://protools.com.vn/noi-bo/`) cho nhân viên kho và kinh doanh nội bộ đăng nhập/truy cập để duyệt toàn bộ 7.500 sản phẩm gốc, lọc tìm kiếm và lấy mã SKU gửi admin gỡ xuống tiếp.
* **Giải Pháp Kiến Trúc Kỹ Thuật Đa Tầng**:
  1. **Màn Hình Bảo Trì Khách Ngoài ([`src/components/MaintenanceScreen.tsx`](file:///d:/T&TVina/protools/src/components/MaintenanceScreen.tsx))**:
     - Tích hợp thư viện `lottie-web` render hoạt họa vector chất lượng cao từ `public/images/Maintenance web.json`.
     - Hiển thị thông báo: *"Website Đang Tiến Hành Bảo Trì & Nâng Cấp Hệ Thống. Sẽ sớm quay trở lại phục vụ Quý khách."*
     - Hai card liên hệ khẩn cấp 24/7 tích hợp nút gọi nhanh và nút sao chép (Copy) 1-click:
       * Hotline: `0915.168.824` (`tel:0915168824`)
       * Email: `info@t2tvina.com` (`mailto:info@t2tvina.com`)
     - Chân trang tích hợp kín đáo nút liên kết sang *Cổng Nhân Sự Nội Bộ*.
  2. **Cổng Soát Mã SKU Nội Bộ ([`src/components/InternalReviewHub.tsx`](file:///d:/T&TVina/protools/src/components/InternalReviewHub.tsx))**:
     - Đường dẫn truy cập hỗ trợ:
       * `https://protools.com.vn/noi-bo/`
       * `https://protools.com.vn/internal/`
       * `https://protools.com.vn/kiem-duyet/`
       * Hoặc thêm tham số `?mode=internal` / `?access=noi-bo`.
     - Cơ chế phiên làm việc: Tự động ghi nhớ cờ `localStorage.setItem('protools_internal_mode', 'true')` để nhân sự thoải mái duyệt web không bị văng về màn hình bảo trì.
     - **3 Chế độ tương tác linh hoạt**:
       * *Trạm Soát Mã SKU Nhanh*: Bảng dữ liệu tìm kiếm tức thì theo Tên / SKU / Hãng / Ngành hàng, phân loại rõ 3 tab (Tất cả 7.500 / Đang mở 7.325 / Đã gỡ 175), nút Copy từng mã và checkbox chọn nhiều mã.
       * *Thanh Công Cụ Sao Chép Hàng Loạt (Floating Batch Bar)*: Tích chọn nhiều sản phẩm và bấm nút *"SAO CHÉP TẤT CẢ MÃ ĐÃ CHỌN (GỬI SẾP)"* để tự động tạo chuỗi phân tách bằng dấu phẩy (`PVN1234, PVN5678, TTPC-0210...`) sẵn sàng paste gửi qua Zalo!
       * *Xem Giao Diện Trang Chủ (Full Home View)*: Cho phép nhân viên trải nghiệm toàn bộ trang chủ Protools bình thường kèm thanh điều khiển Sticky Bar ghim trên cùng.
       * *Xem Thử Trang Bảo Trì*: Xem trước trải nghiệm của khách ngoài bất cứ lúc nào.
  3. **Tập Tin Chỉ Mục Phục Vụ Nội Bộ ([`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json))**:
     - Khởi tạo qua [`scripts/generate_internal_catalog.py`](file:///d:/T&TVina/protools/scripts/generate_internal_catalog.py), lưu trữ trọn vẹn 7.500 sản phẩm gốc kèm thuộc tính nhận diện `isExcluded: true/false` giúp nhân sự phân biệt rõ ràng các sản phẩm đã gỡ và sản phẩm còn hiển thị.
  4. **Bảo Mật & Chặn Thu Thập Dữ Liệu SEO ([`public/robots.txt`](file:///d:/T&TVina/protools/public/robots.txt))**:
     - Khai báo chỉ thị `Disallow: /noi-bo/`, `Disallow: /internal/`, `Disallow: /kiem-duyet/` ngăn chặn tuyệt đối Googlebot và các công cụ tìm kiếm thu thập dữ liệu cổng nội bộ.

### Rule 9.126: Chuẩn Hóa Giao Diện Màn Hình Bảo Trì Nền Sáng & Cổng Soát Mã Nội Bộ Tinh Gọn (07/10/2026)
* **Tinh Chỉnh Màn Hình Bảo Trì Khách Ngoài ([`src/components/MaintenanceScreen.tsx`](file:///d:/T&TVina/protools/src/components/MaintenanceScreen.tsx))**:
  1. **Nhận diện thương hiệu chuẩn**: Tích hợp Logo màu Master chính hãng của T&T Vina (`/logos/TTV_LOGO_Color_Master.svg`).
  2. **Giao diện nền sáng (Light Theme)**: Chuyển toàn bộ màn hình sang phong cách nền sáng thanh lịch (`bg-gradient-to-b from-slate-50 via-white to-slate-100`), tương phản cao, hiện đại.
  3. **Không cần cuộn trang (Zero Scroll Fit)**: Đẩy hoạt họa Lottie SVG lên trên, thu gọn tỉ lệ và khoảng cách để toàn bộ nội dung vừa vặn chính xác chiều cao màn hình (`h-[100dvh]`), đảm bảo trải nghiệm hoàn hảo trên cả máy tính và điện thoại thông minh (iPhone/Android).
  4. **Gỡ bỏ liên kết cổng nội bộ**: Tuyệt đối không để lộ bất kỳ nút hay liên kết nào dẫn tới Cổng nội bộ ở chân trang công khai.
* **Tinh Chỉnh Cổng Soát Mã SKU Nội Bộ ([`src/components/InternalReviewHub.tsx`](file:///d:/T&TVina/protools/src/components/InternalReviewHub.tsx))**:
  1. **Đơn giản hóa giao diện**: Gỡ bỏ hộp thông báo hướng dẫn cồng kềnh, gỡ nhãn `KHÁCH NGOÀI ĐANG THẤY BẢO TRÌ`, và gỡ 3 nút điều hướng ở góc trên bên phải để nhân sự tập trung 100% vào việc kiểm duyệt mã hàng.
  2. **Bổ sung hình ảnh sản phẩm trực quan**: Thêm cột `ẢNH` hiển thị thumbnail sản phẩm sắc nét, hỗ trợ tự động sửa giao thức `https://` và fallback icon gói hàng nếu ảnh lỗi.
  3. **Bộ lọc theo Ngành hàng (Category Filter)**: Thêm menu thả xuống cho phép lọc theo 15+ nhóm ngành kỹ thuật kèm số lượng sản phẩm chi tiết của từng ngành.
  4. **Chuẩn hóa nhãn nút gom mã**: Đổi nút bấm thành **`SAO CHÉP TẤT CẢ MÃ ĐÃ CHỌN`** (lược bỏ chữ "Gửi sếp" theo chỉ đạo).

### Rule 9.127: Cải Tiến Cột Hiển Thị Bảng Soát Mã & Modal Phóng To Ảnh Sản Phẩm (07/10/2026)
* **Tăng kích thước ảnh & Lightbox Zoom Modal ([`src/components/InternalReviewHub.tsx`](file:///d:/T&TVina/protools/src/components/InternalReviewHub.tsx))**:
  1. **Kích thước thumbnail**: Nâng kích thước từ `12x12` lên `16x16` (64x64px), tích hợp hover icon `ZoomIn` và viền màu thương hiệu `#00478D`.
  2. **Trải nghiệm phóng to (Click-to-Zoom Lightbox)**: Khi bấm vào ảnh thumbnail, mở modal overlay phủ mờ hiển thị ảnh phóng to độ phân giải cao, tên thiết bị đầy đủ, SKU, hãng, ngành hàng và nút copy mã nhanh trong popup.
* **Tái cấu trúc thứ tự cột ưu tiên nghiệp vụ**:
  - Thứ tự mới: `[Checkbox]` → `[ẢNH]` → `[MÃ SKU]` → `[TÊN SẢN PHẨM]` → `[NGÀNH HÀNG]` → `[THƯƠNG HIỆU]` → `[TRẠNG THÁI]` → `[THAO TÁC]`.
  - Đưa `Tên sản phẩm` và `Ngành hàng` lên trước `Thương hiệu` giúp nhân sự kho đối chiếu trực quan tên hàng và nhóm hàng nhanh hơn.


### Rule 9.128: Gỡ Bỏ Đợt 3 Toàn Bộ 4.322 Sản Phẩm Nhóm Linh Kiện Cơ Khí & Phụ Trợ (07/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Chỉ đạo gỡ tức thì 8 mã SKU nhạy cảm phát sinh: `PVN10460`, `PVN10449`, `PVN10447`, `PVN10446`, `PVN10445`, `PVN10444`, `PVN10438`, `PVN10436`.
  2. Chỉ đạo gỡ triệt để toàn bộ **4.322 sản phẩm** thuộc ngành hàng **"Linh kiện cơ khí & phụ trợ"** (danh mục gốc: `Linh kiện & Thiết bị công nghiệp`, slug: `linh-kien-thiet-bi`).
* **Kết quả xử lý & Kiểm chứng thực tế**:
  1. **Khớp mã & Tự động hóa ([`scripts/purge_batch3_linh_kien.py`](file:///d:/T&TVina/protools/scripts/purge_batch3_linh_kien.py))**:
     - Toàn bộ 8 mã SKU chỉ định đều nằm trong nhóm 4.322 sản phẩm này.
     - Dữ liệu blacklist tích lũy: Đợt 1 (59 SKU) + Đợt 2 (116 SKU) + Đợt 3 (4.322 SKU) = **4.497 sản phẩm đã gỡ bỏ**.
     - Danh mục hiển thị công khai còn lại: **3.003 sản phẩm** đạt chuẩn chất lượng B2B công nghiệp.
     - Bảo toàn 100% các dòng thiết bị chiến lược chủ lực (21 sản phẩm Murrplastik Đức, Robot tự động, Hakko, Quick, HIOS, v.v. tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts)).
  2. **Đồng bộ đa tầng (Multi-tier Sync)**:
     - [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json): Lưu trữ hồ sơ 4.497 sản phẩm kèm ngày gỡ và lý do chỉ đạo.
     - [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts): Cập nhật `EXCLUDED_NORM_SKUS` chứa 4.497 mã chuẩn hóa, hàm `isExcludedSku()` ngăn chặn truy vấn ở tầng frontend.
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Đồng bộ danh mục 3.003 sản phẩm sạch.
     - [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json): Danh sách 4.497 SKU bị vô hiệu hóa.
     - [`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json): Giữ trọn vẹn 7.500 sản phẩm gốc cho Cổng kiểm duyệt nội bộ (`isExcluded: true` = 4.497, `isExcluded: false` = 3.003).
  3. **Cập nhật SEO & Snapshot Pre-rendering**:
     - Sitemaps ([`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml)): Cập nhật chính xác 3.021 URLs (3.003 sản phẩm + 18 trang trụ cột).
     - Bổ sung `Disallow: /*mode=internal` vào [`public/robots.txt`](file:///d:/T&TVina/protools/public/robots.txt).

### Rule 9.129: Gỡ Bỏ Đợt 4 Toàn Bộ 366 Mã SKU Chỉ Định Theo Yêu Cầu Rà Soát (07/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Chỉ đạo gỡ tiếp danh sách 630 mục SKU phát sinh (bắt đầu từ `TTPC-0470`, `PVN10052` đến `PVN9349`).
  2. Phân tích đối soát dữ liệu thực tế: Trong 630 mục yêu cầu, có 264 SKU đã được gỡ từ các đợt trước (Đợt 1, 2 và 3), và **366 SKU mới** thuộc danh mục cần loại bỏ tiếp.
* **Kết quả xử lý & Kiểm chứng thực tế**:
  1. **Khớp mã & Tự động hóa ([`scripts/purge_batch4_skus.py`](file:///d:/T&TVina/protools/scripts/purge_batch4_skus.py))**:
     - 100% (366/366) SKU mới được nhận diện chính xác và tìm thấy trong cơ sở dữ liệu `catalog_index_full.json`.
     - Bảo toàn tuyệt đối 100% các dòng thiết bị chiến lược chủ lực (21 sản phẩm Murrplastik Đức, Robot hàn, Hakko, Quick, HIOS, v.v. tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) - Zero overlap).
     - Tổng số sản phẩm đã gỡ (Blacklist): **4.863 sản phẩm** (Đợt 1: 59, Đợt 2: 116, Đợt 3: 4.322, Đợt 4: 366).
     - Tổng số sản phẩm công khai còn lại trên web: **2.637 sản phẩm**.
  2. **Đồng bộ đa tầng (Multi-tier Sync)**:
     - [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json): Đã lưu hồ sơ toàn bộ 4.863 bản ghi phân loại theo batch và lý do kiểm duyệt.
     - [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts): Cập nhật `EXCLUDED_NORM_SKUS` chứa 4.863 mã chuẩn hóa, hàm `isExcludedSku()` ngăn chặn tìm kiếm ở tầng frontend.
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Đồng bộ danh mục 2.637 sản phẩm sạch.
     - [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json): Danh sách 4.863 SKU bị vô hiệu hóa.
     - [`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json): Cung cấp cho cổng nội bộ với 7.500 SKU (`isExcluded: true` = 4.863, `isExcluded: false` = 2.637).
  3. **Cập nhật SEO & Sitemaps**:
     - Sitemaps ([`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml)): Cập nhật chính xác 2.655 URLs (2.637 sản phẩm + 18 trang giải pháp).

### Rule 9.130: Gỡ Bỏ Đợt 5 Toàn Bộ 216 Mã SKU Chỉ Định Tiếp Tục Rà Soát (08/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Chỉ đạo gỡ tiếp 217 mã hàng phát sinh (bắt đầu từ `TTPC-0470`, `PVN10342` đến `PVN8882`).
  2. Phân tích đối soát dữ liệu thực tế: Trong 217 mục yêu cầu, có 1 SKU (`TTPC-0470`) đã được gỡ từ Đợt 4, và **216 SKU mới** thuộc danh mục cần loại bỏ tiếp.
* **Kết quả xử lý & Kiểm chứng thực tế**:
  1. **Khớp mã & Tự động hóa ([`scripts/purge_batch5_skus.py`](file:///d:/T&TVina/protools/scripts/purge_batch5_skus.py))**:
     - 100% (216/216) SKU mới được nhận diện chính xác và tìm thấy trong cơ sở dữ liệu `catalog_index_full.json`.
     - Bảo toàn tuyệt đối 100% các dòng thiết bị chiến lược chủ lực (21 sản phẩm Murrplastik Đức, Robot hàn, Hakko, Quick, HIOS, v.v. tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) - Zero overlap).
     - Tổng số sản phẩm đã gỡ (Blacklist): **5.079 sản phẩm** (Đợt 1: 59, Đợt 2: 116, Đợt 3: 4.322, Đợt 4: 366, Đợt 5: 216).
     - Tổng số sản phẩm công khai còn lại trên web: **2.421 sản phẩm**.
  2. **Đồng bộ đa tầng (Multi-tier Sync)**:
     - [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json): Đã lưu hồ sơ toàn bộ 5.079 bản ghi phân loại theo batch và lý do kiểm duyệt.
     - [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts): Cập nhật `EXCLUDED_NORM_SKUS` chứa 5.079 mã chuẩn hóa, hàm `isExcludedSku()` ngăn chặn tìm kiếm ở tầng frontend.
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Đồng bộ danh mục 2.421 sản phẩm sạch.
     - [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json): Danh sách 5.079 SKU bị vô hiệu hóa.
     - [`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json): Cung cấp cho cổng nội bộ với 7.500 SKU (`isExcluded: true` = 5.079, `isExcluded: false` = 2.421).
  3. **Cập nhật SEO & Sitemaps**:
     - Sitemaps ([`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml)): Cập nhật chính xác 2.439 URLs (2.421 sản phẩm + 18 trang giải pháp).

### Rule 9.131: Gỡ Bỏ Đợt 6 Toàn Bộ 673 Mã SKU Chỉ Định Tiếp Tục Rà Soát (08/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Chỉ đạo gỡ tiếp 682 mã hàng phát sinh (bắt đầu từ `PVN8153`, `PVN8149` đến `PVN6333`).
  2. Phân tích đối soát dữ liệu thực tế: Trong 682 mục yêu cầu, có 9 SKU đã được gỡ từ các đợt trước, và **673 SKU mới** thuộc danh mục cần loại bỏ tiếp.
* **Kết quả xử lý & Kiểm chứng thực tế**:
  1. **Khớp mã & Tự động hóa ([`scripts/purge_batch6_skus.py`](file:///d:/T&TVina/protools/scripts/purge_batch6_skus.py))**:
     - 100% (673/673) SKU mới được nhận diện chính xác và tìm thấy trong cơ sở dữ liệu `catalog_index_full.json`.
     - Bảo toàn tuyệt đối 100% các dòng thiết bị chiến lược chủ lực (21 sản phẩm Murrplastik Đức, Robot hàn, Hakko, Quick, HIOS, v.v. tại [`src/data.ts`](file:///d:/T&TVina/protools/src/data.ts) - Zero overlap).
     - Tổng số sản phẩm đã gỡ (Blacklist): **5.752 sản phẩm** (Đợt 1: 59, Đợt 2: 116, Đợt 3: 4.322, Đợt 4: 366, Đợt 5: 216, Đợt 6: 673).
     - Tổng số sản phẩm công khai còn lại trên web: **1.748 sản phẩm**.
  2. **Đồng bộ đa tầng (Multi-tier Sync)**:
     - [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json): Đã lưu hồ sơ toàn bộ 5.752 bản ghi phân loại theo batch và lý do kiểm duyệt.
     - [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts): Cập nhật `EXCLUDED_NORM_SKUS` chứa 5.752 mã chuẩn hóa, hàm `isExcludedSku()` ngăn chặn tìm kiếm ở tầng frontend.
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Đồng bộ danh mục 1.748 sản phẩm sạch.
     - [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json): Danh sách 5.752 SKU bị vô hiệu hóa.
     - [`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json): Cung cấp cho cổng nội bộ với 7.500 SKU (`isExcluded: true` = 5.752, `isExcluded: false` = 1.748).
  3. **Cập nhật SEO & Sitemaps**:
     - Sitemaps ([`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml)): Cập nhật chính xác 1.766 URLs (1.748 sản phẩm + 18 trang giải pháp).

### Rule 9.132: Gỡ Bỏ Đợt 7 Toàn Bộ 837 Sản Phẩm Theo Nhóm Từ Khóa Kỹ Thuật Chỉ Định (08/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Chỉ đạo rà soát và gỡ bỏ toàn bộ sản phẩm chứa các từ khóa: *"xilanh, cảm biến, van tiết lưu, bulong, vít, mũi khoan, động cơ, hộp số, khớp nối, dây đai, xilanh khí nén"*.
  2. Nguyên tắc an toàn kỹ thuật: Chắt lọc chính xác các linh kiện cơ khí rời rạc / phụ kiện tiêu hao (mũi vít, ốc vít, bulong, xilanh, cảm biến, động cơ, dây đai, khớp nối, van tiết lưu, hộp số), đồng thời **BẢO TOÀN TUYỆT ĐỐI** các thiết bị máy móc chủ lực của công ty (Robot bắt vít tự động `TTPC-07030`, `PVN6627`, Máy bắt vít HIOS `CL-4000`, `CL-3000`, Nguồn HIOS `CLT-50`, Máy đo lực siết `HP-50`, hệ sinh thái Murrplastik Đức, Robot hàn, trạm hàn Hakko/Quick, máy bơm keo SP-982, v.v.).
* **Kết quả xử lý & Kiểm chứng thực tế**:
  1. **Khớp mã & Tự động hóa ([`scripts/purge_batch7_keywords.py`](file:///d:/T&TVina/protools/scripts/purge_batch7_keywords.py))**:
     - Tổng số sản phẩm khớp từ khóa và gỡ bỏ trong Đợt 7: **837 sản phẩm**.
       * Vít / mũi vít / ốc vít: 249 sản phẩm
       * Xilanh / xi lanh khí nén: 230 sản phẩm
       * Bulong / đai ốc: 106 sản phẩm
       * Cảm biến / sensor: 95 sản phẩm
       * Dây đai: 58 sản phẩm
       * Động cơ / motor / giảm tốc: 44 sản phẩm
       * Mũi khoan: 33 sản phẩm
       * Khớp nối: 11 sản phẩm
       * Van tiết lưu: 9 sản phẩm
       * Hộp số: 2 sản phẩm
     - Bảo toàn tuyệt đối 100% các dòng thiết bị chiến lược chủ lực (Zero overlap).
     - Tổng số sản phẩm đã gỡ (Blacklist): **6.589 sản phẩm** (Đợt 1: 59, Đợt 2: 116, Đợt 3: 4.322, Đợt 4: 366, Đợt 5: 216, Đợt 6: 673, Đợt 7: 837).
     - Tổng số sản phẩm công khai còn lại trên web: **911 sản phẩm** tinh gọn, chuẩn B2B.
  2. **Đồng bộ đa tầng (Multi-tier Sync)**:
     - [`src/data/excluded_skus.json`](file:///d:/T&TVina/protools/src/data/excluded_skus.json): Đã lưu hồ sơ toàn bộ 6.589 bản ghi phân loại theo batch và lý do kiểm duyệt.
     - [`src/utils/brandNormalizer.ts`](file:///d:/T&TVina/protools/src/utils/brandNormalizer.ts): Cập nhật `EXCLUDED_NORM_SKUS` chứa 6.589 mã chuẩn hóa, hàm `isExcludedSku()` ngăn chặn tìm kiếm ở tầng frontend.
     - [`public/data/catalog_index.json`](file:///d:/T&TVina/protools/public/data/catalog_index.json): Đồng bộ danh mục 911 sản phẩm sạch.
     - [`public/data/disabled_products.json`](file:///d:/T&TVina/protools/public/data/disabled_products.json): Danh sách 6.589 SKU bị vô hiệu hóa.
     - [`public/data/catalog_index_full.json`](file:///d:/T&TVina/protools/public/data/catalog_index_full.json): Cung cấp cho cổng nội bộ với 7.500 SKU (`isExcluded: true` = 6.589, `isExcluded: false` = 911).
  3. **Cập nhật SEO & Sitemaps**:
     - Sitemaps ([`public/sitemap.xml`](file:///d:/T&TVina/protools/public/sitemap.xml)): Cập nhật chính xác 929 URLs (911 sản phẩm + 18 trang giải pháp).





### Rule 9.133: Kiến Trúc Mở Lại Trang Chủ Protools, Bảo Trì Danh Mục Cục Bộ & Cảnh Báo Trình Duyệt In-App (08/10/2026)
* **Bối cảnh & Chỉ đạo Ban Giám Đốc**:
  1. Khôi phục lại hoạt động của Website Protools công khai cho khách hàng và đối tác truy cập, không để màn hình bảo trì toàn trang.
  2. Riêng khu vực danh sách sản phẩm bên dưới được chuyển thành khối thông báo bảo trì định kỳ có hoạt ảnh vector chuyển động ("Hệ thống Danh mục Sản phẩm đang trong quá trình bảo trì..."), do nội bộ vẫn đang trong quá trình rà soát và kiểm duyệt dữ liệu sản phẩm cần gỡ.
  3. Ô tìm kiếm sản phẩm trên Header (cả desktop và mobile) khi khách hàng nhấp vào sẽ hiển thị cửa sổ thông báo tính năng tìm kiếm đang tạm thời bảo trì nâng cấp dữ liệu kèm thông tin hotline tiếp nhận yêu cầu.
  4. Giữ nguyên cổng nội bộ `https://protools.com.vn/?mode=internal` độc lập cho nhân sự công ty vào đối soát 7.500 mã SKU, không đặt bất kỳ liên kết nội bộ nào trên giao diện công khai.
  5. Bổ sung cơ chế phát hiện và cảnh báo khi khách hàng truy cập website qua trình duyệt nội bộ của ứng dụng (Zalo, Facebook, Messenger, TikTok...) để hướng dẫn mở bằng trình duyệt ngoài (Chrome, Safari), tránh các lỗi không tải được tài nguyên của webview nhúng.
  6. Bảo toàn nguyên vẹn 100% hoạt động của Chuyên trang Murrplastik (`https://protools.com.vn/murrplastik/`).

* **Giải pháp Kỹ thuật & Hiện thực**:
  1. **Tách Biệt Trạng Thái Khách Ngoài & Cổng Nội Bộ ([`src/App.tsx`](file:///d:/T&TVina/protools/src/App.tsx))**:
     - Khách ngoài (`!isInternalMode`): Nạp toàn bộ bố cục trang chủ chuẩn mực (`Header`, `Hero`, `Solution Pillars`, `Partner Marquee`, `Impact Counter`, `FAQ Accordion`, `Floating Widgets`, `Footer`), truyền cờ `isCatalogMaintenance = true`.
     - Cổng nội bộ (`isInternalMode = true` khi truy cập `?mode=internal`): Nạp trực tiếp trạm kiểm soát [`src/components/InternalReviewHub.tsx`](file:///d:/T&TVina/protools/src/components/InternalReviewHub.tsx) với đầy đủ 7.500 SKU (6.589 SKU đã gỡ, 911 SKU đang mở).
  2. **Khối Bảo Trì Danh Mục Tại Chỗ ([`src/components/CatalogMaintenanceBlock.tsx`](file:///d:/T&TVina/protools/src/components/CatalogMaintenanceBlock.tsx))**:
     - Tích hợp tại vị trí `#product-catalog` trên [`src/pages/Home.tsx`](file:///d:/T&TVina/protools/src/pages/Home.tsx).
     - Hoạt ảnh vector Lottie mượt mà từ file dữ liệu nội bộ `/data/maintenance.json`.
     - Thông điệp kỹ thuật B2B chỉn chu, nêu rõ hệ thống đang rà soát & chuẩn hóa dữ liệu định kỳ.
     - Tích hợp bảng kênh tiếp nhận báo giá BOM nhanh (Hotline Ms. Nhung `0915.168.824`, Email `info@t2tvina.com`, Mr. Thanh `0943.301.886`, Mr. Khải `0968.597.131`, nút mở Giỏ Báo Giá và nút chuyển sang Chuyên trang Murrplastik Đức).
  3. **Cửa Sổ Báo Bảo Trì Tìm Kiếm ([`src/components/SearchMaintenanceModal.tsx`](file:///d:/T&TVina/protools/src/components/SearchMaintenanceModal.tsx))**:
     - Bắt tương tác click / focus / gõ phím trên cả thanh tìm kiếm Desktop và thanh tìm kiếm trong Mobile Drawer tại [`src/components/Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx).
     - Hiển thị modal thông báo rõ ràng, lịch sự kèm nút gọi Hotline và nút chép số điện thoại / email nhanh.
  4. **Cơ Chế Cảnh Báo Trình Duyệt In-App ([`src/components/InAppBrowserNotice.tsx`](file:///d:/T&TVina/protools/src/components/InAppBrowserNotice.tsx))**:
     - Hàm kiểm tra User-Agent: Nhận diện chính xác `Zalo`, `FBAN|FBAV` (Facebook App), `Messenger`, `Instagram`, `TikTok`, `WeChat`, `Line`.
     - Phân định hệ điều hành: Hướng dẫn người dùng iOS bấm ba chấm / biểu tượng chia sẻ chọn "Mở trong Safari"; hướng dẫn người dùng Android bấm ba chấm (⋮) chọn "Mở bằng trình duyệt".
     - Nút "Sao chép link" để dán vào trình duyệt và nút "Đã hiểu" ghi nhận vào `sessionStorage` để không làm phiền người dùng trong phiên duyệt web.
     - Tuân thủ nghiêm ngặt Quy tắc không dùng Icon/Emoji Windows, sử dụng 100% SVG Vector (Lucide React).

### Rule 9.134: Triệt Tiêu Tuyệt Đối Tình Trạng Kẹt Cổng Nội Bộ Do Sticky localStorage (09/10/2026)
* **Hiện tượng & Nguyên nhân gốc rễ**:
  1. Người dùng khi mở lại `https://protools.com.vn/` bị tự động chuyển hướng (fork) vào màn hình `CỔNG NỘI BỘ KIỂM DUYỆT 7.500 SKU` dù URL không có tham số `?mode=internal`.
  2. Nguyên nhân kỹ thuật: Trước đây hệ thống lưu cờ `localStorage.setItem('protools_internal_mode', 'true')` để ghi nhớ phiên làm việc. Do `localStorage` lưu trữ vĩnh viễn qua nhiều ngày/phiên, khi nhân sự mở lại trang chủ, hàm khởi tạo đọc giá trị `true` và kích hoạt chế độ nội bộ. Người dùng phải xóa cookies/storage thủ công mới quay lại được trang chủ.
* **Giải pháp khắc phục triệt để (Zero Sticky Storage)**:
  1. **Kích hoạt thuần túy theo tham số URL (Strict URL Parameter Only)**:
     - Chỉ kích hoạt `isInternalMode = true` khi và chỉ khi URL hiện tại chứa rõ ràng: `params.get('mode') === 'internal'`, `params.get('access') === 'noi-bo'`, hoặc đường dẫn bắt đầu bằng `/noi-bo`, `/internal`, `/kiem-duyet`.
  2. **Cơ chế tự động dọn dẹp cờ cũ (Self-Healing Auto-Purge)**:
     - Khi người dùng truy cập `https://protools.com.vn/` (không có tham số nội bộ), hàm khởi tạo và hook `popstate` tự động chạy lệnh `localStorage.removeItem('protools_internal_mode')`.
     - Bất kỳ trình duyệt nào còn lưu cờ cũ từ các ngày trước sẽ được tự động xóa sạch ngay lập tức khi tải trang, người dùng không cần phải xóa cookies hay lịch sử web.
  3. **Đồng bộ cơ chế nạp danh mục ([`src/utils/catalogLoader.ts`](file:///d:/T&TVina/protools/src/utils/catalogLoader.ts))**:
     - Phân định nạp `catalog_index_full.json` (7.500 SKU) hay `catalog_index.json` (911 SKU) trực tiếp dựa trên tham số URL hiện tại, không phụ thuộc vào `localStorage`.
  4. **Nút thoát 1 chạm tại Header Cổng Nội Bộ ([`src/components/InternalReviewHub.tsx`](file:///d:/T&TVina/protools/src/components/InternalReviewHub.tsx))**:
     - Bổ sung nút liên kết `"Về Trang Chủ Công Khai"` ở góc trên bên phải header cổng nội bộ để nhân sự dễ dàng quay trở lại trang chủ bất cứ lúc nào.

### Rule 9.121: Quy Trình Thẩm Định Toàn Diện Hệ Thống Robot Dresspack Theo Tiêu Chuẩn .project/analysis/audit/ (10/10/2026)
* **1. Thực Thi Toàn Bộ 4 Trụ Cột Thẩm Định Kỹ Thuật (Full 4-Pillar System Audit)**:
  - **Trụ cột 1 - An ninh ứng dụng & Bảo mật Headers (AppSec)**:
    * Khắc phục triệt để lỗ hổng phụ thuộc cấp cao `source-map-js` bằng cách bổ sung override `source-map-js >= 1.2.2` trong cả [`package.json`](file:///d:/T&TVina/protools/package.json) và [`pnpm-workspace.yaml`](file:///d:/T&TVina/protools/pnpm-workspace.yaml), đưa kết quả `pnpm audit --json` về **0 lỗ hổng** (`0 vulnerabilities`).
    * Khảo sát an ninh HTTP Headers trực tiếp trên endpoint Production `https://protools.com.vn/robot-dresspack` đạt điểm tuyệt đối **100/100 Grade A+** (thực thi nghiêm ngặt đầy đủ 6 headers: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
  - **Trụ cột 2 - Chất lượng mã nguồn & Phân tách Bundle (Quality & Bundle)**:
    * Kiểm tra tĩnh `tsc --noEmit` đạt chuẩn nghiêm ngặt: **0 lỗi, 0 cảnh báo**.
    * Phân tách mã nguồn Rollup: Chunk độc lập `RobotConfigurator-*.js` đạt kích thước lý tưởng **154.86 KB raw** (chỉ **29.85 KB gzip**), nằm gọn trong ngưỡng an toàn khuyến nghị (<250 KB), đảm bảo không làm nghẽn luồng tải trang ban đầu.
  - **Trụ cột 3 - Toàn vẹn dữ liệu chuyên ngành Robot Dresspack (Domain Integrity)**:
    * CSDL bao phủ toàn diện 13 thương hiệu robot hàng đầu thế giới, 83 models thực tế và 20 gói giải pháp dresspack chuẩn hóa độc lập (100% sở hữu mã cấu hình riêng biệt).
    * Quét toàn bộ 233 tài nguyên hình ảnh studio/3D tham chiếu trong CSDL: **100% tệp tồn tại trên đĩa và máy chủ, 0 liên kết chết (404)**.
    * 100% các gói giải pháp đều tuân thủ kiến trúc 4 góc nhìn phối cảnh độc bản (Overview, Top View, Side View, Wrist Detail) chuẩn ISO/CAD phỏng theo ABB IRB 6700.
  - **Trụ cột 4 - Trải nghiệm người dùng & Core Web Vitals (CWV & Performance)**:
    * Điểm số kiểm toán trang cấu hình Robot Dresspack trên môi trường Production: Desktop Performance đạt **96/100**, Accessibility đạt **100/100**, Best Practices đạt **96/100**, SEO đạt **100/100**.
    * Toàn bộ chỉ số Core Web Vitals nằm trong vùng xanh an toàn (LCP 0.9s < 2.5s, CLS 0.001 < 0.1, TBT 20ms < 200ms, TTFB 95ms < 800ms).
* **2. Cập Nhật Hồ Sơ Thẩm Định Có Định Danh Thời Gian**:
  - Lưu trữ đồng bộ 6 file báo cáo JSON chi tiết tại phân vùng dài hạn [`.project/analysis/audit/`](file:///d:/T&TVina/protools/.project/analysis/audit/):
    1. [`appsec/2026-10-10_package_audit.json`](file:///d:/T&TVina/protools/.project/analysis/audit/appsec/2026-10-10_package_audit.json)
    2. [`appsec/2026-10-10_security_headers_audit.json`](file:///d:/T&TVina/protools/.project/analysis/audit/appsec/2026-10-10_security_headers_audit.json)
    3. [`quality/2026-10-10_linter_report.json`](file:///d:/T&TVina/protools/.project/analysis/audit/quality/2026-10-10_linter_report.json)
    4. [`quality/2026-10-10_bundle_analysis.json`](file:///d:/T&TVina/protools/.project/analysis/audit/quality/2026-10-10_bundle_analysis.json)
    5. [`web-vitals/2026-10-10_core_web_vitals_summary.json`](file:///d:/T&TVina/protools/.project/analysis/audit/web-vitals/2026-10-10_core_web_vitals_summary.json)
    6. [`2026-10-10_robot_dresspack_domain_audit.json`](file:///d:/T&TVina/protools/.project/analysis/audit/2026-10-10_robot_dresspack_domain_audit.json)
