# SYSTEM ARCHITECTURE OVERVIEW — PROTOOLS.COM.VN

## 1. TỔNG QUAN KIẾN TRÚC TỔNG THỂ (HIGH-LEVEL ARCHITECTURE)

Hệ thống Protools.com.vn được thiết kế theo mô hình **Decoupled Modern Architecture** (Tách biệt hoàn toàn Frontend SPA và Backend Service):

```mermaid
graph TB
    subgraph Client_Layer [Tầng Client / Trình duyệt]
        Mobile[Mobile Browser - Kỹ sư hiện trường]
        Desktop[Desktop Browser - Phòng Thu Mua]
    end

    subgraph CDN_Web_Hosting [Tầng Hosting Tĩnh & CDN - Mắt Bão Cloud]
        LiteSpeed[LiteSpeed Web Server]
        StaticSPA[React 18 SPA Bundle + .htaccess]
    end

    subgraph Application_Layer [Tầng Dịch Vụ Ứng Dụng (ADR-004)]
        ModernAPI[Modern Independent REST API Service]
        AuthGuard[Security & Auth Middleware]
        RFQEngine[RFQ Processing Engine & PDF Generator]
    end

    subgraph Data_Layer [Tầng Cơ Sở Dữ Liệu - MariaDB 10.6]
        DB[(MariaDB 10.6 - prod2e4e_db)]
    end

    subgraph Defense_Perimeter [Vành Đai An Ninh]
        IM360[Imunify360 WAF + ModSecurity]
    end

    Mobile -->|HTTPS GET/POST| IM360
    Desktop -->|HTTPS GET/POST| IM360
    IM360 -->|Serve SPA| LiteSpeed
    LiteSpeed --> StaticSPA
    StaticSPA -->|REST API Calls| ModernAPI
    ModernAPI --> AuthGuard
    AuthGuard --> RFQEngine
    RFQEngine --> DB
```

## 2. NGUYÊN TẮC PHÂN TẦNG (LAYER RESPONSIBILITIES)
1. **Frontend Presentation Layer (React 18 + TS + Tailwind):** Chịu trách nhiệm render bảng Spec-sheet tốc độ cao, quản lý state giỏ hàng RFQ cục bộ (Local Storage), tối ưu trải nghiệm Mobile Touch Target 48px và Container Queries.
2. **Security & Perimeter Layer (Imunify360 WAF):** Kiểm duyệt 100% traffic, ngăn chặn tấn công khai thác SQL Injection, lọc payload độc hại.
3. **Application API Layer (Independent Modern Backend):** Cung cấp các RESTful API endpoints an toàn, xử lý logic tạo mã RFQ, sinh file PDF dự toán, và quản lý danh mục.
4. **Persistence Layer (MariaDB 10.6):** Lưu trữ dữ liệu danh mục sản phẩm, biến thể thông số kỹ thuật và lịch sử RFQ.
