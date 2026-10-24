<?php
/**
 * DYNAMIC XML SITEMAP ENGINE FOR PROTOOLS.COM.VN
 * Generates valid sitemap.xml directly from database with accurate lastmod timestamps.
 */
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$baseUrl = 'https://protools.com.vn';

// Static key pages with realistic lastmod
$staticPages = array(
    array('loc' => $baseUrl . '/', 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => '2026-10-24'),
    array('loc' => $baseUrl . '/san-pham', 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => '2026-10-24'),
    array('loc' => $baseUrl . '/robot-dresspack', 'priority' => '0.95', 'changefreq' => 'weekly', 'lastmod' => '2026-10-24'),
    array('loc' => $baseUrl . '/tai-lieu', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => '2026-10-20'),
    array('loc' => $baseUrl . '/gio-bao-gia', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => '2026-10-22'),
    array('loc' => $baseUrl . '/lien-he', 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => '2026-10-24'),
    array('loc' => $baseUrl . '/murrplastik/', 'priority' => '0.95', 'changefreq' => 'weekly', 'lastmod' => '2026-10-20'),
    array('loc' => $baseUrl . '/murrplastik/industries/san-xuat-o-to/', 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => '2026-10-14'),
    array('loc' => $baseUrl . '/murrplastik/industries/thuc-pham-va-do-uong/', 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => '2026-10-14'),
    array('loc' => $baseUrl . '/murrplastik/tin-tuc/', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => '2026-10-24'),
    array('loc' => $baseUrl . '/murrplastik/tin-tuc/trien-lam-vec-2026/', 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => '2026-10-14'),
    array('loc' => $baseUrl . '/murrplastik/tin-tuc/thu-nghiem-do-ben-r-tec-liner-17-trieu-chu-ky/', 'priority' => '0.85', 'changefreq' => 'monthly', 'lastmod' => '2026-10-14')
);

// 15 Key Product Categories
$categories = array(
    'thiet-bi-han', 'dung-cu-bom-keo', 'may-cat-bang-dinh-tu-dong', 'may-bat-vit-nha-vit',
    'thiet-bi-kiem-tra', 'camera-kinh-soi-cong-nghiep', 'dung-cu-chong-tinh-dien',
    'thiet-bi-dong-goi-tu-dong', 'thiet-bi-tu-dong-hoa', 'xi-lanh-khi-nen',
    'khi-nen-phu-kien', 'bu-long-oc-vit', 'bang-tai-day-curoa', 'linh-kien-thiet-bi', 'murrplastik'
);

function slugify($text) {
    if (!$text) return '';
    $text = mb_strtolower($text, 'UTF-8');
    // Unicode decomposition & diacritics removal for Vietnamese
    $unaccented = array(
        'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ằ'=>'a','ắ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a','â'=>'a','ầ'=>'a','ấ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
        'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ề'=>'e','ế'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
        'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
        'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ồ'=>'o','ố'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ờ'=>'o','ớ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
        'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ừ'=>'u','ứ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
        'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
        'đ'=>'d'
    );
    $text = strtr($text, $unaccented);
    $text = preg_replace('/[^a-z0-9\s-]/', ' ', $text);
    $text = preg_replace('/\s+/', '-', trim($text));
    $text = preg_replace('/-+/', '-', $text);
    return $text;
}

function make_product_slug($name, $sku) {
    $name_slug = slugify($name ? $name : 'san-pham');
    $sku_slug = slugify($sku ? $sku : '');
    if (!$sku_slug) return $name_slug;
    if (substr($name_slug, -strlen($sku_slug)) === $sku_slug) return $name_slug;
    return $name_slug . '-' . $sku_slug;
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// Render Static Pages
foreach ($staticPages as $p) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($p['loc']) . "</loc>\n";
    echo "    <lastmod>" . $p['lastmod'] . "</lastmod>\n";
    echo "    <changefreq>" . $p['changefreq'] . "</changefreq>\n";
    echo "    <priority>" . $p['priority'] . "</priority>\n";
    echo "  </url>\n";
}

// Render Categories
foreach ($categories as $cat) {
    echo "  <url>\n";
    echo "    <loc>" . $baseUrl . "/danh-muc/" . $cat . "</loc>\n";
    echo "    <lastmod>2026-10-24</lastmod>\n";
    echo "    <changefreq>daily</changefreq>\n";
    echo "    <priority>0.9</priority>\n";
    echo "  </url>\n";
}

// Render Products from Database or Catalog Index
$dbLoaded = false;
try {
    if (file_exists(__DIR__ . '/office/config.php')) {
        require_once __DIR__ . '/office/config.php';
        $pdo = get_db();
        if ($pdo) {
            $stmt = $pdo->query("SELECT sku, name_vn, updated_at FROM tt_products WHERE status = 1 OR status IS NULL LIMIT 2000");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $slug = make_product_slug($row['name_vn'], $row['sku']);
                $lastmod = !empty($row['updated_at']) ? date('Y-m-d', strtotime($row['updated_at'])) : '2026-10-24';
                echo "  <url>\n";
                echo "    <loc>" . $baseUrl . "/san-pham/" . htmlspecialchars($slug) . "</loc>\n";
                echo "    <lastmod>" . $lastmod . "</lastmod>\n";
                echo "    <changefreq>weekly</changefreq>\n";
                echo "    <priority>0.8</priority>\n";
                echo "  </url>\n";
            }
            $dbLoaded = true;
        }
    }
} catch (Exception $e) {
    $dbLoaded = false;
}

// Fallback to catalog_index.json if database query fails or during offline builds
if (!$dbLoaded && file_exists(__DIR__ . '/data/catalog_index.json')) {
    $json = file_get_contents(__DIR__ . '/data/catalog_index.json');
    $products = json_decode($json, true);
    if (is_array($products)) {
        $seen = array();
        $fileModTime = date('Y-m-d', filemtime(__DIR__ . '/data/catalog_index.json'));
        foreach ($products as $p) {
            $name = isset($p['name']) ? $p['name'] : '';
            $sku = isset($p['sku']) ? $p['sku'] : (isset($p['id']) ? $p['id'] : '');
            if (!$name && !$sku) continue;
            $slug = make_product_slug($name, $sku);
            if (isset($seen[$slug])) continue;
            $seen[$slug] = true;
            $itemMod = !empty($p['updated_at']) ? date('Y-m-d', strtotime($p['updated_at'])) : $fileModTime;
            echo "  <url>\n";
            echo "    <loc>" . $baseUrl . "/san-pham/" . htmlspecialchars($slug) . "</loc>\n";
            echo "    <lastmod>" . $itemMod . "</lastmod>\n";
            echo "    <changefreq>weekly</changefreq>\n";
            echo "    <priority>0.8</priority>\n";
            echo "  </url>\n";
        }
    }
}

echo '</urlset>';
