# DOMAIN MODEL (MÔ HÌNH MIỀN NGHIỆP VỤ B2B)

```mermaid
classDiagram
    class Category {
        +string id
        +string name
        +string slug
        +string parentId
        +string description
    }
    class Brand {
        +string id
        +string name
        +string originCountry
        +string logoUrl
    }
    class Product {
        +string id
        +string name
        +string slug
        +string categoryId
        +string brandId
        +string material
        +string coating
        +string description
        +string[] applicationMaterials
    }
    class ProductVariant {
        +string id
        +string productId
        +string sku
        +float diameter_D
        +float shankDiameter_d
        +float fluteLength_l
        +float overallLength_L
        +int fluteCount
        +float cornerRadius_R
        +float price
        +string stockStatus
        +int moq
    }
    class RFQRequest {
        +string id
        +string rfqCode
        +string companyName
        +string taxCode
        +string contactName
        +string phone
        +string email
        +string projectName
        +string status
        +datetime createdAt
    }
    class RFQItem {
        +string id
        +string rfqId
        +string variantId
        +int quantity
        +string note
    }

    Category "1" -- "*" Product : contains
    Brand "1" -- "*" Product : manufactures
    Product "1" -- "*" ProductVariant : has variants
    RFQRequest "1" -- "*" RFQItem : includes
    ProductVariant "1" -- "*" RFQItem : referenced by
```

## GIẢI THÍCH MÔ HÌNH THỰC THỂ
1. **Category & Brand:** Tổ chức danh mục ngành hàng cơ khí và thương hiệu đối tác phân phối chính hãng.
2. **Product (Sản phẩm mẹ):** Đại diện cho một dòng dụng cụ (ví dụ: "Dao phay ngón 4 me phủ TiAlN dòng HRC55"). Chứa thông tin chung về vật liệu gia công, lớp phủ, góc xoắn.
3. **ProductVariant (Biến thể SKU):** Chứa thông số hình học chính xác (D, d, l, L, R) cho từng kích thước cụ thể. Đây là thực thể được thêm vào giỏ RFQ.
4. **RFQRequest & RFQItem:** Đơn yêu cầu báo giá theo dự án B2B.
