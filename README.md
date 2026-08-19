# LAPTOP VE CHAI.COM — V4.80

Phần mềm quản lý bán laptop, linh kiện, kho, sửa chữa và thanh lý.

## V4.80
- Cập nhật giao diện tức thời sau khi lưu đơn.
- Lịch sử bán laptop/linh kiện, thanh lý và sửa chữa cập nhật ngay.
- Đồng bộ dữ liệu nền, không chặn giao diện.
- In Bill/phiếu không dùng cửa sổ `about:blank` trắng.
- Ẩn giá gốc trong các thao tác bán hàng.
- Hiệu ứng nút bấm khi nhấn.

## Chạy trên máy Windows
1. Cài Python 3.
2. Mở thư mục dự án.
3. Chạy `CHAY_LAN.bat`.
4. Trình duyệt mở tại `http://127.0.0.1:8000`.

Nếu cần cài backend thủ công:

```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app:app --host 127.0.0.1 --port 8000
```

## Đưa lên GitHub
Upload toàn bộ **nội dung bên trong thư mục này** vào repository GitHub.

> GitHub Pages chỉ chạy phần frontend tĩnh (`index.html`, `css`, `js`, `assets`). Backend Python/FastAPI không chạy trực tiếp trên GitHub Pages; muốn chạy backend online cần một máy chủ dịch vụ riêng.

## Cấu trúc
- `index.html` — giao diện chính
- `css/` — giao diện
- `js/` — logic ứng dụng
- `assets/` — hình ảnh tài nguyên
- `backend/` — FastAPI + SQLite
- `server_lan.py` — server LAN
- `CHAY_LAN.bat` — chạy bản local
- `CHAY_SERVER_ONLINE.bat` — chạy server theo cấu hình hiện có


## V4.82 FIX
- In Bill/Báo phiếu hiển thị ngay trên cửa sổ hiện tại, không mở `about:blank`.
- Bấm IN PHIẾU sẽ render bill trước rồi mở hộp thoại in.
- Xóa/chuyển Kho/Thanh lý cập nhật giao diện ngay, không chờ server.
- Lưu dữ liệu chạy nền sau khi giao diện đã cập nhật.
