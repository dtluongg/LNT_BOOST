import { useState, useRef, useEffect } from 'react';
import './Header.css';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  MapPin,
  Layers,
  Database
} from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeSiteName: string;
  selectedModuleID: string | null;
  activeModuleName: string;
  onBackToSiteSelection: () => void;
  onLogout: () => void;
  onOpenLiveDb: () => void;
  showLiveDbMenu: boolean;
  onOpenMenuPortal: () => void;
}

export default function Header({
  currentUser,
  activeSiteName,
  selectedModuleID,
  activeModuleName,
  onBackToSiteSelection,
  onLogout,
  onOpenLiveDb,
  showLiveDbMenu,
  onOpenMenuPortal
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        {/* Ô nhãn Phân hệ, tích hợp mở modal portal các function */}
        <button
          className="module-badge-header"
          onClick={onOpenMenuPortal}
          title="Mở Sơ đồ Chức năng (Xem các functions)"
        >
          <Layers size={13} />
          <span>Module : <strong>{activeModuleName}</strong></span>
        </button>

        {/* Cố định thông tin Site đã chọn (Không được thay đổi tại đây) */}
        <div className="site-badge-header">
          <MapPin size={13} style={{ color: 'var(--success-color)' }} />
          <span>Site: <strong>{activeSiteName}</strong></span>
        </div>
      </div>

      {/* SEARCH BAR Ở GIỮA */}
      <div className="header-search-center">
        <Search size={16} className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search module, function, ..."
          className="header-search-input"
        />
      </div>

      <div className="header-right">
        {/* Nút Cơ sở dữ liệu gốc (Chỉ Admin mới nhìn thấy) */}
        {currentUser?.isAdmin && (
          <button
            className={`icon-header-btn ${showLiveDbMenu ? 'active' : ''}`}
            onClick={onOpenLiveDb}
            title="Quản lý Cơ sở dữ liệu (Live DB)"
            style={{
              borderColor: showLiveDbMenu ? 'var(--primary-color)' : 'var(--border-color)',
              backgroundColor: showLiveDbMenu ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
              color: showLiveDbMenu ? 'var(--primary-color)' : 'var(--text-muted)'
            }}
          >
            <Database size={18} />
          </button>
        )}

        {/* Nút chuông thông báo & Trợ giúp */}
        <button className="icon-header-btn">
          <Bell size={18} />
          <span className="notif-badge" />
        </button>
        <button className="icon-header-btn">
          <HelpCircle size={18} />
        </button>

        {/* Thông tin User & Dropdown */}
        <div className="user-profile-menu-wrapper" ref={userRef}>
          <button
            className="user-profile-menu-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <div className="user-avatar">
              {currentUser?.fullName?.charAt(0) || currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details-text">
              <span className="user-name">{currentUser?.fullName || currentUser?.username}</span>
              <span className="user-role">{currentUser?.isAdmin ? 'Admin' : 'User'}</span>
            </div>
            <ChevronDown size={14} className={`chevron-transition ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showUserDropdown && (
            <div className="user-dropdown-panel fade-in">
              <div className="dropdown-user-info">
                <strong style={{ color: 'var(--primary-color)' }}>{currentUser?.fullName || currentUser?.username}</strong>
                <span>{currentUser?.email || `${currentUser?.email}`}</span>
              </div>

              <button onClick={onBackToSiteSelection} className="dropdown-action-btn">
                <MapPin size={14} />
                <span>Chọn Site khác</span>
              </button>

              <button onClick={onLogout} className="dropdown-action-btn logout-danger">
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
