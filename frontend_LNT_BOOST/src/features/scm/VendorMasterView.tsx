export default function VendorMasterView() {
  return (
    <div className="table-wrapper fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã Nhà Cung Cấp</th>
            <th>Tên Đơn Vị</th>
            <th>Điện thoại</th>
            <th>Lĩnh Vực Cung Cấp</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>SUP-001</strong></td>
            <td>Công ty Cổ phần Thép Việt</td>
            <td>0243.888.999</td>
            <td>Sắt thép, vật liệu xây dựng</td>
            <td><span className="badge badge-success">Active</span></td>
          </tr>
          <tr>
            <td><strong>SUP-002</strong></td>
            <td>Tổng kho Kim khí Miền Bắc</td>
            <td>0243.555.222</td>
            <td>Ống thép, phụ kiện cơ khí</td>
            <td><span className="badge badge-success">Active</span></td>
          </tr>
          <tr>
            <td><strong>SUP-003</strong></td>
            <td>Công nghiệp nặng An Dương</td>
            <td>0283.444.666</td>
            <td>Gia công kết cấu thép</td>
            <td><span className="badge badge-success">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
