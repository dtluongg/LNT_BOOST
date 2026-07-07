import React from 'react';
import { Search, Plus } from 'lucide-react';

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

        <button className="btn-primary" onClick={onAddNew} style={{ height: '32px', padding: '4px 12px', fontSize: '12px' }}>
          <Plus size={14} />
          <span>Add New Vendor</span>
        </button>
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
