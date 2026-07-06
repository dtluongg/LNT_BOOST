import type { ModuleMasterInfo } from '../../types';

// General modules master register mapper
export function transformModuleMasterInfo(raw: any): ModuleMasterInfo {
  return {
    moduleMasterID: String(raw?.moduleMasterID || raw?.ModuleMasterID || '').trim(),
    moduleMasterName: String(raw?.moduleMasterName || raw?.ModuleMasterName || 'N/A').trim(),
    activeFlag: Boolean(raw?.activeFlag ?? raw?.ActiveFlag),
  };
}
