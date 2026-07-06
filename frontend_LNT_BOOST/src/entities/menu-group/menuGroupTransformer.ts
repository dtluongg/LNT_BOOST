import type { MenuGroupInfo } from '../../types';

// Sidebar menu groups levels mapper
export function transformMenuGroupInfo(raw: any): MenuGroupInfo {
  return {
    moduleMasterID: String(raw?.moduleMasterID || raw?.ModuleMasterID || '').trim(),
    menuGroupID: Number(raw?.menuGroupID ?? raw?.MenuGroupID ?? 0),
    menuGroupName: String(raw?.menuGroupName || raw?.MenuGroupName || 'N/A').trim(),
    activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag),
  };
}
