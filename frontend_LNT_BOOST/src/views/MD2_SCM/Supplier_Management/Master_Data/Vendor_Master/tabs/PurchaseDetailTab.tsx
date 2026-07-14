import React from 'react';

interface PurchaseDetailTabProps {
  formData: any;
  isView: boolean;
  isEdit: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PurchaseDetailTab({
  formData,
  isView,
  isEdit,
  onInputChange
}: PurchaseDetailTabProps) {
  return (
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
  );
}
