# DEPLOYMENT DIAGRAM — HẠ TẦNG TRIỂN KHAI

```mermaid
graph TB
    subgraph Client_Devices [Thiết Bị Người Dùng]
        MobileDev[Smartphones / Màn hình gập - Kỹ sư]
        PC[Máy tính để bàn / Laptop - Phòng Thu Mua]
    end

    subgraph MatBao_Cloud [Mắt Bão Cloud Network Server - s2d34.cloudnetwork.vn]
        subgraph Perimeter [Vành đai bảo mật]
            WAF[Imunify360 WAF / ModSecurity Port 80/443]
        end

        subgraph Web_Server [Web Server Tier]
            LiteSpeed[LiteSpeed Web Server]
            DocRoot["/domains/protools.com.vn/public_html"]
            HTAccess[".htaccess (SPA Routing & Security Headers)"]
            Assets["dist/ (Vite Static Bundle: JS, CSS, Media)"]
        end

        subgraph Database_Tier [Database Tier]
            MariaDB[MariaDB 10.6 Instance - Port 3306]
            ProdDB[("Database: prod2e4e_db")]
        end

        subgraph Admin_Control [Quản trị Hosting]
            DA[DirectAdmin Control Panel - Port 2222]
            PMA[phpMyAdmin Session]
        end
    end

    MobileDev -->|HTTPS| WAF
    PC -->|HTTPS| WAF
    WAF --> LiteSpeed
    LiteSpeed --> DocRoot
    DocRoot --> HTAccess
    DocRoot --> Assets
    MariaDB --> ProdDB
    DA --> PMA
    PMA --> MariaDB
```

## QUY TRÌNH DEPLOY PRODUCTION TỰ ĐỘNG
- **Script Deploy:** [`deploy_protools.py`](file:///d:/T&TVina/protools/deploy_protools.py).
- **Thư mục sao lưu an toàn:** [`backups/`](file:///d:/T&TVina/protools/backups/).
- **Cấu hình `.htaccess`:** Điều hướng toàn bộ non-file requests về `index.html` (SPA standard fallback) và thiết lập MIME types gzip/brotli.
