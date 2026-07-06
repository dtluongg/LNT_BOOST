import type { SiteInfo } from '../../types';

// Branch details catalog mapper
export function transformSiteInfo(raw: any): SiteInfo {
  return {
    companySiteID: String(raw?.companySiteID || raw?.CompanySiteID || '').trim(),
    companyID: String(raw?.companyID || raw?.CompanyID || '').trim(),
    siteCode: String(raw?.siteCode || raw?.SiteCode || '').trim(),
    siteName: String(raw?.siteName || raw?.SiteName || 'N/A').trim(),
    addressLine1: String(raw?.addressLine1 || raw?.AddressLine1 || '').trim(),
    telephone: (raw?.telephone || raw?.Telephone) ? String(raw.telephone || raw.Telephone).trim() : null,
    email: (raw?.email || raw?.Email) ? String(raw.email || raw.Email).trim() : null,
    taxCode: (raw?.taxCode || raw?.TAXCode || raw?.TaxCode) ? String(raw.taxCode || raw.TAXCode || raw.TaxCode).trim() : null,
    activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag),
  };
}
