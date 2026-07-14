import React from 'react';
import {
  Plus,
  Edit3,
  Save,
  ArrowLeft,
  Layers,
  UserCheck,
  Globe,
  CreditCard,
  Printer,
  ChevronDown
} from 'lucide-react';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ShipperDetailTab from './tabs/ShipperDetailTab';
import PaymentSettingTab from './tabs/PaymentSettingTab';
import PurchaseDetailTab from './tabs/PurchaseDetailTab';

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
  const isEdit = formMode === 'edit';
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

  // 1. Tạo danh sách các trường bắt buộc cần kiểm tra
  const requiredFields = [
    { key: 'vendorCode', label: 'Vendor Code', tab: 'general' },
    { key: 'vendorName', label: 'Vendor Name', tab: 'general' },
    { key: 'vendorGroupID', label: 'Vendor Group', tab: 'general' },
    { key: 'companyName', label: 'Company Name', tab: 'general' },
    { key: 'phoneNo', label: 'Phone No', tab: 'general' },
    { key: 'city', label: 'City', tab: 'general' },
    { key: 'province', label: 'Province', tab: 'general' },
    { key: 'country', label: 'Country', tab: 'general' },
    { key: 'currency', label: 'Currency', tab: 'payment' },
    { key: 'paymentTerm', label: 'Payment Term', tab: 'payment' },
  ] as const;

  const handleFormSubmit = () => {
    // 2. Lọc ra các trường đang bị trống
    const missingFields = requiredFields.filter(field => !formData[field.key] || formData[field.key].toString().trim() === '');

    if (missingFields.length > 0) {
      // Gom tất cả tên các trường bị thiếu lại thành một thông báo
      const errorMessages = missingFields.map(f => `- ${f.label}`).join('\n');
      alert(`Vui lòng nhập đầy đủ các trường bắt buộc sau đây:\n\n${errorMessages}`);

      // Tự động chuyển người dùng về Tab của trường lỗi đầu tiên để họ sửa luôn
      const firstErrorField = missingFields[0];
      if (activeTab !== firstErrorField.tab) {
        onTabChange(firstErrorField.tab);
      }
      return; // Dừng lại không cho Save
    }

    // Nếu không có lỗi gì, tiến hành gọi hàm onSave từ props
    onSave();
  }

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
            type="button"
            className="btn-success"
            onClick={handleFormSubmit}
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
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="activeFlag"
                  checked={formData.activeFlag}
                  onChange={onInputChange}
                  disabled={isView}
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          {/* <div className="erp-form-group checkbox-container" style={{ paddingTop: '16px' }}>
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
          </div> */}

          <div className="erp-form-group">
            <label className="required-label">Vendor Code</label>
            <input
              required
              type="text"
              name="vendorCode"
              value={formData.vendorCode}
              onChange={onInputChange}
              className="erp-input"
              disabled={isView || isEdit}
              placeholder="Vendor Code..."
            />
          </div>

          <div className="erp-form-group">
            <label className="required-label">Vendor Name</label>
            <input
              required
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={onInputChange}
              className="erp-input"
              disabled={isView || isEdit}
              placeholder="Vendor Name..."
            />
          </div>

          <div className="erp-form-group">
            <label className="required-label">Vendor Group</label>
            <select
              required
              name="vendorGroupID"
              value={formData.vendorGroupID}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || isEdit}
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
          <GeneralInfoTab
            formData={formData}
            isView={isView}
            isEdit={isEdit}
            onInputChange={onInputChange}
            countries={countries}
          />
        )}

        {/* TAB: SHIPPER */}
        {activeTab === 'shipper' && (
          <ShipperDetailTab
            formData={formData}
            isView={isView}
            isEdit={isEdit}
            onInputChange={onInputChange}
            shipperLocations={shipperLocations}
          />
        )}

        {/* TAB: PAYMENT */}
        {activeTab === 'payment' && (
          <PaymentSettingTab
            formData={formData}
            isView={isView}
            isEdit={isEdit}
            onInputChange={onInputChange}
            currencies={currencies}
            paymentTypes={paymentTypes}
            countries={countries}
          />
        )}

        {/* TAB: PURCHASE */}
        {activeTab === 'purchase' && (
          <PurchaseDetailTab
            formData={formData}
            isView={isView}
            isEdit={isEdit}
            onInputChange={onInputChange}
          />
        )}


      </div>

    </form>
  );
}
