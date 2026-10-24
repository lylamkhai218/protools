# TTVina Office (Mini ERP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy TTVina Office (`https://protools.com.vn/office`), a secure, modular Mini ERP system for T&T Vina Industrial Co., Ltd., covering Sales, Warehouse/WMS, Procurement & Logistics, and Centralized Document Management.

**Architecture:** Pure PHP (PDO) + MariaDB 10.6 (`prod2e4e_db`) backend with clean REST API endpoints, integrated with a responsive industrial-grade Single Page UI in `/public_html/office`. Secure document repository outside direct web access with authenticated streaming handler.

**Tech Stack:** PHP 8.x, MariaDB 10.6, SQLite (source catalog), LiteSpeed Web Server, HTML5 / CSS3 / Vanilla JS (ES6+), Python 3.14 (deployment & verification tooling).

## Global Constraints
- **Zero Sapo Integration**: 100% independent internal database; no Sapo API calls.
- **Technology Stability**: Plain PHP + MariaDB only; no heavyweight frameworks (no Laravel/Symfony).
- **Rule 1 (Aesthetics)**: Absolutely NO Windows default emojis (yellow smiley). Use technical monochrome SVGs or Markdown formatting.
- **Rule 4 & 9 (Pricing)**: Quotation unit price to customers must be hardcoded static numbers. Markup standard: Net HQ * 1.25 (dealers) or Net * 1.62 (end-users); freight must be an unbundled independent line item.
- **Rule 15 (Typography)**: NEVER use em-dash `—` or en-dash `–`; only standard hyphen `-`.
- **Rule 16 (Warehouse Location Syntax)**: Must strictly use full Vietnamese `Hộp [Số] - Kệ [Số] - Tầng [Số]`.
- **Approval Gate**: Quotations < 5,000,000 VND auto-approved; >= 5,000,000 VND require Director approval.
- **Stock Reservation**: Exactly 15 days expiration countdown.
- **Full Landed Cost**: Cost includes Net EUR + Air/Sea Freight + Customs/Handling + Local delivery.

---

### Task 1: MariaDB Schema & Database Migration Engine
**Files:**
- Create: `D:\T&TVina\protools\office\database\001_initial_schema.sql`
- Create: `D:\T&TVina\protools\office\database\migrate.php`
- Test: `D:\T&TVina\protools\tests\test_database_schema.py`

**Interfaces:**
- Produces: Tables `tt_users`, `tt_customers`, `tt_suppliers`, `tt_products`, `tt_documents`, `tt_document_links`, `tt_shipments`, `tt_goods_receipts`, `tt_gr_items`, `tt_stock_items`, `tt_stock_ledger`, `tt_quotations`, `tt_quotation_items`, `tt_sales_orders`, `tt_so_items`, `tt_stock_reservations`, `tt_delivery_orders`, `tt_do_items`.

- [ ] **Step 1: Write SQL DDL migration script with all `tt_*` tables**
- [ ] **Step 2: Write PHP migration runner connecting via PDO to `prod2e4e_db`**
- [ ] **Step 3: Write test script to verify connection, table creation, and foreign keys**
- [ ] **Step 4: Execute migration and verify tables created on MariaDB**

---

### Task 2: Murrplastik Product Catalog & Stock 500kg Ingestion
**Files:**
- Create: `D:\T&TVina\protools\office\scripts\import_catalog_and_stock.py`
- Test: `D:\T&TVina\protools\tests\test_catalog_import.py`

**Interfaces:**
- Consumes: `Check all products Murrplastik.db` (15,407 SKUs) & `wms_500kg.json` (261 items).
- Produces: Populated `tt_products` with Net EUR PL26, packaging units, HS codes, and populated `tt_stock_items` & initial `tt_stock_ledger`.

- [ ] **Step 1: Write failing test checking for product count and stock balance**
- [ ] **Step 2: Implement Python import script migrating SQLite -> MariaDB `tt_products` and `wms_500kg.json` -> `tt_stock_items`**
- [ ] **Step 3: Run import and verify row counts (15,407 products, 261 stock items)**
- [ ] **Step 4: Verify stock balance calculation: available = on_hand - reserved**

---

### Task 3: Core Authentication & Role-Based Authorization
**Files:**
- Create: `D:\T&TVina\protools\public\office\config.php`
- Create: `D:\T&TVina\protools\public\office\auth.php`
- Create: `D:\T&TVina\protools\public\office\api.php`
- Test: `D:\T&TVina\protools\tests\test_auth_api.py`

**Interfaces:**
- Consumes: MariaDB `tt_users`
- Produces: Endpoints `POST /office/api.php?action=login`, `GET /office/api.php?action=me`, `POST /office/api.php?action=logout`.
- Roles: `ADMIN`, `SALES`, `PROCUREMENT`, `WAREHOUSE`, `ACCOUNTANT`.

- [ ] **Step 1: Write test for user authentication, password hashing (Argon2id/Bcrypt), session cookie, and role check**
- [ ] **Step 2: Implement `config.php` (DB PDO connection, secure headers, error handling)**
- [ ] **Step 3: Implement `auth.php` (login, logout, `has_role()`, `require_auth()`)**
- [ ] **Step 4: Seed default users (Admin, Sales, Procurement, Warehouse, Accountant) with secure credentials**
- [ ] **Step 5: Run tests and verify 200 OK on valid credentials, 401 on invalid, and 403 on role breach**

---

### Task 4: Secure Document Management & Authenticated Streaming Handler
**Files:**
- Create: `D:\T&TVina\protools\public\office\download.php`
- Create: `D:\T&TVina\protools\public\office\storage\.htaccess` (`Require all denied`)
- Create: `D:\T&TVina\protools\office\scripts\index_existing_documents.py`
- Test: `D:\T&TVina\protools\tests\test_documents_security.py`

**Interfaces:**
- Consumes: 237 documents in `D:\T&TVina\Báo giá`.
- Produces: `tt_documents` index, `tt_document_links`, and `GET /office/download.php?id=[doc_id]`.

- [ ] **Step 1: Write test verifying direct URL to documents folder returns 403, and `download.php` enforces auth**
- [ ] **Step 2: Implement `download.php` with mime-type detection, range requests, and filename sanitization**
- [ ] **Step 3: Index existing documents (AWB 5864742881, Invoice 9005222042, QCS Vietnam, Stock 500kg) into database**
- [ ] **Step 4: Verify test passes and document links resolve properly**

---

### Task 5: WMS & Warehouse Inventory Ledger (Increase/Decrease/Inbound/Outbound)
**Files:**
- Create: `D:\T&TVina\protools\public\office\modules\warehouse_api.php`
- Test: `D:\T&TVina\protools\tests\test_warehouse_ledger.py`

**Interfaces:**
- Consumes: `tt_stock_items`, `tt_stock_ledger`, `tt_goods_receipts`, `tt_delivery_orders`
- Produces:
  - `POST /office/api.php?action=create_receipt`: Inbound shipment, landed cost allocation, update on-hand, post to ledger.
  - `POST /office/api.php?action=create_delivery`: Outbound order, deduct on-hand, release reservation, post to ledger, prevent negative stock.
  - `GET /office/api.php?action=get_stock`: Filter by SKU, location `Hộp [Số] - Kệ [Số] - Tầng [Số]`.

- [ ] **Step 1: Write failing test verifying transaction rollback on negative stock and ledger balance matching**
- [ ] **Step 2: Implement `create_receipt` and `create_delivery` using MySQL transactions (`SELECT ... FOR UPDATE`)**
- [ ] **Step 3: Implement Landed Cost distribution logic (Net EUR + freight/customs allocated per kg)**
- [ ] **Step 4: Run tests and verify all stock calculations and edge cases pass**

---

### Task 6: Sales & Quotation Engine with 5M Approval Gate & 15-Day Reservation
**Files:**
- Create: `D:\T&TVina\protools\public\office\modules\sales_api.php`
- Test: `D:\T&TVina\protools\tests\test_sales_workflow.py`

**Interfaces:**
- Consumes: `tt_quotations`, `tt_sales_orders`, `tt_stock_reservations`
- Produces:
  - `POST /office/api.php?action=create_quotation`: Auto-approved if < 5,000,000 VND; Pending Director if >= 5,000,000 VND.
  - `POST /office/api.php?action=approve_quotation`: Director authorization check.
  - `POST /office/api.php?action=create_sales_order`: Converts approved quote to SO, reserves stock for 15 days.
  - Cron cleanup: Auto-release expired reservations after 15 days.

- [ ] **Step 1: Write test for < 5M auto-approval, >= 5M Director block, and 15-day reservation expiry**
- [ ] **Step 2: Implement `sales_api.php` business logic adhering to Rule 4, 9, and the 5M threshold**
- [ ] **Step 3: Run tests and verify correct state transitions**

---

### Task 7: Procurement & Logistics (DHL Arrival Notice, AWB 5864742881, VNACCS 01DDEC1)
**Files:**
- Create: `D:\T&TVina\protools\public\office\modules\procurement_api.php`
- Test: `D:\T&TVina\protools\tests\test_procurement_workflow.py`

**Interfaces:**
- Consumes: `tt_purchase_orders`, `tt_shipments`
- Produces:
  - `POST /office/api.php?action=record_arrival_notice`: Records AWB, flight EY112, warehouse 01DDEC1, sets 3-day storage fee countdown.
  - `GET /office/api.php?action=get_shipments`: Lists shipments, active countdowns, and AP payment due dates (08/12/2026).

- [ ] **Step 1: Write test for storage countdown timer calculation and REX 0% EVFTA validation**
- [ ] **Step 2: Implement `procurement_api.php`**
- [ ] **Step 3: Run test and verify shipment lifecycle**

---

### Task 8: Unified Office Single Page Application (UI Frontend)
**Files:**
- Create: `D:\T&TVina\protools\public\office\index.php`
- Create: `D:\T&TVina\protools\public\office\assets\app.js`
- Create: `D:\T&TVina\protools\public\office\assets\app.css`

**Interfaces:**
- Connects to `/office/api.php` endpoints.
- Provides 5 tabs:
  1. **Tổng quan (Dashboard)**: KPI counters, 3-day storage fee countdown timer, recent activities.
  2. **Bán hàng (Sales)**: RFQ list, Quote builder (QCS Vietnam template), SO list.
  3. **Kho hàng (WMS)**: Live stock ledger, Stock In (Phiếu nhập kho), Stock Out (Phiếu xuất kho), Location browser, Label printer.
  4. **Mua hàng & Vận tải**: Shipments list (DHL Air / Sea), AWB details, Customs clearance status, Landed cost manager.
  5. **Quản lý Chứng từ**: Search and preview 237+ uploaded documents.

- [ ] **Step 1: Implement responsive UI shell with navigation and authentication state**
- [ ] **Step 2: Implement Dashboard with live KPI counters and storage countdown timer**
- [ ] **Step 3: Implement WMS tab with increase/decrease/receipt/delivery modals and stock ledger table**
- [ ] **Step 4: Implement Sales & Procurement tabs with document attachment drawers**
- [ ] **Step 5: Implement Centralized Document Repository with search and instant download**

---

### Task 9: Deployment Pipeline & Production Verification
**Files:**
- Create: `D:\T&TVina\protools\deploy_office.py`
- Test: `D:\T&TVina\protools\tests\test_production_office.py`

**Interfaces:**
- Deploys `/public/office` and database schema to Mắt Bão production server (`s2d34.cloudnetwork.vn`).
- Enforces `.htaccess` permissions and verifies HTTP 200 response on `https://protools.com.vn/office`.

- [ ] **Step 1: Build deployment script `deploy_office.py` using FTP with backup and atomic upload**
- [ ] **Step 2: Execute dry-run and live deployment**
- [ ] **Step 3: Verify live endpoints, login, and document download**
