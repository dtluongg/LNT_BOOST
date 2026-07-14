import React from 'react';

interface PaymentSettingTabProps {
  formData: any;
  isView: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  currencies: any[];
  paymentTypes: any[];
  countries: any[];
}

export default function PaymentSettingTab({
  formData,
  isView,
  isEdit,
  onInputChange,
  currencies = [],
  paymentTypes = [],
  countries = []
}: PaymentSettingTabProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="fade-in">

      {/* Left Column: Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 className="erp-card-title">
            Payment Detail
          </h4>
          <div className="erp-form-group row-align">
            <label className="required-label">Currency</label>
            <select
              required
              name="currency"
              value={formData.currency}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || isEdit}
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
            <label className="required-label">Payment Term</label>
            <select
              required
              name="paymentTerm"
              value={formData.paymentTerm}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || isEdit}
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
            <label className="required-label">Bank Country</label>
            <select
              required
              name="country"
              value={formData.country}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || isEdit}
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
            <label className="required-label">Bank Currency</label>
            <select
              required
              name="currency"
              value={formData.currency}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || isEdit}
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
        <div className="erp-form-group row-align">
          <label>Person Name</label>
          <div className="grid-contract-name">
            <select
              name="remitSalutation"
              value={formData.remitSalutation}
              onChange={onInputChange}
              className="erp-select"
              disabled={isView || formData.isSameAsMainContact}
              style={{ flex: 1 }}
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
              style={{ flex: 8 }}
            />
          </div>
        </div>
        <div className="erp-form-group row-align">
          <label>Position</label>
          <input
            type="text"
            name="contactInitials"
            placeholder="Position"
            value={formData.contactInitials}
            className="erp-input"
            disabled
          />
        </div>
        <div className="erp-form-group row-align">
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
        <div className="erp-form-group row-align">
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
  );
}
