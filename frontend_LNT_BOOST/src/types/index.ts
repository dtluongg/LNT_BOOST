export interface User {
  username: string;
  fullName: string | null;
  email: string | null;
  isAdmin: boolean;
  defaultCompanyID: string | null;
}

export interface SiteDto {
  companySiteID: string;
  siteCode: string;
  siteName: string;
}

export interface ModuleDto {
  companySiteID: string;
  moduleMasterID: string;
  moduleMasterName: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  authorizedSites: SiteDto[];
  authorizedModules: ModuleDto[];
}

export interface CompanyInfo {
  companyID: string;
  companyCode: string | null;
  companyName: string | null;
  addressLine1: string | null;
  telephone: string | null;
  email: string | null;
  taxCode: string | null;
  activeFlag: boolean | null;
}

export interface SiteInfo {
  companySiteID: string;
  companyID: string;
  siteCode: string;
  siteName: string;
  addressLine1: string;
  telephone: string | null;
  email: string | null;
  taxCode: string | null;
  activeFlag: boolean;
}

export interface MastUserInfo {
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  authorized: boolean | null;
  admin: boolean | null;
  createdTime: string | null;
  isNewUser: boolean | null;
}

export interface ModuleMasterInfo {
  moduleMasterID: string;
  moduleMasterName: string;
  activeFlag: boolean;
}

export interface MenuGroupInfo {
  moduleMasterID: string;
  menuGroupID: number;
  menuGroupName: string;
  activeFlag: boolean;
}

export interface MenuFunctionInfo {
  moduleMasterID: string;
  menuGroupID: number;
  menuFunctionID: number;
  menuFunctionName: string;
  menuFilterID: number;
  activeFlag: boolean;
}

export interface MenuFilterInfo {
  menuFilterID: number;
  menuFilterName: string;
  activeFlag: boolean;
}
