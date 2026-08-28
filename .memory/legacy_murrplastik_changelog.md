# Changelog

Tất cả các thay đổi quan trọng của dự án sẽ được lưu trữ tại đây.

## [2.1.0] - 2026-08-18

**Service**: murrplastik-vn-web  
**Purpose**: compliance(legal, branding, seo, i18n): Rà soát và chuẩn hóa pháp lý thương hiệu phân phối ủy quyền theo yêu cầu của Murrplastik Systemtechnik GmbH (Đức).  
**Release at**: 18/08/2026  
**By who**: KhaiLL

### 1. Chuẩn hóa Định danh Pháp nhân & Đại lý Ủy quyền
- Làm rõ quyền sở hữu và vận hành website: thuộc về **Công ty TNHH Công nghiệp T&T Vina** với tư cách là **Đại lý phân phối ủy quyền** (Authorized Distributor).
- Loại bỏ toàn bộ các cụm từ gây nhầm lẫn là chi nhánh/văn phòng đại diện của Murrplastik Đức.
- Cập nhật Title, Meta Description, Thẻ Open Graph, Twitter Cards và Schema JSON-LD trên toàn bộ các trang (`index.html`, 5 trang `products/*.html`, trang `industries/thuc-pham-va-do-uong/`, `industries/san-xuat-o-to/`).

### 2. Cập nhật Giao diện, Liên kết & Disclaimer Bản quyền
- Sửa `footer-brand` thành `T&T VINA INDUSTRIAL CO., LTD`.
- Cập nhật nhãn kênh Facebook thành `T&T Vina`.
- Bổ sung tuyên bố miễn trừ trách nhiệm pháp lý và bản quyền thương hiệu (Trademark Disclaimer) tại chân trang toàn website.
- Chuẩn hóa toàn bộ từ điển song ngữ VI/EN trong `assets/js/i18n.js`.
- Cập nhật giao diện trang quản trị Admin (`admin/index.html`, `admin/dashboard.html`) sang nhận diện T&T Vina.

---

## [2.0.0] - 2026-07-29

**Service**: murrplastik-vn-web  
**Purpose**: feat(industry, 3d, seo, i18n): Tích hợp trang chuyên ngành Sản xuất Ô tô (VinFast Cát Hải), Trình xem 3D CAD/STP tương tác, chuẩn hóa tên pháp nhân T&T Vina & TTPC, nâng cấp bộ lọc đa ngôn ngữ v2.0.0.  
**Release at**: 29/07/2026  
**By who**: KhaiLL

### 1. Thêm trang chuyên ngành Sản xuất Ô tô (`industries/san-xuat-o-to/`)
- Tích hợp trang con landing page chuyên biệt dành riêng cho ngành công nghiệp Sản xuất Ô tô (Automotive Industry).
- Giới thiệu giải pháp bảo vệ cáp & Dress Pack trên Robot ABB tại nhà xưởng Thân vỏ VinFast Cát Hải.
- Cấu hình phân cấp thẻ breadcrumb, thẻ meta OpenGraph, Twitter Cards và dữ liệu cấu trúc Schema.org đầy đủ.

### 2. Tích hợp Trình xem 3D CAD/STP Tương tác (`assets/js/3d-viewer.js` & `assets/3d/`)
- Xây dựng trình xem mô hình 3D tương tác trực tiếp dựa trên Three.js cho phép phóng to, xoay 360 độ và kiểm tra chi tiết linh kiện phụ kiện Robot Murrplastik (R-Tec Liner 550mm, ống luồn EWX-PAE 70, khớp nối KEG-AK).
- Tích hợp trình xem 3D vào các trang sản phẩm và trang ngành ô tô.

### 3. Cập nhật Đa ngôn ngữ (i18n) & Phiên bản v2.0.0
- Nâng cấp phiên bản tài nguyên tĩnh `v2.0.0` trên toàn bộ hệ thống file HTML/JS/CSS để khử triệt để bộ nhớ đệm (Cache Busting).
- Bổ sung từ điển bản dịch tiếng Việt, tiếng Anh cho các danh mục ngành mới (Automotive, Robot Automation) trong `assets/js/i18n.js`.

---

## [1.7.0] - 2026-07-20

**Service**: murrplastik-vn-web  
**Purpose**: feat(rebranding, staging, deploy): Tái nhận diện thương hiệu T&T Vina, cấu hình tách biệt môi trường Staging/Production và thiết lập quy trình deploy tự động qua FTPS.  
**Release at**: 20/07/2026  
**By who**: KhaiLL

### Thay đổi nhận diện thương hiệu (Rebranding)
- **Tên doanh nghiệp**: Thay đổi toàn bộ các tham chiếu "Murrplastik Việt Nam" thành "T&T Vina / T&T Vina Industrial Co., Ltd".
- **Logo**: Thay đổi logo gốc trên Header và Footer của toàn bộ trang web (trang chủ, các trang sản phẩm và trang ngành F&B) sang thiết kế "T&T VINA (Đại lý ủy quyền chính thức Murrplastik)".
- **Email liên hệ**: Đổi từ `sales@murrplastik-vn.com` thành `sales@murrplastik-vn.com`.
- **Đường dẫn nội bộ**: Chuyển đổi toàn bộ liên kết tên miền nội bộ từ `murrplastikvn.com` sang tên miền mới `murrplastikvn.com`.

### Triển khai môi trường Staging & Production riêng biệt
- **Môi trường Staging**:
  - Tự động chèn thẻ meta `<meta name="robots" content="noindex, nofollow" />` vào `<head>` của các file HTML.
  - Cấu hình file `robots.txt` chứa `User-agent: *\nDisallow: /` để chống Google lập chỉ mục.
  - Tạo cấu hình file `.htaccess` tự động tích hợp xác thực mật khẩu Basic Authentication (`.htpasswd` dùng chuẩn mã hóa Apache MD5) để khóa truy cập công cộng mà không làm ảnh hưởng đến các quy tắc viết lại URL sạch.
- **Môi trường Production**:
  - Không chèn thẻ `noindex`, robots.txt cho phép các bộ máy tìm kiếm quét lập chỉ mục.
  - Loại bỏ Basic Authentication để người dùng truy cập tự do.
  - Giữ nguyên các quy tắc định tuyến URL sạch trong `.htaccess`.

### Tự động hóa Deployment (CI/CD qua FTPS)
- **Kịch bản Build và Đóng gói (`copy_and_replace.py`)**: Viết lại script hỗ trợ đối số dòng lệnh (`staging` hoặc `production`) để tự động đóng gói phiên bản sạch theo từng môi trường.
- **Đồng bộ FTP Delta (`deploy_staging.py` và `deploy_production.py`)**: Tích hợp các kịch bản Python đồng bộ hóa thông minh chỉ tải lên các tệp tin thay đổi (so sánh kích thước thông qua cache thư mục từ server), tự động kết nối qua giao thức mã hóa an toàn FTPS (FTP over TLS) và có khả năng tự động kết nối lại khi đường truyền mạng gián đoạn.
- **Bảo mật file cấu hình**: Đưa `.env` lưu thông tin tài khoản FTP và các file script deploy, thư mục build tạm vào `.gitignore` để ngăn rò rỉ thông tin đăng nhập lên kho lưu trữ mã nguồn Git.
- **Cẩm nang bảo mật (`security_skills_pack.md`)**: Biên soạn tài liệu hướng dẫn và lưu ý bảo mật, tối ưu token cho lập trình viên và trợ lý AI trong các phiên làm việc tiếp theo.

## [1.6.1] - 2026-07-09

**Service**: murrplastik-vn-web  
**Purpose**: feat(seo, structure): Tối ưu hóa Technical SEO (Sitemap, Canonical, Hreflang, Schema Breadcrumb, Schema Product), tối ưu hiệu năng LCP (Fetchpriority), Theme Color và Social Media Preview cho toàn bộ website.  
**Release at**: 09/07/2026  
**By who**: KhaiLL

### Tối ưu hóa Technical SEO (Kỹ thuật SEO)
- **Sitemap.xml**: Cập nhật file `sitemap.xml` để khai báo đầy đủ đường dẫn của 5 trang sản phẩm và 1 trang ngành Thực phẩm & Đồ uống (F&B), giúp Google Bot dễ dàng thu thập dữ liệu và lập chỉ mục (index) nhanh chóng.
- **Thẻ Canonical**: Bổ sung thẻ `<link rel="canonical">` vào tất cả các trang con để chống lỗi "Duplicate Content" (nội dung trùng lặp) khi URL bị gắn thêm các tham số theo dõi (như từ chiến dịch quảng cáo).
- **Thẻ Đa ngôn ngữ (Hreflang)**: Khai báo đầy đủ thẻ `<link rel="alternate" hreflang="vi/en">` cho toàn bộ các trang con, đồng thời bổ sung cấu hình tiếng Việt còn thiếu ở trang chủ, giúp Google đề xuất đúng ngôn ngữ cho người tìm kiếm.
- **Schema Breadcrumb (JSON-LD)**: Chèn đoạn mã dữ liệu cấu trúc (Structured Data) BreadcrumbList dạng JSON-LD vào thẻ `<head>` của các trang con. Việc này giúp kết quả trên Google (SERP) hiển thị chuỗi phân cấp gọn gàng (VD: `Murrplastik Việt Nam > Sản phẩm > Tên SP`) thay vì URL thô, làm tăng độ chuyên nghiệp và tỷ lệ nhấp chuột (CTR).

### Tối ưu hóa Hiển thị trên Mạng xã hội (Social Media Preview)
- **Thẻ Open Graph & Twitter Cards**: Thêm các thẻ `<meta property="og:image">`, `og:url`, `og:type` và `<meta name="twitter:card">` vào toàn bộ các trang (Trang chủ, 5 trang Sản phẩm, và trang F&B).
- **Hình ảnh nhận diện**: Thiết lập `logo_murrplastik_vn.png` làm ảnh đại diện mặc định để Zalo, Facebook, LinkedIn có thể tự động tải và hiển thị chính xác khi người dùng chia sẻ liên kết trang web.

### Tối ưu hóa Trải nghiệm và Kỹ thuật Nâng cao
- **Schema Product (JSON-LD)**: Cấu hình dữ liệu cấu trúc `Product` cho 5 trang sản phẩm (KDH, SUV, ACS, EFK, AUR), bao gồm ảnh đại diện, mô tả chi tiết và thương hiệu Murrplastik. Điều này tối ưu hóa khả năng hiển thị trên Google Shopping và Google Hình Ảnh.
- **Theme Color (Giao diện Mobile)**: Bổ sung thẻ `<meta name="theme-color" content="#C8102E">` vào toàn bộ website. Tính năng này sẽ tự động đổi màu thanh địa chỉ (URL bar) của trình duyệt di động (Chrome, Safari, Edge) sang màu Đỏ thương hiệu, tạo cảm giác như khách hàng đang dùng một Native App cao cấp.
- **Tăng tốc LCP (Fetchpriority)**: Áp dụng thuộc tính `fetchpriority="high"` cho bức ảnh lớn nhất (Hero Image) tại trang F&B để ép trình duyệt dồn tài nguyên tải ảnh này đầu tiên. Cải thiện mạnh mẽ điểm số Largest Contentful Paint (LCP) và trải nghiệm tải trang.

## [1.6.0] - 2026-07-08

**Service**: murrplastik-vn-web  
**Purpose**: perf(performance, seo): Tối ưu hóa hiệu năng chuyên sâu, triệt tiêu Forced Reflow, tối ưu CLS và cấu hình máy chủ.  
**Release at**: 08/07/2026  
**By who**: KhaiLL

### Tối ưu hóa Chuyển hướng & Máy chủ (.htaccess)
- **Tốc độ phản hồi (TTFB)**: Gộp các quy tắc chuyển hướng HTTPS và www/non-www thành một block xử lý duy nhất để rút ngắn chuỗi chuyển hướng từ 2 hop xuống còn 1 hop.

### Khắc phục Lỗi Bố cục & Hiệu năng JavaScript (assets/js/main.js)
- **Triệt tiêu Forced Reflow**: Refactor hàm `scrollSpy`, popup quảng cáo và nút "Back to Top". Thay vì đọc trực tiếp các thuộc tính bố cục (`offsetTop`, `scrollHeight`) trong listener sự kiện `scroll`, giá trị được cache trước tại bộ biến toàn cục và chỉ cập nhật lại khi xảy ra sự kiện `resize` hoặc `load`.

### Tối ưu hóa Core Web Vitals & Tránh xê dịch bố cục CLS (index.html & F&B Page)
- **Kích thước hình ảnh**: Khai báo rõ ràng thuộc tính `width` và `height` cho tất cả ảnh chính (banner popup, danh sách sản phẩm, thư ủy quyền đại lý ở trang chủ; ảnh đại diện dự án, ảnh sản phẩm, logo Zalo ở trang Thực phẩm & Đồ uống).
- **Trì hoãn Chặn hiển thị**: Preload Google Fonts bất đồng bộ bằng `link rel="preload"` và thêm thuộc tính `defer` vào các script `i18n.js`, `main.js`, `form.js` để tránh render-blocking.

## [1.5.1] - 2026-07-07

**Service**: murrplastik-vn-web  
**Purpose**: fix(font, encoding): Sửa lỗi hiển thị sai font chữ (mã hóa ký tự) tiếng Việt trên trang con Thực phẩm & Đồ uống (F&B) và cấu hình UTF-8 mặc định cho máy chủ.  
**Release at**: 07/07/2026  
**By who**: KhaiLL

### Khắc phục lỗi hiển thị font (Mã hóa ký tự)
- **Di chuyển thẻ Meta Charset**: Di chuyển thẻ `<meta charset="UTF-8">` và `<meta name="viewport">` lên đầu thẻ `<head>` trong file `industries/foodbeverage/index.html` để đảm bảo trình duyệt nhận diện UTF-8 ngay lập tức (trong 1024 byte đầu tiên), khắc phục lỗi font tiếng Việt hiển thị dạng Mojibake.
- **Cấu hình Bảng mã mặc định (.htaccess)**: Thêm chỉ thị `AddDefaultCharset UTF-8` và `AddCharset UTF-8` trong file cấu hình `.htaccess` để máy chủ Apache/LiteSpeed luôn phục vụ các file tĩnh (HTML, CSS, JS, JSON) với bộ mã UTF-8 mặc định.

## [1.5.0] - 2026-07-06

**Service**: murrplastik-vn-web  
**Purpose**: feat(subpage, i18n, responsive): Tích hợp toàn diện trang con Thực phẩm & Đồ uống (F&B) và hoàn thiện hệ thống đa ngôn ngữ VI/EN song ngữ.  
**Release at**: 06/07/2026  
**By who**: KhaiLL

### Tích hợp Trang con Thực phẩm & Đồ uống (Food & Beverage)
- **Tích hợp Code & Tài nguyên**: Nhập toàn bộ dữ liệu, hình ảnh, video và cấu trúc từ dự án `foodbeverage_murrplastikvn` vào thư mục `industries/foodbeverage/`.
- **Đồng bộ hóa Trang chủ (`index.html`)**: Đưa mục "Thực phẩm" (Food & Beverage) lên vị trí đầu tiên trong danh mục Ngành công nghiệp (`#industries`), áp dụng hiệu ứng hover tương tác, chuyển hướng trực tiếp vào trang con F&B.
- **Đồng bộ Đặc trưng Thương hiệu**: Bổ sung Favicon chuẩn, nút "Quay lại trang chủ" thương hiệu, và đồng bộ thông tin đại lý ủy quyền T&T Vina trên thanh Navigation Header.

### Tối ưu hóa Navigation & Layout Responsive
- **Cố định Thanh Navigation Bar**: Khắc phục hoàn toàn hiện tượng vỡ/xuống thành 2 dòng trên thanh menu khi chuyển đổi ngôn ngữ bằng cách thiết lập `white-space: nowrap`, `display: inline-block` và `flex-shrink: 0` cho toàn bộ liên kết điều hướng và nút chức năng.

### Hệ thống Đa ngôn ngữ Chuyên sâu (i18n VI/EN)
- **Mở rộng Từ điển `assets/js/i18n.js`**: Bổ sung bộ từ điển VI/EN đầy đủ cho trang F&B bao gồm:
  - **Sản phẩm & Giải pháp (`fb.prod.*`)**: 4 tab sản phẩm (Thép không gỉ FDA, Nhựa thực phẩm FDA, Ống & Xích nhựa vệ sinh, Lạt nhựa phát hiện dị vật), mô tả chi tiết, ưu điểm và bảng thông số kỹ thuật (Spec Tables).
  - **Thư viện Tài liệu (`fb.lib.*`, `fb.doc*`)**: Tiêu đề tài liệu, định dạng PDF, kích thước file và các nút bấm xem trực tuyến/tải về.
  - **Các dự án mẫu (`fb.cases.*`, `fb.case*`)**: Case studies thực tế (Velec Systems, Züger AG, Facebook Reels video).
  - **Thông tin Đại lý & Form (`fb.info.*`, `fb.contact.*`)**: Nhãn liên hệ, email, hotline, hướng dẫn quét QR Zalo và thông báo gửi thành công (Toast).
  - **Chân trang (`fb.foot.*`)**: Mô tả đại lý, danh mục liên kết nhanh và ghi chú bản quyền.
- **Gắn thẻ HTML (`data-i18n` & `data-i18n-html`)**: Gắn thuộc tính dịch thuật chính xác vào tất cả các thẻ văn bản và thẻ HTML chứa format trong `industries/foodbeverage/index.html`, đảm bảo trải nghiệm chuyển đổi ngôn ngữ mượt mà 100%.

## [1.4.0] - 2026-06-04

**Service**: murrplastik-vn-web  
**Purpose**: feat(ui/ux, performance): tối ưu hóa dung lượng hình ảnh banner, tích hợp Popup CTA thông minh và bổ sung nút Quay về đầu trang đồng bộ.  
**Release at**: 04/06/2026  
**By who**: KhaiLL

### Tối ưu hóa Hình ảnh & Hiệu năng
- **Chuyển đổi sang WebP**: Chuyển đổi file ảnh banner khuyến mại khổng lồ (`Popup_CTA_Murrplastik.png`, `5.23 MB`) sang định dạng WebP thế hệ mới (`Popup_CTA_Murrplastik.webp`, `337 KB`). Giúp giảm kích thước tải xuống **93.4%** nhưng giữ nguyên độ nét và độ trong suốt của nền, giúp trang tải tức thì trên mọi loại mạng di động.
- **Caching & Nén GZIP (.htaccess)**: Bổ sung cấu hình tối ưu bộ nhớ đệm trình duyệt (Browser Caching) 1 năm cho ảnh (WebP, SVG, PNG, JPG), CSS, JS và kích hoạt nén GZIP dữ liệu truyền tải qua mạng giúp trang web phản hồi siêu nhanh.

### Tích hợp Popup CTA Khuyến mại thông minh
- **Giao diện & Chuyển đổi**: Thêm popup quảng cáo (#promoPopup) vào trang chủ. Sử dụng nút Close (X) phong cách pixel-art màu đỏ thương hiệu dựng trực tiếp bằng SVG và thiết lập liên kết mượt mà cuộn thẳng đến phần liên hệ `#contact` khi nhấp vào banner.
- **Mobile Responsiveness**: Khống chế chiều rộng banner tối đa `320px` và chiều cao tối đa `70vh` trên màn hình nhỏ/điện thoại, đảm bảo giao diện popup cân đối và không làm tràn nút đóng ra ngoài màn hình.
- **Bộ 3 Trình kích hoạt (Triggers)**:
  - **Scroll Depth**: Kích hoạt khi cuộn qua 25% chiều dài trang chủ.
  - **Time Delay**: Kích hoạt sau 10 giây ở lại trang.
  - **Exit Intent**: Kích hoạt trên máy tính khi di chuyển con trỏ chuột hướng lên thanh địa chỉ của trình duyệt để chuẩn bị rời trang.
- **Tần suất hiển thị (Frequency Capping)**: Triển khai Cookie lưu trạng thái tắt `promo_popup_dismissed=true` trong vòng 1 ngày để đảm bảo không hiển thị lặp đi lặp lại gây khó chịu cho khách hàng.

### Nút Quay về đầu trang (Back to Top)
- **Vị trí và căn gióng**: Bổ sung nút quay về đầu trang dạng hình tròn màu đỏ thương hiệu nằm ở góc dưới bên phải, căn ngang thẳng hàng sang trái nút Messenger (`right: 94px` trên desktop và `right: 76px` trên mobile), tạo bố cục gọn gàng, đồng bộ.
- **Kích hoạt & Trải nghiệm**: Thiết lập kích hoạt hiển thị khi cuộn trang đạt mốc **50%** trở lên. Áp dụng hiệu ứng fade-in + slide-in mềm mại.
- **Đồng bộ hóa**: Tích hợp đồng loạt trên trang chủ (`index.html`) và cả 5 trang con giới thiệu sản phẩm trong thư mục `products/`.

### Đo lường chuyển đổi (Analytics)
- **Gửi form thành công**: Tích hợp hàm kích hoạt sự kiện `generate_lead` của Google Analytics khi form báo giá được gửi thành công, giúp việc theo dõi hiệu suất marketing chuẩn xác và trực quan.

### Đa ngôn ngữ (i18n) cho các trang con
- **Đồng bộ hóa Ngôn ngữ**: Liên kết file `i18n.js` vào cả 5 trang sản phẩm (`acs.html`, `aur.html`, `efk.html`, `kdh.html`, `suv.html`). Giao diện sẽ tự động chuyển sang tiếng Anh hoặc tiếng Việt dựa trên tùy chọn đã lưu ở trang chủ hoặc chuyển đổi trực tiếp trên trang con.
- **Thanh Menu & Nút chuyển ngôn ngữ**: Thêm cụm nút chọn ngôn ngữ (VI/EN) và nút menu mobile (hamburger) vào navbar của cả 5 trang con để đồng bộ hóa hoàn toàn trải nghiệm người dùng.
- **Dịch thuật toàn diện nội dung**: Khai báo đầy đủ các thẻ `data-i18n` và dịch thuật toàn bộ các phần: Tiêu đề trang (SEO Title), Mô tả trang (Meta Description), Tiêu đề chính, Các tính năng nổi bật, Mô tả ứng dụng thực tế, Nhãn sản phẩm tiêu biểu và Nút liên hệ của từng trang con.

## [1.3.0] - 2026-05-18

**Service**: murrplastik-vn-web  
**Purpose**: feat(analytics, social & redirection): tích hợp Google Analytics (Google Tag), cập nhật đường dẫn Facebook mới và tự động chuyển hướng tên miền.  
**Release at**: 18/05/2026  
**By who**: KhaiLL

### Tích hợp Đo lường & Analytics
- **Google Tag (gtag.js)**: Triển khai cài đặt mã theo dõi Google Analytics chính thức (`G-VEEJQJ53DS`) trên toàn bộ hệ thống trang công khai để theo dõi lưu lượng truy cập và hành vi chuyển đổi:
  - Trang chủ ([index.html](file:///d:/T&TVina/murrplastik_code/index.html))
  - 5 trang chi tiết sản phẩm thuộc thư mục [products/](file:///d:/T&TVina/murrplastik_code/products/): [acs.html](file:///d:/T&TVina/murrplastik_code/products/acs.html), [aur.html](file:///d:/T&TVina/murrplastik_code/products/aur.html), [efk.html](file:///d:/T&TVina/murrplastik_code/products/efk.html), [kdh.html](file:///d:/T&TVina/murrplastik_code/products/kdh.html), [suv.html](file:///d:/T&TVina/murrplastik_code/products/suv.html).

### Cập nhật Liên kết Mạng xã hội & Thương hiệu
- **Facebook & Messenger Vanity URLs**: Cập nhật đồng loạt các đường dẫn liên kết Facebook cũ chứa ID số (`https://www.facebook.com/profile.php?id=100080348380792`) và liên kết Messenger (`https://m.me/100080348380792`) sang đường dẫn định danh thương hiệu mới (`https://www.facebook.com/murrplastikvietnam` và `https://m.me/murrplastikvietnam`) tại tất cả vị trí:
  - Schema Structured Data (LocalBusiness Schema `sameAs`) trên trang chủ.
  - Các mục thông tin liên hệ và footer trên trang chủ cùng 5 trang chi tiết sản phẩm.

### Cấu hình Chuyển hướng Tên miền & Bảo mật (Server-side)
- **Tự động Redirect (.htaccess)**: Tạo file cấu hình máy chủ [.htaccess](file:///d:/T&TVina/murrplastik_code/.htaccess) ở thư mục gốc để máy chủ Apache/LiteSpeed của Hostinger tự động xử lý chuyển hướng ở mức tối ưu nhất:
  - Tự động chuyển hướng toàn bộ lượt truy cập không an toàn từ HTTP sang HTTPS (Bảo mật SSL).
  - Tự động chuyển hướng từ tên miền phụ có `www` (`www.murrplastikvn.com`) về tên miền gốc không có `www` (`murrplastikvn.com`) bằng phương thức chuyển hướng vĩnh viễn 301 Redirect chuẩn SEO.

### Tối ưu hóa Hình ảnh & Khắc phục Lỗi 404
- **Định dạng WebP thế hệ mới**: Tạo và bổ sung đầy đủ các file ảnh đuôi `.webp` còn thiếu cho danh mục sản phẩm (chuyển đổi chất lượng cao từ các file `.jpg` gốc) bao gồm: `label.webp`, `murrplastik_Conduits_and_fittings.webp`, `murrplastik_Cable_entry_systems_and_holders.webp`, `murrplastik_Energy_chains.webp`, `murrplastik_Automation_and_Robotics.webp`.
- **Sửa lỗi hiển thị (broken images)**: Khắc phục triệt để lỗi 404 hình ảnh trên các trình duyệt hỗ trợ WebP, giúp tối ưu hóa dung lượng trang web và cải thiện đáng kể tốc độ tải trang.

## [1.2.0] - 2026-05-13

**Service**: murrplastik-vn-web  
**Purpose**: fix(ui/ux): nâng cấp trải nghiệm người dùng, tối ưu form chuyển đổi và kỹ thuật SEO chuyên sâu.  
**Release at**: 13/05/2026  
**MR**: [https://github.com/lylamkhai218/murrplastik_vn/commit/c370557](https://github.com/lylamkhai218/murrplastik_vn/commit/c370557)  
**By who**: KhaiLL

### Nâng cấp UI/UX & Điều hướng
- **ScrollSpy**: Tự động làm nổi bật mục Menu tương ứng khi người dùng cuộn đến phần nội dung đó.
- **Preloader**: Thêm màn hình chờ (loading screen) với logo và thanh trạng thái mượt mà khi truy cập web.
- **Hiệu ứng Pulse**: Áp dụng hiệu ứng phát sáng cho bộ 3 nút liên hệ (Zalo, Messenger, Hotline) để tăng tỉ lệ tương tác.
- **Fix Navigation Anchor**: Xử lý triệt để lỗi lệch vị trí khi điều hướng từ trang con về trang chủ thông qua tính năng "cuộn bù" (Scroll Offset & Load Handling).
- **Social Update**: Loại bỏ chữ "Facebook:" thừa tại footer và tích hợp link Fanpage chính thức vào mục Liên hệ.

### Tối ưu Form & Chuyển đổi
- **Real-time Validation**: Hệ thống tự động kiểm tra định dạng Số điện thoại (chuẩn VN), Email và Họ tên ngay khi người dùng đang nhập liệu.
- **Inline Error Messages**: Hiển thị thông báo lỗi chi tiết ngay dưới từng trường thông tin bị sai định dạng.
- **Success Popup Modal**: Thay thế thông báo văn bản đơn giản bằng cửa sổ Popup chuyên nghiệp khi gửi form thành công.

### SEO & Tối ưu Kỹ thuật
- **Structured Data (Schema)**: 
  - Triển khai `LocalBusiness` Schema cho doanh nghiệp (địa chỉ, mạng xã hội, giờ mở cửa).
  - Triển khai `ItemList/Product` Schema cho 5 dòng sản phẩm chính nhằm tối ưu hiển thị Rich Snippets trên Google.
- **Next-gen Images (WebP)**: Cập nhật thẻ `<picture>` cho toàn bộ ảnh sản phẩm chính, ưu tiên định dạng WebP và kích hoạt `lazy loading` để tăng tốc độ tải trang.
- **Responsive**: Tăng kích thước font `.why-num` và tối ưu khoảng cách hiển thị trên thiết bị di động.

