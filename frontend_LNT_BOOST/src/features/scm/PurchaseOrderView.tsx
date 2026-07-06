import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

interface MockPO {
  poNumber: string;
  orderDate: string;
  supplierName: string;
  amount: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Settled';
}

export default function PurchaseOrderView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPOCreateForm, setShowPOCreateForm] = useState(false);
  const [newPOSupplier, setNewPOSupplier] = useState('');
  const [newPOAmount, setNewPOAmount] = useState('');

  const [mockPOs, setMockPOs] = useState<MockPO[]>([
    { poNumber: 'PO-2026-001', orderDate: '2026-06-20', supplierName: 'Công ty Cổ phần Thép Việt', amount: 154000000, status: 'Approved' },
    { poNumber: 'PO-2026-002', orderDate: '2026-06-22', supplierName: 'Tổng kho Kim khí Miền Bắc', amount: 89000000, status: 'Pending Approval' },
    { poNumber: 'PO-2026-003', orderDate: '2026-06-24', supplierName: 'Công nghiệp nặng An Dương', amount: 320000000, status: 'Draft' }
  ]);

  const handleCreateMockPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPOSupplier || !newPOAmount) return;
    
    const amountNum = parseFloat(newPOAmount);
    const newPO: MockPO = {
      poNumber: `PO-2026-00${mockPOs.length + 1}`,
      orderDate: new Date().toISOString().split('T')[0],
      supplierName: newPOSupplier,
      amount: amountNum,
      status: 'Draft'
    };

    setMockPOs([newPO, ...mockPOs]);
    setNewPOSupplier('');
    setNewPOAmount('');
    setShowPOCreateForm(false);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-dark)' }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn mua hàng..." 
            className="input-field"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={() => setShowPOCreateForm(true)}>
          <Plus size={16} />
          <span>Tạo Đơn Hàng Mới (PO)</span>
        </button>
      </div>

      {/* Modal tạo PO mới giả lập */}
      {showPOCreateForm && (
        <div className="data-card fade-in" style={{ borderColor: 'var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Tạo Đơn Mua Hàng Mới (Purchase Order)</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPOCreateForm(false)}>
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleCreateMockPO}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nhà cung cấp / Supplier</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ví dụ: Công ty Cổ phần Thép Việt"
                  value={newPOSupplier}
                  onChange={e => setNewPOSupplier(e.target.value)}
                  required 
                  style={{ paddingLeft: '12px' }}
                />
              </div>
              <div className="form-group">
                <label>Giá trị đơn hàng (VNĐ)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Ví dụ: 120000000"
                  value={newPOAmount}
                  onChange={e => setNewPOAmount(e.target.value)}
                  required 
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowPOCreateForm(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Xác nhận tạo đơn</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Số PO</th>
              <th>Ngày Đặt</th>
              <th>Nhà Cung Cấp</th>
              <th>Giá Trị Đơn Hàng (VNĐ)</th>
              <th>Trạng Thái Phê Duyệt</th>
            </tr>
          </thead>
          <tbody>
            {mockPOs
              .filter(po => !searchTerm || po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((po, idx) => (
                <tr key={idx}>
                  <td><strong>{po.poNumber}</strong></td>
                  <td>{po.orderDate}</td>
                  <td>{po.supplierName}</td>
                  <td>{po.amount.toLocaleString('vi-VN')} VNĐ</td>
                  <td>
                    <span className={`badge ${
                      po.status === 'Approved' ? 'badge-success' : 
                      po.status === 'Pending Approval' ? 'badge-info' : 
                      po.status === 'Draft' ? 'badge-error' : 'badge-success'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
