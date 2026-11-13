# Đánh giá khảo sát kho dao CNC và đề xuất cập nhật

Ngày: 05/11/2026. Nguồn: báo cáo phân tích cuộc ghi âm khảo sát kho do anh Khải cung cấp, chưa đối chiếu trực tiếp với bản ghi âm hoặc bảng Excel gốc. Mốc thời gian dưới đây theo báo cáo.

## 1. Những điều phải thay đổi trong phương án cũ

1. **Cán dao là căn cứ định danh vật lý khi trả.** Báo cáo 01:02-01:28 và 11:00-11:58 nêu hộp có thể mất, lẫn dao hoặc không đi cùng dao khi trả. Tem hộp chỉ hỗ trợ quét nhanh lúc cấp; người giao phải đối chiếu mã và số thứ tự trên cán với hộp trước khi xác nhận. Hệ thống không thể suy ra sự trùng khớp vật lý chỉ từ mã hộp.
2. **Bản vẽ và xác nhận của lập trình là điều kiện cấp.** Báo cáo 05:07-05:41 và 12:25-12:50 nêu bản vẽ bắt buộc và quy định không có xác nhận lập trình thì kho không cấp. Ca đêm có người lập trình trực theo mô tả; không mặc định cấp tự phục vụ khi chưa có xác nhận hợp lệ.
3. **Trả và kiểm định là hai bước độc lập.** Thủ kho đối chiếu cá thể và số lượng trước; kiểm định viên soi rồi phân loại một lần, cũ hoặc hủy (08:58-10:02). Sau khi nhận trả, dao ở chờ kiểm định, chưa tính là sẵn sàng cấp.
4. **Loại dao và cá thể dao phải tách biệt.** Mã nội bộ, quy cách và mã nhà sản xuất thuộc danh mục loại dao; số thứ tự nhận diện cá thể trong phạm vi được kho xác nhận. Bảo toàn chuỗi gốc và số 0 đầu như `018` và `081`. Báo cáo vừa nói số không lặp, vừa nêu cùng số có thể xuất hiện ở mã khác: chưa được giả định số thứ tự là duy nhất toàn kho. Khóa hệ thống riêng; ràng buộc nghiệp vụ theo phạm vi thực tế sau khi đối chiếu Excel.

## 2. Giải pháp đề xuất

### Nhập và chuẩn hóa danh mục

- Khảo sát bảng tồn và bảng xuất/nhập thực tế, sao lưu và nhập thử trên dữ liệu bản sao. Lập danh sách trùng mã, thiếu số, dao đã hủy và mã hộp không khớp cán để kho xác nhận; không tự điều chỉnh tồn.
- Với mỗi loại lưu mã nội bộ, tên/quy cách, mã nhà sản xuất nếu có; mỗi cây có mã cá thể đầy đủ và lịch sử riêng. Không tái sử dụng định danh sau khi hủy.
- In tem mã máy đọc trên hộp gắn với cùng định danh cá thể; in thêm chữ để người kiểm tra. Tiếp tục khắc mã nội bộ và số thứ tự đọc được trên cán. Quy trình cấp lại tem phải xác minh cán và ghi nhận người thực hiện.

### Cấp dao ban ngày và ca đêm

1. Lập trình viên đăng nhập riêng, chọn bản vẽ hoặc phiên bản/lệnh sản xuất, chỉ định các **loại dao và số lượng**, xác nhận danh sách; lưu người xác nhận, thời điểm và phiên bản. Chữ ký điện tử thay chữ ký giấy chỉ áp dụng sau khi doanh nghiệp thống nhất quy trình.
2. CNC đăng nhập bằng tài khoản cá nhân, chọn bản vẽ đã được xác nhận, lấy hộp, quét mã tem và đối chiếu mã/số trên cán. Máy đối chiếu **loại dao** với chỉ định và kiểm tra **cá thể** còn sẵn sàng, đúng vị trí, chưa có lượt mượn mở.
3. Nếu sai, danh sách hết hiệu lực hoặc cá thể đang mượn/chờ kiểm định, dừng cấp và nêu lý do. Dao gãy cần thay được cấp cá thể khác cùng loại khi chỉ định còn hiệu lực, kiểm tra số lượng và lưu liên kết lượt thay thế; trường hợp vượt chỉ định cần người lập trình xác nhận lại.
4. Ghi một giao dịch trong transaction: người nhận, người xác nhận lập trình, bản vẽ và phiên bản, cá thể, tình trạng, thời điểm, ca/vị trí. Tự giảm số dao sẵn sàng. Một cá thể chỉ có một lượt mượn mở; chống gửi lặp và cấp đồng thời.
5. Đầu ca bàn giao danh sách dao được đặt tại khay đêm; sáng hôm sau đối chiếu số thực tế, lượt lấy và ngoại lệ. Đối soát không tạo thêm phiếu xuất. Cần xác nhận giờ ca thực tế, không mặc định 18:00-06:00.

### Thu hồi và kiểm định

- Thủ kho tìm theo người đang giữ, bản vẽ hoặc nhập **mã loại + số thứ tự đầy đủ** đọc trên cán; tìm theo số cuối chỉ để gợi ý, hiển thị mọi kết quả trùng, không tự chọn cá thể. Đối chiếu trực tiếp cán, số lượng và người trả rồi ghi nhận vào khu chờ kiểm định.
- Kiểm định viên soi và kết luận `DAO 1 LẦN`, `DAO CŨ` hoặc `HỦY`, lưu người, thời điểm, lý do nếu hủy. Tồn sẵn sàng tăng sau kiểm định đạt và về vị trí kho; xác nhận với kho thời điểm hạch toán và cách chốt tồn đầu kỳ.
- Trạng thái vận hành (`sẵn sàng`, `đang sử dụng`, `chờ kiểm định`, `hủy`) tách khỏi tình trạng dao (`mới`, `1 lần`, `cũ`) và vị trí. Cần quy tắc xử lý thiếu, mất, nhầm hộp, chữ khắc khó đọc; không tự áp dụng hình phạt qua hệ thống.

## 3. Lựa chọn công nghệ quét

| Phương án | Điểm mạnh | Giới hạn và thử nghiệm |
|---|---|---|
| QR/Data Matrix hoặc barcode trên tem hộp | Nhãn phẳng, máy quét 2D hoặc camera có thể đọc định danh đã mã hóa | Phải in thử kích thước thật, kiểm tra dầu/bẩn/lóa và xác minh hộp đúng cán. Không cam kết thời gian <0,5 giây khi chưa đo. |
| OCR chữ trên hộp | Dùng được tem hiện có, không cần in lại ngay | Chữ giống nhau, font nhỏ và ánh sáng dễ gây nhầm; chỉ coi kết quả là gợi ý và đối chiếu với mẫu hoặc danh mục. |
| OCR chữ khắc trên cán | Phù hợp trả dao trần nếu đọc được | Cần thử mẫu thật với gá cố định, ánh sáng tán xạ và thiết bị thực tế; không khẳng định đọc ổn định. |
| Mã khắc trực tiếp trên cán + máy đọc DPM | Có thể nhận diện khi mất hộp | Chưa thể kết luận barcode 1D hay 2D khắc được, không biến dạng hay dễ đọc. Cần phối hợp QC/nhà cung cấp thử trên mẫu phù hợp, đánh giá chất lượng khắc, độ bền và ảnh hưởng dụng cụ trước khi chọn. |
| Nhập thủ công có kiểm soát | Phương án dự phòng khi tem/cán khó quét | Chọn đúng cá thể và người giữ; ghi người thao tác, lý do, thời điểm và đối soát. Không chỉ nhập ba số rồi tự quyết định. |

Ưu tiên thử nhãn mã máy đọc trên hộp cho khâu cấp, kết hợp đối chiếu cán; khâu trả dùng cán làm căn cứ và thử OCR/DPM song song. Chỉ nhân rộng phương án sau kết quả đo tại kho và ý kiến QC.

## 4. Đối chiếu hệ thống hiện có

- Trang thử `/office/san-xuat/test/` chỉ kiểm tra camera/OCR, không cấp hoặc ghi kho; bản sửa nút cho phép thử camera không cần nhập mã. Việc đọc đúng mã trên iPhone và tem thật chưa được nghiệm thu.
- Mã local trong `production_service.php` đã có các nhánh nhận trả, kiểm định, đối soát và lưu mã bản vẽ, tên lập trình; chưa có bằng chứng việc tên lập trình tương đương xác nhận của người lập trình hoặc có kiểm tra danh sách dao đã duyệt theo bản vẽ. Đây là khoảng trống cần triển khai và kiểm thử.
- Không xem các dòng “đã đáp ứng” trong báo cáo là kết quả nghiệm thu production. Cần đối chiếu phiên bản thực đang chạy, cơ sở dữ liệu và quyền trước khi kết luận.
- Chức năng Sapo Murrplastik trong báo cáo là đầu việc riêng; chưa gộp vào đợt kho dao nếu chưa có yêu cầu triển khai.

## 5. Backlog và nghiệm thu

1. **P0 - Trải nghiệm thử và kiểm chứng thực địa:** thử camera trên iPhone; dùng 3 mẫu `018`, `081` và mẫu thứ ba để kiểm tra khả năng nhìn/đọc; chụp lại các điều kiện thất bại và không coi ba mẫu là đánh giá thống kê.
2. **P0 - Xác nhận nghiệp vụ:** xem Excel gốc, quy tắc duy nhất của số, giờ ca, ai có quyền xác nhận, quy tắc thay dao và cách tính tồn; ký duyệt quy trình trước khi thay giấy.
3. **P1 - Dữ liệu và vòng đời:** danh mục loại/cá thể, nhập thử, danh sách đối soát, trả/kiểm định hai bước và sổ giao dịch nguyên tử; kiểm thử đồng thời và gửi lặp trên cơ sở dữ liệu thử nghiệm.
4. **P1 - Chỉ định theo bản vẽ:** phiên bản danh sách, xác thực lập trình, kiểm tra phía server ở mọi API cấp và thay dao, quyền từng vai trò, thu hồi/sửa chỉ định có lịch sử.
5. **P2 - Quét và ca đêm:** thử ít nhất 30 hộp và 300 lượt theo thiết bị/ánh sáng; đo thời gian, tỷ lệ đọc đúng, đọc sai cá thể và không đọc được. Với mã máy đọc cần thêm mẫu xước/bẩn/hộp sai. Hai ca đêm vận hành có giám sát và đối soát thực tế.
6. **P3 - Phát hành:** nghiệm thu từng mốc, backup và diễn tập khôi phục, bảo vệ quyền và phiên, đào tạo kho/CNC/lập trình; theo dõi ngoại lệ và có quy trình quay lại khi gặp lỗi.

Không coi OCR hay dữ liệu camera là bằng chứng khẳng định hộp và dao bên trong trùng nhau. Định danh vật lý, phê duyệt và kiểm tra trạng thái phía server vẫn cần thiết.
