import React from 'react';
import './MenuPortalModal.css';
import { X, Layers, FolderTree, Activity, Calendar, Settings, Compass, ChevronRight } from 'lucide-react';
import type { MenuGroupInfo, MenuFunctionInfo, MenuFilterInfo } from '../types';

interface MenuPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModuleName: string;
  selectedModuleID: string | null;
  allMenuFilters: MenuFilterInfo[];
  allMenuGroups: MenuGroupInfo[];
  allMenuFunctions: MenuFunctionInfo[];
  onSelectMenuGroup: (groupId: number, filterId: number) => void;
  onSelectFunction: (func: MenuFunctionInfo) => void;
}

export default function MenuPortalModal({
  isOpen,
  onClose,
  activeModuleName,
  selectedModuleID,
  allMenuFilters,
  allMenuGroups,
  allMenuFunctions,
  onSelectMenuGroup,
  onSelectFunction
}: MenuPortalModalProps) {

  if (!isOpen) return null;

  const matchModuleID = (id1: string | null, id2: string | null) => {
    if (!id1 || !id2) return false;
    const norm = (s: string) => s.trim().toUpperCase().replace(/MD00/g, 'MD0');
    return norm(id1) === norm(id2);
  };

  // Find all groups & functions in this module
  const moduleGroups = allMenuGroups.filter(g => matchModuleID(g.moduleMasterID, selectedModuleID));
  const activeModuleFunctions = allMenuFunctions.filter(f => matchModuleID(f.moduleMasterID, selectedModuleID));

  // Find all unique filters referenced by functions in this module
  const referencedFilterIDs = Array.from(new Set(activeModuleFunctions.map(f => f.menuFilterID)));
  const relevantFilters = allMenuFilters.filter(filter => 
    referencedFilterIDs.includes(filter.menuFilterID)
  );

  const getFilterIcon = (filterID: number, name: string) => {
    const normName = name.toLowerCase();
    if (normName.includes('nghiệp vụ') || normName.includes('work') || filterID === 1) {
      return <Activity size={13} />;
    }
    if (normName.includes('báo cáo') || normName.includes('report') || filterID === 2) {
      return <Calendar size={13} />;
    }
    if (normName.includes('hệ thống') || normName.includes('thiết lập') || normName.includes('setting') || filterID === 4) {
      return <Settings size={13} />;
    }
    return <Compass size={13} />;
  };

  return (
    <div className="menu-portal-overlay" onClick={onClose}>
      <div className="menu-portal-container" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="menu-portal-header">
          <div className="menu-portal-title-block">
            <Layers size={22} className="module-title-icon" />
            <div>
              <h2>Sơ đồ Chức năng</h2>
              <span className="subtitle">Phân hệ: <strong>{activeModuleName}</strong> ({selectedModuleID})</span>
            </div>
          </div>
          <button className="menu-portal-close-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* HORIZONTAL MAP BODY */}
        <div className="menu-portal-body-scroll">
          <div className="menu-portal-horizontal-layout">
            
            {moduleGroups.length === 0 ? (
              <div className="portal-empty-state">
                <FolderTree size={36} />
                <p>Không có nhóm menu nào trong phân hệ này</p>
              </div>
            ) : (
              moduleGroups.map(group => {
                // Get all functions in this group
                const groupFunctions = activeModuleFunctions.filter(f => f.menuGroupID === group.menuGroupID);

                return (
                  <div key={group.menuGroupID} className="portal-group-column">
                    
                    {/* Column Group Header */}
                    <div 
                      className="group-column-header clickable-header"
                      onClick={() => {
                        onSelectMenuGroup(group.menuGroupID, null as any);
                        onClose();
                      }}
                      title="Click để tiêu điểm nhóm này ở Sidebar"
                    >
                      <FolderTree size={16} className="group-header-icon" />
                      <h4>{group.menuGroupName}</h4>
                    </div>

                    {/* Column Group Body: List of Functions grouped by Filter */}
                    <div className="group-column-body">
                      {relevantFilters.map(filter => {
                        const filterFuncs = groupFunctions.filter(f => f.menuFilterID === filter.menuFilterID);
                        if (filterFuncs.length === 0) return null;

                        return (
                          <div key={filter.menuFilterID} className="category-section">
                            <div className="category-subheader">
                              {getFilterIcon(filter.menuFilterID, filter.menuFilterName)}
                              <span>{filter.menuFilterName}</span>
                            </div>
                            
                            <div className="category-funcs-list">
                              {filterFuncs.map(func => (
                                <button
                                  key={func.menuFunctionID}
                                  type="button"
                                  className="portal-function-link"
                                  onClick={() => onSelectFunction(func)}
                                >
                                  <ChevronRight size={12} className="link-arrow" />
                                  <span>{func.menuFunctionName}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {groupFunctions.length === 0 && (
                        <div className="empty-group-text">Không có chức năng</div>
                      )}
                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
