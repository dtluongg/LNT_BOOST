import React from 'react';
import { Search, Plus, Printer, ChevronDown } from 'lucide-react';

interface VendorListViewProps {
  vendors: any[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddNew: () => void;
  onSelectRow: (vendor: any) => void;
}

export default function VendorListView({
  vendors,
  searchTerm,
  onSearchChange,
  onAddNew,
  onSelectRow
}: VendorListViewProps) {
  const [showPrintMenu, setShowPrintMenu] = React.useState(false);

  const handlePrintList = () => {
    window.print();
  };

  const handleExportListExcel = () => {
    const headers = ['Vendor ID', 'Vendor Code', 'Vendor Name', 'Phone', 'Country', 'Class', 'Status'];
    const rows = vendors.map(v => [
      v.vendorID,
      v.vendorCode,
      v.vendorName,
      v.phoneNo || '',
      v.country || '',
      v.vendorClass || '',
      v.activeFlag ? 'Active' : 'Inactive'
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vendor_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
      
      {/* Search and Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '320px', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by code or vendor name..." 
            className="erp-input"
            style={{ paddingLeft: '36px', height: '32px' }}
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => setShowPrintMenu(!showPrintMenu)} 
              style={{ height: '32px', padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Printer size={14} />
              <span>Print / Export List</span>
              <ChevronDown size={11} />
            </button>
            
            {showPrintMenu && (
              <div className="print-dropdown-menu" style={{
                position: 'absolute',
                top: '36px',
                right: 0,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-premium)',
                zIndex: 100,
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px 0'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    handlePrintList();
                    setShowPrintMenu(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-main)',
                    display: 'block',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  📄 In danh sách / PDF (A4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportListExcel();
                    setShowPrintMenu(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-main)',
                    display: 'block',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🟢 Xuất file Excel (.csv)
                </button>
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={onAddNew} style={{ height: '32px', padding: '4px 12px', fontSize: '12px' }}>
            <Plus size={14} />
            <span>Add New Vendor</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-wrapper">
        <table className="data-table" style={{ fontSize: '12.5px' }}>
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Vendor Code</th>
              <th>Vendor Name</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No vendors found
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr 
                  key={vendor.vendorID} 
                  onDoubleClick={() => onSelectRow(vendor)}
                  style={{ cursor: 'pointer' }}
                  title="Double click to view details"
                >
                  <td><strong>{vendor.vendorID}</strong></td>
                  <td>{vendor.vendorCode}</td>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.phoneNo || '---'}</td>
                  <td>{vendor.country || '---'}</td>
                  <td>{vendor.vendorClass || '---'}</td>
                  <td>
                    <span className={`badge ${vendor.activeFlag ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '10px' }}>
                      {vendor.activeFlag ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <span style={{ fontSize: '11px', color: 'var(--text-dark)', fontStyle: 'italic' }}>
        * Double-click any row to view and edit details.
      </span>
    </div>
  );
}
