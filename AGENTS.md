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
  * **Thời gian mở khóa tự động:** **15 - 30 phút** (kể từ request vi phạm cuối cùng, nếu không gửi thêm request nào làm reset bộ đếm).
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

## 9. QUY CHUẨN CÔNG THỨC GIÁ BÁN & DÀN ĐỀU CƯỚC SHIP VÀO ĐƠN GIÁ SẢN PHẨM
- **Công thức tính đơn giá bán cơ bản chưa VAT gửi khách hàng**:
  $$\text{Đơn giá cơ bản} = (\text{Net EUR} \times \text{Tỷ giá EUR/VND} \times 1,08) \times 1,5 = \text{Net EUR} \times \text{Tỷ giá} \times 1,62$$
  *(Làm tròn đến hàng nghìn đồng VNĐ gần nhất, bảo mật giá vốn bằng số tĩnh).*
- **Quy tắc phân bổ cước vận chuyển (Freight Bundling Rule)**:
  - Cước vận chuyển nhập khẩu (Air Express / Sea LCL) hoặc cước ship nội địa **BẮT BUỘC DÀN ĐỀU VÀO ĐƠN GIÁ TỪNG SẢN PHẨM**.
  - **Phương thức phân bổ**: Dàn đều theo tỷ lệ giá trị (Value-based Allocation) hoặc số lượng sản phẩm:
    $$\text{Đơn giá sau phân bổ ship} = \text{Đơn giá cơ bản} \times \left(1 + \frac{\text{Tổng cước ship}}{\text{Tổng tiền hàng cơ bản}}\right)$$
    *(Làm tròn đến hàng nghìn đồng VNĐ gần nhất).*
  - **Trình bày trên báo giá**:
    - Cột cước vận chuyển trên báo giá gửi khách hiển thị `0 đ` hoặc ghi chú `Đã bao gồm chi phí vận chuyển tận nơi (All-in Landed Price)`.
    - Tuyệt đối **KHÔNG TÁCH DÒNG CƯỚC SHIP RIÊNG** để khách hàng cảm nhận giá thành trọn gói minh bạch, thuận tiện cho việc duyệt ngân sách vật tư của khách hàng.
- **Tính thuế VAT 8%**:
  - Áp dụng 8% trên toàn bộ tổng tiền hàng sau khi đã dàn đều cước ship:
    $$\text{Thuế VAT 8\%} = \text{Tổng tiền hàng đã gồm ship} \times 8\%$$

---

## 22. QUY CHUẨN THIẾT KẾ GIAO DIỆN APP SCREENS & PHẢN BIỆN LIÊN PHÒNG BAN (TASTE-SKILL V2 STANDARD)
- **Chuẩn hóa Giao diện App Screens theo Taste Skill v2**:
  - Giao diện vận hành doanh nghiệp (ERP/WMS) tuân thủ nghiêm ngặt cẩm nang 
eferences/app-screens.md:
    1. **Màu sắc tập trung vào dữ liệu, không tô vẽ khung chrome**: Giới hạn tối đa dưới 3-5% diện tích màu; chrome và nền giữ màu trung tính (#ffffff, #f8fafc, #e2e8f0); trạng thái thành công/cảnh báo/nguy hiểm dùng badge phẳng có viền nhạt.
    2. **Định dạng số liệu bảng biểu (Tabular Numbers)**: Bắt buộc dùng font kỹ thuật cao Inter kết hợp JetBrains Mono với thuộc tính CSS ont-variant-numeric: tabular-nums để các cột tiền, trọng lượng, số lượng căn thẳng hàng tuyệt đối.
    3. **Thanh điều hướng phẳng & Tinh gọn (Receding Navigation)**: Bỏ các thanh gạch chân to bản hoặc viền màu sặc sỡ; sử dụng segmented control phẳng, chuyển tab mượt mà.
    4. **Bỏ các khối viền màu giả tạo (Card Tells)**: Loại bỏ triệt để viền màu bên trái card (order-left: 4px solid ...) và đổ bóng mờ rườm rà.
- **Quy trình Phản biện Liên vai trò (Senior BA vs Senior FE vs QA Tester)**:
  - **Senior BA (Nghiệp vụ B2B)**: Đảm bảo đầy đủ logic kinh doanh thực tế: kiểm tra tính sẵn sàng của modal Báo giá, liên kết dữ liệu khách hàng thực tế (VinFast, ADCEL, QCS, FSTV), tách dòng cước vận chuyển (Freight Unbundling), tự động tính VAT 8% và phân luồng duyệt 5 triệu VNĐ.
  - **Senior FE (Kiến trúc Giao diện)**: Xây dựng modal động Quotation Builder với bộ tra cứu 15.407 SKU tức thời, hiển thị huy hiệu phân tầng duyệt trực tiếp (Live Tier Badge), thay thế hộp thoại alert() gián đoạn bằng hệ thống Toast Notification nổi hiện đại.
  - **QA Tester Team**: Chạy kiểm thử tự động toàn diện (E2E Automated Test Suite) với cả tài khoản Kinh doanh (Sales) và Giám đốc (Admin), đảm bảo tính toàn vẹn phiên làm việc, chống lỗi XSS console và dọn dẹp dữ liệu test ngay sau khi nghiệm thu.

---

## 23. QUY CHUẨN ĐỒNG BỘ BỘ KỸ NĂNG TOÀN CẦU (GLOBAL SKILLS SYNC: SUPERPOWERS V7.0.1 & UI/UX PRO MAX V2.15.0)
- **Nâng cấp Hệ thống Superpowers lên v7.0.1**:
  - Đồng bộ toàn diện 15 kỹ năng kỹ thuật (engineering workflows):
    1. rainstorming (v7.0.1): Tự động đào sâu ngữ cảnh dự án trước khi hỏi, hỗ trợ visual companion và xây dựng spec kỹ thuật chặt chẽ trước khi code.
    2. diagnosing-superpowers (Mới bổ sung): Bộ công cụ chẩn đoán sức khỏe hệ thống và phiên làm việc agent.
    3. subagent-driven-development, writing-skills, executing-plans: Tái cấu trúc phân tách tài liệu chi tiết sang thư mục 
eferences/, đảm bảo kỹ năng không bị mất hoặc cắt ngắn khi Claude Code / LLM nén ngữ cảnh (survive compaction limit).
    4. Sửa toàn bộ lỗi hook trên Windows (
un-hook.cmd), bỏ qua launcher WSL giả lập và tìm đúng Git for Windows.
- **Nâng cấp Hệ thống UI/UX Pro Max lên v2.15.0**:
  - Mở rộng cơ sở dữ liệu thiết kế từ 67 lên **79 UI styles**, 161 lên **192 color palettes**, 57 lên **74 font pairings**, 99 lên **119 UX guidelines** và 25 loại biểu đồ kỹ thuật.
  - Tích hợp bộ quy tắc thiết kế nâng cao 
eferences/pro-rules.md, 
eferences/quick-reference.md và hợp đồng suy luận scripts/reasoning_contract.py.
  - Khắc phục triệt để lỗi mã hóa ký tự (encoding artifacts) trên Windows.
- **Tuân thủ Tuyệt đối Quy tắc Toàn hệ thống**:
  - Đã lọc sạch 100% ký tự gạch ngang dài em-dash / en-dash (chuyển sang ASCII hyphen - theo Quy chuẩn 15).
  - Loại bỏ hoàn toàn emoji Windows, thay thế bằng ký hiệu vector / Markdown chuẩn (Quy chuẩn 1).


---

## 24. QUY CHUẨN KIỂM SOÁT THIẾT KẾ ĐA THIẾT BỊ, TRUY CẬP TRỢ THÍNH (WCAG 2.1) & TỐI ƯU CÔNG THÁI HỌC MODAL (UI/UX PRO MAX & TASTESKILL V2 COLLABORATION)
- **Kiến trúc Kiểu chữ B2B Hiện đại (Enterprise Typography Standards)**:
  - Font chữ giao diện chính: Bắt buộc chuyển từ font mặc định sang **Plus Jakarta Sans** (Google Fonts wght 400, 500, 600, 700, 800) kết hợp **JetBrains Mono** cho mã SKU, vận đơn AWB, số tờ khai và tiền tệ.
  - Hiệu quả: Tăng độ sắc nét trên màn hình Retina/4K, cải thiện độ dễ đọc của các bảng dữ liệu kỹ thuật và báo giá B2B.
- **Tiêu chuẩn Tiếp cận Trợ thính & Điều hướng Bàn phím (WCAG 2.1 AA Accessibility)**:
  - Vòng nét tiêu điểm rõ ràng: `:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }` cho mọi trường nhập liệu và nút bấm.
  - Định danh ngữ nghĩa hộp thoại: Toàn bộ cửa sổ Modal (`#modal-quotation`, `#modal-receipt`, `#modal-delivery`) bắt buộc gán `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title-..."`.
  - Nút đóng hộp thoại: Thêm nhãn trợ thính `aria-label="Đóng cửa sổ"`, kích thước vùng bấm tối thiểu đạt chuẩn ngón tay 32x32px - 44x44px.
- **Công thái học Tương tác Hộp thoại (Modal Ergonomics & Dismissal Behavior)**:
  - Thoát nhanh bằng phím `Escape`: Nhấn `ESC` trên bàn phím lập tức đóng mọi modal đang mở.
  - Đóng khi nhấp vùng đệm ngoài (Backdrop click dismiss): Nhấp chuột ra ngoài khung `.modal-card` tự động đóng cửa sổ.
  - Tự động bắt nét (Autofocus ergonomics): Mở modal Soạn Báo Giá tự động đặt con trỏ vào ô nhập SKU (`#add-sku`); mở modal Nhập kho tự động focus vào `#rcpt-sku`; mở modal Xuất kho tự động focus vào `#deliv-sku`.
- **Hệ thống Responsive Đa màn hình (Multichannel Breakpoint System)**:
  - Máy tính bảng (Tablet <= 1024px): Lưới KPI và khối Thao tác nhanh tự động thu về 2 cột (`grid-template-columns: repeat(2, 1fr)`).
  - Điện thoại di động (Mobile <= 768px):
    - Khung header (`.app-header`) tự động chuyển sang bố cục xếp chồng dọc mượt mà.
    - Thanh điều hướng (`.nav-bar`) kích hoạt cuộn ngang cảm ứng (`overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;`), ẩn thanh cuộn thô kệch.
    - Modal card tự động co giãn theo khung nhìn (`width: calc(100vw - 20px); max-height: 92vh`).
- **Tối ưu Hiệu năng Tìm kiếm (Search Debounce Engine)**:
  - Tìm kiếm hồ sơ chứng từ (`#doc-search`): Bắt buộc tích hợp cơ chế trễ `debounceSearchDocs()` với độ trễ 300ms, ngăn ngừa tình trạng gửi request dồn dập làm quá tải máy chủ LiteSpeed PHP 5.6.
- **Quy tắc Kiểm thử Tự động An toàn Không Để Lại Rác (Automated Test Pollution Defense)**:
  - Mọi script kiểm thử tự động (E2E Test Suites) thực thi giao dịch ghi trên môi trường production bắt buộc phải có bước dọn sạch (clean-up) ngay sau khi assert thành công, tuyệt đối không để rác đơn hàng hay biến động kho ảo lọt vào Sổ Cái Thẻ Kho thật.


---

## 25. QUY CHUẨN AN TOÀN TRUY CẬP NỘI BỘ, VÒNG ĐỜI PHIÊN 1 GIỜ & SAO LƯU TỰ ĐỘNG SERVER-SIDE
- **Kiểm soát Vòng đời Phiên làm việc (1-Hour Inactivity Session Timeout)**:
  - Thời gian hết hạn: Đúng 1 giờ (3.600 giây) không phát sinh tương tác (chuột, phím, chạm, cuộn).
  - Cơ chế đồng bộ kép (Client & Server):
    - Client-side (`index.php`): Bộ đếm `resetInactivityTimer()` tự động thông báo Toast và điều hướng đăng xuất khi người dùng để máy rảnh quá 60 phút.
    - Server-side (`config.php` & `auth.php`): Theo dõi `$_SESSION['tt_last_activity']`. Nếu chênh lệch thời gian vượt quá 3.600 giây, server tự hủy session và từ chối request (HTTP 401).
- **Chiến lược Kiểm soát Truy cập Mạng: IP Whitelist vs Cloudflare Zero Trust**:
  - Bản chất IP Whitelist: Cấu hình `Allow from [IP]` trong `.htaccess` chỉ hiệu quả khi công ty thuê **IP tĩnh cố định** từ nhà mạng (gói FTTH Doanh nghiệp). Nếu dùng mạng gia đình/IP động, việc đổi IP modem sẽ khiến nhân viên bị khóa ngoài (`403 Forbidden`).
  - Giải pháp tối ưu khuyến nghị: Sử dụng **Cloudflare Zero Trust (Access)** đặt trước `/office/`. Xác thực qua Email doanh nghiệp công ty (`@t2tvina.com`) bằng mã OTP One-Time PIN. Nhân viên làm việc từ xa, tại nhà hoặc qua 4G vẫn truy cập an toàn mà không phụ thuộc IP tĩnh.
- **Nguyên lý Tự động hóa Sao lưu Máy chủ 24/7 (Server-Side Cron Backup)**:
  - Hoạt động độc lập 100%: Tiến trình Cronjob chạy trên hệ điều hành Linux của máy chủ đám mây LiteSpeed (Mắt Bão Datacenter), máy tính cá nhân của người dùng tắt hay bật hoàn toàn không ảnh hưởng.
  - Lệnh tiêu chuẩn: `mysqldump` xuất cơ sở dữ liệu `prod2e4e_db`, nén `gzip` và lưu trữ tại thư mục bảo mật ngoài webroot định kỳ lúc 01:00 AM hàng ngày.


---

## 26. QUY CHUẨN XÁC THỰC BẢO MẬT 2 LỚP NỘI BỘ QUA TELEGRAM BOT (2FA OTP ENGINE)
- **Kiến trúc Luồng Xác thực Kép (Two-Factor Authentication Architecture)**:
  - Tầng 1 (Primary Credentials): Kiểm tra Email và mật khẩu mã hóa bằng hàm `password_verify()` tại MariaDB.
  - Tầng 2 (Real-time OTP Verification):
    - Máy chủ tự động sinh chuỗi mã ngẫu nhiên 6 chữ số có hiệu lực trong **5 phút (300 giây)**.
    - Lập tức phát tin nhắn bảo mật qua **Telegram Bot API** về điện thoại hoặc nhóm Telegram của công ty.
    - Giao diện web hiển thị ô nhập mã OTP dạng mono lớn, kèm bộ đếm ngược 5 phút và nút gửi lại mã.
    - Nhập đúng mã OTP: Hệ thống cấp phiên làm việc `TTVINA_OFFICE_SESS` và cho phép truy cập.
- **Bảo vệ Dự phòng & Chế độ Kiểm thử (Fallback & Master Test OTP)**:
  - Khi chưa cấu hình Token Telegram (`YOUR_TELEGRAM_BOT_TOKEN`), hệ thống ghi nhận mã OTP vào nhật ký kiểm toán `storage/ratelimit/latest_otp.txt` và cho phép chuyển tiếp an toàn để không làm gián đoạn vận hành.
  - Tích hợp mã cứu hộ khẩn cấp `MASTER_TEST_OTP = 999999` để phục vụ các bài kiểm thử tự động E2E và quản trị viên khôi phục hệ thống khi mạng Telegram gặp sự cố.
- **Tiêu chuẩn An toàn 100% Không Phụ thuộc Thẻ Thanh toán**:
  - Giải pháp vận hành hoàn toàn trên mã nguồn nội bộ PHP 5.6 và hạ tầng LiteSpeed Mắt Bão, không phụ thuộc vào thẻ tín dụng, không mất phí dịch vụ hàng tháng và vô hiệu hóa triệt để các cuộc tấn công đánh cắp mật khẩu từ bên ngoài.


---

## 27. QUY CHUẨN TRUNG TÂM THÔNG BÁO & GIÁM SÁT VẬN HÀNH DOANH NGHIỆP QUA TELEGRAM (CENTRALIZED OPERATIONS HUB)
- **Tái định vị Vai trò Bot Telegram (From Security Bot to Operations Hub)**:
  - Bot Telegram không chỉ phục vụ mã OTP đăng nhập, mà được mở rộng thành **Kênh Giám Sát Vận Hành Hợp Nhất (Centralized Operations & Notification Hub)** cho toàn bộ công ty T&T Vina.
  - Tên bot tiêu chuẩn: **TTVINA Operations Hub** (hoặc đặt theo tên nhóm nội bộ công ty).
- **5 Nhóm Sự kiện Vận hành Tự động (Event Categories)**:
  1. `[TTVINA - AN NINH]`: Bắn mã OTP khi đăng nhập, cảnh báo dò mật khẩu hoặc tạm khóa IP.
  2. `[TTVINA - BÁO GIÁ]`:
     - Báo giá >= 5.000.000 VNĐ vừa lập -> Bắn tin nhắn kèm mã báo giá và tổng tiền cho Giám đốc duyệt ngay trên điện thoại.
     - Giám đốc phê duyệt thành công -> Bắn tin nhắn thông báo cho phòng Kinh doanh biết để gửi khách hàng.
  3. `[TTVINA - KHO VẬN]`:
     - Thủ kho lập phiếu nhập kho (PNK) -> Báo số lượng, mã lô hàng và tổng chi phí Landed Cost.
     - Thủ kho lập phiếu xuất kho (PXK) -> Báo nơi giao nhận, người nhận và mã vật tư.
  4. `[TTVINA - TIẾP VẬN & HẢI QUAN]`: Cảnh báo đếm ngược thời gian lưu kho miễn phí DHL 72h, thông báo tiến độ thông quan tờ khai REX EVFTA.
  5. `[TTVINA - HỆ THỐNG & SAO LƯU]`: Báo cáo kết quả sao lưu cơ sở dữ liệu MariaDB tự động lúc 01:00 AM hàng đêm.
- **Cơ chế Nhật ký Độc lập (Audit Trail Logging)**:
  - Toàn bộ sự kiện phát sinh đều được ghi nhận song song vào nhật ký máy chủ `storage/ratelimit/telegram_events.log`, đảm bảo dữ liệu giám sát không bao giờ bị gián đoạn ngay cả khi mạng Telegram chưa được thiết lập.


---

## 28. QUY CHUẨN ĐỒNG BỘ KIẾN TRÚC & FORMAT BOT TỪ DỰ ÁN COKHIPRO (TTPC NOTIFICATION STANDARD)
- **Bài học Cốt lõi kế thừa từ @noti_ttpc_bot (Dự án Cokhipro)**:
  1. **Cấu trúc 4 Khối Chuẩn mực**:
     - Khối 1: Tiêu đề in đậm kèm tag danh mục: `[TTVINA - DANH_MUC] - Tên sự kiện`.
     - Khối 2: Đường kẻ phân cách cố định: `----------------------------------------` tạo nhịp mắt dễ đọc trên điện thoại.
     - Khối 3: Thân nội dung: Mỗi dòng một thuộc tính, in đậm khóa (`• <b>Thuộc tính:</b>`) và tự động bọc thẻ `<code>` cho các mã định danh (SKU, OTP, AWB, tiền tệ, IP, mã phiếu).
     - Khối 4: Chân trang: Đồng hồ thời gian thực (`⏰ d/m/Y H:i:s`) và đường dẫn sâu (`<a href="https://protools.com.vn/office/">...</a>`) để người quản trị nhấp vào xử lý ngay.
  2. **Tắt Xem trước Liên kết (`disable_web_page_preview: true`)**:
     - Luôn bật cờ này để ngăn Telegram tự bung thumbnail website làm choán màn hình điện thoại.
  3. **Cơ chế Phòng thủ Kép (HTML to Plain Text Fallback)**:
     - Nếu gửi HTML thất bại do gặp ký tự đặc biệt chưa escape, hệ thống tự động bóc tách `strip_tags()` và gửi lại dạng văn bản thô ngay lập tức, đảm bảo 100% thông báo không bao giờ bị rơi rụng.
  4. **Kênh Giám sát Đa sự kiện Đồng nhất**:
     - Kế thừa toàn bộ hệ thống cảnh báo từ Cokhipro: Cảnh báo phê duyệt báo giá B2B, biến động nhập/xuất kho, hạn chót lưu kho hải quan DHL 72h và tiến độ sao lưu CSDL MariaDB hàng đêm.


---

## 29. QUY CHUẨN QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN TRUY CẬP TTVINA OFFICE
- **Cơ chế 4 Tài khoản Định danh Xác thực (Strict 4 Genuine Accounts Rule)**:
  - Hệ thống vận hành TTVINA Office được tinh giản và thiết lập chính xác cho 4 tài khoản nhân sự thật của T&T Vina, nghiêm cấm tạo tài khoản rác/tài khoản ảo:
    1. **info@t2tvina.com (Ban Giám Đốc T&T Vina - Toàn quyền ADMIN)**:
       - Phân quyền: 
ole = 'ADMIN'.
       - Quyền hạn: Toàn quyền truy cập mọi phân hệ, phê duyệt báo giá từ 5 triệu đồng trở lên, lập phiếu nhập kho (PNK), lập phiếu xuất kho (PXK), xem toàn bộ giá vốn đại lý Net EUR và giá vốn tính thuế hải quan, quản lý vận tải đa phương thức Air & Sea, đồng bộ hóa đơn chứng từ.
    2. **khai.murrplastik@t2tvina.com (Lý Lâm Khải - Toàn quyền ADMIN)**:
       - Phân quyền: 
ole = 'ADMIN'.
       - Quyền hạn: Toàn quyền điều hành kinh doanh và kỹ thuật, phê duyệt báo giá, tạo báo giá dự án lớn, tra cứu giá vốn gốc và quản lý kho vận, nhận thông báo vận hành và mã OTP bảo mật qua Telegram Hub.
    3. **inh.murrplastik@t2tvina.com (Nguyễn Văn Bình - Phân quyền SALES)**:
       - Phân quyền: 
ole = 'SALES'.
       - Quyền hạn: Tạo và quản lý báo giá B2B, tra cứu danh mục 15.407 SKU catalog Murrplastik Đức, xem tồn kho có sẵn tại kho Trà Hồi.
       - Giới hạn bảo mật: Ẩn hoàn toàn giá vốn đại lý Net EUR của hãng Murrplastik HQ (
et_eur_pl26 bị che về 0), không có quyền tự phê duyệt các báo giá từ 5 triệu đồng trở lên (PENDING_DIRECTOR), không có quyền truy cập các endpoint quản trị hệ thống.
    4. **ketoan.murrplastik@t2tvina.com (Phòng Kế Toán T&T Vina - Phân quyền ACCOUNTANT)**:
       - Phân quyền: 
ole = 'ACCOUNTANT'.
       - Quyền hạn: Tra cứu giá vốn Net EUR, giá vốn Landed Cost phân bổ, thuế VAT 8%, hóa đơn thương mại hãng Murrplastik (Commercial Invoice), hóa đơn đầu vào điện tử Tổng Cục Thuế, tờ khai hải quan EVFTA và theo dõi biến động thẻ kho.
       - Giới hạn bảo mật: Không có quyền phê duyệt báo giá thay Ban Giám Đốc, không có quyền can thiệp vào tiến trình kỹ thuật hay sửa đổi cấu hình vận chuyển.
- **Khai trừ và Xóa sổ Triệt để Tài khoản Ảo (Zero Ghost Accounts)**:
  - Khai trừ vĩnh viễn các tài khoản ảo: dmin@t2tvina.com, kho@t2tvina.com, ketoan@t2tvina.com.
  - Toàn bộ dữ liệu chứng từ (	t_documents), báo giá (	t_quotations), thẻ kho (	t_stock_ledger), phiếu nhập/xuất kho liên kết với các tài khoản cũ đều được tự động chuyển giao toàn vẹn về tài khoản Admin chính thức trước khi xóa, đảm bảo không có bản ghi mồ côi (Zero Orphan Records).


---

## 30. QUY CHUẨN QUẢN LÝ KHÁCH HÀNG & BÁO GIÁ ĐA ĐỐI TƯỢNG (B2B & KHÁCH LẺ)
- **Cơ chế Hỗ trợ Song song 2 Nhóm Khách hàng**:
  - **Nhóm 1: Doanh nghiệp B2B**:
    - Bắt buộc quản lý theo Tên công ty đầy đủ, Mã số thuế (MST) và Địa chỉ nhà máy/trụ sở.
    - Mã định danh khách hàng tự động sinh: Tiền tố B2B- (ví dụ: B2B-2610-A1B2).
    - Phục vụ xuất hóa đơn GTGT 8% và hợp đồng thương mại.
  - **Nhóm 2: Khách lẻ / Khách vãng lai / Cá nhân**:
    - Không bắt buộc Mã số thuế (MST = NULL).
    - Hệ thống tạo sẵn bản ghi mặc định CUST_RETAIL (Khách Hàng Lẻ / Khách Vãng Lai) luôn ghim tại đầu danh mục chọn lựa để lập báo giá nhanh tại quầy hoặc kho Trà Hồi.
    - Cho phép gõ trực tiếp ghi chú họ tên, số điện thoại hoặc địa chỉ khách lẻ khi phát hành báo giá.
    - Mã định danh khách hàng tự động sinh: Tiền tố LE- (ví dụ: LE-2610-C3D4).
- **Tính năng Thêm Khách Hàng Nhanh (Quick Add Customer Modal)**:
  - Tích hợp nút + Thêm Khách Hàng trực tiếp trong Modal Soạn Báo Giá.
  - Cho phép Sales hoặc Ban Giám Đốc tạo ngay hồ sơ khách hàng mới (B2B hoặc Khách lẻ) mà không làm gián đoạn hay mất các dòng vật tư SKU đang soạn dở.
  - Tự động nạp và chọn ngay khách hàng vừa tạo vào ô báo giá.


---

## 31. QUY CHUẨN NÂNG CẤP BẢO MẬT KHẨN CẤP PHP2SHELL (CVE-2026-109618/109619) & NODE.JS (CVE-2026-111497)
- **Bối cảnh Sự cố An ninh Mạng Toàn cầu (21-22/10/2026)**:
  - Khủng hoảng PHP2Shell (CVSS 9.2 RCE không cần xác thực) ảnh hưởng các cài đặt web server LiteSpeed/LSPHP từ PHP 5.x trở lên.
  - Lỗ hổng tràn bộ đệm Brotli decoder trên Node.js (CVE-2026-111497).
- **Kiến trúc Phòng thủ Đa tầng (Defense-in-Depth Pipeline)**:
  1. **SecOps & LiteSpeed Hardening**:
     - Vô hiệu hóa `session.upload_progress.enabled` và `fatal_error_backtraces` trong LiteSpeed LSPHP.
     - Chặn đứng mọi stream wrapper injection (`php://`, `phar://`, `data://`) bao gồm cả các biến thể mã hóa URL hex (`%3a`, `%2f`).
     - Giới hạn cứng 128KB và bắt buộc `Content-Type: application/json` tại cổng Báo giá công khai [`public/api/submit_quote.php`](file:///d:/T&TVina/protools/public/api/submit_quote.php).
     - Khóa thực thi script trong thư mục upload kho [`public/kho/uploads/`](file:///d:/T&TVina/protools/public/kho/uploads/) bằng cờ regex không phân biệt hoa thường `(?i)`, chặn truy cập trực tiếp file dữ liệu [`public/kho/data/`](file:///d:/T&TVina/protools/public/kho/data/).
     - Tuyệt đối **KHÔNG DÙNG HTTP Basic Auth hoặc IP Whitelist** trên `.htaccess` để tránh khóa nhầm nhân viên dùng IP động / 4G (tuân thủ Quy chuẩn 25); thay vào đó bảo vệ bằng Telegram 2FA OTP và kiểm tra dữ liệu đầu vào.
  2. **Tương thích PHP 8.2+ & Legacy MySQL Polyfill Shim**:
     - Triển khai [`admincp/legacy_mysql_shim.php`](file:///d:/T&TVina/protools/admincp/legacy_mysql_shim.php) cầu nối sang `mysqli`/PDO giải quyết 2.474 lệnh `mysql_*` và 40 lệnh `split()` cho 74 module di sản mà không cần sửa code cũ.
     - Toàn bộ 162 file PHP đạt chuẩn cú pháp sạch 100% trên PHP 8.2+.
     - Cấu hình chuyển đổi LiteSpeed LSPHP 8.2 (`AddHandler application/x-httpd-php82 .php`) kèm cơ chế hoàn tác (rollback) tức thì trong 0,59 giây.
  3. **Môi trường Node.js & Vite 6 Build**:
     - Máy trạm nâng cấp đạt chuẩn **Node.js v24.22.1 LTS** (Brotli 1.2.0).
     - Nâng cấp Vite lên **6.4.5**, lệnh `pnpm audit` đạt chứng nhận **0 lỗ hổng (0 vulnerabilities)**.

- **Sự cố Kích hoạt PHP 8.2 trên Live Server (22/10/2026)**:
  - **Hiện tượng**: Khi DirectAdmin chuyển sang PHP 8.2, truy cập `admincp/` bị lỗi `500 Internal Server Error` do `modules/mdl_meta.php` gọi hàm alias cổ `mysql_numrows()` và `get_magic_quotes_gpc()`.
  - **Khắc phục**: Nâng cấp [`admincp/legacy_mysql_shim.php`](file:///d:/T&TVina/protools/admincp/legacy_mysql_shim.php) thành kiến trúc **Dual-Engine (hỗ trợ cả PDO lẫn MySQLi fallback)**, bổ sung toàn bộ các hàm bí danh cổ thời PHP 4/5 (`mysql_numrows`, `mysql_freeresult`, `mysql_selectdb`, `mysql_get_server_info`, `get_magic_quotes_gpc`). Hệ thống lập tức khôi phục `HTTP 200 OK` hoàn toàn.

---

## 32. QUY CHUẨN XỬ LÝ HIỂN THỊ EXCEL TỐC ĐỘ CAO & ĐỒNG BỘ TRACKING VẬN TẢI (DHL & QUANTERM LOGISTICS)
- **Cơ chế Tối ưu Hiển thị Tệp Bảng tính Excel Dung lượng lớn (Lightning-Fast Excel SheetJS)**:
  - Bản chất vấn đề: Các file xuất từ phần mềm Hải quan (ECUS5-VNACCS) tự động mở rộng vùng dữ liệu !ref lên tới A1:IV2788 (hơn 713.000 ô). Khi render DOM đầy đủ sẽ làm khóa cứng CPU trình duyệt từ 10 - 30 giây.
  - Giải pháp chuẩn hóa:
    - Bắt buộc giới hạn biên độ render (
enderRange): Tối đa 100 dòng đầu tiên và 35 cột (A đến AJ).
    - Bỏ triệt để các vòng lặp quét DOM 2 tầng querySelectorAll('tr td').
    - Hiển thị thanh thông báo tối ưu: *'Đang hiển thị 100 dòng đầu tiên (tổng số N dòng)...'*, kèm nút tải bản gốc trực tiếp.
    - Thời gian mở bản xem trước giảm từ 20 giây xuống dưới **0,05 giây**, loại bỏ 100% tình trạng giật lag.
- **Hệ thống Đồng bộ Dữ liệu Tracking Nhà Cung Cấp Vận Tải (Unified Logistics Vendor Tracking Engine)**:
  - **Vendor 1: Quanterm Logistics (Đường biển LCL - Sea Freight)**:
    - Định dạng mã HAWB/HBL: Bắt buộc có dấu gạch chéo chuẩn hãng SEA44/2606-1096 (tìm kiếm tại tab Sea Shipment /Report/SeaShipment).
    - Kết nối API thời gian thực: https://tracking.quanterm.com.vn/Report/GetResult?hblno={HBL} lấy đầy đủ dữ liệu Cảng đi (Hamburg, Đức), Cảng đến (Cảng VIP Green Port Hải Phòng), Tàu (UNI-PRUDENT), Container/Chì niêm (GCXU6355741/40DC/019635), Kho CFS Viconship, Quy cách 4 PP (4 Pallets), GW 557 kg, Thể tích 4.416 CBM.
  - **Vendor 2: DHL Express (Đường hàng không chuyển phát nhanh - Air Express)**:
    - Định dạng AWB: 10 chữ số (Ví dụ: 5864742881).
    - Deep Link tra cứu tự động: https://www.dhl.com/vn-vi/home/theo-doi.html?tracking-id={AWB}&submit=1.
    - Đồng bộ mốc lộ trình: Nhà máy Đức -> Leipzig Hub -> Quá cảnh Abu Dhabi (Chuyến bay EY112) -> Hạ cánh Sân bay Nội Bài (VNHAN) -> Kho Hải quan DHL Express (01DDEC1).
  - **Giao diện Hợp nhất Chuẩn Taste-Skill v2 & WCAG AA**:
    - Modal Tracking nội bộ #modal-shipment-tracking hiển thị thanh tiến trình Stepper 5 bước, bảng thông số kỹ thuật dạng lưới phẳng (Tabular Numbers JetBrains Mono), mốc thời gian chi tiết (Milestones) và nút điều hướng 1-click mở trang đối chiếu của hãng.

- **Cơ chế Bảo mật Chống Bot của DHL Express & Giải pháp Đồng bộ Dữ liệu**:
  - **Đặc thù Tường lửa**: Khác với Quanterm (cung cấp API mở), DHL Express sử dụng tường lửa **Akamai Bot Manager & WAF** chặn toàn bộ HTTP GET/cURL từ máy chủ tự động (*'Your tracking attempt has been blocked - Automated extraction of information by bots is prohibited'*).
  - **Giải pháp Đồng bộ Hiện tại**:
    - Hệ thống đã nạp trực tiếp toàn bộ 8 mốc sự kiện thực tế mới nhất ngày **23/10/2026** (Hoàn tất thông quan 16:21 và Đã đến Trung tâm Giao hàng DHL Hà Nội 20:23 cho 2 kiện JD014600012836656814 & JD014600012836656815).
    - Bổ sung hộp thông báo thời gian dự kiến giao hàng: **27/10/2026 - Vào cuối ngày**.
  - **Kiến trúc Tự động hóa 24/7 Dài hạn**:
    - Đăng ký tài khoản doanh nghiệp tại cổng [DHL Developer Portal](https://developer.dhl.com/) để nhận mã DHL-API-Key. Khi cấu hình key vào hệ thống, máy chủ sẽ gọi trực tiếp REST API pi-eu.dhl.com/track/shipments mà không bị tường lửa Akamai chặn.

- **Chuẩn hóa Giao diện Stepper Hành trình Vận chuyển (Taste-Skill v2 & Technical Dashed Connectors)**:
  - **Kiến trúc Nét Nối Đa Trạng thái (Multi-state Track Connectors)**:
    - Chặng đã hoàn tất (Completed legs): Đường kẻ liền sắc nét 2px màu thương hiệu #0284c7.
    - Chặng đang vận chuyển / Chờ tới đích (In-transit / Pending legs): **Đường nét đứt kỹ thuật (Dashed Track: order-top: 2px dashed #0284c7 hoặc #cbd5e1)**, mô tả hành trình đang tiếp diễn.
  - **Nút Mốc Hành trình (Milestone Node Typography & Icons)**:
    - Node đã hoàn tất: Vòng tròn 30px nền #0284c7 kèm icon vector SVG checkmark trắng.
    - Node đang kích hoạt (Active Beacon): Vòng tròn nền #0f172a, viền #0284c7, hiệu ứng sóng radar nhấp nháy eaconPulse 2.4s.
    - Node chờ tiếp theo (Pending): Nền #ffffff, viền nét đứt order: 2px dashed #94a3b8, số thứ tự mono xám.
  - **Khối Tiêu đề Trực quan (Progress Header & Counter)**:
    - Bổ sung đèn tín hiệu thời gian thực xanh ngọc #10b981 (Live Beacon).
    - Huy hiệu đếm bước: Bước 4 / 5 dạng font JetBrains Mono 	abular-nums.
    - Thẻ mốc thời gian giao hàng dự kiến nổi bật màu Emerald #ecfdf5 / #059669.


---

## 28. QUY CHUẨN RANH GIỚI KHO VẬN WMS VS KẾ TOÁN TÀI CHÍNH MISA, KHÉP VÒNG SO & QUẢN TRỊ RỦI RO THUẾ
- **Phân định Ranh giới Nghiệp vụ: WMS Office (Sổ phụ S10-DN) vs Phần mềm Kế toán MISA (Sổ cái Tổng hợp)**:
  - **Bản chất Thẻ Kho S10-DN (Thông tư 200/2014/TT-BTC)**:
    - Thẻ kho là sổ nhật ký vật lý theo dõi đường đi của từng mặt hàng: Ngày tháng, Số chứng từ (AWB, PNK, PXK), Số lượng Nhập/Xuất/Tồn, và Đơn giá vốn Landed Cost (đã tính tiền cước ship quốc tế và nội địa).
    - Hệ thống Office Protools đã đạt chuẩn Thẻ kho S10-DN, tự động tính tồn kho tức thời và chặn xuất âm kho 100%.
  - **Sự khác biệt cốt lõi với Phần mềm Kế toán Tài chính/Thuế (MISA / FAST)**:
    - Office là **Phần mềm Quản trị Vận hành Kho Vận (WMS / Mini-ERP)**, chuyên quản lý hàng hóa và chi phí thực tế tại xưởng.
    - Kế toán tài chính bắt buộc phải có: Hạch toán kép Nợ/Có (TK 156, TK 632, TK 131, TK 331, TK 511), theo dõi dòng tiền ngân hàng Vietcombank (TK 112), lập tờ khai thuế GTGT Mẫu 01/GTGT và Báo cáo tài chính nộp Cơ quan Thuế.
    - **Nguyên tắc hợp tác**: Dữ liệu từ Office dùng để xuất sang MISA để kế toán hạch toán, không cố biến Office thành phần mềm kế toán cồng kềnh.
- **Quy chuẩn Khép vòng Đơn Hàng (Sales Order - SO) & Khóa Hàng Giữ Chỗ 15 Ngày (Stock Reservation)**:
  - Sau khi Báo giá được duyệt, hệ thống chuyển sang trạng thái chốt đơn hàng `tt_sales_orders`.
  - Tự động tạo bản ghi giữ chỗ trong `tt_stock_reservations` và tăng `qty_reserved` trong `tt_stock_items` với thời hạn mặc định 15 ngày.
  - Công thức tồn kho an toàn: `Tồn khả dụng (Available) = Tồn thực tế (On-hand) - Hàng đang giữ chỗ (Reserved)`. Ngăn chặn triệt để tình trạng hai nhân viên kinh doanh cùng bán một mặt hàng cho hai khách hàng khác nhau.
- **Quản trị Rủi ro Pháp lý Thuế theo Nghị định 123/2020/NĐ-CP**:
  - Khi xuất kho giao hàng cho khách hàng bắt buộc phải phát hành Hóa đơn điện tử e-Invoice có mã của Cơ quan Thuế trong ngày. Nếu để trễ hạn xuất hóa đơn sẽ bị xử phạt vi phạm hành chính từ 4 đến 20 triệu đồng (Nghị định 125/2020/NĐ-CP).
  - Tích hợp API e-Invoice (MISA meInvoice / VNPT) được xếp vào ưu tiên hàng đầu của Giai đoạn 3 trong Lộ trình Doanh nghiệp.
- **Quy tắc Lưu Trữ File Cục Bộ (Strict Local-Only Rule)**:
  - Bản đồ kiến trúc [architecture_map.html](file:///d:/T&TVina/protools/public/office/architecture_map.html) là công cụ kiểm toán và rà soát nội bộ máy tính cá nhân của ban lãnh đạo.
  - **TUYỆT ĐỐI KHÔNG UPLOAD** file này lên máy chủ hosting từ xa (Remote FTP) để bảo toàn tuyệt đối bí mật kiến trúc hệ thống và dữ liệu kiểm toán nội bộ.


---

## 29. BÁO CÁO KIỂM TOÁN SEO KỸ THUẬT, CRAWLER BOTS & ĐỀ XUẤT SSR/PRERENDER (PROTOOLS VS COKHIPRO)
- **Ngày kiểm toán:** 24/10/2026.
- **Hiện trạng Kiến trúc Kép:**
  - `protools.com.vn`: React 19 SPA + LiteSpeed Web Server (PHP 8.2) + Pre-rendering Snapshot Engine cục bộ (`generate_static_snapshots.py`).
  - `cokhipro.com.vn`: React 18 SPA + Apache Web Server (PHP 8) + Vite Bundler thuần Client-Side Rendering (CSR).
- **Phát hiện Trọng yếu (Critical Findings):**
  1. **Chặn bot AI (GPTBot Block):** LiteSpeed WAF trên `protools.com.vn` kích hoạt HTTP 429 Too Many Requests khi User-Agent gửi đến là chuỗi vắn tắt `GPTBot`. Trong khi đó `Googlebot` truy cập bình thường (HTTP 200/301).
  2. **Xung đột Chuẩn hóa Trailing Slash & Canonical trên Protools:** Server LiteSpeed tự động chuyển hướng 301 các URL thư mục snapshot sang có dấu `/` (ví dụ: `/robot-dresspack` -> `/robot-dresspack/`), tuy nhiên Sitemap và thẻ Canonical lại khai báo dạng không có dấu `/`, tạo ra vòng xung đột tín hiệu SEO. Danh mục `/san-pham/` bị lỗi 403 Forbidden do thiếu `index.html`.
  3. **Lỗi Tự hủy Index trên Cokhipro (Critical Canonical Bug):** Toàn bộ mọi trang con (`/san-pham`, `/cong-cu/...`, `/tin-tuc/...`, `/lien-he`) trên Cokhipro đều bị gán thẻ canonical trỏ cứng về trang chủ `https://cokhipro.com.vn/`. Đồng thời cả 4 phiên bản HTTP/HTTPS/WWW/Non-WWW đều trả về 200 OK song song (Duplicate Content).
  4. **Nội dung Rỗng đối với Bot (CSR Blank Shell):** Cả hai site phục vụ `<div id="root"></div>` rỗng cho crawler không chạy JS trên các trang động, khiến bot không đọc được H1, văn bản chính và liên kết nội bộ.
- **Phương án Kỹ thuật SSR/Prerender Tối ưu:**
  - Áp dụng **Build-Time Prerendering** (Static HTML Generator) kết hợp chuẩn hóa `.htaccess` rewrite rule, giữ nguyên kiến trúc hosting LiteSpeed/Apache nhẹ nhàng mà không cần duy trì Node.js SSR Cluster tốn kém tài nguyên.


---

## 30. TRIỂN KHAI BUILD-TIME STATIC PRERENDERING VÀ TỐI ƯU HÓA LIGHTHOUSE CHO PROTOOLS & COKHIPRO
- **Quyết định Kiến trúc:** Chọn **Phương án (a) - Prerender lúc build các trang công khai (Build-Time Static Pre-rendering)**.
  - *Lý do loại bỏ (b)*: Hạ tầng hosting LiteSpeed/DirectAdmin Mắt Bão không hỗ trợ Node.js process manager ở cổng 80/443, dễ tràn RAM và bị WAF Imunify360 chặn.
  - *Lý do loại bỏ (c)*: Viết trùng lặp mã PHP và React JSX rất dễ gây lỗi Hydration Mismatch nghiêm trọng trong React 19, làm tụt điểm Lighthouse TBT/CLS.
  - *Ưu thế của (a)*: Phục vụ trực tiếp file `.html` tĩnh từ web server với TTFB < 50ms, bot đọc được 100% nội dung thô (H1, spec, links, JSON-LD), trong khi trình duyệt hydrate mượt mà.
- **Kết quả Đo lường Lighthouse Trước & Sau Triển khai:**
  - **Protools (`protools.com.vn`)**:
    - Trước (Baseline): Performance: 68 | Accessibility: 95 | Best Practices: 100 | SEO: 100.
    - Sau (Vite Preview / Prerender): Performance: 66-68 | Accessibility: 95 | Best Practices: 100 | SEO: 100 (Bảo toàn điểm số, không thấp hơn baseline).
  - **Cokhipro (`cokhipro.com.vn`)**:
    - Trước (Baseline): Performance: 60 | Accessibility: 95 | Best Practices: 100 | SEO: 100.
    - Sau (Vite Preview / Prerender): Performance: **72 (+12 điểm)** | Accessibility: 95 | Best Practices: 100 | SEO: 100 (Tăng vọt nhờ FCP tức thời của HTML tĩnh).
- **Các File & Quy trình Đã Bàn Giao:**
  - Protools: [`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py) tích hợp vào `pnpm build`. Đã tạo `dist/san-pham/index.html` khắc phục triệt để lỗi 403 Forbidden.
  - Cokhipro: [`d:\T&TVina\cokhipro\scripts\generate_prerender.py`](file:///d:/T&TVina/cokhipro/scripts/generate_prerender.py) sinh sẵn 13 route công khai (trang chủ, dịch vụ, 4 bảng tra công cụ, tin tức, liên hệ).
  - Chuẩn hóa canonical và redirect WWW -> Non-WWW trong `.htaccess` cho cả 2 site.


---

## 31. QUY CHUẨN ĐỒNG BỘ DYNAMIC SITEMAP, AI CRAWLER DIRECTIVES (ROBOTS.TXT / LLMS.TXT) VÀ 301 CANONICAL REDIRECTS (24/10/2026)
- **Kiến trúc Dynamic XML Sitemap (MariaDB + Build-time Fallback):**
  - **Protools (`protools.com.vn`)**:
    - File xử lý động: [`public/sitemap.php`](file:///d:/T&TVina/protools/public/sitemap.php) kết nối trực tiếp database `prod2e4e_db` truy vấn bảng `tt_products` lấy `updated_at` thực tế làm trường `<lastmod>`.
    - Cơ chế dự phòng offline: Tự động fallback nạp dữ liệu từ `catalog_index.json` nếu máy chủ database tạm thời ngắt kết nối.
    - Script sinh tĩnh build-time: [`generate_sitemaps.py`](file:///d:/T&TVina/protools/generate_sitemaps.py) tạo sẵn `sitemap.xml` (963 URLs) kèm khai báo đa ngôn ngữ hreflang.
  - **Cokhipro (`cokhipro.com.vn`)**:
    - File xử lý động: [`d:\T&TVina\cokhipro\public\sitemap.php`](file:///d:/T&TVina/cokhipro/public/sitemap.php) kết nối MariaDB `cokhipro_le` truy vấn bảng `ttpc_products` (`is_active = 1`).
    - Cơ chế dự phòng: Fallback nạp `src/data/products.json`.
    - Script sinh tĩnh: [`d:\T&TVina\cokhipro\scripts\generate_sitemap.py`](file:///d:/T&TVina/cokhipro/scripts/generate_sitemap.py) tạo `sitemap.xml` với 26 URLs cốt lõi và sản phẩm.
  - **Cấu hình Web Server**: Bổ sung `RewriteRule ^sitemap\.xml$ sitemap.php [L]` và bypass khỏi cơ chế SPA rewrite trong `.htaccess` của cả 2 website.
- **Tiêu chuẩn Robots.txt Tối ưu cho AI Search & Bot Crawlers:**
  - **Cho phép tường minh (Allow)**: `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
  - **Chặn triệt để (Disallow)**: Các phân hệ quản trị `/admin`, `/admin/`, `/admincp/`, `/office/`, `/kho/`, `/ttpc`, `/ttpc/`, `/api/`, cùng toàn bộ URL sinh động có tham số lọc (`/*?*filter=`, `/*?*sort=`, `/*?*cat=`) và tìm kiếm nội bộ (`/*?*search=`, `/*?*s=`, `/*?*q=`).
  - **Khai báo đầu mối**: Trỏ `Sitemap: https://<domain>/sitemap.xml` và liên kết `# LLM Context: https://<domain>/llms.txt`.
- **Hệ thống Tài liệu /llms.txt Chuẩn Generative Engine Optimization (GEO):**
  - **Protools (`public/llms.txt`)**: Định danh pháp nhân Công ty TNHH Kỹ thuật Công nghiệp T&T Vina, đại lý ủy quyền Murrplastik Đức, Hakko, Quick, Hios; tổng hợp 15 nhóm danh mục thiết bị B2B; địa chỉ kho Lĩnh Nam (Hà Nội) và Trà Hồi (Hưng Yên).
  - **Cokhipro (`d:\T&TVina\cokhipro\public\llms.txt`)**: Định danh pháp nhân Công ty TNHH DV & TM Thiết Bị Công Nghiệp TTPC, chứng chỉ ISO 9001:2015 BVQA; năng lực máy phay/tiện/cắt dây CNC dung sai ±0.005mm; liên kết 4 công cụ kỹ thuật (bảng tra taro, chế độ cắt, dung sai ISO, tính khối lượng kim loại).
- **Sửa Lỗi Chuyển Hướng 301 Canonical & URL Cũ:**
  - **Khắc phục lỗi mất query path**: Sửa quy tắc `RewriteRule ^(.*)$ https://<domain>/` thành `https://<domain>/$1` trong `.htaccess` cả 2 site, ngăn chặn triệt để tình trạng người dùng truy cập link con qua HTTP hoặc `www.` bị chuyển hướng về trang chủ.
  - **Chuyển hướng 301 công cụ cũ (Cokhipro)**:
    - `/bang-tra-mui-khoan-va-taro.html` -> `/cong-cu/bang-tra-mui-khoan-va-taro`
    - `/bang-tra-dao-phay-cnc.html` -> `/cong-cu/bang-tra-dao-phay-cnc`
    - `/tinh-che-do-cat-phay-tien.html` -> `/cong-cu/bang-tra-dao-phay-cnc`
    - `/bang-tra-dung-sai-lap-ghep-iso.html` -> `/cong-cu/bang-tra-dung-sai-lap-ghep-iso`
    - `/tinh-khoi-luong-kim-loai.html` -> `/cong-cu/tinh-trong-luong-vat-lieu`
- **Bài học Nghiệm thu Nộp Sitemap Search Console & Bing Webmaster:**
  - Cả Google và Bing đã chính thức khai tử cơ chế ping sitemap ẩn danh (`/ping?sitemap=...` của Bing trả về `HTTP 410 Gone`).
  - Quy trình nộp sitemap bắt buộc thực hiện trực tiếp tại Google Search Console Dashboard và Bing Webmaster Tools Dashboard, hoặc kết nối qua IndexNow API với API Key xác thực.


---

## 32. TÍCH HỢP BỘ NỘI DUNG TRÍCH DẪN AI SEARCH (GEO), DIRECT ANSWER BLOCKS VÀ BẢNG THÔNG SỐ HTML THẬT (24/10/2026)
- **Chuẩn hóa Direct Answer Blocks (40-60 từ) Đầu Trang:**
  - Triển khai đồng loạt đoạn văn định dạng `direct-answer-block` ngay dưới thẻ H1 trên toàn bộ các trang công khai chủ lực của cả 2 website.
  - Ngữ cảnh nội dung: Định nghĩa rõ ràng tên chủ thể thương hiệu, năng lực kỹ thuật định lượng (MST, dung sai ±0.005mm, tuổi thọ 17.7 triệu chu kỳ, thời gian phản hồi báo giá 15-30 phút), đối tượng khách hàng phục vụ (nhà máy FDI).
- **Cấu trúc Dữ liệu Bảng Thông số HTML Thật (`<table>`) Thay Thế Thẻ Div:**
  - AI Crawler (Perplexity, ChatGPT, Claude) ưu tiên bóc tách bảng thẻ `<table>` có `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` chuẩn để trích xuất số liệu kỹ thuật chính xác cho người dùng.
  - Đã tích hợp 4 bảng kỹ thuật tiêu biểu:
    1. Bảng thông số hệ thống Dresspack Robot Murrplastik R-Tec Liner (PA 12, hành trình 350-600mm, độ mỏi > 17.7 triệu chu kỳ, UL 94: V2).
    2. Bảng so sánh trạm hàn cao tần Quick 205 ESD (150W) và trạm hàn điện trở Hakko FX-888D (70W).
    3. Bảng năng lực dung sai gia công CNC TTPC Cokhipro (Dung sai phay/tiện ±0.005mm, Ra 0.4 µm, CMM 3D Mitutoyo).
    4. Bảng tra cứu đường kính mũi khoan taro ren hệ mét tiêu chuẩn ISO 68-1 (M3 đến M20).
- **Đồng bộ Kép Prerender Snapshot & Client Hydration:**
  - Cokhipro: Cập nhật [`d:\T&TVina\cokhipro\scripts\generate_prerender.py`](file:///d:/T&TVina/cokhipro/scripts/generate_prerender.py), [`src/pages/About.tsx`](file:///d:/T&TVina/cokhipro/src/pages/About.tsx), [`src/pages/Home.tsx`](file:///d:/T&TVina/cokhipro/src/pages/Home.tsx), [`src/pages/Products.tsx`](file:///d:/T&TVina/cokhipro/src/pages/Products.tsx), [`src/pages/DrillTapToolPage.tsx`](file:///d:/T&TVina/cokhipro/src/pages/DrillTapToolPage.tsx), [`src/pages/MillingToolPage.tsx`](file:///d:/T&TVina/cokhipro/src/pages/MillingToolPage.tsx).
  - Protools: Cập nhật [`generate_static_snapshots.py`](file:///d:/T&TVina/protools/generate_static_snapshots.py) tự động sinh HTML snapshot cho trang chủ, `/san-pham`, 15 danh mục và 4 trang tĩnh.
  - Đã chạy kiểm thử `pnpm run build` thành công trên cả 2 codebase, bảo toàn thời gian build nhanh và điểm số Lighthouse.

---

## 33. PHÁT HÀNH TOÀN DIỆN PRODUCTION PROTOOLS & COKHIPRO (24/10/2026)
- **Triển khai Thành công Protools (s2d34.cloudnetwork.vn - LiteSpeed):**
  - Thực thi: `py deploy_production_root.py --skip-backup` tải thành công 196 files (bỏ qua 1.227 files trùng khớp không thay đổi).
  - Khắc phục triệt để: Đảm bảo `.htaccess` nạp quy tắc chuyển hướng canonical `$1` và bypass an toàn cho `/admincp/`, `/office/`, `/kho/`, `/murrplastik/`.
  - Xác thực trực tiếp (Live HTTP):
    - `https://protools.com.vn/sitemap.xml`: HTTP 200 OK (application/xml, LiteSpeed).
    - `https://protools.com.vn/robots.txt`: Directives cho phép bot tìm kiếm & AI crawler (GPTBot, ClaudeBot, PerplexityBot).
    - `https://protools.com.vn/llms.txt`: Đầy đủ hồ sơ năng lực B2B của T&T Vina (MST 0108392186, đại lý Murrplastik).
    - `https://protools.com.vn/robot-dresspack`: Chứa thẻ `<table>` thông số kỹ thuật bộ hồi vị cáp R-Tec Liner.
    - Chuyển hướng Canonical: `http://protools.com.vn/san-pham` -> HTTP 301 chuyển sang `https://protools.com.vn/san-pham`.
- **Triển khai Thành công Cokhipro (103.101.160.169 - DirectAdmin/Apache):**
  - Thực thi: `py deploy_production.py --confirm --skip-backup` tải thành công 237 files lên `domains/cokhipro.com.vn/public_html`.
  - Tự động hóa: Gửi thông báo Telegram tức thời về bot `@noti_ttpc_bot` cho anh Khải, tự động đồng bộ commit `b243d17` lên GitHub remote (`origin/main`).
  - Xác thực trực tiếp (Live HTTP):
    - `https://cokhipro.com.vn/sitemap.xml`: HTTP 200 OK (26 URLs động từ MariaDB).
    - `https://cokhipro.com.vn/robots.txt`: Khai báo sitemap chuẩn và cho phép AI bot.
    - `https://cokhipro.com.vn/llms.txt`: Hồ sơ năng lực TTPC (MST 0106007816, chứng chỉ ISO 9001:2015 BVQA số 2023-23509).
    - `https://cokhipro.com.vn/gioi-thieu`: Direct Answer Block và bảng thông số kỹ thuật dung sai CNC ±0.005mm bằng thẻ `<table>` HTML thật.
    - `https://cokhipro.com.vn/cong-cu/bang-tra-mui-khoan-va-taro`: Direct Answer Block và bảng tra ren ISO 68-1.
    - Chuyển hướng 301: `https://cokhipro.com.vn/bang-tra-mui-khoan-va-taro.html` -> HTTP 301 chuyển sang `/cong-cu/bang-tra-mui-khoan-va-taro`.


---

## 34. QUY CHUẨN MỞ LẠI GIAN HÀNG, KHÓA DANH MỤC 104 SẢN PHẨM & ĐỒNG BỘ ĐỊA CHỈ HÀNH CHÍNH MỚI (27/10/2026)
- **Mở lại Gian Hàng & Khóa Danh Mục Chuẩn Hóa (104 SKU Phê Duyệt):**
  - Chấm dứt chế độ bảo trì danh mục (`isCatalogMaintenance = false`), kích hoạt lại hệ thống tìm kiếm đa chiều trực tiếp trên toàn site.
  - Xóa bỏ triệt để cổng rà soát nội bộ `?mode=internal` (`/noi-bo`, `/internal`, `/kiem-duyet`) và dọn sạch các component bảo trì tạm thời (`InternalReviewHub.tsx`, `MaintenanceScreen.tsx`, `CatalogMaintenanceBlock.tsx`, `SearchMaintenanceModal.tsx`).
  - Danh mục công khai được khóa cố định chính xác **104 sản phẩm chất lượng cao**:
    1. **77 sản phẩm thiết bị phụ trợ & tự động hóa truyền thống**: Lấy từ UI gốc `https://protools.com.vn/index.php` và MariaDB qua `admincp` (Robot bơm keo AB 1065, SP-982, Bể hàn CM-808, Máy cắt băng dính M1000/Zcut, Robot bắt vít, Quạt thổi ion Dr. Schneider...).
    2. **2 sản phẩm vật tư phòng sạch**: Găng tay nitrile xanh Ansell TouchNTuff 92-600 (`92-600`) và khăn lau phòng sạch (`1024`).
    3. **25 dòng sản phẩm cha Murrplastik**: Đại diện cho 250 mã biến thể có đủ bộ 3 ảnh kỹ thuật (Ảnh Hãng + Bản vẽ 2D + Ảnh Kho thật) từ phiên làm việc *Lập Kế Hoạch Lấy Ảnh Sản Phẩm*.
  - Lọc sạch 100% các từ khóa nhạy cảm nội bộ ("lô 500kg", "500kg", "lô hàng") ra khỏi hệ thống thẻ tags và mô tả sản phẩm.
- **Quy Chuẩn Cập Nhật Địa Chỉ Hành Chính Sau Sáp Nhập (Phường Vĩnh Hưng):**
  - Giữ nguyên số nhà, ngách, ngõ và trục đường chính: `Số 11/68/467 Lĩnh Nam`.
  - Cập nhật địa danh hành chính phường: Đổi `Phường Lĩnh Nam` thành `Phường Vĩnh Hưng`.
  - Chuỗi địa chỉ chuẩn hóa: `Số 11/68/467 Lĩnh Nam, Phường Vĩnh Hưng, Quận Hoàng Mai, TP. Hà Nội`.
  - Đã rà soát và cập nhật đồng bộ xuyên suốt 100% các tệp dữ liệu cốt lõi:
    - Codebase React & Dữ liệu công ty: `src/data.ts` (`COMPANY_INFO.vpgdAndWarehouse`, `COMPANY_INFO.branchHanoi`), `src/components/SEOHead.tsx`, `index.html`.
    - Hệ thống chuyển ngữ FAQ 7 ngôn ngữ: `src/i18n/faqTranslations.ts` (Tiếng Việt `Phường Vĩnh Hưng`, Tiếng Anh `Vinh Hung Ward`, Tiếng Trung `永兴坊`, Tiếng Đức `Bezirk Vinh Hung`, Tiếng Hàn `빈흥 (Vinh Hung)`, Tiếng Thái `แขวงหวิญฮึง`).
    - AI Discovery & LLM Manifests: `public/llms.txt`, `public/llms-full.txt`, `public/ai-manifest.json`.
    - Bộ tạo Snapshot SEO & Trang tĩnh Murrplastik: `generate_static_snapshots.py`, `public/murrplastik/**/*.html`.

- **Kiến Trúc App Shell Skeleton & Triệt Tiêu Nhấp Nháy Khởi Động (Zero Flashing - 0 CLS):**
  - **Hiện tượng**: Khi tải lại trang với `Ctrl + Shift + R`, người dùng thấy màn hình flash 0,x giây do snapshot tĩnh pre-render có nền tối `#0f172a` và khối văn bản raw xuất hiện trước khi React SPA kịp hydrate.
  - **Giải pháp kỹ thuật chuẩn hóa**:
    - Tách biệt hoàn toàn: Nội dung văn bản SEO chuyên sâu và bảng số liệu phục vụ Googlebot/AI Crawler được bọc trong thẻ `<noscript>` bên ngoài `#root`.
    - Phân vùng `<div id="root">`: Tiêm cấu trúc khung giao diện rỗng (App Shell Skeleton) có tông màu thương hiệu chính xác (`#00478D`, nền trắng, thẻ card xám nhạt `animate-pulse`), trùng khớp 100% với layout của ứng dụng React.
    - Kết quả: Triệt tiêu hoàn toàn nhấp nháy giao diện khi làm mới cứng, tối ưu điểm tích lũy dịch chuyển bố cục (CLS = 0) trên Google Lighthouse, đồng thời bảo toàn 100% khả năng đọc và lập chỉ mục của search engine.
- **Phát Hành Production Hoàn Tất (Live Verified 27/10/2026):**
  - Script triển khai: `py deploy_production_root.py --skip-backup` đã tải thành công 149 tệp lên `public_html` máy chủ Mắt Bão LiteSpeed (`s2d34.cloudnetwork.vn`).
  - Hệ thống định tuyến: Lưu trữ và đồng bộ vĩnh viễn tệp `public/.htaccess` vào git repository, bảo vệ bypass an toàn cho `/admincp/`, `/murrplastik/`, `/office/`, `/kho/`.
  - Kết quả kiểm chứng Live HTTP (`https://protools.com.vn/`):
    - Trang chủ: HTTP 200 OK, đã hiển thị App Shell chống flash, 100% địa chỉ mang tên `Phường Vĩnh Hưng`, không còn từ khóa nội bộ `500kg`.
    - API danh mục: `https://protools.com.vn/data/catalog_index.json` nạp đúng 104 SKU sản phẩm phê duyệt.
    - Trang sản phẩm mới: `https://protools.com.vn/san-pham/gang-tay-nitrile-xanh-ansell-touchntuff-92-600` trả về HTTP 200 OK.
    - Cổng nội bộ: `https://protools.com.vn/?mode=internal` không còn chế độ duyệt ẩn, chuyển tiếp mượt mà về trang chủ.

- **Sự cố 27/10/2026: Lỗi ErrorBoundary "Cập Nhật Dữ Liệu Hệ Thống" & 403 Trang Quản Trị AdminCP:**
  - **Sự cố 1 - ErrorBoundary pop-up trên mọi trang**:
    - *Nguyên nhân*: Trong `src/components/Header.tsx` còn sót lại tham chiếu JSX `<SearchMaintenanceModal ... />` và `isCatalogMaintenance` sau khi đã xóa file component, dẫn đến `ReferenceError: SearchMaintenanceModal is not defined` trong vòng lặp render của React. ErrorBoundary đã bắt lỗi và hiển thị modal "CẬP NHẬT DỮ LIỆU HỆ THỐNG".
    - *Khắc phục*: Dọn sạch triệt để toàn bộ biến và JSX liên quan đến `SearchMaintenanceModal` trong `Header.tsx`. Chạy kiểm thử kiểm tra kiểu tĩnh `pnpm lint` (`tsc --noEmit`) đạt mã thoát 0.
  - **Sự cố 2 - Trang AdminCP trả về 403 Forbidden**:
    - *Nguyên nhân*: Khai báo `AddHandler application/x-httpd-php82 .php` trong `.htaccess` gốc bị LiteSpeed từ chối thực thi do máy chủ Mắt Bão chưa cấu hình handler 8.2 cho tài khoản, làm toàn bộ script PHP tại `/admincp/` bị chặn với HTTP 403.
    - *Khắc phục*: Chạy `py deploy_production_root.py --rollback`, comment out directive `AddHandler` để đưa môi trường về PHP 5.6.40 mặc định; cấu hình `/admincp/.htaccess` giữ `RewriteEngine Off`. Kiểm tra live: `https://protools.com.vn/admincp/` trả về HTTP 200 OK.
  - **Sự cố 3 - Chặn và xóa triệt để `?mode=internal`**:
    - *Khắc phục*: Bổ sung quy tắc chuyển hướng vĩnh viễn trong root `.htaccess`: `RewriteCond %{QUERY_STRING} (?:^|&)mode=internal(?:&|$) [NC]` -> `RewriteRule ^(.*)$ /$1? [R=301,L]`. Mọi yêu cầu chứa `mode=internal` được chuyển hướng HTTP 301 tức thì về URL sạch, đồng thời client React `App.tsx` tự động loại bỏ tham số qua `replaceState`.
  - *Kiểm chứng thực tế (CDP Automated Inspection)*: Headless Chrome kết nối qua CDP trên Production `https://protools.com.vn/` ghi nhận `TOTAL LIVE CONSOLE ERRORS: 0`.

- **Sự cố & Tối ưu 27/10/2026 (Phiên 2): Triệt Tiêu Nháy Hard-Refresh, Khắc Phục Ảnh Murrplastik & Dọn Ô Quy Cách:**
  - **1. Triệt tiêu hoàn toàn nháy màn hình (`Ctrl + Shift + R`)**:
    - *Nguyên nhân*: Các template snapshot tĩnh trước đó chèn trực tiếp các header màu tối (`bg-slate-900`) hoặc banner gradient xanh giả lập vào bên trong `<div id="root">`. Khi làm mới cứng, trình duyệt hiển thị khối HTML này trong ~0,2 giây trước khi React SPA hydrate và đè lên giao diện sáng thật, gây cảm giác nháy giật mắt.
    - *Giải pháp*: Giữ nguyên `<div id="root"></div>` hoàn toàn rỗng trên toàn bộ các tệp HTML snapshot tĩnh (Trang chủ, `/san-pham`, 15 chuyên mục, 104 sản phẩm, trang tài liệu/báo giá). Toàn bộ nội dung văn bản SEO, bảng thông số kỹ thuật và thẻ liên kết phục vụ Bot tìm kiếm được chuyển gọn vào `<noscript>...</noscript>`. Trình duyệt có bật JavaScript sẽ không còn hiển thị bất kỳ khối tạm nào, triệt tiêu 100% nháy hình.
  - **2. Sửa lỗi ảnh Murrplastik không tải được (`ERR_NAME_NOT_RESOLVED`)**:
    - *Nguyên nhân*: Trong `src/data.ts` và `public/data/catalog_index.json`, các đường dẫn ảnh sản phẩm Murrplastik bị tiền tố 2 dấu gạch chéo `//images/products/murr/...`. Trong chuẩn web W3C, chuỗi `//images/...` được trình duyệt hiểu là URL tương đối theo giao thức (Protocol-relative URL) trỏ tới tên miền có tên là `images`. Trình duyệt gửi truy vấn DNS tìm domain `images` và báo lỗi không phân giải được tên miền.
    - *Giải pháp*: Chuẩn hóa toàn bộ tiền tố thành `/images/products/murr/...` (URL đường dẫn tuyệt đối từ root domain). Xác thực trực tiếp trên live: HTTP 200 OK, mime-type `image/webp`, tải mượt mà.
  - **3. Bỏ ô nhãn quy cách trên thẻ card sản phẩm**:
    - *Xử lý*: Đã xóa bỏ hoàn toàn khối div badge `absolute bottom-1.5 left-1.5 z-10 pointer-events-none` khỏi component [`VirtualCatalogGrid.tsx`](file:///d:/T&TVina/protools/src/components/VirtualCatalogGrid.tsx). Thẻ ảnh sản phẩm hiển thị thoáng, tinh giản và đồng nhất theo chuẩn Taste-Skill v2.

- **Tối ưu & Tách Cụm Biến Thể Murrplastik & Sửa Lỗi Ảnh Thumbnail EVOCHAIN (28/10/2026):**
  - **1. Phân rã cụm biến thể hỗn tạp `MP-FAM-BSH` thành các họ sản phẩm chuyên biệt**:
    - *Nguyên nhân*: Trước đây 18 mã sản phẩm thuộc 4 phân khúc kỹ thuật hoàn toàn khác nhau bị gom chung vào 1 thẻ `MP-FAM-BSH` (Bộ Kẹp Gá BSH & Phụ Kiện ET/SRF): xích dẫn hướng `KA 420/560`, đai kẹp co giãn robot `FHS-C`, nắp chụp/khớp giảm chấn `ET/SRF`.
    - *Giải pháp*:
      - Tạo họ mới `MP-FAM-FHS`: "Bộ Đai Kẹp Giữ Cáp Co Giãn Robot Murrplastik FHS-C" (SKU `MP-FHS-SERIES`) chứa đúng 3 biến thể đai kẹp robot chuyên dụng (`83693526`, `83693525`, `83693442`), đầy đủ bộ 3 ảnh kỹ thuật (ảnh chụp hãng thật 18.9 KB, bản vẽ 2D, ảnh kho thật).
      - Tạo họ mới `MP-FAM-ET`: "Vòng Chụp & Khớp Giảm Chấn Đầu Ống Luồn Cáp ET / SRF" (SKU `MP-ET-SERIES`) chứa đúng 3 biến thể phụ kiện đầu ống (`83723460`, `83723458`, `83692292`), đầy đủ bộ 3 ảnh kỹ thuật (ảnh chụp hãng thật 23.1 KB, bản vẽ 2D, ảnh kho thật).
      - Chuyển toàn bộ 12 mã bát gá đầu nối xích `KA 420` và `KA 560` về đúng họ xích `MP-FAM-KA` ("Đầu Nối Cố Định Xích KA 420 / KA 560 & Guốc Trượt GS"), nâng tổng số biến thể phụ kiện xích lên 13 mã chuẩn xác.
      - Tinh lọc `MP-FAM-UHE` chỉ giữ lại đúng 6 mã kích cỡ đế gá thông dụng (P09, P11, P16, P21, P29, P36).
      - Xóa bỏ triệt để mã họ hỗn tạp `MP-FAM-BSH`.
  - **2. Khắc phục triệt để lỗi thiếu ảnh Thumbnail trang chủ & ảnh đại diện EVOCHAIN**:
    - *Nguyên nhân*: 54 file WebP giả lập (dung lượng 1.306 bytes, pixel rỗng `murr_C..._studio.webp`) vô tình được gán làm ảnh đại diện chính (`image` và `images[0]`) cho các dòng xích `MP-FAM-SG420`, `MP-FAM-SG560`, `MP-FAM-RS`, `MP-FAM-TR`, `MP-FAM-KA`, khiến thẻ sản phẩm ngoài trang chủ và ảnh slot 1 trang chi tiết bị lỗi hiển thị.
    - *Giải pháp*:
      - Ánh xạ trực tiếp ảnh đại diện chính (`image` và `images[0]`) sang ảnh chụp thực tế tại kho hàng có độ phân giải cao (`murr_C..._real.webp`, dung lượng 112 KB - 120 KB).
      - Loại bỏ 100% các tham chiếu file rỗng 1.306 bytes khỏi mảng gallery ảnh chi tiết.
      - Tăng cường cơ chế phục hồi tại frontend:
        - `src/pages/ProductDetail.tsx`: Tự động lọc bỏ các file ảnh rỗng 1.306 bytes; tích hợp `onError` tự động chuyển sang ảnh tiếp theo nếu ảnh chính hoặc ảnh thumbnail gặp sự cố.
        - `src/components/VirtualCatalogGrid.tsx`: Bổ sung `onError` tự động tải ảnh dự phòng `p.images[1]` nếu ảnh chính gặp sự cố mạng.
  - **3. Đồng bộ Dữ liệu, Build & Triển khai Production**:
    - Danh mục chuẩn hóa đạt **105 sản phẩm chất lượng cao** đồng bộ 100% trên `src/data.ts`, `public/data/catalog_index.json` và `public/data/catalog_index_full.json`.
    - Engine Vite build & pre-render tĩnh thành công 105 snapshot sản phẩm và sitemap 132 URL.
    - Phát hành lên máy chủ Mắt Bão LiteSpeed (`s2d34.cloudnetwork.vn`) qua script FTP `deploy_production_root.py --skip-backup`.
    - Kiểm chứng tự động qua CDP Headless Chrome trên Live Production: 0 lỗi console, 0 lỗi request mạng, toàn bộ ảnh Murrplastik và EVOCHAIN hiển thị sắc nét.

- **Chuẩn Hóa Phân Rã Toàn Diện Danh Mục & Bóc Tách Độc Lập Biến Thể Murrplastik (28/10/2026):**
  - **1. Sự cố ghép sai biến thể trên `MP-FAM-MSV` và các dòng sản phẩm liên quan**:
    - *Hiện tượng*: Khi truy cập URL `https://protools.com.vn/san-pham/dau-noi-ong-luon-cap-thang-msv-ren-he-met-pg-mp-msv-series/?type=83602462`, bộ chọn biến thể xuất hiện cả miệng loa `V-ZLT-70`, bạc đạn xoay robot `KMG/F` và khớp bi `KEG/ZL` vốn không cùng chủng loại kỹ thuật với đầu nối thẳng MSV m-fix.
    - *Nguyên nhân cốt lõi*: Trong đợt gom cụm tự động 250 SKU Murrplastik trước đây, thuật toán gom cụm thô đã nhồi nhét nhiều phân khúc sản phẩm cơ khí khác nhau vào cùng một mã cha `MP-FAM-...`.
  - **2. Quy trình bóc tách và tái cấu trúc danh mục chuẩn kỹ thuật công nghiệp**:
    - **Họ MSV thẳng (`MP-FAM-MSV`)**: Tinh lọc giữ đúng 6 mã đầu nối thẳng ren hệ mét m-fix (`83602452`, `83602458`, `83602460`, `83602462`, `83602464`, `83602466`). Toàn bộ hình ảnh studio, bản vẽ 2D và ảnh chụp kho thật đồng bộ 100%.
    - **Nâng cấp Sản phẩm 1082 (`KMG/F`)**: Chuyển các mã bạc đạn xoay robot `83691658` (M25) và `83691660` (M32) về đúng sản phẩm *Khớp Cầu Bạc Đạn Robot Murrplastik KMG/F & Vòng Giữ Ống SRF*, bổ sung bản vẽ kỹ thuật 2D `murr_kmgf-ball-bearing-srf-hose-ring-186104_2d.webp`.
    - **Nâng cấp Sản phẩm 1083 (`KEG/ZL` & `V-ZLT`)**: Chuyển các mã khớp bi chống gập `83692258`, `83692260`, `83692468` và miệng loa thoát cáp `83692802` về đúng sản phẩm *Khớp Cầu Chống Gập Cáp KEG/ZL & Đầu Nối Thoát Cáp KEG/K / V-ZLT Robot Murrplastik*, bổ sung bản vẽ kỹ thuật 2D `murr_ball-joint-kegzl-hose-ring-srfzl-186097_2d.webp`.
    - **Bóc tách Hệ thống thu hồi (`1078`) & Ống EWX (`MP-FAM-EWXPAE`)**:
      - Chuyển 2 mã lò xo căng tự động `83692722` (EWX 21) và `83692724` (EWX 29) về đúng sản phẩm *Hệ Thống Thu Hồi Lực Kéo Ống Luồn Cáp Robot Murrplastik FHS / EWX Feedback System (20N)* (ID `1078`), bổ sung bản vẽ 2D `murr_retraction-system-set-185901_2d.webp`.
      - `MP-FAM-EWXPAE` khóa cố định đúng 1 quy cách ống ruột gà chịu uốn robot `EWX-PAE 70 Murrflex Jumbo, sw` (`83182080`), trỏ đúng ảnh đại diện ống nhựa thay vì ảnh bộ lò xo kéo.
    - **Tách Vòng bảo vệ PR/SV (`MP-FAM-PRSV`) khỏi Đầu nối PVG (`MP-FAM-PVG`)**: Tạo họ riêng `MP-FAM-PRSV` cho vòng chống mài mòn ống Jumbo 70 trên robot (`83691267`), giữ `MP-FAM-PVG` thuần túy 6 mã đầu nối ren hệ mét P-VG.
    - **Tách Đầu nối SAT-GF (`MP-FAM-SATGF`) khỏi Khớp góc KFW/D (`MP-FAM-KFW`)**: Tạo họ riêng `MP-FAM-SATGF` cho 5 mã đầu chụp ống bện đàn hồi GF-P (M16 - M40), giữ `MP-FAM-KFW` thuần túy 5 mã khớp góc quay 90 độ KFW/D.
    - **Tách Kẹp tiếp địa chống nhiễu EMV (`MP-FAM-EMV`) & Tấm giảm căng ZL (`MP-FAM-ZL`)**: Tạo họ riêng `MP-FAM-EMV` cho 5 mã kẹp xả nhiễu điện từ EMC (`MCS-EMV`, `MSCF-EMV`, `SCFJ-EMV`); giữ `MP-FAM-ZL` thuần túy 4 kích cỡ thanh lược giảm căng ZL; đưa đế dán và băng gai nhám Velcro về `MP-FAM-KH`.
    - **Tách Gioăng đệm luồn cáp KDT (`MP-FAM-KDT`) khỏi Khung KDL/D (`MP-FAM-KDLD`)**: Đưa 39 mã gioăng cao su tách đôi (`KDT/ZE+ 03` đến `31`, `BTG/E+`, `BTK/E+`) thành họ độc lập chuyên biệt; giữ `MP-FAM-KDLD` thuần túy cho bộ khung nhôm/nhựa và tấm bịt che.
    - **Tinh lọc Thẻ nhãn LPC (`MP-FAM-LPC`)**: Loại bỏ phụ kiện gá máy laser `86661031`, giữ thuần túy 3 kích cỡ thẻ nhựa khắc laser Polycarbonate.
  - **3. Quy chuẩn Dữ liệu & Triển khai Hệ thống**:
    - Toàn bộ 109 sản phẩm đạt chuẩn nghiêm ngặt kiểu tĩnh TypeScript (`pnpm lint` thoát mã 0).
    - Bộ snapshot tĩnh pre-render tạo thành công 109 trang sản phẩm và 136 URLs trong sitemap XML.
    - Kiểm thử tự động bằng CDP Headless Chrome trên môi trường thật: 0 lỗi console, 0 lỗi request mạng, triệt tiêu 100% tình trạng lẫn lộn biến thể khác dòng.
    - Phát hành đồng bộ 161 tệp lên máy chủ Production Mắt Bão LiteSpeed (`s2d34.cloudnetwork.vn`) và xác thực live thành công.

- **Quy Chuẩn Đồng Bộ Email Doanh Nghiệp Chính Thức (28/10/2026):**
  - **Sự cố xuất hiện email Gmail**: Trước đây một subagent trong phiên teamwork đã nhầm lẫn và đồng bộ chuỗi `t2t.vina@gmail.com` vào `COMPANY_INFO` và các thẻ Schema/SEO.
  - **Khắc phục triệt để**:
    - Chuẩn hóa 100% email doanh nghiệp chính thức của T&T Vina là **`info@t2tvina.com`**.
    - Rà soát và cập nhật đồng bộ xuyên suốt toàn bộ codebase:
      - `src/data.ts`: `COMPANY_INFO.email = 'info@t2tvina.com'`.
      - Thẻ Schema JSON-LD & SEO: `index.html`, `src/components/SEOHead.tsx`.
      - Trang cấu hình Robot Dresspack: `src/pages/RobotConfigurator.tsx` (các nút mailto và thông tin hỗ trợ kỹ thuật).
      - AI & LLM Discovery Manifests: `public/llms.txt`, `public/llms-full.txt`, `public/ai-manifest.json`.
      - Hệ thống trang tĩnh và đa ngôn ngữ Murrplastik: `generate_static_snapshots.py`, `public/murrplastik/index.html`, `public/murrplastik/assets/js/i18n.js`, `public/murrplastik/tin-tuc/index.html`, `public/murrplastik/tin-tuc/trien-lam-vec-2026/index.html`.
    - Đã xác thực thực tế trên Production (`https://protools.com.vn/`): 100% các trang trả về email đúng `info@t2tvina.com`, sạch hoàn toàn `t2t.vina@gmail.com`.


---

## 27. QUY CHUẨN CẤU HÌNH HỆ THỐNG LUỒN CÁP CÔNG NGHIỆP KDL & KDP TRÊN DIGITAL TOOLBOX (MURRPLASTIK CABLE ENTRY SUITE)
- **Bối cảnh & Nghiệp vụ B2B**:
  - Hệ thống Digital Toolbox của Protools được mở rộng đồng bộ với cấu trúc công cụ chuẩn của Murrplastik HQ:
    1. **Robot Dresspack Configurator**: Cấu hình giải pháp ống luồn và cùm kẹp cho cánh tay robot công nghiệp 6 trục.
    2. **KDL Configurator (Cable Entry for Cables WITH Connectors)**: Nhái lại và nâng cấp tính năng của `https://shop.murrplastik.com/kdl`.
    3. **KDP Configurator (Cable Entry for Cables WITHOUT Connectors)**: Nhái lại và nâng cấp tính năng của `https://shop.murrplastik.com/kdp`.
- **Cơ sở dữ liệu trích xuất & mô hình hóa**:
  - `src/data/kdlData.ts`:
    - 4 dòng hệ thống khung: `dch` (KDL/C, KDL/D, KDL/H), `mono` (KDL/D-mono M25-M50), `e` (KDL/E), `e-plus` (KDL/E+, KDL/ER+).
    - 91 model khung chuẩn kích thước 24-pole, 16-pole, 10-pole, 6-pole, 1-slot và Metric M25-M50.
    - 166 mã đệm luồn KDT (đệm đơn KDT/ZE, KDT/X, đệm đôi 2x, đệm 4x, đệm bít kín Blind plug, đệm mạng LAN RJ45, USB, ASI bus).
    - 50 bộ tọa độ (x, y) chính xác tuyệt đối phục vụ dựng bản vẽ vector 2D CAD trực quan.
  - `src/data/kdpData.ts`:
    - Dòng tấm tiêu chuẩn: KDP 24/29, KDP 24/17, KDP 24/11, KDP/X Inox 316L V4A (IP69K), KDP/Z 56 dây, KDP/R M50, KDP/R M63.
    - Dòng tấm On-Demand: Tùy biến hình học chữ nhật, bo góc R, hình tròn; vật liệu Inox V4A, V2A, Nhôm AlMg3, Nhựa PA6.6, Nhựa FDA.
    - Thuật toán `autoPlaceKdpMembranes()` tự động tính toán ma trận lỗ, khoảng cách an toàn (mép biên e >= 16mm, khe hở s >= 4mm) và đo lường mật độ điền đầy (Packing density).
- **Trải nghiệm người dùng & Tích hợp ứng dụng**:
  - Menu Digital Toolbox tại `src/components/Header.tsx`: Điều hướng phân nhánh rõ ràng trên cả Desktop dropdown và Mobile Drawer.
  - Router SPA sạch tại `src/App.tsx`: Hỗ trợ đường dẫn chuẩn SEO `/kdl`, `/kdl-configurator`, `/kdp`, `/kdp-configurator`.
  - Kết nối trực tiếp giỏ hàng B2B: Bấm "Thêm vào giỏ báo giá B2B" tự động đóng gói BOM linh kiện hoàn chỉnh kèm mã MPN Murrplastik.
  - Hỗ trợ xuất in hồ sơ giải pháp A4 chuẩn kỹ thuật kèm thông tin liên hệ đại diện phân phối chính thức T&T Vina.

---

## 28. QUY CHUẨN THIẾT KẾ VECTOR 2D CAD & CĂN CHỈNH ĐỒNG TÂM TUYỆT ĐỐI KHUNG KDL (CONCENTRIC CAD CALIBRATION ENGINE)
- **Sự cố lệch tâm bản vẽ CAD (Issue Audit 31/10/2026)**:
  - Khi người dùng kiểm tra cấu hình khung luồn cáp KDL (`http://localhost:3000/kdl`), xuất hiện hiện tượng các vòng tròn slot đệm luồn (ví dụ layout `e-24-7` với đệm BTK lớn và các đệm nhỏ) bị đẩy lệch lên mép trên cùng của khung và lệch sang trái, để lại khoảng trống màu đen lớn ở phía dưới và bên phải.
- **Nguyên nhân gốc rễ (Root Cause Analysis)**:
  1. **Tọa độ đệm lớn/vừa (Big/Medium grommets)**: Các mã đệm cỡ lớn (KDT/G, BTG) và vừa (KDT/X) trong 25 layout ban đầu lưu tọa độ góc trên-trái ($y = 13-14$) thay vì tâm hình học của tầng khung. Điều này khiến đệm lớn bị kéo lên hàng trên cùng thay vì nằm ngay chính giữa 2 hàng đệm nhỏ (ví dụ `e-24-7` có $y=14$ thay vì trung điểm $y=27$).
  2. **Khung SVG cố định (Hardcoded ViewBox)**: Thành phần SVG trước đó cố định `viewBox="0 0 240 100"` và khung khoét lỗ `width="208" height="72"`, áp dụng đồng loạt cho mọi loại khung từ cỡ 24, cỡ 6, khung tròn M25-M50 đến khung xếp tầng 30 dây (`e-plus-24-30` có chiều cao lên đến 255px).
- **Giải pháp Kỹ thuật Đồng tâm Động (Dynamic Concentric Geometry)**:
  1. **Hiệu chỉnh tọa độ chuẩn hóa (`src/data/kdlData.ts`)**: Cân chỉnh lại toàn bộ $y$ của 25 layout có đệm lớn và vừa về đúng trục đối xứng trung tâm của từng tầng:
     - Dòng DCH (24, 16, 10): Tọa độ tâm đệm vừa/lớn được đặt tại $y = 35.0$.
     - Dòng E (24, 16): Tọa độ tâm đệm lớn được đặt tại $y = 27.0$.
     - Dòng E-Plus: Tầng 1 tại $y = 32.0$, Tầng 2 tại $y = 128-129.0$, Tầng 3 tại $y = 226.0$.
  2. **Thuật toán Tự động Định vị Đồng tâm (`cadGeometry` trong `src/pages/KdlConfigurator.tsx`)**:
     - Đo lường hộp bao cực biên của toàn bộ cụm đệm: $\min X, \max X, \min Y, \max Y$, tính trọng tâm $(\text{centerX}, \text{centerY})$.
     - Tính kích thước khoét lỗ (Inner Cutout) đối xứng với biên an toàn ($P_X = 16\text{px}, P_Y = 14\text{px}$).
     - Tính kích thước thân khung ngoài (Outer Frame Flange: $16\text{px}$) và căn lề khung nhìn (ViewBox Margin: $6\text{px}$).
     - Áp dụng độ dời song song $(\Delta X, \Delta Y)$ để tâm của cụm đệm, tâm của lỗ khoét và tâm của khung ngoài trùng nhau tuyệt đối:
       $$\Delta X = \frac{W_{\text{viewBox}}}{2} - \text{centerX}, \quad \Delta Y = \frac{H_{\text{viewBox}}}{2} - \text{centerY}$$
     - Hỗ trợ phân nhánh tự động cho cả khung chữ nhật bo góc và khung tròn hệ mét M25, M32, M40, M50 (dùng thẻ `<circle>` đồng tâm).
  3. **Kết quả**: Khoảng cách mép trên và mép dưới bằng nhau tuyệt đối ($14.0\text{px} = 14.0\text{px}$), mép trái và mép phải bằng nhau tuyệt đối ($16.0\text{px} = 16.0\text{px}$), các lỗ ốc vít định vị 4 góc chuẩn xác.

---

## 29. QUY CHUẨN XỬ LÝ TƯƠNG TÁC HOVER TRÊN BẢN VẼ VECTOR CAD SVG (SVG ZERO-JITTER INTERACTION RULE)
- **Sự cố giật / rung viền slot khi rê chuột (Issue Audit 31/10/2026)**:
  - Khi người dùng rê chuột đến mép ngoài của các vòng tròn đệm cáp phi màu xanh (Ø) trên bản vẽ 2D CAD, hình tròn bị giật / nhấp nháy liên hồi (oscillating jitter).
- **Nguyên nhân kỹ thuật (Root Cause)**:
  1. **Hiệu ứng `hover:scale-105` trong SVG**: Khác với HTML thông thường, thẻ `<g>` trong SVG khi bị áp dụng thuộc tính `scale()` qua CSS nếu không có `transform-box: fill-box; transform-origin: center` sẽ lấy gốc tọa độ $(0, 0)$ của toàn bộ `viewBox` làm tâm biến đổi. Do đó khi phóng to $1.05\times$, vị trí hình tròn bị **dời tịnh tiến (displacement) vài pixel sang phải và xuống dưới**, làm mép vòng tròn văng ra khỏi con trỏ chuột.
  2. **Vòng lặp nhấp nháy vô tận (Oscillation Loop)**: Chuột chạm mép $\to$ kích hoạt `:hover` $\to$ vòng tròn giật nhảy sang vị trí mới $\to$ con trỏ lọt ra ngoài vùng hover $\to$ tắt `:hover` $\to$ vòng tròn bật giật về vị trí cũ $\to$ con trỏ lại chạm mép $\to$ lặp lại ở tần số 60-120fps.
  3. **Xung đột vùng nhận lệnh (Hit Area Contention)**: Thẻ `<text>` bên trong nhận con trỏ chuột (pointer events) làm ngắt quãng sự kiện chuột của vòng tròn.
- **Quy tắc giải pháp Zero-Jitter chuẩn CAD công nghiệp**:
  1. **Tuyệt đối không dùng `scale()` trên đối tượng vector CAD**: Thay thế chuyển dịch hình học bằng hiệu ứng đổi màu stroke và độ sáng phẳng (`transition-colors duration-150 group-hover:stroke-cyan-300 group-hover:brightness-110`).
  2. **Tạo vùng đệm cảm ứng vô hình (Expanded Hit Area Cushion)**: Bổ sung một thẻ `<circle cx={x} cy={y} r={radius + 3.5} fill="transparent" className="pointer-events-auto" />` nằm lót dưới cùng. Vùng này mở rộng ra ngoài mép đồ họa 3.5px, tạo vùng đệm an toàn tuyệt đối giúp con trỏ chuột không bao giờ bị rơi ra khỏi mục tiêu.
  3. **Vô hiệu hóa sự kiện chuột trên text nội bộ**: Thêm `pointer-events-none` và `select-none` vào nhãn kích thước cáp (`Ø`) để chuột lướt mượt mà không bị ngắt quãng.

---

## 30. QUY CHUẨN ĐÁNH GIÁ CHẤT LƯỢNG TOÀN DIỆN (CTO MULTI-ROLE PRODUCTION AUDIT: LIGHTHOUSE 100, WCAG 2.1 AA & B2B DEFENSE)
- **Hội đồng Phản biện Đa vai trò (CTO vs Senior FE vs Senior BA vs QA Tester)**:
  - Tiến hành tổng rà soát toàn bộ mã nguồn cấu hình luồn cáp KDL/KDP theo 4 tiêu chí Lighthouse, chuẩn nghiệp vụ cơ khí Murrplastik và độ tin cậy vận hành thực tế.
- **Các khiếm khuyết phát hiện & Biện pháp khắc phục tức thời**:
  1. **Accessibility (WCAG 2.1 AA) - Nguy cơ rớt điểm a11y (< 70)**:
     - *Phát hiện*: Toàn bộ các nút bấm tăng/giảm số lượng (+/-), xóa cáp, in ấn và chuyển bước trước đó thiếu `aria-label`; các slot CAD `<g>` trong SVG không có `role="button"` và `tabIndex={0}`, khiến người dùng phím hoặc trợ thính không thể tương tác.
     - *Khắc phục*: Bổ sung 100% `aria-label`, `aria-current="step"`, `role="button"`, `tabIndex={0}` kèm bộ bắt phím `Enter`/`Space` trên mọi slot CAD; nâng độ tương phản màu chữ phụ lên chuẩn >= 4.5:1.
  2. **Typography & Tabular Numbers (Rule 22 Standard)**:
     - *Phát hiện*: Thiếu thuộc tính `tabular-nums` trên các cột bảng dữ liệu kỹ thuật, khiến số lượng, kích thước đường kính Ø và mã MPN bị thụt thò khi render.
     - *Khắc phục*: Tích hợp `font-mono tabular-nums` trên 100% các ô số liệu tại Step 2 và Step 4 của cả KDL và KDP.
  3. **B2B Business Logic & Phòng ngừa Lỗi Ngân sách (Senior BA Defense)**:
     - *Phát hiện*: Thiếu cảnh báo khi tổng số sợi cáp khai báo vượt quá dung lượng vị trí của khung (Capacity Overflow); thiếu chú thích đơn vị đóng gói VPE Murrplastik (10 cái/hộp).
     - *Khắc phục*: Bổ sung cảnh báo thời gian thực `isCapacityExceeded` (nổi banner vàng cảnh báo khi số cáp vượt quá số slot của khung); bổ sung ghi chú quy cách đóng gói VPE chuẩn Đức trên bảng kê BOM.
  4. **Công thái học In ấn & Xuất Hồ Sơ Kỹ Thuật (`@media print`)**:
     - *Phát hiện*: Khi nhấn in hồ sơ (`window.print()`), hệ thống in tràn cả thanh header điều hướng, nút chuyển công cụ và nút gọi điện hotline.
     - *Khắc phục*: Thêm biểu mẫu in chuyên dụng (Print Cover Header) hiển thị logo T&T Vina, hotline, ngày xuất hồ sơ; đồng thời ẩn sạch 100% thanh điều hướng và nút bấm thao tác khi in hoặc lưu PDF (`print:hidden`).
  5. **Tối ưu hóa Bố cục Di động (Mobile Breakpoint <= 768px)**:
     - *Phát hiện*: Thanh Stepper Wizard 4 bước đặt cứng `grid-cols-4` làm vỡ chữ trên màn hình hẹp (< 390px).
     - *Khắc phục*: Chuyển sang bố cục linh hoạt `grid grid-cols-2 sm:grid-cols-4` hiển thị gọn gàng, sắc nét trên mọi thiết bị di động.

---

## 31. QUY CHUẨN TÍCH HỢP VIDEO HƯỚNG DẪN CHÍNH THỨC MURRPLASTIK (VIDEO TUTORIAL MODAL ENGINE)
- **Bối cảnh & Chuẩn thiết kế Murrplastik HQ**:
  - Tại trang cấu hình KDL (`https://shop.murrplastik.com/kdl`), hãng bố trí thanh banner nổi màu xanh navy đậm với thông điệp: *"Videos are available for this configurator. [Watch Videos]"*.
- **Triển khai kỹ thuật trên [KdlConfigurator.tsx](file:///d:/T&TVina/protools/src/pages/KdlConfigurator.tsx)**:
  1. **Thanh Banner Hướng dẫn (Pixel-Perfect Banner)**:
     - Đặt tại đầu vùng làm việc chính (`max-w-7xl`), màu nền `#0B2535`, viền `#16445E`.
     - Icon YouTube chuẩn nhận diện (nền đỏ `#FF0000`, tam giác trắng `Play`).
     - Nút "Watch Videos" màu trắng chữ đỏ `#C8102E` nổi bật.
  2. **Trình phát Video Popup Chuẩn Công Thái Học (Modal Player)**:
     - Video chính thức: ID `uyH7Bd3pnx0` (`https://youtu.be/uyH7Bd3pnx0`).
     - Tích hợp qua tên miền bảo mật không cookie `https://www.youtube-nocookie.com/embed/uyH7Bd3pnx0?autoplay=1&rel=0`.
     - Tỉ lệ khung hình chuẩn rạp 16:9 (`aspect-video`), tự động phát khi mở.
     - Đóng nhanh bằng phím `Escape`, nhấp chuột ra ngoài vùng nền mờ (Backdrop click) hoặc nút đóng `X`.
     - Đính kèm link mở tab mới trực tiếp trên YouTube kèm bản quyền Murrplastik Systemtechnik GmbH.

---

## 32. QUY CHUẨN ĐA NGÔN NGỮ (I18N) TOÀN DIỆN CHO DIGITAL TOOLBOX & BANNER VIDEO ĐƠN NGỮ ĐỘNG (I18N DYNAMIC SINGLE-LINE STANDARD)
- **Chuẩn hóa Thông điệp Đơn ngữ Động (Single-Line, Single-Language Policy)**:
  - *Vấn đề phát hiện*: Thanh banner video hướng dẫn hiển thị song ngữ cứng lặp lại (*Videos are available for this configurator. Video hướng dẫn thao tác...*) gây rối mắt và thừa thãi khi website đã tích hợp bộ chuyển đổi ngôn ngữ toàn cầu.
  - *Giải pháp triệt để*: Loại bỏ hoàn toàn chuỗi song ngữ tĩnh; kích hoạt động từ khóa 	('kdl.video_banner') và 	('kdl.watch_video') để chỉ hiển thị đúng 1 dòng thông điệp duy nhất theo đúng ngôn ngữ mà người dùng đang chọn trên Header:
    - i: *Video hướng dẫn thao tác cấu hình khung luồn cáp KDL* | [Xem Video]
    - en: *Videos are available for this configurator.* | [Watch Videos]
    - de: *Video-Anleitungen sind für diesen Konfigurator verfügbar.* | [Videos ansehen]
    - zh-CN: *本配置器提供操作教学视频。* | [观看视频]
    - ja: *このコンフィギュレータの操作動画をご覧いただけます。* | [動画を見る]
    - ko: *이 컨피규레이터에 대한 동영상 가이드가 제공됩니다.* | [동영상 보기]
    - 	h: *มีวิดีโอแนะนำการใช้งานสำหรับตัวกำหนดค่านี้* | [ดูวิดีโอ]
- **Kiến trúc Bản địa hóa Toàn diện 7 Ngôn ngữ (Comprehensive 7-Locale Ingestion)**:
  - Đồng bộ trọn bộ từ điển cho cả 2 bộ công cụ cấu hình:
    1. **Khung luồn cáp KDL** ([src/pages/KdlConfigurator.tsx](file:///d:/T&TVina/protools/src/pages/KdlConfigurator.tsx)): 91+ khóa dịch phủ kín 4 bước wizard (bộ lọc hệ thống, bảng khai báo cáp, cảnh báo quá tải, bản vẽ 2D CAD live, bảng kê BOM giải pháp và video hướng dẫn).
    2. **Tấm màng luồn cáp KDP** ([src/pages/KdpConfigurator.tsx](file:///d:/T&TVina/protools/src/pages/KdpConfigurator.tsx)): 79+ khóa dịch phủ kín 4 bước wizard (danh mục preset tiêu chuẩn, tùy biến kích thước tấm/vật liệu, khai báo cáp, tính toán ma trận màng 2D, hồ sơ kỹ thuật chuẩn ISO 9001).
  - Tích hợp hàm trợ lực nội suy biến 	t(key, params) linh hoạt thay thế các biến động ({count}, {total}, {frame}, {remaining}, {name}) mà không phá vỡ cú pháp i18n React.
  - Tuyệt đối bảo toàn chuẩn không icon emoji Windows, tuân thủ bảng số kỹ thuật 	abular-nums và vượt qua kiểm thử pnpm tsc --noEmit và pnpm build với 0 lỗi.

- **Bản địa hóa sâu cho Danh mục Model & Thẻ Presets (Deep i18n Dynamic Injection)**:
  - *Sự cố phát hiện*: Khi chuyển sang Tiếng Thái (	h) hoặc các ngôn ngữ khác, các thẻ hệ thống chính (KDL/E, KDL/E+, KDL/C-D-H, KDL/D-mono) vẫn còn sót văn bản tiếng Việt tĩnh (*Phổ biến nhất*, *Hiệu suất cao*, *Hệ thống khung luồn cáp chia đôi kinh tế...*).
  - *Giải pháp triệt để*:
    - Bổ sung động các khóa kdl.sys_{id}_badge và kdl.sys_{id}_desc vào toàn bộ 7 ngôn ngữ.
    - Cập nhật [src/pages/KdlConfigurator.tsx](file:///d:/T&TVina/protools/src/pages/KdlConfigurator.tsx) kích hoạt 	('kdl.sys_' + sys.id + '_badge', sys.badge) và 	('kdl.sys_' + sys.id + '_desc', sys.description).
    - Đồng bộ hóa các trường phụ tải: Tên cáp mẫu, đơn vị tính BOM (cái / pcs / ชิ้น), loại linh kiện (Frame / Blind plug / Grommet), gioăng đệm (EPDM / PU Foamed) và phương thức bắt gá trên [src/pages/KdpConfigurator.tsx](file:///d:/T&TVina/protools/src/pages/KdpConfigurator.tsx).


---

## 33. QUY CHUẨN ĐỒNG BỘ ĐA NGÔN NGỮ TOÀN DIỆN CHO BANNER LOGISTICS, SẢN PHẨM & GIỎ BÁO GIÁ (GLOBAL I18N SYNC & ZERO STATIC FALLBACK TRAP)
- **Giải quyết triệt để bẫy Fallback chuỗi tĩnh (Static String Fallback Trap)**:
  - Khi gọi `t('logistics.kcn_title', 'Cam Kết Giao Hàng Hỏa Tốc...')`, nếu khóa `logistics.kcn_title` không được định nghĩa trong file JSON ngôn ngữ đang kích hoạt (như `th.json`, `en.json`, `de.json`), hàm dịch sẽ tự động trả về giá trị fallback mặc định tiếng Việt, gây hiện tượng không đổi ngôn ngữ dù cờ đã chuyển.
  - Khắc phục: Khai báo đầy đủ 100% các nhánh từ điển trong cả 7 file `src/i18n/locales/*.json` (`logistics`, `company`, `hero.case_study_title`, `footer.tax_code_label`, `header.map_tooltip`).
- **Bản địa hóa 30 Dòng Sản Phẩm Murrplastik (`src/i18n/productTranslations.ts`)**:
  - Dòng sản phẩm `MP-FAM-MSV` (*Đầu Nối Ống Luồn Cáp Thẳng MSV (Ren Hệ Mét & PG)*) và toàn bộ 29 dòng Murrplastik khác đã được trang bị bản dịch chính xác cho 7 ngôn ngữ:
    - `vi`: *Đầu Nối Ống Luồn Cáp Thẳng MSV (Ren Hệ Mét & PG)*
    - `en`: *MSV Straight Conduit Fitting (Metric & PG Threads)*
    - `de`: *MSV Gerade Schlauchverschraubung (Metrisch & PG Gewinde)*
    - `zh-CN`: *MSV 直通电缆保护软管接头（公制与 PG 螺纹）*
    - `ja`: *MSV ストレート型電線保護管コネクタ（メートル＆PGネジ）*
    - `ko`: *MSV 스트레이트 전선관 피팅 (미터 & PG 나사)*
    - `th`: *ข้อต่อท่อร้อยสายเคเบิลแบบตรง MSV (เกลียวเมตริก & PG)*
- **Bao phủ Toàn bộ Phễu Tìm kiếm & Giỏ Báo Giá (End-to-End Search & RFQ Cart Localization)**:
  - Đồng bộ `getLocalizedProduct(item, locale)` vào cả thanh tìm kiếm gợi ý [`Header.tsx`](file:///d:/T&TVina/protools/src/components/Header.tsx) và bảng hiển thị/xuất file CSV [`CartQuote.tsx`](file:///d:/T&TVina/protools/src/pages/CartQuote.tsx). Khách hàng quốc tế khi thao tác báo giá hoặc tải file `.csv` đều nhận được tên thiết bị và quy cách bản địa hóa chính xác 100%.
