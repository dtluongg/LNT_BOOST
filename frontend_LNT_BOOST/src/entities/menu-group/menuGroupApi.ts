import { apiFetch } from '../../core/api/httpClient';
import { transformMenuGroupInfo } from './menuGroupTransformer';
import type { MenuGroupInfo } from '../../types';

export const menuGroupApi = {
  // Fetch menu group levels
  getMenuGroups: async (): Promise<MenuGroupInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetMenuGroups' })
    });
    return raw.map(transformMenuGroupInfo);
  }
};
