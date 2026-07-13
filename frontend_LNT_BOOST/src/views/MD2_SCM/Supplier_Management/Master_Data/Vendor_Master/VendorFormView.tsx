import React from 'react';
import {
  Plus,
  Edit3,
  Save,
  ArrowLeft,
  Layers,
  UserCheck,
  Globe,
  MapPin,
  CreditCard,
  Printer,
  ChevronDown
} from 'lucide-react';

interface VendorFormViewProps {
  formData: any;
  formMode: 'view' | 'create' | 'edit';
  activeTab: 'general' | 'shipper' | 'payment' | 'purchase';
  onTabChange: (tab: 'general' | 'shipper' | 'payment' | 'purchase') => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
  onAddNew: () => void;
  onEdit: () => void;
  onSave: () => void;
  vendorGroups: any[];
  countries: any[];
  currencies: any[];
  paymentTypes: any[];
  shipperLocations: any[];
}

export default function VendorFormView({
  formData,
  formMode,
  activeTab,
  onTabChange,
  onInputChange,
  onCancel,
  onAddNew,
  onEdit,
  onSave,
  vendorGroups = [],
  countries = [],
  currencies = [],
  paymentTypes = [],
  shipperLocations = []
}: VendorFormViewProps) {
  const isView = formMode === 'view';
  const [showPrintMenu, setShowPrintMenu] = React.useState(false);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Vendor ID', formData.vendorID],
      ['Vendor Code', formData.vendorCode],
      ['Vendor Name', formData.vendorName],
      ['Status', formData.activeFlag ? 'Active' : 'Inactive'],
      ['Company Name', formData.companyName || ''],
      ['Phone No', formData.phoneNo || ''],
      ['Fax', formData.fax || ''],
      ['Website', formData.web || ''],
      ['Address Line 1', formData.addressLine1 || ''],
      ['Address Line 2', formData.addressLine2 || ''],
      ['City', formData.city || ''],
      ['Province', formData.province || ''],
      ['Postal Code', formData.postalCode || ''],
      ['Country', formData.country || ''],
      ['Contact Person Name', formData.contactPersonName || ''],
      ['Contact Email', formData.contactEmail || ''],
      ['Contact Phone', formData.contactPhone1 || ''],
      ['Vendor Class', formData.vendorClass || ''],
      ['Currency', formData.currency || ''],
      ['Payment Term', formData.paymentTerm || '']
    ];
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vendor_${formData.vendorCode || formData.vendorID}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <form className="erp-form-container fade-in" onSubmit={(e) => {
      e.preventDefault();
      onSave();
    }}>

      {/* TOOLBAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 14px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            title="Return to vendors list"
            style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', fontSize: '12px' }}
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onAddNew}
            disabled={formMode === 'create'}
            style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', fontSize: '12px', opacity: formMode === 'create' ? 0.6 : 1 }}
          >
            <Plus size={13} />
            <span>Add New</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onEdit}
            disabled={formMode !== 'view'}
            style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', fontSize: '12px', opacity: formMode !== 'view' ? 0.6 : 1 }}
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>

          <button
            type="submit"
            className="btn-success"
            // onClick={onSave}
            disabled={isView}
            style={{
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px',
              fontSize: '12px',
              backgroundColor: isView ? '#ccc' : 'var(--success-color)',
              borderColor: isView ? '#ccc' : 'var(--success-color)',
              color: '#fff',
              cursor: isView ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={13} />
            <span>Save</span>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowPrintMenu(!showPrintMenu)}
              style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', fontSize: '12px' }}
            >
              <Printer size={13} />
              <span>Print / Export</span>
              <ChevronDown size={10} />
            </button>
            {showPrintMenu && (
              <div className="print-dropdown-menu" style={{
                position: 'absolute',
                top: '32px',
                left: 0,
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
                    handlePrintPDF();
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
                  📄 In ra PDF / Print (A4)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportExcel();
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
        </div>

        <div style={{ fontSize: '12px', fontWeight: '600' }}>
          Action: &nbsp;
          <span className={`badge ${formMode === 'create' ? 'badge-info' :
            formMode === 'edit' ? 'badge-warning' : 'badge-success'
            }`} style={{ fontSize: '10px' }}>
            {formMode === 'create' ? 'CREATE' : formMode === 'edit' ? 'EDIT' : 'VIEW'}
          </span>
        </div>
      </div>

      {/* HEADER FIELDS */}
      <div className="erp-card" style={{ padding: '12px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px'
        }}>

          <div className="erp-form-group">
            <label>Vendor ID</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                name="vendorID"
                value={formData.vendorID}
                className="erp-input"
                disabled={true}
                style={{ backgroundColor: '#f1f5f9', flex: 1 }}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0 6px', height: '28px', fontSize: '12px' }}
                title="Lookup Vendor"
                onClick={() => alert('Vendor Lookup')}
              >
                ...
              </button>
            </div>
          </div>

          <div className="erp-form-group checkbox-container" style={{ paddingTop: '16px' }}>
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="activeFlag"
                checked={formData.activeFlag}
                onChange={onInputChange}
                disabled={isView}
              />
              <span>Active Flag</span>
            </label>
          </div>

          <div className="erp-form-group">
            <label>Vendor Code</label>
            <input
              required
              type="text"
              name="vendorCode"
              value={formData.vendorCode}
              onChange={onInputChange}
              className="erp-input"
              disabled={isView}
              placeholder="Vendor Code..."
            />
          </div>

          <div className="erp-form-group">
            <label>Vendor Name</label>
            <input
              required
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={onInputChange}
              className="erp-input"
              disabled={isView}
              placeholder="Vendor Name..."
            />
          </div>

          <div className="erp-form-group">
            <label>Vendor Group</label>
            <select
              required
              name="vendorGroupID"
              value={formData.vendorGroupID}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView}
            >
              <option value="">-- Select Group --</option>
              {vendorGroups.map(g => (
                <option key={g.vendorGroupCode} value={g.vendorGroupCode}>
                  {g.vendorGroupName}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* TABS CONTROL */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', height: '34px', alignItems: 'flex-end' }}>
        <button
          type="button"
          className={`workspace-tab-item ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => onTabChange('general')}
          style={{ borderTopLeftRadius: '6px', borderTopRightRadius: '6px', height: activeTab === 'general' ? '34px' : '32px', fontSize: '12px', padding: '4px 12px' }}
        >
          <Layers size={12} style={{ marginRight: '4px' }} />
          General Infor
        </button>
        <button
          type="button"
          className={`workspace-tab-item ${activeTab === 'shipper' ? 'active' : ''}`}
          onClick={() => onTabChange('shipper')}
          style={{ height: activeTab === 'shipper' ? '34px' : '32px', fontSize: '12px', padding: '4px 12px' }}
        >
          <UserCheck size={12} style={{ marginRight: '4px' }} />
          Shipper Detail
        </button>
        <button
          type="button"
          className={`workspace-tab-item ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => onTabChange('payment')}
          style={{ height: activeTab === 'payment' ? '34px' : '32px', fontSize: '12px', padding: '4px 12px' }}
        >
          <CreditCard size={12} style={{ marginRight: '4px' }} />
          Payment Setting
        </button>
        <button
          type="button"
          className={`workspace-tab-item ${activeTab === 'purchase' ? 'active' : ''}`}
          onClick={() => onTabChange('purchase')}
          style={{ height: activeTab === 'purchase' ? '34px' : '32px', fontSize: '12px', padding: '4px 12px' }}
        >
          <Globe size={12} style={{ marginRight: '4px' }} />
          Purchase Detail
        </button>
      </div>

      {/* ACTIVE TAB CONTAINER */}
      <div className="erp-card" style={{ minHeight: '280px' }}>

        {/* TAB: GENERAL */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="fade-in">

            {/* Left Card: Main Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 className="erp-card-title">
                <MapPin size={13} />
                Main Address
              </h4>

              <div className="erp-form-group row-align">
                <label>Company Name</label>
                <input
                  required
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>


              <div className="erp-form-group row-align">
                <label>Phone No</label>
                <input
                  required
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>
              <div className="erp-form-group row-align">
                <label>Fax</label>
                <input
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>

              <div className="erp-form-group row-align">
                <label>Web</label>
                <input
                  type="text"
                  name="web"
                  value={formData.web}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                  placeholder="https://example.com"
                />
              </div>

              <div className="erp-form-group row-align">
                <label>Address Line 1</label>
                <input
                  required
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>

              <div className="erp-form-group row-align">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>


              <div className="erp-form-group row-align">
                <label>City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>
              <div className="erp-form-group row-align">
                <label>Province</label>
                <input
                  required
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>
              <div className="erp-form-group row-align">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView}
                />
              </div>


              <div className="erp-form-group row-align">
                <label>Country</label>
                <select
                  required
                  name="country"
                  value={formData.country}
                  onChange={onInputChange}
                  className="erp-select"
                  disabled={isView}
                >
                  <option value="">-- Select Country --</option>
                  {countries.map(c => (
                    <option key={c.countryID} value={c.countryID}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Card: Main Contract & Financials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="erp-card-title">
                  Main Contract
                </h4>

                <div className="erp-form-group row-align">
                  <label>Person Name</label>
                  <div className="grid-contract-name">
                    <select
                      name="contactSalutation"
                      value={formData.contactSalutation}
                      onChange={onInputChange}
                      className="erp-select"
                      disabled={isView}
                    >
                      <option value="Ms">Ms</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                    </select>
                    <input
                      type="text"
                      name="contactPersonName"
                      placeholder="Full Name"
                      value={formData.contactPersonName}
                      onChange={onInputChange}
                      className="erp-input"
                      disabled={isView}
                    />
                    <input
                      type="text"
                      name="contactInitials"
                      placeholder="Initials"
                      value={formData.contactInitials}
                      onChange={onInputChange}
                      className="erp-input"
                      disabled={isView}
                    />
                  </div>
                </div>


                <div className="erp-form-group row-align">
                  <label>Phone No - 1</label>
                  <input
                    type="text"
                    name="contactPhone1"
                    value={formData.contactPhone1}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>Phone No - 2</label>
                  <input
                    type="text"
                    name="contactPhone2"
                    value={formData.contactPhone2}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>


                <div className="erp-form-group row-align">
                  <label>Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="erp-card-title">
                  Financial Settings
                </h4>
                <div className="erp-form-group row-align">
                  <label>Vendor Class</label>
                  <input
                    type="text"
                    name="vendorClass"
                    value={formData.vendorClass}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                    placeholder="Search or double click..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="erp-card-title">
                  Vendor Certificates
                </h4>
                <div className="erp-form-group row-align">
                  <input
                    type="text"
                    name="vendorCertificates"
                    value={formData.vendorCertificates}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                    placeholder="Quality certificates e.g., ISO 9001..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SHIPPER */}
        {activeTab === 'shipper' && (
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
        )}

        {/* TAB: PAYMENT */}
        {activeTab === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="fade-in">

            {/* Left Column: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="erp-card-title">
                  Payment Detail
                </h4>
                <div className="erp-form-group row-align">
                  <label>Currency</label>
                  <select
                    required
                    name="currency"
                    value={formData.currency}
                    onChange={onInputChange}
                    className="erp-select"
                    disabled={isView}
                  >
                    <option value="">-- Select Currency --</option>
                    {currencies.map(curr => (
                      <option key={curr.currencyCode} value={curr.currencyCode}>
                        {curr.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-form-group row-align">
                  <label>Payment Term</label>
                  <select
                    required
                    name="paymentTerm"
                    value={formData.paymentTerm}
                    onChange={onInputChange}
                    className="erp-select"
                    disabled={isView}
                  >
                    <option value="">-- Select Payment Term --</option>
                    {paymentTypes.map(p => (
                      <option key={p.paymentTypeCode} value={p.paymentTypeCode}>
                        {p.paymentTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-form-group row-align">
                  <label>Payment Reference</label>
                  <input
                    type="text"
                    name="paymentReference"
                    value={formData.paymentReference}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>

                <h4 className="erp-card-title">
                  Bank Account Detail
                </h4>
                <div className="erp-form-group row-align">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>Bank Branch</label>
                  <input
                    type="text"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>Bank Country</label>
                  <select
                    required
                    name="country"
                    value={formData.country}
                    onChange={onInputChange}
                    className="erp-select"
                    disabled={isView}
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map(c => (
                      <option key={c.countryID} value={c.countryID}>
                        {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-form-group row-align">
                  <label>Bank Currency</label>
                  <select
                    required
                    name="currency"
                    value={formData.currency}
                    onChange={onInputChange}
                    className="erp-select"
                    disabled={isView}
                  >
                    <option value="">-- Select Currency --</option>
                    {currencies.map(curr => (
                      <option key={curr.currencyCode} value={curr.currencyCode}>
                        {curr.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="erp-form-group row-align">
                  <label>Account Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>Account No</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>SWIFT Code</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>
                <div className="erp-form-group row-align">
                  <label>Instructions</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                  />
                </div>

              </div>
            </div>

            {/* Right Column: Remittance Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 className="erp-card-title">
                Remittance Contact
              </h4>
              {/* <div className="erp-form-group row-align checkbox-container" style={{ paddingBottom: '4px' }}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isSameAsMainContact"
                    checked={formData.isSameAsMainContact}
                    onChange={onInputChange}
                    disabled={isView}
                  />
                  <span>Same as Main Contact of General Info. Tab</span>
                </label>
              </div> */}
              <div className="erp-form-group">
                <label>Person Name</label>
                <div className="grid-contract-name">
                  <select
                    name="remitSalutation"
                    value={formData.remitSalutation}
                    onChange={onInputChange}
                    className="erp-select"
                    disabled={isView || formData.isSameAsMainContact}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input
                    type="text"
                    name="remitPersonName"
                    value={formData.remitPersonName}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView || formData.isSameAsMainContact}
                  />
                  <input
                    type="text"
                    name="remitPosition"
                    value={formData.remitPosition}
                    onChange={onInputChange}
                    className="erp-input"
                    disabled={isView}
                    placeholder="Position"
                  />
                </div>
              </div>
              <div className="erp-form-group">
                <label>Phone No - 1</label>
                <input
                  type="text"
                  name="remitPhone1"
                  value={formData.remitPhone1}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView || formData.isSameAsMainContact}
                />
              </div>
              <div className="erp-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="remitEmail"
                  value={formData.remitEmail}
                  onChange={onInputChange}
                  className="erp-input"
                  disabled={isView || formData.isSameAsMainContact}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: PURCHASE */}
        {activeTab === 'purchase' && (
          <div className="fade-in">
            <h4 className="erp-card-title">Purchase Operations Detail</h4>
            <div className="erp-form-group">
              <label>Specify custom purchase workflow agreements for this vendor:</label>
              <textarea
                name="purchaseDetailNotes"
                value={formData.purchaseDetailNotes}
                onChange={onInputChange}
                disabled={isView}
                className="erp-textarea"
                placeholder="Enter framework agreement clauses, max liability limits, custom pricing rules..."
              />
            </div>
          </div>
        )}

      </div>

    </form>
  );
}
