# Walkthrough - Định tuyến Path-based & Lazy Loading cho LNT_BOOST Frontend

Tôi đã hoàn tất việc chuyển đổi kiến trúc định tuyến của frontend từ **State-based** (dùng React State để lưu trang hiện tại) sang **Path-based Routing** sử dụng thư viện `react-router-dom`. Các đường dẫn URL hiện tại đã được thiết kế thân thiện dạng **Slug** (sử dụng tên chức năng thay vì ID số).

Đồng thời, các component view lớn đã được áp dụng kỹ thuật **Lazy Loading** để tăng tốc độ phản hồi ban đầu của hệ thống.

---

## Các thay đổi đã thực hiện

### 1. Khai báo thư viện định tuyến
* **File:** [package.json](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/package.json)
* Đã thêm dependency `"react-router-dom": "^6.22.0"`.

### 2. Thiết kế Animation Spinner khi chuyển trang
* **File:** [index.css](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/index.css)
* Thêm hiệu ứng `@keyframes spin` cho spinner tròn. Khi người dùng truy cập một route chưa được tải (lazy component), spinner này sẽ hiển thị mượt mà.

### 3. Bộ định tuyến thân thiện (URL Slug) & Đồng bộ hóa Tab-to-URL
* **File:** [App.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/App.tsx)
  * Sử dụng `React.lazy()` và `Suspense` để trì hoãn việc tải (code-splitting) cho các view nặng: `DashboardOverview`, `SystemDataView`, `PurchaseOrderView`, `VendorMasterView`.
  * Tích hợp bộ chuyển đổi chuỗi chữ cái tiếng Việt/tiếng Anh có dấu thành Slug không dấu phân cách bằng gạch ngang (ví dụ: `"Vendor Master"` -> `"vendor-master"`).
  * Định nghĩa hệ thống `<Routes>` bảo mật (Route Guards) trong `AppContent`:
    * Tự động điều chuyển sang `/login` nếu chưa có token.
    * Tự động điều chuyển sang `/site-selection` nếu đã đăng nhập nhưng chưa chọn Site/Module.
  * Tích hợp đồng bộ hai chiều giữa `location.pathname` của React Router và state danh sách các Tab công việc (`workspaceTabs`):
    * Khi bấm Sidebar hoặc Modal: Đổi URL ứng dụng tương ứng (`/function/vendor-master` hoặc `/sys-db/sys_company`).
    * Khi click đổi tab: Đổi URL tương ứng.
    * Khi đóng tab (nút X): Đóng tab và đổi URL tới tab kế bên hoặc về Dashboard.
    * Khi người dùng sao chép liên kết (ví dụ: `/function/vendor-master`) và dán vào trình duyệt mới: Ứng dụng tự động đọc Slug từ URL, đối chiếu tìm kiếm trong danh mục Menu để lấy ID gốc, thêm tab tương ứng vào thanh Tab Bar và hiển thị chính xác.

### 4. Xác minh sự tương thích của Sidebar & Header
* **Các file:** [Sidebar.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/layouts/Sidebar.tsx) và [Header.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/layouts/Header.tsx)
* Xác minh toàn bộ các sự kiện click trên Sidebar và các hành động đổi Site, Đăng xuất trên Header đều gọi qua các hàm callback được quản lý tại `App.tsx` (hiện tại đã được nâng cấp để thực thi lệnh điều hướng `navigate`). Không cần sửa trực tiếp nội dung các layout này.

---

## Hướng dẫn cài đặt & Kiểm thử (Verification Steps)

Mở terminal tại thư mục `d:\LNT_Learn\VisualStudio\LNT_BOOST\frontend_LNT_BOOST` và chạy các lệnh dưới đây:

### Bước 1: Cài đặt thư viện mới
```powershell
npm install
```

### Bước 2: Khởi động dự án
```powershell
npm run dev
```

### Bước 3: Thực hiện kiểm thử các kịch bản
1. **Kiểm tra Route Guard**:
   * Truy cập thẳng địa chỉ `http://localhost:5173/` -> Trang web phải tự điều hướng về `/login`.
2. **Đăng nhập và chọn Site**:
   * Đăng nhập -> Tự động chuyển tới `/site-selection`.
   * Xác nhận Site và Phân hệ -> Tự động chuyển tới `/dashboard`.
3. **Mở chức năng nghiệp vụ**:
   * Click chọn chức năng **Vendor Master** trên Sidebar -> URL trình duyệt chuyển thành `http://localhost:5173/function/vendor-master` (Thay vì ID số 301 như trước) và tab "Vendor Master" xuất hiện.
   * Click chọn chức năng **Purchase Order** -> URL chuyển thành `http://localhost:5173/function/purchase-order` (Thay vì ID số 115).
4. **Kiểm tra đồng bộ Tab-to-URL**:
   * Nhấp qua lại giữa tab "Vendor Master" và tab "Purchase Order" -> URL trên thanh địa chỉ phải thay đổi tương ứng.
   * Đóng tab "Vendor Master" -> Tab biến mất và URL chuyển về tab còn lại hoặc Dashboard.
5. **Kiểm tra lưu trữ và chia sẻ URL (Bookmark/Share Link)**:
   * Mở tab "Vendor Master" (URL là `/function/vendor-master`).
   * Sao chép URL này, dán vào trình duyệt ẩn danh mới -> Giao diện tự động mở sẵn tab "Vendor Master" trên Tab Bar và hiển thị đúng nội dung của trang này.
