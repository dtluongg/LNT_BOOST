import { apiFetch } from '../../core/api/httpClient';
import { transformMenuFunctionInfo } from './menuFunctionTransformer';
import type { MenuFunctionInfo } from '../../types';

export const menuFunctionApi = {
  // Fetch menu function items
  getMenuFunctions: async (): Promise<MenuFunctionInfo[]> => {
    const raw = await apiFetch<any[]>('/MenuFunctions');
    return raw.map(transformMenuFunctionInfo);
  },

  // Fetch menu functions filtered by module using SQL Gateway
  getMenuByModule: async (moduleId: string): Promise<MenuFunctionInfo[]> => {
    const raw = await apiFetch<any[]>('/SqlGateway/query', {
      method: 'POST',
      body: JSON.stringify({
        queryName: 'GetMenuFunctionsByModule',
        parameters: { ModuleId: moduleId }
      })
    });
    return raw.map(transformMenuFunctionInfo);
  }
};
