# Hướng Dẫn Từng Bước: Triển Khai Tab Shipper Detail Từ Backend Đến Frontend

Tài liệu này hướng dẫn bạn tích hợp dữ liệu SQL vào tab **Shipper Detail** (bao gồm việc load dropdown động từ database và quản lý danh sách các địa điểm giao hàng của nhà cung cấp).

---

## 1. Bản Đồ Dữ Liệu (Database Mapping)

### Các Bảng Master (Danh mục lookup):
- **`tblDeliveryModeMaster`**: Danh mục hình thức vận chuyển (`AIR` - Air, `GRD` - Ground, `SEA` - Sea).
- **`tblDeliveryTermMaster`**: Danh mục điều khoản giao hàng chung (`EXW`, `FOB`, `CIF`, `DDP`, v.v.).
- **`tblShippingFOBPoints`**: Danh mục địa điểm chuyển giao quyền sở hữu (`DES` - Destination, `PRT` - Port, `SPT` - Shipping Point).
- **`tblShippingTermMaster`**: Danh mục điều khoản vận chuyển.

### Bảng Dữ Liệu Chi Tiết:
- **`tblVendorShippingLocation`**: Danh sách địa điểm giao hàng của từng nhà cung cấp. Bảng này liên kết với nhà cung cấp qua `VendorID` và khóa chính phức hợp gồm `(VendorID, LocationID)`.

---

## 2. Bước 1: Backend - Cập Nhật File Truy Vấn `Vendor.json`

File `SqlGatewayController.cs` tự động đọc các câu lệnh SQL từ các file JSON trong thư mục `SqlQueries`. Chúng ta cần sửa file [Vendor.json](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/Backend_LNT_BOOST/SqlQueries/MD2/Supplier_Management/Master_Data/Vendor_Master/Vendor.json) để:
1. **Lấy danh mục** cho các dropdown.
2. **Hoàn thiện các hàm CRUD** cho địa điểm giao hàng (sửa lại tên bảng chính xác thành `tblVendorShippingLocation`).

Dưới đây là nội dung chi tiết cần cập nhật vào **[Vendor.json](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/Backend_LNT_BOOST/SqlQueries/MD2/Supplier_Management/Master_Data/Vendor_Master/Vendor.json)**:

```json
{
  // ... các query cũ (GetVendors, GetVendorGroups, v.v.) giữ nguyên

  // 1. Các query danh mục (lookup) cho tab Shipper Detail
  "GetDeliveryModes": "SELECT DeliveryModeCode AS code, [Description] AS description FROM tblDeliveryModeMaster WHERE ActiveFlag = 1",
  "GetDeliveryTerms": "SELECT DeliveryTermCode AS code, [Description] AS description FROM tblDeliveryTermMaster WHERE Activeflag = 1",
  "GetShippingFOBPoints": "SELECT FOBPointCode AS code, [Description] AS description FROM tblShippingFOBPoints WHERE Activeflag = 1",
  "GetShippingTerms": "SELECT ShippingTermCode AS code, [Description] AS description FROM tblShippingTermMaster WHERE Activeflag = 1",

  // 2. Các query quản lý địa điểm giao hàng (sử dụng tên bảng tblVendorShippingLocation)
  "GetShipperLocations": "SELECT l.*, c.CountryName, dt.Description AS TermOfDeliveryDesc FROM tblVendorShippingLocation l LEFT JOIN tblCountryMaster c ON l.CountryID = c.CountryID LEFT JOIN tblDeliveryTermMaster dt ON l.TermOfDelivery = dt.DeliveryTermCode WHERE l.VendorID = @VendorID",
  "CreateShipperLocation": "INSERT INTO tblVendorShippingLocation (VendorID, LocationID, LocationName, AddressLine1, AddressLine2, City, Province, Postalcode, CountryID, PhoneNo, Fax, Email, ContractPersonTitle, ContractPersonName, ContractPersonPosition, TermOfDelivery, PortOfLoading, DefaultLocationflag, Activeflag) VALUES (@VendorID, (SELECT ISNULL(MAX(LocationID), 0) + 1 FROM tblVendorShippingLocation WHERE VendorID = @VendorID), @LocationName, @AddressLine1, @AddressLine2, @City, @Province, @Postalcode, @CountryID, @PhoneNo, @Fax, @Email, @ContractPersonTitle, @ContractPersonName, @ContractPersonPosition, @TermOfDelivery, @PortOfLoading, @DefaultLocationflag, @Activeflag); SELECT 1 AS Success;",
  "UpdateShipperLocation": "UPDATE tblVendorShippingLocation SET LocationName = @LocationName, AddressLine1 = @AddressLine1, AddressLine2 = @AddressLine2, City = @City, Province = @Province, Postalcode = @Postalcode, CountryID = @CountryID, PhoneNo = @PhoneNo, Fax = @Fax, Email = @Email, ContractPersonTitle = @ContractPersonTitle, ContractPersonName = @ContractPersonName, ContractPersonPosition = @ContractPersonPosition, TermOfDelivery = @TermOfDelivery, PortOfLoading = @PortOfLoading, DefaultLocationflag = @DefaultLocationflag, Activeflag = @Activeflag WHERE VendorID = @VendorID AND LocationID = @LocationID; SELECT 1 AS Success;",
  "DeleteShipperLocation": "DELETE FROM tblVendorShippingLocation WHERE VendorID = @VendorID AND LocationID = @LocationID; SELECT 1 AS Success;"
}
```

> [!NOTE]
> Trong lệnh `CreateShipperLocation`, hệ thống tự động sinh `LocationID` tăng dần bắt đầu từ 1 dựa trên `VendorID` hiện tại thông qua câu lệnh:
> `(SELECT ISNULL(MAX(LocationID), 0) + 1 FROM tblVendorShippingLocation WHERE VendorID = @VendorID)`

---

## 3. Bước 2: Frontend - Khai Báo API Trong `vendorApi.ts`

Chúng ta mở file **[vendorApi.ts](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/vendorApi.ts)** để cập nhật:

1. **Thêm API load các dropdown:**
```typescript
  getDeliveryModes: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetDeliveryModes' })
    });
    return mapKeysToCamelCase(raw);
  },

  getDeliveryTerms: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetDeliveryTerms' })
    });
    return mapKeysToCamelCase(raw);
  },

  getShippingFOBPoints: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetShippingFOBPoints' })
    });
    return mapKeysToCamelCase(raw);
  },

  getShippingTerms: async (): Promise<any[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetShippingTerms' })
    });
    return mapKeysToCamelCase(raw);
  },
```

2. **Thêm logic CRUD Location:**
Cập nhật hàm `saveShipperLocation` hoặc thêm hàm xóa:
```typescript
  saveShipperLocation: async (location: any): Promise<any> => {
    const isEdit = !!location.locationID;
    return apiFetch<any>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: isEdit ? 'UpdateShipperLocation' : 'CreateShipperLocation',
        parameters: {
          VendorID: location.vendorID,
          LocationID: location.locationID || 0,
          LocationName: location.locationName,
          AddressLine1: location.addressLine1,
          AddressLine2: location.addressLine2,
          City: location.city,
          Province: location.province,
          Postalcode: location.postalcode,
          CountryID: location.countryID,
          PhoneNo: location.phoneNo,
          Fax: location.fax,
          Email: location.email,
          ContractPersonTitle: location.contractPersonTitle,
          ContractPersonName: location.contractPersonName,
          ContractPersonPosition: location.contractPersonPosition,
          TermOfDelivery: location.termOfDelivery,
          PortOfLoading: location.portOfLoading,
          DefaultLocationflag: location.defaultLocationflag ? 1 : 0,
          Activeflag: location.activeflag ? 1 : 0
        }
      })
    });
  },

  deleteShipperLocation: async (vendorID: string, locationID: number): Promise<any> => {
    return apiFetch<any>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: 'DeleteShipperLocation',
        parameters: {
          VendorID: vendorID,
          LocationID: locationID
        }
      })
    });
  }
```

---

## 4. Bước 3: Frontend - Load Dữ Liệu Trong `VendorMasterView.tsx`

Chúng ta mở **[VendorMasterView.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/VendorMasterView.tsx)** để thêm các state và gọi API load dữ liệu catalog khi component được khởi tạo.

1. **Thêm state lưu trữ danh mục:**
```typescript
  const [deliveryModes, setDeliveryModes] = useState<any[]>([]);
  const [deliveryTerms, setDeliveryTerms] = useState<any[]>([]);
  const [shippingFOBPoints, setShippingFOBPoints] = useState<any[]>([]);
  const [shippingTerms, setShippingTerms] = useState<any[]>([]);
```

2. **Cập nhật hàm `loadLookupData`:**
```typescript
  const loadLookupData = async () => {
    try {
      const [groups, ctries, currs, terms, dModes, dTerms, fobPts, sTerms] = await Promise.all([
        vendorApi.getVendorGroups(),
        vendorApi.getCountries(),
        vendorApi.getCurrencies(),
        vendorApi.getPaymentTypes(),
        vendorApi.getDeliveryModes(),
        vendorApi.getDeliveryTerms(),
        vendorApi.getShippingFOBPoints(),
        vendorApi.getShippingTerms()
      ]);
      setVendorGroups(groups);
      setCountries(ctries);
      setCurrencies(currs);
      setPaymentTypes(terms);
      setDeliveryModes(dModes);
      setDeliveryTerms(dTerms);
      setShippingFOBPoints(fobPts);
      setShippingTerms(sTerms);
    } catch (err: any) {
      console.error('Failed to load lookup catalogs:', err.message);
    }
  };
```

3. **Cung cấp callback thêm/sửa/xóa Location xuống Form:**
Khai báo các hàm xử lý lưu/xóa trong `VendorMasterView.tsx`:
```typescript
  const handleReloadLocations = async (vendorID: string) => {
    try {
      const locations = await vendorApi.getShipperLocations(vendorID);
      setShipperLocations(locations);
    } catch (err) {
      console.error("Failed to load shipper locations", err);
    }
  };

  const handleSaveLocation = async (location: any) => {
    try {
      await vendorApi.saveShipperLocation({ ...location, vendorID: formData.vendorID });
      await handleReloadLocations(formData.vendorID);
      alert('Location saved successfully!');
    } catch (err: any) {
      alert('Failed to save location: ' + err.message);
    }
  };

  const handleDeleteLocation = async (locationID: number) => {
    if (!window.confirm('Are you sure you want to delete this shipping location?')) return;
    try {
      await vendorApi.deleteShipperLocation(formData.vendorID, locationID);
      await handleReloadLocations(formData.vendorID);
      alert('Location deleted successfully!');
    } catch (err: any) {
      alert('Failed to delete location: ' + err.message);
    }
  };
```

---

## 5. Bước 4: Frontend - Tích Hợp Dropdown Động Vào `ShipperDetailTab.tsx`

Chúng ta cập nhật lại component **[ShipperDetailTab.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/tabs/ShipperDetailTab.tsx)** để truyền các danh mục động đã load được từ API và hiển thị form Popup/Modal khi nhấn nút **Add Shipper Location** hoặc khi chỉnh sửa.

### Truyền thêm các Props vào `ShipperDetailTabProps`:
```typescript
interface ShipperDetailTabProps {
  formData: any;
  isView: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  shipperLocations: any[];
  // Bổ sung các danh mục lookup:
  deliveryModes: any[];
  shippingFOBPoints: any[];
  shippingTerms: any[];
  deliveryTerms: any[];
  countries: any[];
  // Bổ sung hàm thao tác dữ liệu:
  onSaveLocation: (loc: any) => Promise<void>;
  onDeleteLocation: (locationID: number) => Promise<void>;
}
```

### Sử dụng dropdown động cho "Shipping Instructions":
```tsx
  {/* Shipping Terms */}
  <select
    name="shippingTerms"
    value={formData.shippingTerms || ''}
    onChange={onInputChange}
    disabled={isView}
    className="erp-select"
  >
    <option value="">-- Select Shipping Terms --</option>
    {shippingTerms.map(t => (
      <option key={t.code} value={t.code}>{t.description}</option>
    ))}
  </select>

  {/* Delivery Mode */}
  <select
    name="deliveryMode"
    value={formData.deliveryMode || ''}
    onChange={onInputChange}
    disabled={isView}
    className="erp-select"
  >
    <option value="">-- Select Delivery Mode --</option>
    {deliveryModes.map(m => (
      <option key={m.code} value={m.code}>{m.description}</option>
    ))}
  </select>

  {/* FOB Point */}
  <select
    name="fobPoint"
    value={formData.fobPoint || ''}
    onChange={onInputChange}
    disabled={isView}
    className="erp-select"
  >
    <option value="">-- Select FOB Point --</option>
    {shippingFOBPoints.map(f => (
      <option key={f.code} value={f.code}>{f.description}</option>
    ))}
  </select>
```

---

## 6. Bước 5: Viết Component Modal Nhập Địa Điểm Mới

Trong **[ShipperDetailTab.tsx](file:///d:/LNT_Learn/VisualStudio/LNT_BOOST/frontend_LNT_BOOST/src/views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/tabs/ShipperDetailTab.tsx)**, ta thiết kế một State `showModal` và `selectedLocation` để hiển thị hộp thoại pop-up nhập liệu địa chỉ mới (như Location Name, Address, City, Term of Delivery, Default Location flag, Active flag).

Hộp thoại modal có thể viết trực tiếp trong file hoặc tạo một component phụ bên trong `tabs/`. Khi người dùng click nút **Save**, ta gọi prop `onSaveLocation(locationData)` để lưu dữ liệu xuống database qua SQL Gateway.
