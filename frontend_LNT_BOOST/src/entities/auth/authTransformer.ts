import type { User, SiteDto, ModuleDto, LoginResponse } from '../../types';

// User profile data transformer
export function transformUser(raw: any): User {
  return {
    username: String(raw?.username || '').trim(),
    fullName: raw?.fullName ? String(raw.fullName).trim() : null,
    email: raw?.email ? String(raw.email).trim() : null,
    isAdmin: Boolean(raw?.isAdmin || raw?.admin),
    defaultCompanyID: raw?.defaultCompanyID ? String(raw.defaultCompanyID).trim() : null,
  };
}

// Site selector items transformer
export function transformSiteDto(raw: any): SiteDto {
  return {
    companySiteID: String(raw?.companySiteID || '').trim(),
    siteCode: String(raw?.siteCode || '').trim(),
    siteName: String(raw?.siteName || 'N/A').trim(),
  };
}

// Module authorization items transformer
export function transformModuleDto(raw: any): ModuleDto {
  return {
    companySiteID: String(raw?.companySiteID || '').trim(),
    moduleMasterID: String(raw?.moduleMasterID || '').trim(),
    moduleMasterName: String(raw?.moduleMasterName || 'N/A').trim(),
  };
}

// Authentication response mapper
export function transformLoginResponse(raw: any): LoginResponse {
  return {
    token: String(raw?.token || ''),
    refreshToken: raw?.refreshToken ? String(raw.refreshToken) : undefined,
    user: transformUser(raw?.user),
    authorizedSites: Array.isArray(raw?.authorizedSites) 
      ? raw.authorizedSites.map(transformSiteDto) 
      : [],
    authorizedModules: Array.isArray(raw?.authorizedModules) 
      ? raw.authorizedModules.map(transformModuleDto) 
      : [],
  };
}
