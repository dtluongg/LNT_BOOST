import { apiFetch } from '../../core/api/httpClient';
import { transformMenuFilterInfo } from './menuFilterTransformer';
import type { MenuFilterInfo } from '../../types';

export const menuFilterApi = {
  // Fetch classification filter categories
  getMenuFilters: async (): Promise<MenuFilterInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetMenuFilters' })
    });
    return raw.map(transformMenuFilterInfo);
  }
};
