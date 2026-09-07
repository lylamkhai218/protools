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
