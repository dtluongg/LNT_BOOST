import { useState } from 'react';
import './Sidebar.css';
import {
  FolderTree,
  FileText,
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  Star,
  Search,
  ChevronLeft,
  LayoutGrid,
  FileCheck
} from 'lucide-react';
import type {
  MenuGroupInfo,
  MenuFunctionInfo,
  MenuFilterInfo
} from '../types';

// Danh sách các bảng hệ thống để xem dữ liệu trực quan
const SYSTEM_TABLES = [
  { id: 'sys_company', name: 'tblCompanyInformation', label: 'Tổng Công Ty', icon: LayoutGrid },
  { id: 'sys_site', name: 'tblCompanySiteInformation', label: 'Chi Nhánh / Sites', icon: LayoutGrid },
  { id: 'sys_user', name: 'tblMastUser', label: 'Tài Khoản / Users', icon: LayoutGrid },
  { id: 'sys_module', name: 'tblModuleMaster', label: 'Phân Hệ / Modules', icon: LayoutGrid },
  { id: 'sys_menu_group', name: 'tblMenuGroups', label: 'Nhóm Menu', icon: LayoutGrid },
  { id: 'sys_menu_func', name: 'tblMenuFunctions', label: 'Chức Năng Chi Tiết', icon: LayoutGrid },
  { id: 'sys_menu_filter', name: 'tblMenuFilters', label: 'Bộ Lọc Phân Loại', icon: LayoutGrid }
];

interface SidebarProps {
  selectedModuleID: string | null;
  activeModuleName: string;
  moduleGroups: MenuGroupInfo[];
  allMenuFunctions: MenuFunctionInfo[];
  allMenuFilters: MenuFilterInfo[];
  activeViewId: string | null;
  expandedGroups: { [key: string]: boolean };
  onToggleGroup: (groupId: string) => void;
  onSelectFunction: (func: MenuFunctionInfo) => void;
  onSelectSystemTable: (tableId: string, tableName: string) => void;

  // Các tính năng nâng cao mới
  favorites: string[];
  onToggleFavorite: (funcId: string) => void;
  activeFilterID: number | null;
  onSelectFilter: (filterId: number | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  showLiveDbMenu: boolean;

  selectedMenuGroupID: number | null;
  onSelectMenuGroup: (groupId: number | null) => void;
}

export default function Sidebar({
  selectedModuleID,
  moduleGroups,
  allMenuFunctions,
  allMenuFilters,
  activeViewId,
  expandedGroups,
  onToggleGroup,
  onSelectFunction,
  onSelectSystemTable,
  favorites,
  onToggleFavorite,
  activeFilterID,
  onSelectFilter,
  isCollapsed,
  onToggleCollapse,
  showLiveDbMenu,
  selectedMenuGroupID,
  onSelectMenuGroup
}: SidebarProps) {
  const [funcSearch, setFuncSearch] = useState('');

  // Hàm so sánh mềm dẻo ModuleMasterID để tránh lệch định dạng (ví dụ: MD02 và MD002)
  const matchModuleID = (id1: string | null, id2: string | null) => {
    if (!id1 || !id2) return false;
    const norm = (s: string) => s.trim().toUpperCase().replace(/MD00/g, 'MD0');
    return norm(id1) === norm(id2);
  };

  // Xác định nhóm menu đang hoạt động
  const activeGroupId = selectedMenuGroupID !== null ? selectedMenuGroupID : (moduleGroups.length > 0 ? moduleGroups[0].menuGroupID : null);

  // Lọc các chức năng thuộc module đang chọn
  const activeModuleFunctions = allMenuFunctions.filter(f => matchModuleID(f.moduleMasterID, selectedModuleID));

  // Lọc các chức năng thuộc nhóm menu đang hoạt động
  const activeGroupFunctions = activeGroupId !== null
    ? activeModuleFunctions.filter(f => f.menuGroupID === activeGroupId)
    : [];

  // Lấy các bộ lọc thực tế được tham chiếu bởi các chức năng trong nhóm hoạt động
  const referencedFilterIDs = Array.from(new Set(activeGroupFunctions.map(f => f.menuFilterID)));
  const activeFilters = allMenuFilters.filter(filter =>
    referencedFilterIDs.includes(filter.menuFilterID)
  );

  // 1. Lọc các Favourites (Chức năng yêu thích được ghim lên đầu)
  const favouriteFunctions = allMenuFunctions.filter(f =>
    favorites.includes(f.menuFunctionID.toString()) && matchModuleID(f.moduleMasterID, selectedModuleID)
  );

  // 2. Tính số lượng chức năng theo từng bộ lọc (Filter) trong phạm vi nhóm đang hoạt động
  const getFilterCount = (filterId: number | null) => {
    return activeGroupFunctions.filter(f =>
      filterId === null || f.menuFilterID === filterId
    ).length;
  };

  // 3. Lọc chức năng trong danh sách hiển thị theo bộ lọc đang chọn & từ khóa tìm kiếm
  const getFilteredFunctions = (groupId: number) => {
    return allMenuFunctions.filter(f =>
      matchModuleID(f.moduleMasterID, selectedModuleID) &&
      f.menuGroupID === groupId &&
      (activeFilterID === null || f.menuFilterID === activeFilterID) &&
      (funcSearch === '' || f.menuFunctionName.toLowerCase().includes(funcSearch.toLowerCase()))
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>

      {/* LOGO BOX - TÀI TRỢ BỞI LNTBOOST */}
      <div
        className="sidebar-logo-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: isCollapsed ? '16px 0' : '16px 20px',
          height: '64px',
          borderBottom: '1px solid var(--border-color)',
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        }}
      >
        <div className="logo-symbol">
          <img src="/lntlogo.png" alt="L" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
        </div>
        {!isCollapsed && (
          <span className="logo-text">
            LNT<span style={{ color: '#0284c7' }}>BOOST</span>
          </span>
        )}
      </div>

      {/* CHỈ TIÊU CẬP NHẬT TRONG SIDEBAR */}
      <div className="sidebar-scrollable-content">

        {/* 1. MỤC FAVORITES (QUICK ACCESS MENU) */}
        {!isCollapsed && favouriteFunctions.length > 0 && (
          <div className="filter-section fade-in">
            <div className="filter-header">
              <span>FAVOURITES</span>
            </div>
            <div className="favorites-list">
              {favouriteFunctions.map(func => {
                const isActive = activeViewId === func.menuFunctionID.toString();
                return (
                  <div key={func.menuFunctionID} className={`fav-item-row ${isActive ? 'active' : ''}`}>
                    <button
                      className="fav-item-btn"
                      onClick={() => onSelectFunction(func)}
                    >
                      <FileCheck size={14} style={{ color: 'var(--success-color)' }} />
                      <span>{func.menuFunctionName}</span>
                    </button>
                    <button
                      className="star-toggle-btn active"
                      onClick={() => onToggleFavorite(func.menuFunctionID.toString())}
                    >
                      <Star size={12} fill="var(--warning-color)" stroke="var(--warning-color)" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Ô TÌM KIẾM CHỨC NĂNG TRONG SIDEBAR */}
        {!isCollapsed && (
          <div className="sidebar-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search Function..."
              value={funcSearch}
              onChange={e => setFuncSearch(e.target.value)}
            />
          </div>
        )}

        {/* 3. DANH SÁCH CHỨC NĂNG NGHIỆP VỤ CHÍNH (FUNCTIONS) */}
        <div className="filter-section">
          {!isCollapsed && (
            <div className="filter-header">
              <span>FUNCTIONS</span>
            </div>
          )}

          {(() => {
            if (activeGroupId === null) {
              return !isCollapsed && (
                <div style={{ padding: '10px 8px', fontSize: '12px', color: 'var(--text-dark)', fontStyle: 'italic' }}>
                  Chưa có menu được nạp.
                </div>
              );
            }

            const selectedGroup = moduleGroups.find(g => g.menuGroupID === activeGroupId);
            const groupFunctions = getFilteredFunctions(activeGroupId);

            if (isCollapsed) {
              if (groupFunctions.length === 0) return null;
              return (
                <div className="collapsed-group-icon" title={selectedGroup?.menuGroupName || 'Nhóm Menu'}>
                  <FolderTree size={18} style={{ color: 'var(--primary-color)' }} />
                  <div className="hover-tooltip-menu">
                    <div className="tooltip-title">{selectedGroup?.menuGroupName}</div>
                    {groupFunctions.map(func => (
                      <div
                        key={func.menuFunctionID}
                        className="tooltip-func-item"
                        onClick={() => onSelectFunction(func)}
                      >
                        {func.menuFunctionName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div className="focused-group-container fade-in">
                <div className="focused-group-title">
                  <FolderTree size={14} style={{ color: 'var(--primary-color)' }} />
                  <span>{selectedGroup?.menuGroupName}</span>
                </div>
                <div className="functions-list flat-list">
                  {groupFunctions.length === 0 ? (
                    <div style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--text-dark)' }}>
                      Không có chức năng thỏa mãn bộ lọc
                    </div>
                  ) : (
                    groupFunctions.map(func => {
                      const isActive = activeViewId === func.menuFunctionID.toString();
                      const isFav = favorites.includes(func.menuFunctionID.toString());

                      return (
                        <div key={func.menuFunctionID} className={`function-item-row ${isActive ? 'active' : ''}`}>
                          <button
                            className="function-item-btn"
                            onClick={() => onSelectFunction(func)}
                          >
                            <FileText size={13} />
                            <span>{func.menuFunctionName}</span>
                          </button>
                          <button
                            className={`star-toggle-btn ${isFav ? 'active' : ''}`}
                            onClick={() => onToggleFavorite(func.menuFunctionID.toString())}
                          >
                            <Star size={12} fill={isFav ? 'var(--warning-color)' : 'none'} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* 4. DỮ LIỆU LIVE DATABASE BẢNG GỐC */}
        {showLiveDbMenu && (
          <div className="filter-section" style={{ marginTop: '20px' }}>
            {!isCollapsed && (
              <div className="filter-header">
                <span>DỮ LIỆU LIVE DB</span>
              </div>
            )}

            {SYSTEM_TABLES.map(table => {
              const isActive = activeViewId === table.id;

              if (isCollapsed) {
                return (
                  <div
                    key={table.id}
                    className={`collapsed-group-icon ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectSystemTable(table.id, table.name)}
                    title={table.label}
                  >
                    <Database size={18} style={{ color: 'var(--success-color)' }} />
                  </div>
                );
              }

              return (
                <button
                  key={table.id}
                  className={`function-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectSystemTable(table.id, table.name)}
                  style={{ color: isActive ? 'var(--primary-hover)' : 'var(--text-muted)' }}
                >
                  <Database size={14} style={{ color: 'var(--success-color)' }} />
                  <span>{table.label}</span>
                  <Eye size={11} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* 5. PHẦN BỘ LỌC CHÂN TRANG SIDEBAR (FILTER BY GROUP) */}
      {!isCollapsed && (
        <div className="sidebar-filter-by-group">
          <div className="filter-header">
            <span>FILTER</span>
          </div>

          <button
            className={`filter-group-item ${activeFilterID === null ? 'active' : ''}`}
            onClick={() => onSelectFilter(null)}
          >
            <span>ALL Functions</span>
            <span className="filter-badge badge-all">{getFilterCount(null)}</span>
          </button>

          {activeFilters.map(filter => {
            const count = getFilterCount(filter.menuFilterID);
            let badgeClass = 'badge-work';
            if (filter.menuFilterID === 1) badgeClass = 'badge-work';
            else if (filter.menuFilterID === 2) badgeClass = 'badge-report';
            else if (filter.menuFilterID === 4) badgeClass = 'badge-setting';
            else {
              const colors = ['badge-work', 'badge-report', 'badge-setting', 'badge-all'];
              badgeClass = colors[filter.menuFilterID % colors.length];
            }

            return (
              <button
                key={filter.menuFilterID}
                className={`filter-group-item ${activeFilterID === filter.menuFilterID ? 'active' : ''}`}
                onClick={() => onSelectFilter(filter.menuFilterID)}
              >
                <span>{filter.menuFilterName}</span>
                <span className={`filter-badge ${badgeClass}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 6. NÚT COLLAPSE / EXPAND SIDEBAR Ở DƯỚI CÙNG */}
      <button className="sidebar-collapse-btn" onClick={onToggleCollapse}>
        <ChevronLeft size={16} className={`chevron-transition ${isCollapsed ? 'rotate-180' : ''}`} />
        {!isCollapsed && <span>Collapse Sidebar</span>}
      </button>

    </aside>
  );
}
