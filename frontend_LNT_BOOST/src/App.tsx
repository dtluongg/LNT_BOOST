import { useState, useEffect } from 'react';
import './App.css';
import { apiService } from './services/api';
import { X, Database, FileText, LayoutGrid } from 'lucide-react';

// Imports layouts & components
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import LoginScreen from './features/auth/LoginScreen';
import SiteSelectionScreen from './features/auth/SiteSelectionScreen';
import DashboardOverview from './features/dashboard/DashboardOverview';
import SystemDataView from './features/system-db/SystemDataView';
import PurchaseOrderView from './features/scm/PurchaseOrderView';
import VendorMasterView from './views/MD2_SCM/Supplier_Management/Master_Data/Vendor_Master/VendorMasterView';
import MenuPortalModal from './components/MenuPortalModal';

// Imports types
import type {
  User,
  SiteDto,
  ModuleDto,
  MenuGroupInfo,
  MenuFunctionInfo,
  MenuFilterInfo
} from './types';

export default function App() {
  // State Authentication
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(
    localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null
  );
  const [authorizedSites, setAuthorizedSites] = useState<SiteDto[]>(
    localStorage.getItem('auth_sites') ? JSON.parse(localStorage.getItem('auth_sites')!) : []
  );
  const [authorizedModules, setAuthorizedModules] = useState<ModuleDto[]>(
    localStorage.getItem('auth_modules') ? JSON.parse(localStorage.getItem('auth_modules')!) : []
  );

  // Form states & workspace selection
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedSiteID, setSelectedSiteID] = useState<string | null>(
    localStorage.getItem('selected_site_id') || null
  );
  const [isSiteConfirmed, setIsSiteConfirmed] = useState<boolean>(
    localStorage.getItem('is_site_confirmed') === 'true'
  );
  const [selectedModuleID, setSelectedModuleID] = useState<string | null>(
    localStorage.getItem('selected_module_id') || null
  );
  const [selectedMenuGroupID, setSelectedMenuGroupID] = useState<number | null>(null);
  const [showMenuPortalModal, setShowMenuPortalModal] = useState<boolean>(false);

  // Menu metadata loaded from DB
  const [allMenuGroups, setAllMenuGroups] = useState<MenuGroupInfo[]>([]);
  const [allMenuFunctions, setAllMenuFunctions] = useState<MenuFunctionInfo[]>([]);
  const [allMenuFilters, setAllMenuFilters] = useState<MenuFilterInfo[]>([]);

  // Multi-tab Workspace Interface & States
  interface WorkspaceTab {
    id: string;
    name: string;
    type: 'function' | 'table';
  }
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([]);

  // Active workspace state
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [activeViewName, setActiveViewName] = useState<string>('Tổng quan');
  const [activeMenuFilterID, setActiveMenuFilterID] = useState<number | null>(null);

  // Expandable Menu Groups State
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({ '1': true });

  // Advanced Sidebar states (Favorites, Filter, Collapse)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('user_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeFilterID, setActiveFilterID] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showLiveDbMenu, setShowLiveDbMenu] = useState<boolean>(false);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('user_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load menu metadata once logged in
  useEffect(() => {
    if (token) {
      loadMenuMetadata();
    }
  }, [token]);

  // Set default Site and Module
  useEffect(() => {
    if (authorizedSites.length > 0 && !selectedSiteID) {
      const defaultSite = currentUser?.defaultCompanyID && authorizedSites.some(s => s.companySiteID === currentUser.defaultCompanyID)
        ? currentUser.defaultCompanyID
        : authorizedSites[0].companySiteID;
      setSelectedSiteID(defaultSite);
      localStorage.setItem('selected_site_id', defaultSite);
    }
  }, [authorizedSites, currentUser]);

  useEffect(() => {
    if (selectedSiteID) {
      const siteModules = authorizedModules.filter(m => m.companySiteID === selectedSiteID);
      if (siteModules.length > 0) {
        const savedModule = localStorage.getItem('selected_module_id');
        if (savedModule && siteModules.some(m => m.moduleMasterID === savedModule)) {
          setSelectedModuleID(savedModule);
        } else {
          setSelectedModuleID(siteModules[0].moduleMasterID);
          localStorage.setItem('selected_module_id', siteModules[0].moduleMasterID);
        }
      } else {
        setSelectedModuleID(null);
        localStorage.removeItem('selected_module_id');
      }
      setActiveViewId(null);
      setActiveViewName('Tổng quan');
      setSelectedMenuGroupID(null);
    }
  }, [selectedSiteID, authorizedModules]);

  const loadMenuMetadata = async () => {
    try {
      const [groups, filters] = await Promise.all([
        apiService.getMenuGroups(),
        apiService.getMenuFilters()
      ]);
      setAllMenuGroups(groups);
      setAllMenuFilters(filters);
    } catch (err) {
      console.error('Không thể tải cấu trúc menu từ database:', err);
    }
  };

  // Tải danh sách chức năng lọc theo Phân hệ bằng SQL Gateway (Dapper)
  useEffect(() => {
    if (token && selectedModuleID) {
      const loadModuleFunctions = async () => {
        try {
          const funcs = await apiService.getMenuByModule(selectedModuleID);
          setAllMenuFunctions(funcs);
        } catch (err) {
          console.error('Không thể tải danh sách chức năng cho phân hệ:', err);
        }
      };
      loadModuleFunctions();
    } else {
      setAllMenuFunctions([]);
    }
  }, [token, selectedModuleID]);

  const handleLoginSubmit = async (username: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await apiService.login(username, password);

      // Save local storage
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_refresh_token', res.refreshToken || '');
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      localStorage.setItem('auth_sites', JSON.stringify(res.authorizedSites));
      localStorage.setItem('auth_modules', JSON.stringify(res.authorizedModules));
      localStorage.removeItem('is_site_confirmed');

      // Save states
      setToken(res.token);
      setCurrentUser(res.user);
      setAuthorizedSites(res.authorizedSites);
      setAuthorizedModules(res.authorizedModules);
      setIsSiteConfirmed(false);

      if (res.authorizedSites.length > 0) {
        const defaultSite = res.user.defaultCompanyID && res.authorizedSites.some(s => s.companySiteID === res.user.defaultCompanyID)
          ? res.user.defaultCompanyID
          : res.authorizedSites[0].companySiteID;
        setSelectedSiteID(defaultSite);
        localStorage.setItem('selected_site_id', defaultSite);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Sai tên đăng nhập hoặc mật khẩu.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setCurrentUser(null);
    setAuthorizedSites([]);
    setAuthorizedModules([]);
    setSelectedSiteID(null);
    setSelectedModuleID(null);
    setWorkspaceTabs([]);
    setActiveViewId(null);
    setIsSiteConfirmed(false);
  };

  const handleConfirmSite = (siteId: string, moduleId: string) => {
    setSelectedSiteID(siteId);
    setSelectedModuleID(moduleId);
    setIsSiteConfirmed(true);
    localStorage.setItem('selected_site_id', siteId);
    localStorage.setItem('selected_module_id', moduleId);
    localStorage.setItem('is_site_confirmed', 'true');
  };

  const handleBackToLogin = () => {
    handleLogout();
  };

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleID(moduleId);
    setWorkspaceTabs([]);
    setActiveViewId(null);
    setActiveViewName('Tổng quan');
    setActiveFilterID(null); // Reset filter when module changes
    setShowLiveDbMenu(false); // Close Live DB menu when switching module
  };

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  const handleSelectFunction = (func: MenuFunctionInfo) => {
    const tabId = func.menuFunctionID.toString();
    if (!workspaceTabs.some(t => t.id === tabId)) {
      setWorkspaceTabs(prev => [...prev, { id: tabId, name: func.menuFunctionName, type: 'function' }]);
    }
    setActiveViewId(tabId);
    setActiveViewName(func.menuFunctionName);
    setActiveMenuFilterID(func.menuFilterID);
    setSelectedMenuGroupID(func.menuGroupID); // Focus sidebar on this group
    setActiveFilterID(null); // Show all functions in this group (no filter)
    setShowLiveDbMenu(false); // Close Live DB menu when selecting regular function
  };

  const handleSelectSystemTable = (tableId: string, tableName: string) => {
    if (!workspaceTabs.some(t => t.id === tableId)) {
      setWorkspaceTabs(prev => [...prev, { id: tableId, name: tableName, type: 'table' }]);
    }
    setActiveViewId(tableId);
    setActiveViewName(tableName);
  };

  const handleCloseTab = (tabId: string) => {
    const tabIndex = workspaceTabs.findIndex(t => t.id === tabId);
    const updatedTabs = workspaceTabs.filter(t => t.id !== tabId);
    setWorkspaceTabs(updatedTabs);

    if (activeViewId === tabId) {
      if (updatedTabs.length > 0) {
        const nextIndex = Math.min(tabIndex, updatedTabs.length - 1);
        const nextTab = updatedTabs[nextIndex];
        setActiveViewId(nextTab.id);
        setActiveViewName(nextTab.name);
      } else {
        setActiveViewId(null);
        setActiveViewName('Tổng quan');
      }
    }
  };

  const handleSelectTab = (tabId: string | null) => {
    if (tabId === null) {
      setActiveViewId(null);
      setActiveViewName('Tổng quan');
    } else {
      const tab = workspaceTabs.find(t => t.id === tabId);
      if (tab) {
        setActiveViewId(tab.id);
        setActiveViewName(tab.name);
      }
    }
  };

  const handleToggleFavorite = (funcId: string) => {
    setFavorites(prev =>
      prev.includes(funcId)
        ? prev.filter(id => id !== funcId)
        : [...prev, funcId]
    );
  };

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleToggleLiveDbMenu = () => {
    setShowLiveDbMenu(prev => {
      const nextVal = !prev;
      if (nextVal) {
        const tabId = 'sys_company';
        const tabName = 'tblCompanyInformation';
        if (!workspaceTabs.some(t => t.id === tabId)) {
          setWorkspaceTabs(prevTabs => [...prevTabs, { id: tabId, name: tabName, type: 'table' }]);
        }
        setActiveViewId(tabId);
        setActiveViewName(tabName);
      } else {
        setActiveViewId(null);
        setActiveViewName('Tổng quan');
      }
      return nextVal;
    });
  };

  // Breadcrumbs selector
  const getBreadcrumbs = () => {
    if (!activeViewId) return `${activeModuleName} > Tổng quan`;
    if (activeViewId.startsWith('sys_')) return `Live System DB > ${activeViewName}`;
    const func = allMenuFunctions.find(f => f.menuFunctionID.toString() === activeViewId);
    if (func) {
      const group = allMenuGroups.find(g => g.menuGroupID === func.menuGroupID);
      return `${activeModuleName} > ${group ? group.menuGroupName : ''} > ${func.menuFunctionName}`;
    }
    return `${activeModuleName} > ${activeViewName}`;
  };

  // Filters computed
  const matchModuleID = (id1: string | null, id2: string | null) => {
    if (!id1 || !id2) return false;
    const norm = (s: string) => s.trim().toUpperCase().replace(/MD00/g, 'MD0');
    return norm(id1) === norm(id2);
  };

  const siteModules = authorizedModules.filter(m => m.companySiteID === selectedSiteID);
  const moduleGroups = allMenuGroups.filter(g => matchModuleID(g.moduleMasterID, selectedModuleID));
  const activeSiteName = authorizedSites.find(s => s.companySiteID === selectedSiteID)?.siteName || 'Chưa chọn Site';
  const activeModuleName = siteModules.find(m => matchModuleID(m.moduleMasterID, selectedModuleID))?.moduleMasterName || 'Chưa chọn Phân hệ';

  return (
    <div className="app-container">
      {!token ? (
        <LoginScreen
          onLoginSubmit={handleLoginSubmit}
          loginLoading={loginLoading}
          loginError={loginError}
        />
      ) : !isSiteConfirmed ? (
        <SiteSelectionScreen
          currentUser={currentUser}
          authorizedSites={authorizedSites}
          authorizedModules={authorizedModules}
          onConfirmSite={handleConfirmSite}
          onBackToLogin={handleBackToLogin}
        />
      ) : (
        <div className="portal-container">
          <Sidebar
            selectedModuleID={selectedModuleID}
            activeModuleName={activeModuleName}
            moduleGroups={moduleGroups}
            allMenuFunctions={allMenuFunctions}
            allMenuFilters={allMenuFilters}
            activeViewId={activeViewId}
            expandedGroups={expandedGroups}
            onToggleGroup={handleToggleGroup}
            onSelectFunction={handleSelectFunction}
            onSelectSystemTable={handleSelectSystemTable}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            activeFilterID={activeFilterID}
            onSelectFilter={setActiveFilterID}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
            showLiveDbMenu={currentUser?.isAdmin ? showLiveDbMenu : false}
            selectedMenuGroupID={selectedMenuGroupID}
            onSelectMenuGroup={setSelectedMenuGroupID}
          />

          <div className="portal-main">
            <Header
              currentUser={currentUser}
              activeSiteName={activeSiteName}
              selectedModuleID={selectedModuleID}
              activeModuleName={activeModuleName}
              onBackToSiteSelection={() => setIsSiteConfirmed(false)}
              onLogout={handleLogout}
              onOpenLiveDb={handleToggleLiveDbMenu}
              showLiveDbMenu={showLiveDbMenu}
              onOpenMenuPortal={() => setShowMenuPortalModal(true)}
            />

            {/* WORKSPACE TABS BAR */}
            <div className="workspace-tabs-bar">
              {/* Permanent Dashboard Tab */}
              <button
                className={`workspace-tab-item ${activeViewId === null ? 'active' : ''}`}
                onClick={() => handleSelectTab(null)}
              >
                <LayoutGrid size={13} />
                <span>Tổng quan</span>
              </button>

              {/* Dynamic open tabs */}
              {workspaceTabs.map(tab => {
                const isActive = activeViewId === tab.id;
                return (
                  <div
                    key={tab.id}
                    className={`workspace-tab-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectTab(tab.id)}
                  >
                    {tab.type === 'table' ? (
                      <Database size={13} style={{ color: 'var(--success-color)' }} />
                    ) : (
                      <FileText size={13} style={{ color: 'var(--primary-color)' }} />
                    )}
                    <span>{tab.name}</span>
                    <button
                      className="tab-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(tab.id);
                      }}
                      title="Đóng tab"
                    >
                      <X size={11} />
                    </button>
                  </div>
                );
              })}
            </div>

            {showMenuPortalModal && (
              <MenuPortalModal
                isOpen={showMenuPortalModal}
                onClose={() => setShowMenuPortalModal(false)}
                activeModuleName={activeModuleName}
                selectedModuleID={selectedModuleID}
                allMenuFilters={allMenuFilters}
                allMenuGroups={allMenuGroups}
                allMenuFunctions={allMenuFunctions}
                onSelectMenuGroup={(groupId, filterId) => {
                  setSelectedMenuGroupID(groupId);
                  setActiveFilterID(filterId);
                  setShowMenuPortalModal(false);
                }}
                onSelectFunction={(func) => {
                  handleSelectFunction(func);
                  setShowMenuPortalModal(false);
                }}
              />
            )}

            <main className="workspace fade-in">
              <div className="workspace-breadcrumb">
                {getBreadcrumbs()}
              </div>

              <div className="workspace-header">
                <div className="workspace-title">
                  <h1>{activeViewId ? activeViewName : 'Hệ Thống LNTBOOST EMS'}</h1>
                  <p>
                    {activeViewId
                      ? `${activeViewId.startsWith('sys_') ? 'Bảng Cơ sở dữ liệu gốc' : `Chức năng nghiệp vụ Phân hệ ${selectedModuleID}`} tại ${activeSiteName}`
                      : `Chào mừng bạn, ${currentUser?.fullName || currentUser?.username}. Chọn tính năng để làm việc.`
                    }
                  </p>
                </div>
              </div>

              {/* ROUTE RENDERING */}
              {!activeViewId ? (
                <DashboardOverview
                  currentUser={currentUser}
                  authorizedSites={authorizedSites}
                  siteModules={siteModules}
                  activeSiteName={activeSiteName}
                />
              ) : activeViewId.startsWith('sys_') ? (
                <SystemDataView
                  tableId={activeViewId}
                  tableName={activeViewName}
                  currentUser={currentUser}
                />
              ) : activeViewId === '115' ? (
                <PurchaseOrderView />
              ) : activeViewId === '301' ? (
                <VendorMasterView />
              ) : (
                <div style={{ padding: '40px', border: '1px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Chức năng: {activeViewName} (ID: {activeViewId})</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
                    Giao diện của chức năng này thuộc nhóm bộ lọc <strong>{allMenuFilters.find(f => f.menuFilterID === activeMenuFilterID)?.menuFilterName || 'Chức năng'}</strong> đang được phát triển. Dữ liệu sẽ được kết nối tới API của phân hệ {selectedModuleID}.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
