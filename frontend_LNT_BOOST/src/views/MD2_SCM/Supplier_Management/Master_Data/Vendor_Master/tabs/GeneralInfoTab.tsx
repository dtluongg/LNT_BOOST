import React from 'react';
import { MapPin } from 'lucide-react';

interface GeneralInfoTabProps {
  formData: any;
  isView: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  countries: any[];
}

export default function GeneralInfoTab({
  formData,
  isView,
  isEdit,
  onInputChange,
  countries = []
}: GeneralInfoTabProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="fade-in">

      {/* Left Card: Main Address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 className="erp-card-title">
          <MapPin size={13} />
          Main Address
        </h4>

        <div className="erp-form-group row-align">
          <label className="required-label">Company Name</label>
          <input
            required
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onInputChange}
            className="erp-input"
            disabled={isView || isEdit}
          />
        </div>

        <div className="erp-form-group row-align">
          <label className="required-label">Phone No</label>
          <input
            required
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={onInputChange}
            className="erp-input"
            disabled={isView || isEdit}
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
          <label className="required-label">Address Line 1</label>
          <input
            required
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={onInputChange}
            className="erp-input"
            disabled={isView || isEdit}
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
          <label className="required-label">City</label>
          <input
            required
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="erp-input"
            disabled={isView || isEdit}
          />
        </div>
        <div className="erp-form-group row-align">
          <label className="required-label">Province</label>
          <input
            required
            type="text"
            name="province"
            value={formData.province}
            onChange={onInputChange}
            className="erp-input"
            disabled={isView || isEdit}
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
          <label className="required-label">Country</label>
          <select
            required
            name="country"
            value={formData.country}
            onChange={onInputChange}
            className="erp-select"
            disabled={isView}
          >disabled={isView || isEdit}
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
                style={{ flex: 1 }}
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
                style={{ flex: 8 }}
              />
            </div>
          </div>

          <div className="erp-form-group row-align">
            <label>Position</label>
            <input
              type="text"
              name="contactInitials"
              placeholder="President / CEO / Developer / Tester / ..."
              value={formData.contactInitials}
              onChange={onInputChange}
              className="erp-input"
              disabled={isView}
            />
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
          <div className="erp-form-group">
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
  );
}
