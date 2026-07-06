import { apiFetch } from '../../core/api/httpClient';
import { transformModuleMasterInfo } from './moduleTransformer';
import type { ModuleMasterInfo } from '../../types';

export const moduleApi = {
  // Fetch modules registers
  getModules: async (): Promise<ModuleMasterInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({ queryName: 'GetModules' })
    });
    return raw.map(transformModuleMasterInfo);
  }
};
