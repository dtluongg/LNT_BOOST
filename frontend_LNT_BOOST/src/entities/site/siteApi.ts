import { apiFetch } from '../../core/api/httpClient';
import { transformSiteInfo } from './siteTransformer';
import type { SiteInfo } from '../../types';

export const siteApi = {
  // Fetch branches and active sites
  getSites: async (): Promise<SiteInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetSites' })
    });
    return raw.map(transformSiteInfo);
  }
};
