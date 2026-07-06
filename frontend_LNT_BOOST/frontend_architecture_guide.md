# Tài liệu hướng dẫn phát triển Frontend (React & TypeScript) - LNT_BOOST

Tài liệu này được biên soạn dành riêng cho bạn để nắm bắt nhanh cách thức hoạt động của frontend trong dự án `LNT_BOOST`, giúp bạn có thể tự tin chỉnh sửa, bảo trì và phát triển các tính năng mới (như thêm API, vẽ giao diện, xử lý luồng dữ liệu).

---

## 1. Tổng quan Kiến trúc Frontend

Frontend của bạn được xây dựng bằng **React** (thư viện JavaScript dùng để xây dựng giao diện), **TypeScript** (phiên bản mở rộng của JavaScript giúp kiểm soát lỗi chặt chẽ thông qua việc định nghĩa kiểu dữ liệu) và build bằng **Vite** (công cụ build dự án rất nhanh).

### Cấu trúc các thư mục quan trọng trong `src/`

```text
src/
├── core/             # Chứa mã nguồn cốt lõi (ví dụ: httpClient cấu hình kết nối API)
├── types/            # Khai báo kiểu dữ liệu (Interfaces) cho toàn hệ thống
├── entities/         # Định nghĩa các nghiệp vụ/thực thể (gồm API riêng và bộ chuyển đổi dữ liệu)
│   ├── user/         # Ví dụ thực thể User
│   │   ├── userApi.ts          # Các hàm gọi API liên quan tới User
│   │   └── userTransformer.ts  # Chuẩn hóa dữ liệu từ DB (SQL) về dạng chuẩn Frontend
│   └── site/, company/, v.v.
├── services/         # Nơi gom các API riêng lẻ thành một dịch vụ chung (apiService)
├── components/       # Các component UI dùng chung cho toàn dự án (như LoadingSpinner)
├── features/         # Chứa giao diện và logic của từng màn hình chức năng cụ thể
│   ├── auth/         # Giao diện đăng nhập
│   ├── system-db/    # Giao diện quản lý các bảng hệ thống
│   └── scm/          # Quản lý chuỗi cung ứng (Supply Chain Management)
├── App.tsx           # Component gốc định tuyến (Routing) và layout tổng quát của ứng dụng
├── main.tsx          # Điểm khởi chạy của React, render App vào file index.html
└── index.css         # CSS Global định nghĩa màu sắc, font chữ và các biến style
```

---

## 2. Các thành phần chính hoạt động như thế nào?

### A. Quản lý kết nối API (`src/core/api/httpClient.ts`)
*   **Chức năng**: Chứa hàm `apiFetch<T>(endpoint, options)`. Hàm này bọc ngoài hàm `fetch` mặc định của trình duyệt để tự động chèn token đăng nhập (`Authorization: Bearer <token>`) vào mỗi request.
*   **Cơ chế tự động làm mới Token (Silent Refresh Token)**: Nếu backend trả về lỗi `401 Unauthorized` (Token hết hạn), `httpClient.ts` sẽ tự động gọi API `/auth/refresh` để lấy Token mới, lưu vào `localStorage`, rồi tự động thực hiện lại request bị lỗi trước đó mà người dùng không hề hay biết.

### B. Định nghĩa Kiểu dữ liệu (`src/types/index.ts`)
*   **TypeScript** yêu cầu chúng ta khai báo trước cấu trúc của dữ liệu (gọi là `interface` hoặc `type`). Điều này giúp trình soạn thảo nhắc code (IntelliSense) và báo lỗi ngay khi bạn gõ sai tên cột/thuộc tính.
*   Ví dụ:
    ```typescript
    export interface MastUserInfo {
      username: string;       // Bắt buộc là chuỗi
      fullName: string | null; // Có thể là chuỗi hoặc null
      admin: boolean | null;   // Có thể là true/false hoặc null
    }
    ```

### C. Lớp Entity API và Transformer (`src/entities/`)
*   **API**: Thay vì viết code kết nối API trực tiếp ở màn hình giao diện, dự án tách riêng ra các file `xxxApi.ts`.
*   **Transformer (Bộ chuyển đổi)**: Backend hoặc SQL Server thường trả về tên cột viết hoa/viết thường lộn xộn (ví dụ: `Username`, `FULLNAME`, `ActiveFlag`). File `xxxTransformer.ts` có nhiệm vụ chuyển đổi các thuộc tính thô đó thành các thuộc tính chữ thường chuẩn camelCase (như `username`, `fullName`, `activeFlag`) trước khi đưa lên màn hình.

---

## 3. Hướng dẫn từng bước: Thêm một API backend mới & hiển thị lên Frontend

Giả sử phía backend mới viết một API trả về danh sách **Sản Phẩm (Product)**. Đường dẫn API là `/SqlGateway/query` với body gửi đi là `{ queryName: 'GetProducts' }` (hoặc một endpoint dạng `/api/products`). 

Dưới đây là 4 bước để bạn tích hợp API này vào Frontend:

### Bước 1: Khai báo Interface (Kiểu dữ liệu)
Mở file `src/types/index.ts` và thêm định nghĩa cấu trúc dữ liệu cho Product ở cuối file:

```typescript
// Thêm vào file src/types/index.ts
export interface ProductInfo {
  productId: string;
  productName: string;
  price: number;
  activeFlag: boolean;
}
```

### Bước 2: Tạo Entity API & Transformer cho Product
Tạo một thư mục mới là `src/entities/product`. Trong thư mục này, tạo 2 file:

1.  **File 1: `productTransformer.ts`** để chuẩn hóa dữ liệu từ API:
    ```typescript
    // src/entities/product/productTransformer.ts
    import type { ProductInfo } from '../../types';

    export function transformProductInfo(raw: any): ProductInfo {
      return {
        productId: String(raw?.productId || raw?.ProductID || '').trim(),
        productName: String(raw?.productName || raw?.ProductName || 'Không tên').trim(),
        price: Number(raw?.price || raw?.Price || 0),
        activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag ?? false)
      };
    }
    ```

2.  **File 2: `productApi.ts`** để thực hiện gọi API:
    ```typescript
    // src/entities/product/productApi.ts
    import { apiFetch } from '../../core/api/httpClient';
    import { transformProductInfo } from './productTransformer';
    import type { ProductInfo } from '../../types';

    export const productApi = {
      // Hàm gọi API lấy danh sách sản phẩm
      getProducts: async (): Promise<ProductInfo[]> => {
        const raw = await apiFetch<any[]>('/SqlGateway/query', {
          method: 'POST',
          body: JSON.stringify({ queryName: 'GetProducts' }) // Tùy chỉnh body theo yêu cầu backend
        });
        
        // Map qua từng phần tử thô và chuyển đổi sang kiểu dữ liệu chuẩn
        return raw.map(transformProductInfo);
      }
    };
    ```

### Bước 3: Đăng ký API mới vào `apiService` dùng chung
Mở file `src/services/api.ts` để gộp `productApi` vào service chung giúp toàn ứng dụng dễ dàng gọi.

```typescript
// src/services/api.ts
import { authApi } from '../entities/auth/authApi';
import { userApi } from '../entities/user/userApi';
// ... các import khác ...
import { productApi } from '../entities/product/productApi'; // <-- 1. IMPORT THÊM Ở ĐÂY

export const apiService = {
  ...authApi,
  ...userApi,
  // ... các api khác ...
  ...productApi // <-- 2. GỘP VÀO ĐÂY
};
```

### Bước 4: Tạo Component để gọi API và hiển thị lên màn hình
Bây giờ, bạn muốn tạo một giao diện hiển thị danh sách sản phẩm. Bạn sẽ tạo một component React. Ví dụ tạo file `src/features/scm/ProductList.tsx`:

```tsx
// src/features/scm/ProductList.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import type { ProductInfo } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProductList() {
  // 1. KHAI BÁO CÁC STATE (Trạng thái của Component)
  const [products, setProducts] = useState<ProductInfo[]>([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(false);       // Trạng thái đang tải dữ liệu
  const [error, setError] = useState<string | null>(null);     // Lưu thông báo lỗi nếu có

  // 2. HÀM GỌI API LẤY DỮ LIỆU
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi api thông qua apiService đã đăng ký ở Bước 3
      const data = await apiService.getProducts(); 
      setProducts(data); // Lưu dữ liệu vào state để React tự động re-render giao diện
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // 3. USEEFFECT ĐỂ CHẠY HÀM FETCH KHI COMPONENT ĐƯỢC HIỂN THỊ LẦN ĐẦU
  useEffect(() => {
    fetchProducts();
  }, []); // Mảng rỗng [] có nghĩa là chỉ chạy duy nhất 1 lần khi màn hình này được mở lên

  // 4. PHẦN GIAO DIỆN (TSX - Sự kết hợp giữa HTML và Javascript)
  return (
    <div style={{ padding: '20px' }}>
      <h2>Danh sách Sản phẩm</h2>
      
      {/* Nút làm mới dữ liệu */}
      <button 
        className="btn-primary" 
        onClick={fetchProducts} 
        disabled={loading}
        style={{ marginBottom: '15px' }}
      >
        Làm mới
      </button>

      {/* Hiển thị Loading */}
      {loading && <LoadingSpinner message="Đang tải danh sách sản phẩm..." />}

      {/* Hiển thị Lỗi nếu có */}
      {error && (
        <div style={{ color: '#ef4444', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '5px' }}>
          Lỗi: {error}
        </div>
      )}

      {/* Hiển thị danh sách khi đã load xong và không có lỗi */}
      {!loading && !error && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.productId}>
                  <td><strong>{prod.productId}</strong></td>
                  <td>{prod.productName}</td>
                  <td>{prod.price.toLocaleString()} VNĐ</td>
                  <td>
                    <span className={`badge ${prod.activeFlag ? 'badge-success' : 'badge-error'}`}>
                      {prod.activeFlag ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Các khái niệm cốt lõi của React bạn cần ghi nhớ khi chỉnh sửa giao diện

Khi chỉnh sửa bất kỳ file `.tsx` nào, bạn sẽ gặp 3 khái niệm quan trọng này:

1.  **JSX / TSX (Giao diện)**:
    *   Trông giống HTML nhưng thực chất là JavaScript viết dưới dạng thẻ.
    *   **Chú ý**: Dùng `className` thay vì `class` để đặt tên class CSS. Dùng cặp dấu ngoặc nhọn `{}` để lồng code JavaScript (như biến, hàm, logic điều kiện) vào giữa giao diện HTML.
2.  **State (`useState`)**:
    *   Là "bộ nhớ" nội bộ của một màn hình hoặc một component. Khi giá trị của State thay đổi (thông qua hàm set tương ứng như `setProducts`), React sẽ **tự động vẽ lại (re-render)** giao diện hiển thị giá trị mới đó.
3.  **Effect (`useEffect`)**:
    *   Dùng để chạy các hiệu ứng phụ (side effects) như: Gọi API khi vừa mở màn hình, lắng nghe sự thay đổi của một biến nào đó để thực hiện hành động tự động.
4.  **Props**:
    *   Là các tham số truyền từ component cha xuống component con (như truyền thuộc tính vào thẻ HTML). Props giúp tái sử dụng component dễ dàng với các dữ liệu khác nhau.
