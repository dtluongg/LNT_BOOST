import type { MastUserInfo } from '../../types';

// System account details mapper
export function transformMastUserInfo(raw: any): MastUserInfo {
  return {
    username: String(raw?.username || raw?.Username || '').trim(),
    fullName: (raw?.fullName || raw?.FullName) ? String(raw.fullName || raw.FullName).trim() : null,
    email: (raw?.email || raw?.Email) ? String(raw.email || raw.Email).trim() : null,
    phone: (raw?.phone || raw?.Phone) ? String(raw.phone || raw.Phone).trim() : null,
    authorized: (raw?.authorized !== undefined || raw?.Authorized !== undefined) ? Boolean(raw.authorized ?? raw.Authorized) : null,
    admin: (raw?.admin !== undefined || raw?.Admin !== undefined) ? Boolean(raw.admin ?? raw.Admin) : null,
    createdTime: (raw?.createdTime || raw?.CreatedTime) ? String(raw.createdTime || raw.CreatedTime) : null,
    isNewUser: (raw?.isNewUser !== undefined || raw?.IsNewUser !== undefined) ? Boolean(raw.isNewUser ?? raw.IsNewUser) : null,
  };
}
