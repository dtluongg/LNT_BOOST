import type { CompanyInfo } from '../../types';

// Parent corporate catalog transformer
export function transformCompanyInfo(raw: any): CompanyInfo {
  return {
    companyID: String(raw?.companyID || raw?.CompanyID || '').trim(),
    companyCode: (raw?.companyCode || raw?.CompanyCode) ? String(raw.companyCode || raw.CompanyCode).trim() : null,
    companyName: (raw?.companyName || raw?.CompanyName) ? String(raw.companyName || raw.CompanyName).trim() : null,
    addressLine1: (raw?.addressLine1 || raw?.AddressLine1) ? String(raw.addressLine1 || raw.AddressLine1).trim() : null,
    telephone: (raw?.telephone || raw?.Telephone) ? String(raw.telephone || raw.Telephone).trim() : null,
    email: (raw?.email || raw?.Email) ? String(raw.email || raw.Email).trim() : null,
    taxCode: (raw?.taxCode || raw?.TAXCode || raw?.TaxCode) ? String(raw.taxCode || raw.TAXCode || raw.TaxCode).trim() : null,
    activeFlag: (raw?.activeFlag !== undefined || raw?.ActiveFlag !== undefined) ? Boolean(raw.activeFlag ?? raw.ActiveFlag) : null,
  };
}
