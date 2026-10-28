import os
import json
import re
import unicodedata

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")
INDEX_HTML_PATH = os.path.join(DIST_DIR, "index.html")
CATALOG_PATH = os.path.join(BASE_DIR, "public", "data", "catalog_index.json")
BASE_URL = "https://protools.com.vn"
COMPANY_NAME = "T&T VINA INDUSTRIAL CO., LTD"

def to_slug(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = text.replace('đ', 'd').replace('Đ', 'd')
    text = re.sub(r'[^a-z0-9\s-]', ' ', text)
    text = re.sub(r'\s+', '-', text.strip())
    text = re.sub(r'-+', '-', text)
    return text

def create_product_slug(name: str, sku: str) -> str:
    name_slug = to_slug(name or 'san-pham')
    sku_slug = to_slug(sku or '')
    if not sku_slug:
        return name_slug
    if name_slug.endswith(sku_slug):
        return name_slug
    return f"{name_slug}-{sku_slug}"

def generate_snapshots():
    print("=" * 65)
    print("PROTOOLS STATIC SEO SNAPSHOT PRE-RENDERING ENGINE (V3 AI-CITABLE)")
    print(f"Template: {INDEX_HTML_PATH}")
    print("=" * 65)

    if not os.path.exists(INDEX_HTML_PATH):
        print(f"[ERROR] {INDEX_HTML_PATH} not found. Run 'pnpm build' first!")
        return

    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    categories = [
        {"slug": "thiet-bi-han", "name": "Thiết Bị Hàn Công Nghiệp & Trạm Hàn ESD", "desc": "Trạm hàn Hakko, Quick, mũi hàn chính hãng chịu nhiệt độ cao, chống tĩnh điện ESD cho nhà máy điện tử."},
        {"slug": "dung-cu-bom-keo", "name": "Dụng Cụ & Robot Bơm Keo Tự Động", "desc": "Máy bơm keo chính xác, van định lượng, kim tra keo và hệ thống robot bơm keo 3 trục 4 trục tự động."},
        {"slug": "may-cat-bang-dinh-tu-dong", "name": "Máy Cắt Băng Dính & Tách Tem Tự Động", "desc": "Máy cắt băng keo cuộn tự động ZCUT, RT-3000, máy bóc tách nhãn dán barcode tự động tốc độ cao."},
        {"slug": "may-bat-vit-nha-vit", "name": "Máy Bắt Vít Tự Động & Dụng Cụ Siết Lực", "desc": "Tô vít điện Hios, máy cấp vít tự động, đầu vặn siết lực điều chỉnh kiểm soát mô-men xoắn."},
        {"slug": "thiet-bi-kiem-tra", "name": "Thiết Bị Đo Lường & Kiểm Tra Kỹ Thuật", "desc": "Kính hiển vi soi nổi công nghiệp, máy đo lực căng, đồng hồ vạn năng kiểm tra bo mạch."},
        {"slug": "camera-kinh-soi-cong-nghiep", "name": "Kính Hiển Vi Soi Nổi & Camera Công Nghiệp", "desc": "Kính hiển vi quang học độ phóng đại lớn, camera HDMI phân tích khuyết tật mối hàn SMT."},
        {"slug": "dung-cu-chong-tinh-dien", "name": "Vật Tư Phòng Sạch & Dụng Cụ Chống Tĩnh Điện ESD", "desc": "Thảm cao su chống tĩnh điện, quạt khử ion, dây đeo cổ tay, nhíp chống tĩnh điện phòng sạch."},
        {"slug": "thiet-bi-dong-goi-tu-dong", "name": "Thiết Bị Đóng Gói & Dán Thùng Tự Động", "desc": "Máy quấn màng pallet, máy dán băng dính thùng carton, dụng cụ đóng đai kiện hàng."},
        {"slug": "thiet-bi-tu-dong-hoa", "name": "Linh Kiện & Thiết Bị Tự Động Hóa", "desc": "Cảm biến quang, cảm biến từ, rơ-le bán dẫn, bộ điều khiển PLC phục vụ dây chuyền tự động."},
        {"slug": "xi-lanh-khi-nen", "name": "Xi Lanh & Thiết Bị Chấp Hành Khí Nén", "desc": "Xi lanh khí nén SMC, Airtac, Festo chính hãng tiêu chuẩn ISO, hành trình chuẩn xác."},
        {"slug": "khi-nen-phu-kien", "name": "Cút Nối, Van Điện Từ & Khớp Nối Khí Nén", "desc": "Đầu nối nhanh khí nén, ống khí polyurethane (PU), van điện từ 5/2, 3/2, bộ lọc khí đôi."},
        {"slug": "bu-long-oc-vit", "name": "Bu Lông, Ốc Vít & Cơ Khí Liên Kết", "desc": "Bu lông lục giác chìm, đai ốc, vít bake, chốt định vị thép không gỉ inox 304, thép cấp bền 8.8, 10.9, 12.9."},
        {"slug": "bang-tai-day-curoa", "name": "Băng Tải PVC & Dây Truyền Động Curoa", "desc": "Dây băng tải PVC xanh, dây curoa răng truyền động công nghiệp chống trượt chịu tải lớn."},
        {"slug": "murrplastik", "name": "Hệ Thống Xích Dẫn Cáp Robot Murrplastik (Đức)", "desc": "Bao che bảo vệ cáp robot, xích dẫn cáp Drag Chain, khớp cầu Trục 6, hệ thống co rút R-Tec Liner Murrplastik Đức."},
        {"slug": "linh-kien-thiet-bi", "name": "Linh Kiện & Phụ Kiện Thiết Bị Công Nghiệp", "desc": "Vật tư tiêu hao, phụ tùng thay thế định kỳ cho xưởng lắp ráp và chế tạo cơ khí."}
    ]

    # Load catalog products
    products = []
    if os.path.exists(CATALOG_PATH):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            products = json.load(f)

    # 1. PRE-RENDER HOMEPAGE (dist/index.html)
    print("Generating Homepage App Shell & SEO Semantic Snapshot...")
    home_cat_links = "\n".join([f'<li><a href="/danh-muc/{c["slug"]}">{c["name"]}</a> - {c["desc"]}</li>' for c in categories])
    home_featured_prods = "\n".join([
        f'<li><a href="/san-pham/{create_product_slug(p.get("name",""), p.get("sku",""))}">{p.get("name","")} ({p.get("sku","")})</a> - {p.get("brand","T&T Vina")}</li>'
        for p in products[:15]
    ])

    home_body = f"""
    <div id="root"></div>

    <!-- SEO & AI SEARCH SEMANTIC DOSSIER (Zero Flashing - 100% Crawlable) -->
    <noscript>
      <div class="protools-semantic-dossier" style="padding: 24px; max-width: 1200px; margin: 0 auto; font-family: sans-serif; line-height: 1.6; color: #334155;">
        <header style="margin-bottom: 24px;">
          <h2 style="font-size: 22px; font-weight: bold; color: #0f172a;">T&amp;T VINA INDUSTRIAL CO., LTD | Thiết Bị Công Nghiệp &amp; Tự Động Hóa (Protools)</h2>
          <p style="color: #64748b;">Nhà phân phối chính hãng thiết bị công nghiệp, robot tự động hóa, vật tư phòng sạch ESD, phụ kiện Murrplastik Đức, trạm hàn Hakko, Quick, máy bắt vít Hios tại Việt Nam.</p>
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #065f46; font-size: 14px;">
            <p><strong>Protools.com.vn</strong> là nền tảng phân phối thiết bị công nghiệp B2B của <strong>T&amp;T Vina Industrial</strong>, đại diện ủy quyền chính hãng Murrplastik Đức, Hakko, HIOS và Quick tại Việt Nam. Chúng tôi cung ứng hơn 100+ dòng sản phẩm thiết bị công nghiệp chính hãng gồm xích dẫn cáp robot, máy siết lực, trạm hàn ESD và vật tư phòng sạch với cam kết đầy đủ chứng từ nguồn gốc chính ngạch, giao hàng trong 24 giờ cho nhà máy FDI.</p>
          </div>
        </header>

        <section style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #0f172a;">Về Công Ty TNHH Công Nghiệp T&amp;T Vina (Protools Việt Nam)</h3>
          <p style="font-size: 14px; color: #475569;"><strong>Công ty TNHH Công nghiệp T&amp;T Vina</strong> (tên quốc tế: <em>T&amp;T Vina Industrial Co., Ltd</em>, sở hữu nền tảng thương mại kỹ thuật <strong>Protools.com.vn</strong>) được thành lập năm <strong>2018</strong> theo Giấy chứng nhận đăng ký kinh doanh số <strong>0108392186</strong> do Sở Kế hoạch và Đầu tư TP. Hà Nội cấp. T&amp;T Vina là nhà phân phối thiết bị công nghiệp, dụng cụ phòng sạch ESD và giải pháp tự động hóa nhà xưởng phục vụ chuỗi cung ứng phụ trợ ô tô, điện tử FDI tại Việt Nam.</p>
          <h4 style="font-size: 16px; font-weight: bold; margin-top: 12px;">Giấy Phép Ủy Quyền Phân Phối Chính Hãng</h4>
          <ul style="font-size: 14px; color: #475569; padding-left: 20px;">
            <li><strong>Murrplastik Medingen GmbH (CHLB Đức)</strong>: Đại lý ủy quyền chính thức phân phối hệ thống bảo vệ cáp robot (Robotic Dress Pack R-Tec Liner), xích dẫn cáp kéo trượt, tấm luồn cáp đa năng KDL/KDP.</li>
            <li><strong>Hakko &amp; Quick Electronic</strong>: Trạm hàn thiếc ESD công suất cao (Quick 205 150W, Hakko FX-888D), mũi hàn và bể hàn nhúng nhiệt độ ổn định.</li>
            <li><strong>HIOS Inc. (Nhật Bản)</strong>: Tô vít điện siết lực chính xác (CL-4000, CL-3000, BL-5000) và máy đo lực siết HP-10/HP-100.</li>
            <li><strong>Zcut &amp; ELM (Nhật Bản)</strong>: Máy cắt băng dính tự động Zcut-9, RT-7000 và máy tách tem nhãn barcode.</li>
          </ul>
        </section>

        <section style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 12px;">Thông Số Kỹ Thuật Bộ Hồi Vị Cáp Dresspack Robot Murrplastik R-Tec Liner</h3>
          <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px; border-color: #cbd5e1;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th scope="col" style="text-align: left;">Thông số kỹ thuật</th>
                <th scope="col" style="text-align: left;">Quy chuẩn / Giá trị đo</th>
                <th scope="col" style="text-align: left;">Ứng dụng thực tế</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Vật liệu ống luồn cáp</strong></td>
                <td>Polyamide biến tính đặc biệt (Mod. Polyamide PA 12)</td>
                <td>Chịu dầu mỡ công nghiệp, tia lửa hàn xói mòn và hóa chất tẩy rửa</td>
              </tr>
              <tr>
                <td><strong>Hành trình hồi vị lò xo</strong></td>
                <td>350 mm / 400 mm / 600 mm tích hợp trong thân hộp kín</td>
                <td>Triệt tiêu hiện tượng văng võng cáp khi robot vặn xoắn trục 5 và 6</td>
              </tr>
              <tr>
                <td><strong>Độ bền chu kỳ thử nghiệm</strong></td>
                <td>&gt; 17.700.000 chu kỳ uốn mỏi (219 ngày kiểm thử phòng lab Murrplastik)</td>
                <td>Độ bền vượt trội gấp 3 lần so với giải pháp treo cáp bằng lò xo cơ học hở</td>
              </tr>
              <tr>
                <td><strong>Cấp chống cháy tiêu chuẩn</strong></td>
                <td>UL 94: V2 tự dập tắt / Không sinh khí Halogen độc hại</td>
                <td>Đạt tiêu chuẩn an toàn PCCC nhà máy lắp ráp ô tô FDI</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style="background: #f1f5f9; padding: 16px; border-radius: 6px;">
          <h3 style="font-size: 16px; font-weight: bold; color: #0f172a;">Thông Tin Liên Hệ &amp; Hệ Thống Kho Hàng T&amp;T VINA</h3>
          <p style="font-size: 14px; color: #475569;"><strong>Kho Hà Nội:</strong> Số 11/68/467 Lĩnh Nam, Phường Vĩnh Hưng, Quận Hoàng Mai, Hà Nội (Tọa độ GPS: 20.982887, 105.881468).</p>
          <p style="font-size: 14px; color: #475569;"><strong>Trụ sở &amp; Kho Logistics Hưng Yên:</strong> Thôn Trà Hồi, Xã Thái Thụy, Tỉnh Hưng Yên (cách KCN Liên Hà Thái 1km).</p>
          <p style="font-size: 14px; color: #475569;"><strong>Hotline kỹ thuật &amp; Báo giá:</strong> 0915.168.824 | <strong>Email:</strong> info@t2tvina.com</p>
        </section>
      </div>
    </noscript>
    """
    home_html = template.replace('<div id="root"></div>', home_body.strip())
    with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(home_html)
    print("Homepage snapshot updated successfully.")

    # 2. PRE-RENDER CATALOG ROOT (/san-pham & /san-pham/)
    print("Generating Catalog Overview Snapshot (/san-pham)...")
    catalog_dir = os.path.join(DIST_DIR, "san-pham")
    os.makedirs(catalog_dir, exist_ok=True)
    catalog_file = os.path.join(catalog_dir, "index.html")

    catalog_title = "Danh Mục Thiết Bị Công Nghiệp & Tự Động Hóa | T&T VINA Industrial"
    catalog_desc = "Tra cứu hơn 900+ thiết bị công nghiệp chính hãng Murrplastik Đức, Hakko, Quick, Hios, robot bơm keo, máy bắt vít tự động sẵn hàng tại Hà Nội & Hưng Yên."
    catalog_canonical = f"{BASE_URL}/san-pham"

    catalog_body = f"""
    <div id="root"></div>
    <noscript>
      <header class="p-6 bg-slate-900 text-white">
        <nav class="text-xs text-slate-400 mb-2"><a href="/" class="hover:underline">Trang chủ</a> &gt; <span>Sản phẩm</span></nav>
        <h1 class="text-2xl font-bold">Danh Mục Thiết Bị Công Nghiệp & Giải Pháp Tự Động Hóa</h1>
        <p class="mt-2 text-slate-300">{catalog_desc}</p>
        
        <!-- DIRECT ANSWER BLOCK (40-60 WORDS FOR AI CITATION) -->
        <div class="direct-answer-block bg-emerald-950/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r text-emerald-100 text-sm leading-relaxed shadow-sm">
          <p>
            Danh mục thiết bị công nghiệp Protools cung cấp 15 nhóm sản phẩm chính ngạch: hệ thống quản lý cáp robot, trạm hàn ESD, máy siết lực tự động, máy bơm keo, khí nén và bu lông inox DIN tiêu chuẩn. Toàn bộ thiết bị đều có sẵn bản vẽ kỹ thuật CAD/STP, chứng chỉ xuất xứ CO/CQ và được bảo hành chính hãng từ 12 đến 24 tháng.
          </p>
        </div>
      </header>
      <main class="max-w-7xl mx-auto p-6 space-y-6">
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">Các Chuyên Mục Phân Phối Chính Hãng</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {"".join([f'<div class="p-4 border rounded hover:border-blue-500"><h3 class="font-bold"><a href="/danh-muc/{c["slug"]}" class="text-blue-700 hover:underline">{c["name"]}</a></h3><p class="text-xs text-slate-600 mt-1">{c["desc"]}</p></div>' for c in categories])}
          </div>
        </section>
        <section>
          <h2 class="text-xl font-bold text-slate-900 mb-4">Sản Phẩm Tiêu Biểu</h2>
          <ul class="space-y-2">
            {home_featured_prods}
          </ul>
        </section>
      </main>
    </noscript>
    """
    cat_html = template
    cat_html = re.sub(r'<title>.*?</title>', f'<title>{catalog_title}</title>', cat_html, flags=re.DOTALL)
    cat_html = re.sub(r'<meta name="description" content=".*?" />', f'<meta name="description" content="{catalog_desc}" />', cat_html)
    cat_html = re.sub(r'<link rel="canonical" href=".*?" />', f'<link rel="canonical" href="{catalog_canonical}" />', cat_html)
    cat_html = cat_html.replace('<div id="root"></div>', catalog_body.strip())
    with open(catalog_file, "w", encoding="utf-8") as f:
        f.write(cat_html)
    print("Generated /san-pham/index.html (fixes 403 Forbidden).")

    # 3. PRE-RENDER CATEGORIES
    for cat in categories:
        cat_dir = os.path.join(DIST_DIR, "danh-muc", cat["slug"])
        os.makedirs(cat_dir, exist_ok=True)
        cat_file = os.path.join(cat_dir, "index.html")

        cat_title = f"{cat['name']} Chính Hãng | Báo Giá & Thông Số Kỹ Thuật - T&T VINA"
        cat_desc = f"Danh mục {cat['name']} phân phối chính hãng bởi T&T Vina Industrial. Đầy đủ giấy tờ chứng nhận hợp pháp, bảng báo giá B2B số lượng lớn, giao hàng nhanh 24h."
        cat_canonical = f"{BASE_URL}/danh-muc/{cat['slug']}"

        # Find matching products
        matching_prods = [p for p in products if cat["slug"] in to_slug(p.get("category","")) or cat["slug"] in to_slug(p.get("name",""))]
        if not matching_prods:
            matching_prods = products[:6]
        else:
            matching_prods = matching_prods[:12]

        prod_list_html = "\n".join([
            f'<li class="p-3 border rounded"><a href="/san-pham/{create_product_slug(p.get("name",""), p.get("sku",""))}" class="font-semibold text-blue-700 hover:underline">{p.get("name","")}</a><div class="text-xs text-slate-500 mt-1">SKU: {p.get("sku","")} | Hãng: {p.get("brand","T&T Vina")}</div></li>'
            for p in matching_prods
        ])

        cat_page_body = f"""
        <div id="root"></div>
        <noscript></div>
        <noscript>
          <header class="p-6 bg-slate-900 text-white">
            <nav class="text-xs text-slate-400 mb-2"><a href="/" class="hover:underline">Trang chủ</a> &gt; <a href="/san-pham" class="hover:underline">Sản phẩm</a> &gt; <span>{cat["name"]}</span></nav>
            <h1 class="text-2xl font-bold">{cat["name"]}</h1>
            <p class="mt-2 text-slate-300">{cat["desc"]}</p>
          </header>
          <main class="max-w-7xl mx-auto p-6 space-y-6">
            <section>
              <h2 class="text-xl font-bold text-slate-900 mb-4">Danh Sách Sản Phẩm Tiêu Biểu Thuộc Nhóm {cat["name"]}</h2>
              <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prod_list_html}
              </ul>
            </section>
            <section class="p-4 bg-blue-50 border border-blue-200 rounded">
              <p class="text-sm text-blue-900">Quý khách hàng nhà máy cần cung cấp bảng thông số kỹ thuật (Spec sheet), chứng nhận xuất xứ CO/CQ hoặc yêu cầu báo giá dự án, vui lòng liên hệ hotline <strong>0915.168.824</strong> hoặc gửi yêu cầu qua <a href="/gio-bao-gia" class="underline font-bold">Giỏ báo giá B2B</a>.</p>
            </section>
          </main>
        </noscript>
        """
        html = template
        html = re.sub(r'<title>.*?</title>', f'<title>{cat_title}</title>', html, flags=re.DOTALL)
        html = re.sub(r'<meta name="description" content=".*?" />', f'<meta name="description" content="{cat_desc}" />', html)
        html = re.sub(r'<link rel="canonical" href=".*?" />', f'<link rel="canonical" href="{cat_canonical}" />', html)
        html = html.replace('<div id="root"></div>', cat_page_body.strip())
        with open(cat_file, "w", encoding="utf-8") as f:
            f.write(html)

    print(f"Generated {len(categories)} category rich static snapshots.")

    # 4. PRE-RENDER TOP 150 PRODUCTS
    top_products = products[:150]
    for p in top_products:
        name = p.get("name", "")
        sku = p.get("sku", "") or p.get("id", "")
        if not name and not sku:
            continue
        slug = create_product_slug(name, sku)
        prod_dir = os.path.join(DIST_DIR, "san-pham", slug)
        os.makedirs(prod_dir, exist_ok=True)
        prod_file = os.path.join(prod_dir, "index.html")

        prod_title = f"{name} ({sku}) | T&T VINA Industrial"
        prod_desc = f"Thông số kỹ thuật và báo giá cho {name} (Mã: {sku}). Thương hiệu {p.get('brand', 'T&T Vina')}. Hàng chính hãng, bảo hành nhà máy, sẵn kho Hà Nội & Hưng Yên."
        prod_canonical = f"{BASE_URL}/san-pham/{slug}"
        prod_img = p.get("image", "/og-image.jpg")
        if prod_img and not prod_img.startswith("http"):
            prod_img = f"{BASE_URL}{prod_img}"

        # Schema Product
        schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": name,
            "sku": sku,
            "image": prod_img,
            "description": prod_desc,
            "brand": {
                "@type": "Brand",
                "name": p.get("brand", "T&T VINA")
            },
            "offers": {
                "@type": "Offer",
                "url": prod_canonical,
                "priceCurrency": "VND",
                "price": "0",
                "priceValidUntil": "2027-12-31",
                "availability": "https://schema.org/InStock" if p.get("stock", 0) > 0 else "https://schema.org/PreOrder",
                "seller": {
                    "@type": "Organization",
                    "name": COMPANY_NAME,
                    "url": BASE_URL,
                    "telephone": "+84-915-168-824",
                    "email": "info@t2tvina.com"
                }
            }
        }
        schema_json = json.dumps(schema, ensure_ascii=False)

        # Related links
        related_prods = [rp for rp in products if rp.get("category") == p.get("category") and rp.get("sku") != sku][:4]
        if not related_prods:
            related_prods = products[:4]
        related_links = "".join([
            f'<li><a href="/san-pham/{create_product_slug(rp.get("name",""), rp.get("sku",""))}" class="text-blue-700 hover:underline">{rp.get("name","")} ({rp.get("sku","")})</a></li>'
            for rp in related_prods
        ])

        prod_body = f"""
        <div id="root"></div>
        <noscript></div>
        <noscript>
          <header class="p-6 bg-slate-900 text-white">
            <nav class="text-xs text-slate-400 mb-2"><a href="/" class="hover:underline">Trang chủ</a> &gt; <a href="/san-pham" class="hover:underline">Sản phẩm</a> &gt; <span>{name}</span></nav>
            <h1 class="text-2xl font-bold">{name}</h1>
            <p class="text-slate-300 mt-1">Mã sản phẩm (SKU): <strong class="text-sky-400">{sku}</strong> | Thương hiệu: <strong>{p.get('brand', 'T&T Vina')}</strong></p>
          </header>
          <main class="max-w-7xl mx-auto p-6 space-y-6">
            <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div class="border rounded p-4 flex justify-center bg-white">
                <img src="{prod_img}" alt="{name} - SKU: {sku}" class="max-h-80 object-contain" />
              </div>
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-slate-900">Chi Tiết Thông Số & Đặc Tính Kỹ Thuật</h2>
                <div class="p-4 bg-slate-50 border rounded text-sm text-slate-700 leading-relaxed">
                  {p.get("description", "Sản phẩm thiết bị công nghiệp chính hãng phân phối bởi T&T Vina. Liên hệ hotline để nhận catalog thông số chi tiết.")}
                </div>
                <div class="p-4 border rounded bg-emerald-50 text-emerald-900 text-sm">
                  <p><strong>Tình trạng hàng:</strong> { 'Sẵn sàng giao ngay' if p.get('stock', 0) > 0 else 'Đặt hàng nhà máy (Lead time 5-10 ngày)' }</p>
                  <p class="mt-1"><strong>Hồ sơ đi kèm:</strong> Hóa đơn GTGT VAT, Chứng chỉ xuất xứ (CO), Chứng chỉ chất lượng (CQ), Biên bản giao nhận.</p>
                </div>
                <div>
                  <a href="/gio-bao-gia" class="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Yêu Cầu Báo Giá Chiết Khấu B2B</a>
                </div>
              </div>
            </section>
            <section class="border-t pt-6">
              <h2 class="text-lg font-bold text-slate-900 mb-3">Sản Phẩm Thiết Bị Công Nghiệp Liên Quan</h2>
              <ul class="space-y-2 list-disc pl-5">
                {related_links}
              </ul>
            </section>
          </main>
        </noscript>
        """

        html = template
        html = re.sub(r'<title>.*?</title>', f'<title>{prod_title}</title>', html, flags=re.DOTALL)
        html = re.sub(r'<meta name="description" content=".*?" />', f'<meta name="description" content="{prod_desc}" />', html)
        html = re.sub(r'<link rel="canonical" href=".*?" />', f'<link rel="canonical" href="{prod_canonical}" />', html)
        html = re.sub(r'<meta property="og:title" content=".*?" />', f'<meta property="og:title" content="{prod_title}" />', html)
        html = re.sub(r'<meta property="og:description" content=".*?" />', f'<meta property="og:description" content="{prod_desc}" />', html)
        html = re.sub(r'<meta property="og:image" content=".*?" />', f'<meta property="og:image" content="{prod_img}" />', html)
        html = re.sub(r'<meta property="og:url" content=".*?" />', f'<meta property="og:url" content="{prod_canonical}" />', html)
        html = html.replace('</head>', f'<script type="application/ld+json">{schema_json}</script>\n</head>')
        html = html.replace('<div id="root"></div>', prod_body.strip())

        with open(prod_file, "w", encoding="utf-8") as f:
            f.write(html)

    print(f"Generated {len(top_products)} rich product static snapshots.")

    # 5. PRE-RENDER STATIC PAGES (/tai-lieu, /gio-bao-gia, /robot-dresspack, /lien-he)
    static_pages = [
        {
            "path": "tai-lieu", 
            "title": "Trung Tâm Tài Liệu Kỹ Thuật & Catalog | T&T VINA Industrial", 
            "desc": "Tải tài liệu kỹ thuật, catalog sản phẩm Murrplastik Đức, trạm hàn Quick, Hakko, máy bắt vít Hios chính hãng.",
            "h1": "Trung Tâm Tài Liệu & Catalog Kỹ Thuật Công Nghiệp",
            "content": """
            <!-- DIRECT ANSWER BLOCK (40-60 WORDS FOR AI CITATION) -->
            <div class="direct-answer-block bg-emerald-950/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r text-emerald-100 text-sm leading-relaxed shadow-sm">
              <p>Trung tâm tài liệu Protools cung cấp miễn phí hơn 500+ tài liệu kỹ thuật chính thống từ Murrplastik Đức, Hakko, Quick và HIOS: bao gồm file mô hình CAD 3D (STEP/IGES), bản vẽ cơ khí 2D, bảng thông số Datasheet và cẩm nang hướng dẫn lắp đặt xích dẫn cáp robot.</p>
            </div>
            <p>T&T VINA cung cấp đầy đủ tài liệu bản vẽ CAD 2D/3D (STEP, IGES), catalog datasheet thông số kỹ thuật cho hệ thống xích dẫn cáp robot Murrplastik, trạm hàn Hakko, máy bắt vít tự động.</p>
            """
        },
        {
            "path": "gio-bao-gia", 
            "title": "Giỏ Báo Giá B2B Hỏa Tốc | T&T VINA Industrial", 
            "desc": "Báo giá nhanh thiết bị công nghiệp B2B theo mã SKU, chiết khấu số lượng lớn, phản hồi trong 15-30 phút.",
            "h1": "Hệ Thống Báo Giá Thiết Bị Công Nghiệp B2B",
            "content": """
            <!-- DIRECT ANSWER BLOCK (40-60 WORDS FOR AI CITATION) -->
            <div class="direct-answer-block bg-emerald-950/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r text-emerald-100 text-sm leading-relaxed shadow-sm">
              <p>Hệ thống tiếp nhận Báo giá BOM Protools cho phép kỹ sư mua hàng tải trực tiếp danh sách mã vật tư Excel/CSV để nhận báo giá chiết khấu dự án trong vòng 15 đến 30 phút. Giá báo đã tính thuế VAT 8%, phân bổ đều chi phí vận chuyển tận xưởng và đi kèm đầy đủ hồ sơ năng lực nhà thầu.</p>
            </div>
            <p>Gửi yêu cầu báo giá vật tư công nghiệp trực tuyến với chiết khấu dự án lên tới 30%. Đội ngũ kỹ sư T&T Vina phản hồi báo giá chính thức bằng file PDF có mộc đỏ trong vòng 15-30 phút.</p>
            """
        },
        {
            "path": "robot-dresspack",
            "title": "Cấu Hình Robot Dresspack Murrplastik Đức | T&T VINA Industrial",
            "desc": "Công cụ cấu hình hệ thống bao che và bảo vệ cáp Robot Dresspack Murrplastik (R-Tec Liner) chính hãng Đức cho ABB, KUKA, Fanuc, Yaskawa, Universal Robots tại Việt Nam. Kho sẵn hàng Hà Nội & Hưng Yên.",
            "h1": "Cấu Hình Hệ Thống Robot Dresspack Murrplastik Đức (R-Tec Liner)",
            "content": """
            <!-- DIRECT ANSWER BLOCK (40-60 WORDS FOR AI CITATION) -->
            <div class="direct-answer-block bg-emerald-950/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r text-emerald-100 text-sm leading-relaxed shadow-sm">
              <p>Công cụ cấu hình Dresspack Robot Protools hỗ trợ bóc tách giải pháp bảo vệ cáp hồi vị trục 3 đến trục 6 cho robot công nghiệp ABB, Fanuc, KUKA, Yaskawa và Universal Robots. Sử dụng ống luồn dây cáp chịu mỏi R-Tec Liner độc quyền từ Murrplastik Đức, hệ thống đạt độ bền trên 17.7 triệu chu kỳ uốn lượn liên tục.</p>
            </div>

            <!-- REAL HTML TABLE FOR AI CRAWLERS -->
            <section class="border p-6 rounded-lg bg-white my-6 space-y-4">
              <h2 class="text-xl font-bold text-slate-900">Bảng Thông Số Kỹ Thuật Bộ Hồi Vị Cáp Robot Murrplastik R-Tec Liner</h2>
              <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f1f5f9;">
                    <th scope="col" style="text-align: left;">Thông số kỹ thuật</th>
                    <th scope="col" style="text-align: left;">Quy chuẩn / Giá trị đo</th>
                    <th scope="col" style="text-align: left;">Ứng dụng thực tế</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Vật liệu ống luồn cáp</td><td>Polyamide biến tính đặc biệt (Mod. Polyamide PA 12)</td><td>Chịu dầu mỡ công nghiệp, tia lửa hàn xói mòn và hóa chất tẩy rửa</td></tr>
                  <tr><td>Hành trình hồi vị lò xo</td><td>350 mm / 400 mm / 600 mm tích hợp trong thân hộp kín</td><td>Triệt tiêu hiện tượng văng võng cáp khi robot vặn xoắn trục 5 và 6</td></tr>
                  <tr><td>Độ bền chu kỳ thử nghiệm</td><td>&gt; 17.700.000 chu kỳ uốn mỏi (219 ngày kiểm thử phòng lab Murrplastik)</td><td>Độ bền vượt trội gấp 3 lần so với giải pháp treo cáp bằng lò xo cơ học hở</td></tr>
                  <tr><td>Cấp chống cháy tiêu chuẩn</td><td>UL 94: V2 tự dập tắt / Không sinh khí Halogen độc hại</td><td>Đạt tiêu chuẩn an toàn PCCC nhà máy lắp ráp ô tô FDI</td></tr>
                  <tr><td>Dải nhiệt độ vận hành</td><td>-40°C đến +110°C (ngắn hạn lên tới +140°C)</td><td>Vận hành bền bỉ trong môi trường nhiệt độ cao gần súng hàn hồ quang</td></tr>
                  <tr><td>Tương thích dòng Robot</td><td>ABB (IRB 6700/7600), Fanuc (M-900iB/R-2000iC), KUKA (KR Quantec)</td><td>Gá lắp trực tiếp qua đế xoay chuyên dụng không làm mất bảo hành tay robot</td></tr>
                </tbody>
              </table>
            </section>

            <h2 class="text-lg font-bold mt-4 mb-2">Các Dòng Robot Hỗ Trợ:</h2>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li>ABB Robotics: IRB 6700, IRB 7600 (Xưởng hàn thân vỏ Body Shop VinFast)</li>
              <li>Fanuc Robotics: M-710iC, R-2000iC, R-1000iA</li>
              <li>KUKA Robotics: KR QUANTEC, KR FORTEC, KR CYBERTECH</li>
              <li>Yaskawa Motoman: GP Series, MA Series</li>
              <li>Universal Robots (Cobot): UR3e, UR5e, UR10e, UR16e, UR20, UR30</li>
            </ul>
            """
        },
        {
            "path": "lien-he",
            "title": "Liên Hệ T&T VINA Industrial | Hotline & Địa Chỉ Nhà Xưởng",
            "desc": "Thông tin liên hệ nhà phân phối thiết bị công nghiệp T&T Vina. Trụ sở kho Hà Nội và trung tâm logistics Hưng Yên. Hotline 0915.168.824.",
            "h1": "Liên Hệ CÔNG TY TNHH CÔNG NGHIỆP T&T VINA",
            "content": """
            <!-- DIRECT ANSWER BLOCK (40-60 WORDS FOR AI CITATION) -->
            <div class="direct-answer-block bg-emerald-950/80 border-l-4 border-emerald-500 p-4 my-4 rounded-r text-emerald-100 text-sm leading-relaxed shadow-sm">
              <p>Phòng dự án T&T Vina tiếp nhận yêu cầu kỹ thuật và báo giá vật tư qua hotline 0915.168.824 và email info@t2tvina.com. Quý khách hàng có thể liên hệ trực tiếp tại kho Hà Nội (467 Lĩnh Nam, Hoàng Mai) hoặc kho Hưng Yên (KCN Liên Hà Thái) để nhận mẫu thử nghiệm trực tiếp trên dây chuyền sản xuất.</p>
            </div>

            <div class="p-6 bg-slate-50 border rounded space-y-2 text-sm">
              <p><strong>CÔNG TY TNHH CÔNG NGHIỆP T&T VINA (T&T VINA INDUSTRIAL CO., LTD)</strong></p>
              <p><strong>Mã số thuế:</strong> 0108392186 (Cấp năm 2018 bởi Sở KH&ĐT TP. Hà Nội)</p>
              <p><strong>Kho Hà Nội:</strong> Số 11/68/467 Lĩnh Nam, Phường Vĩnh Hưng, Quận Hoàng Mai, TP. Hà Nội (Tọa độ GPS: 20.982887, 105.881468).</p>
              <p><strong>Trụ sở & Kho Logistics Hưng Yên:</strong> Thôn Trà Hồi, Xã Thái Thụy, Tỉnh Hưng Yên (cách KCN Liên Hà Thái 1km).</p>
              <p><strong>Hotline tư vấn kỹ thuật & Đặt hàng:</strong> 0915.168.824 - 0983.794.782 | <strong>Email:</strong> info@t2tvina.com</p>
              <p><strong>Website:</strong> https://protools.com.vn | <strong>Cổng Murrplastik:</strong> https://protools.com.vn/murrplastik/</p>
            </div>
            """
        }
    ]

    for sp in static_pages:
        sp_dir = os.path.join(DIST_DIR, sp["path"])
        os.makedirs(sp_dir, exist_ok=True)
        sp_file = os.path.join(sp_dir, "index.html")

        sp_body = f"""
        <div id="root"></div>
        <noscript>
          <header class="p-6 bg-slate-900 text-white">
            <nav class="text-xs text-slate-400 mb-2"><a href="/" class="hover:underline">Trang chủ</a> &gt; <span>{sp["h1"]}</span></nav>
            <h1 class="text-2xl font-bold">{sp["h1"]}</h1>
            <p class="mt-2 text-slate-300">{sp["desc"]}</p>
          </header>
          <main class="max-w-7xl mx-auto p-6 space-y-6">
            <div class="prose max-w-none text-slate-800">
              {sp["content"]}
            </div>
          </main>
        </noscript>
        """
        html = template
        html = re.sub(r'<title>.*?</title>', f'<title>{sp["title"]}</title>', html, flags=re.DOTALL)
        html = re.sub(r'<meta name="description" content=".*?" />', f'<meta name="description" content="{sp["desc"]}" />', html)
        html = re.sub(r'<link rel="canonical" href=".*?" />', f'<link rel="canonical" href="{BASE_URL}/{sp["path"]}" />', html)
        html = html.replace('<div id="root"></div>', sp_body.strip())
        with open(sp_file, "w", encoding="utf-8") as f:
            f.write(html)

    print(f"Generated {len(static_pages)} static informational page snapshots.")
    print("ALL PROTOOLS SNAPSHOTS GENERATED SUCCESSFULLY.")

if __name__ == "__main__":
    generate_snapshots()
