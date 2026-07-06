import { apiFetch } from '../../core/api/httpClient';
import { transformCompanyInfo } from './companyTransformer';
import type { CompanyInfo } from '../../types';

export const companyApi = {
  // Fetch global corporate registers
  getCompanies: async (): Promise<CompanyInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetCompanies' })
    });
    return raw.map(transformCompanyInfo);
  }
};
