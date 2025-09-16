# 🏥 Hệ thống quản lý nhập liệu kết quả khám sức khỏe

Ứng dụng React để quản lý nhập liệu kết quả khám sức khỏe cho nhân viên phòng khám, hỗ trợ quản lý kết quả khám cho nhiều công ty.

## ✨ Tính năng chính

-   **📋 Quản lý danh sách công ty**: Hiển thị, tìm kiếm, lọc và phân trang danh sách các công ty
-   **👥 Quản lý bệnh nhân**: Xem danh sách bệnh nhân theo công ty đã chọn
-   **📝 Nhập kết quả khám**: Form nhập liệu chi tiết kết quả khám sức khỏe
-   **✏️ Chỉnh sửa kết quả**: Cập nhật thông tin kết quả khám đã có
-   **🔍 Tìm kiếm và lọc**: Tìm kiếm nhanh trong danh sách công ty và bệnh nhân
-   **📄 Phân trang**: Hỗ trợ phân trang cho danh sách dài
-   **📱 Responsive**: Giao diện thân thiện trên mọi thiết bị

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

-   Node.js >= 14.0.0
-   npm >= 6.0.0

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình API

1. Tạo file `.env` trong thư mục gốc:

```env
REACT_APP_API_URL=http://your-api-server-url:port
```

2. Thay thế `http://your-api-server-url:port` bằng URL thực tế của server API

### Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production

```bash
npm run build
```

## 🔧 Cấu trúc dự án

```
src/
├── components/
│   ├── CompanyList.js          # Danh sách công ty
│   ├── PatientList.js          # Danh sách bệnh nhân
│   └── HealthResultForm.js     # Form nhập kết quả
├── services/
│   └── api.js                  # Service kết nối API
├── App.js                      # Component chính
├── App.css                     # Styles chính
├── index.js                    # Entry point
└── index.css                   # Global styles
```

## 📡 API Endpoints

Ứng dụng kết nối với các API endpoints sau:

### 1. Lấy danh sách công ty

```
GET /api/v1/ha/all-data
```

### 2. Lấy danh sách bệnh nhân theo công ty

```
GET /api/v1/ha/result-detail/{dataId}
```

### 3. Cập nhật kết quả khám

```
PUT /api/v1/ha/result-detail/{id}
```

## 🎯 Hướng dẫn sử dụng

### 1. Xem danh sách công ty

-   Trang chủ hiển thị danh sách tất cả công ty
-   Sử dụng thanh tìm kiếm để tìm công ty theo tên hoặc người tạo
-   Click vào header cột để sắp xếp
-   Sử dụng phân trang để xem nhiều công ty

### 2. Chọn công ty

-   Click nút "Chọn công ty" để xem danh sách bệnh nhân
-   Hệ thống sẽ chuyển đến trang danh sách bệnh nhân của công ty đó

### 3. Xem danh sách bệnh nhân

-   Hiển thị tất cả bệnh nhân của công ty đã chọn
-   Tìm kiếm theo loại khám, kết luận, bác sĩ hoặc tên file
-   Xem trạng thái kết quả (đã có/chưa có kết quả)

### 4. Nhập/chỉnh sửa kết quả

-   Click "Nhập kết quả" cho bệnh nhân chưa có kết quả
-   Click "Xem/Sửa" cho bệnh nhân đã có kết quả
-   Điền đầy đủ thông tin bắt buộc:
    -   Loại khám sức khỏe
    -   Kết luận khám
    -   Bác sĩ kết luận
-   Điền thông tin tùy chọn:
    -   Ngày kết luận
    -   Tên file đính kèm
    -   Đề xuất/chỉ định

## 🎨 Giao diện

-   **Thiết kế hiện đại**: Sử dụng gradient và shadow effects
-   **Responsive**: Tự động điều chỉnh trên mobile, tablet, desktop
-   **Intuitive**: Breadcrumb navigation và trạng thái rõ ràng
-   **Accessible**: Hỗ trợ keyboard navigation và screen readers

## 🔒 Bảo mật

-   Validation dữ liệu đầu vào
-   Xử lý lỗi API an toàn
-   Không lưu trữ dữ liệu nhạy cảm trong localStorage

## 🐛 Xử lý lỗi

-   Hiển thị thông báo lỗi rõ ràng
-   Retry mechanism cho API calls
-   Loading states cho UX tốt hơn

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ:

-   Email: support@clinic.com
-   Hotline: 1900-xxxx

## 📄 License

© 2024 Hệ thống quản lý khám sức khỏe. All rights reserved.
# ngocminh_app_nhap
