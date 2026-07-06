import type { MenuFunctionInfo } from '../../types';

// Sidebar menu items detailed functions transformer
export function transformMenuFunctionInfo(raw: any): MenuFunctionInfo {
  return {
    moduleMasterID: String(raw?.moduleMasterID || raw?.ModuleMasterID || '').trim(),
    menuGroupID: Number(raw?.menuGroupID ?? raw?.MenuGroupID ?? 0),
    menuFunctionID: Number(raw?.menuFunctionID ?? raw?.MenuFunctionID ?? 0),
    menuFunctionName: String(raw?.menuFunctionName || raw?.MenuFunctionName || 'N/A').trim(),
    menuFilterID: Number(raw?.menuFilterID ?? raw?.MenuFilterID ?? 0),
    activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag),
  };
}
