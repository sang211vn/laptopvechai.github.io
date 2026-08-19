LAPTOP VE CHAI .COM - WEB V1
- Mở index.html bằng Chrome.
- Dữ liệu V1 lưu trong localStorage của trình duyệt trên máy tính.
- Có: Trang chủ, Nhập kho, sửa chữa/nâng cấp, tự tính giá vốn, Kho Laptop, Kho linh kiện (khung), Bán hàng tự trừ kho, Lịch sử.
- Nút Chụp hình dùng camera của thiết bị khi trình duyệt hỗ trợ (đặc biệt khi mở trên điện thoại qua HTTPS/localhost).
- Bản tiếp theo có thể thêm: camera điện thoại kết nối với máy tính qua QR/LAN, nhập linh kiện đầy đủ, xuất Word, hóa đơn, khách hàng, nhà cung cấp và báo cáo.

V1 cập nhật: Hãng máy đã có danh sách chọn nhanh gồm Dell, HP, Lenovo, Asus, Acer, MSI, Apple, Surface, Samsung, Sony, LG, Huawei, Fujitsu, Toshiba, Gigabyte, Razer và Khác.

V1 cập nhật: Model máy là danh sách phụ thuộc vào Hãng máy; chọn Dell/HP/Lenovo... sẽ hiện các model tương ứng.

V1 cập nhật lớn: danh sách Model được mở rộng từ nhiều đời cũ đến các dòng mới. Danh sách là bộ chọn nhanh, có thể bổ sung model bất cứ lúc nào.

V2: thêm Nhập linh kiện, Kho linh kiện, Thư viện ảnh Model linh kiện. Mỗi model linh kiện có ảnh mẫu riêng.

V2.1 FIX: đã sửa menu để hiện Nhập linh kiện và Thư viện ảnh. Đã thêm vùng hiển thị ảnh mẫu Model trong Nhập kho.

V2.2: menu chính được chốt đúng thứ tự: Trang chủ → Nhập kho → Nhập linh kiện → Kho hàng → Bán hàng → Lịch sử bán → Thư viện ảnh.

V2.3: Model linh kiện dùng danh sách chọn nhanh phụ thuộc Loại linh kiện + Hãng, giống Model laptop.

V2.4: thêm nút TỰ NHẬN DIỆN MODEL bằng OCR. Chụp ảnh rõ tem Model/Service Tag, phần mềm đọc chữ trong ảnh và dò với danh sách Model. Lần đầu cần Internet để tải Tesseract.js; kết quả cần kiểm tra trước khi lưu.

V2.5: thêm TỰ NHẬN DIỆN MODEL cho linh kiện. Chụp ảnh/tem linh kiện → OCR đọc mã → tự chọn Loại + Hãng + Model theo danh sách.


V3 LAN - Dùng thử trên điện thoại:
1. Máy tính và điện thoại cùng Wi-Fi.
2. Trên máy tính chạy CHAY_LAN.bat.
3. Cửa sổ sẽ hiện địa chỉ http://192.168.x.x:8000.
4. Trên Chrome điện thoại nhập đúng địa chỉ đó.
5. Dữ liệu localStorage hiện vẫn nằm ở trình duyệt của từng thiết bị; đây là bản thử LAN. Bước tiếp theo sẽ chuyển dữ liệu về máy tính/server để điện thoại và máy tính dùng chung kho.

V3.1: Kho dung chung qua server LAN. Du lieu luu tren may tinh trong data/database.json. Dien thoai va may tinh cung Wi-Fi se doc/ghi cung mot kho.


V3.2 FIX KHO CHUNG:
- SAVE điện thoại/PC chờ server ghi xong database.json trước khi báo thành công.
- Khi mở/chuyển trang, ứng dụng đồng bộ lại dữ liệu từ server.
- Dashboard hiển thị trạng thái KHO CHUNG.
- Cả điện thoại và PC phải mở cùng địa chỉ http://IP:8000; không mở index.html trực tiếp.


V3.3: chống cache trình duyệt, thêm kiểm tra /api/ping, log IP thiết bị và nút ĐỒNG BỘ KHO. Khi test phải dùng đúng cùng địa chỉ IP:8000 trên cả PC và điện thoại.


V3.4 QUAN LY KHO:
- Xem chi tiết máy.
- Xem ảnh Model và ảnh thực tế nếu bản ghi có ảnh.
- Sửa hãng, model, số lượng, giá nhập, chi phí bàn phím/màn hình/RAM/SSD/khác; tự tính giá vốn.
- Xóa máy có xác nhận.
- Tất cả thay đổi ghi vào KHO CHUNG.

V3.5: Kho hàng có XEM / ảnh / SỬA / XÓA cho laptop và linh kiện; sửa số lượng, giá, chi phí sửa chữa; laptop mới lưu cả ảnh thực tế. Đã sửa stockPage để nút quản lý thực sự hiển thị.

V3.8: Kho hàng có thêm thẻ TỔNG GIÁ LINH KIỆN, tính theo giá/cái x số lượng còn.

V3.9: Chọn Hãng → Model tự động hiển thị ảnh mẫu đúng Model. Thư viện ảnh có chức năng thêm/lưu ảnh thật cho từng Model.

V4.0: Thư viện ảnh Model được nạp sẵn và liên kết tự động theo Hãng + Model; Nhập kho và Kho hàng/XEM dùng chung ảnh mẫu.

V4.1: Tự hiện ảnh cho tất cả model laptop và linh kiện. Ảnh thật trong thư viện được ưu tiên; model chưa có ảnh thật dùng ảnh mẫu tự sinh để không còn khung trống.

V4.2: Ưu tiên ảnh chụp thực tế của từng món; nếu chưa có thì dùng ảnh thật trong Thư viện Model; không tự tạo hình minh họa.
