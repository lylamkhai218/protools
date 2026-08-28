# PATTERN-001: BẢNG SPEC-SHEET GRID THÍCH ỨNG BẰNG CONTAINER QUERIES

## MÔ TẢ PATTERN
Bảng thông số thiết bị cơ khí chứa nhiều cột kích thước (D, d, l, L, R, MOQ, Giá). Trên màn hình điện thoại hoặc khi đặt trong Sidebar, bảng cần tự động hiển thị dạng danh sách thẻ (Card Summary); khi nằm ở vùng nội dung chính rộng rãi, bảng tự mở rộng dạng Grid đa cột.

```html
<div class="@container">
  <!-- Trên container hẹp: Render dạng Compact Cards -->
  <div class="block @lg:hidden space-y-2">
    <!-- Card SKU biến thể -->
  </div>

  <!-- Trên container rộng: Render full Grid Table -->
  <div class="hidden @lg:block overflow-x-auto">
    <table class="min-w-full text-xs">
      <!-- Full Spec Headers: D, d, l, L, R, MOQ, Action -->
    </table>
  </div>
</div>
```

## LỢI ÍCH
- Không cần tải lại trang hay đổi component.
- Không gây giật vỡ layout trên các dòng máy màn hình hẹp hay màn hình gập.
