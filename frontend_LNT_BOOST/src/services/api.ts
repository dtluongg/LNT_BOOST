import { authApi } from '../entities/auth/authApi';
import { userApi } from '../entities/user/userApi';
import { siteApi } from '../entities/site/siteApi';
import { companyApi } from '../entities/company/companyApi';
import { menuGroupApi } from '../entities/menu-group/menuGroupApi';
import { menuFunctionApi } from '../entities/menu-function/menuFunctionApi';
import { menuFilterApi } from '../entities/menu-filter/menuFilterApi';
import { moduleApi } from '../entities/module/moduleApi';

// Unified backward-compatible apiService mapping 1-to-1 to entity-driven API layers
export const apiService = {
  ...authApi,
  ...userApi,
  ...siteApi,
  ...companyApi,
  ...menuGroupApi,
  ...menuFunctionApi,
  ...menuFilterApi,
  ...moduleApi
};
