import { useState, useEffect } from 'react';
import './SiteSelectionScreen.css';
import {
  Globe,
  ShieldCheck,
  ShoppingCart,
  Factory,
  BarChart3,
  Users,
  Home,
  User as UserIcon,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../../services/api';
import type { User, SiteDto, ModuleDto, CompanyInfo, SiteInfo } from '../../types';

interface SiteSelectionScreenProps {
  currentUser: User | null;
  authorizedSites: SiteDto[];
  authorizedModules: ModuleDto[];
  onConfirmSite: (siteId: string, moduleId: string) => void;
  onBackToLogin: () => void;
}

export default function SiteSelectionScreen({
  currentUser,
  authorizedSites,
  authorizedModules,
  onConfirmSite,
  onBackToLogin
}: SiteSelectionScreenProps) {
  const [selectedSiteID, setSelectedSiteID] = useState<string>('');

  // Dữ liệu thực tế từ DB để thực hiện Lookup thông tin chi tiết
  const [companies, setCompanies] = useState<CompanyInfo[]>([]);
  const [sitesInfo, setSitesInfo] = useState<SiteInfo[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Load chi tiết thông tin từ DB để hiển thị Company Name, Address
  useEffect(() => {
    const fetchDbDetails = async () => {
      try {
        setLoadingDetails(true);
        const [companiesList, sitesList] = await Promise.all([
          apiService.getCompanies(),
          apiService.getSites()
        ]);
        setCompanies(companiesList);
        setSitesInfo(sitesList);
      } catch (err) {
        console.error('Không thể tải chi tiết danh mục để thực hiện Lookup:', err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDbDetails();
  }, []);

  // Chọn site mặc định ban đầu
  useEffect(() => {
    if (authorizedSites.length > 0 && !selectedSiteID) {
      const defaultSite = currentUser?.defaultCompanyID && authorizedSites.some(s => s.companySiteID === currentUser.defaultCompanyID)
        ? currentUser.defaultCompanyID
        : authorizedSites[0].companySiteID;
      setSelectedSiteID(defaultSite);
    }
  }, [authorizedSites, currentUser]);

  // Thực hiện Lookup chi tiết Site được chọn
  const selectedSiteDetail = sitesInfo.find(s => s.companySiteID === selectedSiteID);
  const selectedCompanyDetail = companies.find(c => c.companyID === selectedSiteDetail?.companyID);

  const enabledModules = authorizedModules.filter(m => m.companySiteID === selectedSiteID);

  const isModuleEnabled = (moduleMasterId: string) => {
    const norm = (id: string) => id.trim().toUpperCase().replace(/MD00/g, 'MD0');
    return enabledModules.some(m => norm(m.moduleMasterID) === norm(moduleMasterId));
  };

  const handleModuleClick = (moduleMasterId: string) => {
    const norm = (id: string) => id.trim().toUpperCase().replace(/MD00/g, 'MD0');
    const found = enabledModules.find(m => norm(m.moduleMasterID) === norm(moduleMasterId));
    if (found) {
      onConfirmSite(selectedSiteID, found.moduleMasterID);
    }
  };

  return (
    <div className="site-selection-wrapper">
      <div className="brand-overlay"></div>

      {/* HEADER SECTION */}
      <header className="site-selection-header">
        <div className="brand-logo-container">
          <img src="/lntlogo.png" alt="LNTBOOST Logo" className="brand-logo-img" />
          <div className="brand-logo-text">
            <h2>LNT<span style={{ color: '#0ea5e9' }}>BOOST</span></h2>
            <span>BUSINESS SUITE</span>
          </div>
        </div>

        {/* LANG PICKER & USER PROFILE PILL */}
        <div className="header-right-controls">
          <div className="lang-picker-pill">
            <Globe size={14} />
            <span>English</span>
            <ChevronDownIcon />
          </div>

          <div className="user-profile-pill">
            <div className="user-avatar-pill">
              {currentUser?.fullName?.charAt(0) || currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info-pill">
              <span className="user-name">{currentUser?.fullName || currentUser?.username}</span>
              <span className="user-badge">{currentUser?.isAdmin ? 'Quản Trị Viên' : 'Nhân viên'}</span>
            </div>
            <button
              type="button"
              className="btn-logout-pill"
              onClick={onBackToLogin}
              title="Đăng xuất / Back to Login"
            >
              <ArrowLeft size={14} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="site-selection-container centered-layout">
        <div className="site-selection-card-panel">

          {/* SLOGAN & TITLE */}
          <div className="brand-content-middle text-center">
            <h1>
              One Platform. <span className="text-glow-blue">Infinite Possibilities.</span>
            </h1>
            <p className="brand-subtitle">
              Hệ thống Quản lý và Vận hành Doanh nghiệp Toàn diện LNTBOOST
            </p>
          </div>

          {/* SITE SELECTOR GLASS CARD */}
          <div className="glass-card site-selector-card fade-in">
            <div className="card-header-icon">
              <Globe size={16} />
              <h3>Chọn Chi nhánh / Site làm việc</h3>
            </div>

            <div className="input-field-wrapper">
              <select
                className="site-select-custom"
                value={selectedSiteID}
                onChange={e => setSelectedSiteID(e.target.value)}
              >
                {authorizedSites.map(site => (
                  <option key={site.companySiteID} value={site.companySiteID}>
                    [{site.siteCode}] - {site.siteName}
                  </option>
                ))}
              </select>
              <div className="select-arrow-icon">
                <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>

            {/* Looked up Details */}
            {(selectedSiteDetail || selectedCompanyDetail) && (
              <div className="site-details-inline">
                {selectedCompanyDetail && (
                  <div className="detail-row">
                    <span className="detail-lbl">Công ty</span>
                    <span className="detail-val">{selectedCompanyDetail.companyName}</span>
                  </div>
                )}
                {selectedSiteDetail && (
                  <div className="detail-row">
                    <span className="detail-lbl">Địa chỉ</span>
                    <span className="detail-val">{selectedSiteDetail.addressLine1}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HORIZONTAL MODULES LIST */}
          <div className="modules-horizontal-section fade-in">
            <h3 className="section-title">Choose Module for Work</h3>
            <p className="section-subtitle">Click on the Module to access</p>

            <div className="brand-modules-grid horizontal-grid">
              <button
                type="button"
                className={`brand-module-card ${isModuleEnabled('MD02') ? 'active-highlight' : 'disabled-module'}`}
                onClick={() => handleModuleClick('MD02')}
                disabled={!isModuleEnabled('MD02')}
              >
                <div className="module-icon-circle">
                  <ShoppingCart size={22} />
                </div>
                <h4>SCM</h4>
                <span>Supply Chain</span>
              </button>

              <button
                type="button"
                className={`brand-module-card ${isModuleEnabled('MD03') ? 'active-highlight' : 'disabled-module'}`}
                onClick={() => handleModuleClick('MD03')}
                disabled={!isModuleEnabled('MD03')}
              >
                <div className="module-icon-circle">
                  <Factory size={22} />
                </div>
                <h4>MANUFACTURING</h4>
                <span>Production</span>
              </button>

              <button
                type="button"
                className={`brand-module-card ${isModuleEnabled('MD01') ? 'active-highlight' : 'disabled-module'}`}
                onClick={() => handleModuleClick('MD01')}
                disabled={!isModuleEnabled('MD01')}
              >
                <div className="module-icon-circle">
                  <BarChart3 size={22} />
                </div>
                <h4>FINANCE</h4>
                <span>Financial Control</span>
              </button>

              <button
                type="button"
                className={`brand-module-card ${isModuleEnabled('MD06') ? 'active-highlight' : 'disabled-module'}`}
                onClick={() => handleModuleClick('MD06')}
                disabled={!isModuleEnabled('MD06')}
              >
                <div className="module-icon-circle">
                  <Users size={22} />
                </div>
                <h4>HR</h4>
                <span>Workforce</span>
              </button>

              <button
                type="button"
                className={`brand-module-card ${isModuleEnabled('MD05') ? 'active-highlight' : 'disabled-module'}`}
                onClick={() => handleModuleClick('MD05')}
                disabled={!isModuleEnabled('MD05')}
              >
                <div className="module-icon-circle">
                  <Home size={22} />
                </div>
                <h4>WMS</h4>
                <span>Warehouse</span>
              </button>
            </div>
          </div>

          {/* VALIDATION BOX */}
          <div className="live-validation-box fade-in centered-validation">
            <div className="validation-tags">
              <span className="valid-tag">
                <CheckCircle size={12} /> Live DB Match
              </span>
              <span className="valid-tag">
                <CheckCircle size={12} /> JWT Claims Synced
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-selection-footer">
        <div className="footer-copyright">
          © 2026 LNTBOOST. All rights reserved.
        </div>
        <div className="footer-secure-tag">
          <ShieldCheck size={14} />
          <span>Secure login powered by <strong>LNTBOOST</strong></span>
        </div>
      </footer>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px', opacity: 0.8 }}>
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const getModuleIcon = (moduleId: string) => {
  const normId = moduleId.trim().toUpperCase().replace(/MD00/g, 'MD0');
  switch (normId) {
    case 'MD01':
      return <BarChart3 size={24} />;
    case 'MD02':
      return <ShoppingCart size={24} />;
    case 'MD03':
      return <Factory size={24} />;
    case 'MD05':
      return <Home size={24} />;
    case 'MD06':
      return <Users size={24} />;
    default:
      return <Globe size={24} />;
  }
};

const getModuleDesc = (moduleId: string) => {
  const normId = moduleId.trim().toUpperCase().replace(/MD00/g, 'MD0');
  switch (normId) {
    case 'MD01':
      return 'Kế toán tổng hợp, quản lý thu chi, báo cáo tài chính';
    case 'MD02':
      return 'Quản lý đơn hàng, nhà cung cấp, chuỗi cung ứng SCM';
    case 'MD03':
      return 'Quản lý lệnh sản xuất, định mức vật tư, tiến độ nhà máy';
    case 'MD05':
      return 'Quản lý nhập xuất tồn, sơ đồ kho WMS, kiểm kê hàng hóa';
    case 'MD06':
      return 'Quản lý hồ sơ nhân viên, bảng công, tính lương lò';
    default:
      return 'Phân hệ chức năng và nghiệp vụ tích hợp';
  }
};
