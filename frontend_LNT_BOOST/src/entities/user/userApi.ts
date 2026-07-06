import { apiFetch } from '../../core/api/httpClient';
import { transformMastUserInfo } from './userTransformer';
import type { MastUserInfo } from '../../types';

export const userApi = {
  // Fetch active system users
  getUsers: async (): Promise<MastUserInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetUsers' })
    });
    return raw.map(transformMastUserInfo);
  }
};
