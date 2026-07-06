import type { MenuFilterInfo } from '../../types';

// Bottom filters configuration levels mapper
export function transformMenuFilterInfo(raw: any): MenuFilterInfo {
  return {
    menuFilterID: Number(raw?.menuFilterID ?? raw?.MenuFilterID ?? 0),
    menuFilterName: String(raw?.menuFilterName || raw?.MenuFilterName || 'N/A').trim(),
    activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag),
  };
}
