import React from 'react';

interface ShipperDetailTabProps {
  formData: any;
  isView: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  shipperLocations: any[];
}

export default function ShipperDetailTab({
  formData,
  isView,
  isEdit,
  onInputChange,
  shipperLocations = []
}: ShipperDetailTabProps) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* PHẦN 1: SHIPPING INSTRUCTIONS */}
      <div className="erp-card" style={{ maxWidth: '450px', padding: '12px' }}>
        <h4 className="erp-card-title">Shipping Instructions</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600 }}>Shipping Terms</label>
            <select
              name="shippingTerms"
              value={formData.shippingTerms || ''}
              onChange={onInputChange}
              disabled={isView}
              className="erp-select"
            >
              <option value="Free On Board">Free On Board</option>
              <option value="Cost and Freight">Cost and Freight</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600 }}>Delivery Mode</label>
            <select
              name="deliveryMode"
              value={formData.deliveryMode || ''}
              onChange={onInputChange}
              disabled={isView}
              className="erp-select"
            >
              <option value="Sea Shipment">Sea Shipment</option>
              <option value="Air Shipment">Air Shipment</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600 }}>FOB Point</label>
            <select
              name="fobPoint"
              value={formData.fobPoint || ''}
              onChange={onInputChange}
              disabled={isView}
              className="erp-select"
            >
              <option value="Port">Port</option>
              <option value="Factory">Factory</option>
            </select>
          </div>
        </div>
      </div>
      {/* PHẦN 2: SHIPPER LOCATION */}
      <div className="erp-card" style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 className="erp-card-title" style={{ margin: 0, border: 'none' }}>Shipper Location</h4>
          <button
            type="button"
            className="btn-secondary"
            disabled={isView}
            style={{ height: '24px', fontSize: '11px', padding: '0 8px' }}
            onClick={() => {/* Mở Form/Popup nhập location mới */ }}
          >
            Add Shipper Location
          </button>
        </div>
        {/* Bảng hiển thị danh sách địa điểm */}
        <div className="table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: '11.5px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location Name</th>
                <th>Person Title</th>
                <th>Person Name</th>
                <th>Position</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>City</th>
                <th>Province</th>
                <th>Postal Code</th>
                <th>Country</th>
                <th>Phone No</th>
                <th>Fax</th>
                <th>Email</th>
                <th>Term Of Delivery</th>
                <th>Port Of Loading</th>
                <th>Default Location</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {shipperLocations.length === 0 ? (
                <tr>
                  <td colSpan={18} style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                    No locations registered
                  </td>
                </tr>
              ) : (
                shipperLocations.map((loc, idx) => (
                  <tr key={loc.locationID || idx}>
                    <td>{loc.locationID || idx + 1}</td>
                    <td>{loc.locationName}</td>
                    <td>{loc.personTitle}</td>
                    <td>{loc.personName}</td>
                    <td>{loc.position}</td>
                    <td>{loc.addressLine1}</td>
                    <td>{loc.addressLine2}</td>
                    <td>{loc.city}</td>
                    <td>{loc.province}</td>
                    <td>{loc.postalCode}</td>
                    <td>{loc.countryName}</td>
                    <td>{loc.phoneNo}</td>
                    <td>{loc.fax}</td>
                    <td>{loc.email}</td>
                    <td>{loc.termOfDelivery}</td>
                    <td>{loc.portOfLoading}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={loc.defaultLocationFlag} disabled />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={loc.activeFlag} disabled />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
