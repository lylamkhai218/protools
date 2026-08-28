# DATABASE SCHEMA (MARIADB 10.6 DDL SPECIFICATION)

```sql
-- 1. Bảng Danh mục
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `parent_id` VARCHAR(36) DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Thương hiệu
CREATE TABLE IF NOT EXISTS `brands` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) UNIQUE NOT NULL,
    `origin_country` VARCHAR(100) NOT NULL,
    `logo_url` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Sản phẩm mẹ
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(36) PRIMARY KEY,
    `category_id` VARCHAR(36) NOT NULL,
    `brand_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) UNIQUE NOT NULL,
    `material` VARCHAR(150) NOT NULL,
    `coating` VARCHAR(100) DEFAULT NULL,
    `helix_angle` DECIMAL(5,2) DEFAULT NULL,
    `hardness_max` INT DEFAULT NULL,
    `description` LONGTEXT DEFAULT NULL,
    `hero_image` VARCHAR(500) DEFAULT NULL,
    `datasheet_url` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_prod_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Biến thể kỹ thuật (Spec-sheet)
CREATE TABLE IF NOT EXISTS `product_variants` (
    `id` VARCHAR(36) PRIMARY KEY,
    `product_id` VARCHAR(36) NOT NULL,
    `sku` VARCHAR(100) UNIQUE NOT NULL,
    `diameter_d` DECIMAL(8,3) NOT NULL,
    `shank_diameter_d` DECIMAL(8,3) NOT NULL,
    `flute_length_l` DECIMAL(8,3) NOT NULL,
    `overall_length_l` DECIMAL(8,3) NOT NULL,
    `flute_count` INT NOT NULL DEFAULT 4,
    `corner_radius_r` DECIMAL(8,3) DEFAULT 0.000,
    `price` DECIMAL(12,2) DEFAULT NULL,
    `stock_status` ENUM('in_stock', 'low_stock', 'pre_order') DEFAULT 'in_stock',
    `moq` INT DEFAULT 1,
    CONSTRAINT `fk_var_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    INDEX `idx_sku` (`sku`),
    INDEX `idx_spec` (`diameter_d`, `overall_length_l`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Yêu cầu báo giá (RFQ)
CREATE TABLE IF NOT EXISTS `rfq_requests` (
    `id` VARCHAR(36) PRIMARY KEY,
    `rfq_code` VARCHAR(50) UNIQUE NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `tax_code` VARCHAR(50) DEFAULT NULL,
    `contact_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `project_name` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('pending', 'quoting', 'quoted', 'completed', 'cancelled') DEFAULT 'pending',
    `note` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Chi tiết RFQ
CREATE TABLE IF NOT EXISTS `rfq_items` (
    `id` VARCHAR(36) PRIMARY KEY,
    `rfq_id` VARCHAR(36) NOT NULL,
    `variant_id` VARCHAR(36) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `custom_note` VARCHAR(500) DEFAULT NULL,
    CONSTRAINT `fk_rfq_parent` FOREIGN KEY (`rfq_id`) REFERENCES `rfq_requests` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rfq_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
