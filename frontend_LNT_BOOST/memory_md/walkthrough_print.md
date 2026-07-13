# Walkthrough - Định tuyến Path-based, Lazy Loading & Print/Export cho LNT_BOOST Frontend

Tôi đã hoàn tất việc chuyển đổi kiến trúc định tuyến của frontend từ **State-based** sang **Path-based Routing** sử dụng thư viện `react-router-dom`. Các đường dẫn URL hiện tại đã được thiết kế thân thiện dạng **Slug** (sử dụng tên chức năng thay vì ID số).

Đồng thời, theo yêu cầu mới, tôi đã tích hợp thêm chức năng **Print / Export** cho cả màn hình Danh sách nhà cung cấp (Vendor List) và màn hình Chi tiết (Vendor Detail Form).

---

## Các thay đổi đã thực hiện

### 1. Khai báo thư viện định tuyến
* **File:** [package.json](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/package.json)
* Đã thêm dependency `"react-router-dom": "^6.22.0"`.

### 2. Thiết kế Animation Spinner & Print Styles
* **File:** [index.css](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/index.css)
  * Thêm hiệu ứng `@keyframes spin` cho spinner tròn.
* **File:** [VendorMaster.css](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/VendorMaster.css)
  * Bổ sung khối `@media print` chuyên biệt cho việc in ấn A4. Khi kích hoạt chế độ in, toàn bộ thanh Sidebar, Header, Tab Bar, và các nút điều hướng sẽ tự động được ẩn đi. 
  * Các ô nhập liệu bị vô hiệu hóa (disabled) sẽ đổi từ nền xám sang nền trong suốt và có đường gạch dưới nét đứt (`1px dashed #ccc`) giống như biểu mẫu in chuyên nghiệp để ký nhận.

### 3. Tích hợp Print / Export cho Vendor Master
* **Màn hình Chi tiết (Form View) -** [VendorFormView.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/VendorFormView.tsx):
  * Thêm nút dropdown **Print / Export** trên Toolbar.
  * Hỗ trợ **In ra PDF / Print (A4)** bằng lệnh `window.print()`.
  * Hỗ trợ **Xuất file Excel (.csv)**: Tự động gom dữ liệu hiện tại của Vendor, chuyển thành tệp CSV chuẩn hóa với mã BOM UTF-8 (đảm bảo hiển thị chuẩn tiếng Việt có dấu trong Microsoft Excel).
* **Màn hình Danh sách (List View) -** [VendorListView.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/VendorListView.tsx):
  * Thêm nút dropdown **Print / Export List** bên cạnh nút "Add New Vendor".
  * Hỗ trợ **In danh sách / PDF (A4)** và **Xuất file Excel (.csv)** cho toàn bộ danh sách Vendor hiện hành.

### 4. Định tuyến Slug & Đồng bộ hóa Tab-to-URL
* **File:** [App.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/App.tsx)
  * Sử dụng `React.lazy()` và `Suspense` để trì hoãn việc tải (code-splitting) cho các view nặng: `DashboardOverview`, `SystemDataView`, `PurchaseOrderView`, `VendorMasterView`.
  * Sử dụng bộ chuyển đổi Slug (ví dụ: `"Vendor Master"` -> `"vendor-master"`).
  * Đồng bộ hai chiều giữa `location.pathname` của React Router và state danh sách các Tab công việc (`workspaceTabs`).

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

### Bước 3: Kiểm thử chức năng in ấn & xuất file
1. **Kiểm tra tại màn hình danh sách Vendor (Vendor List)**:
   * Click chọn **Print / Export List** -> Chọn **Xuất file Excel (.csv)**. File `vendor_list.csv` sẽ được tải xuống, bạn mở bằng Excel để kiểm tra tính chính xác và bảng mã UTF-8 tiếng Việt.
   * Chọn **In danh sách / PDF (A4)** -> Xem bản preview in của trình duyệt (chỉ hiển thị bảng danh sách dữ liệu sạch, các thanh menu và nút đều đã được ẩn tự động).
2. **Kiểm tra tại màn hình chi tiết Vendor (Vendor Form)**:
   * Double-click vào một dòng Vendor bất kỳ để vào màn hình chi tiết.
   * Click chọn **Print / Export** trên Toolbar -> Chọn **Xuất file Excel (.csv)** để tải xuống thông tin biểu mẫu của Vendor đó.
   * Chọn **In ra PDF / Print (A4)** -> Kiểm tra bản preview in. Các ô input disabled sẽ hiển thị dưới dạng các dòng kẻ điền form vô cùng sạch đẹp và chuyên nghiệp.
