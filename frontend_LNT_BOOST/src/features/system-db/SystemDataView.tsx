import { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import type { 
  CompanyInfo, 
  SiteInfo, 
  MastUserInfo, 
  ModuleMasterInfo, 
  MenuGroupInfo, 
  MenuFunctionInfo, 
  MenuFilterInfo,
  User 
} from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SystemDataViewProps {
  tableId: string;
  tableName: string;
  currentUser: User | null;
}

export default function SystemDataView({ tableId, tableName, currentUser }: SystemDataViewProps) {
  const [liveData, setLiveData] = useState<any[]>([]);
  const [liveDataLoading, setLiveDataLoading] = useState(false);
  const [liveDataError, setLiveDataError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLiveDataLoading(true);
    setLiveDataError(null);
    setLiveData([]);

    try {
      let data: any[] = [];
      switch (tableId) {
        case 'sys_company':
          data = await apiService.getCompanies();
          break;
        case 'sys_site':
          data = await apiService.getSites();
          break;
        case 'sys_user':
          data = await apiService.getUsers();
          break;
        case 'sys_module':
          data = await apiService.getModules();
          break;
        case 'sys_menu_group':
          data = await apiService.getMenuGroups();
          break;
        case 'sys_menu_func':
          data = await apiService.getMenuFunctions();
          break;
        case 'sys_menu_filter':
          data = await apiService.getMenuFilters();
          break;
      }
      setLiveData(data);
    } catch (err: any) {
      setLiveDataError(err.message || 'Không thể tải dữ liệu.');
    } finally {
      setLiveDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableId]);

  return (
    <div className="fade-in">
      {/* THANH TÌM KIẾM & REFRESH */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-dark)' }} />
          <input 
            type="text" 
            placeholder={`Tìm kiếm trong bảng ${tableName}...`} 
            className="input-field"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={loadData}
          disabled={liveDataLoading}
        >
          <RefreshCw size={14} className={liveDataLoading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {liveDataLoading ? (
        <LoadingSpinner message="Đang kết nối SQL Server và lấy dữ liệu..." />
      ) : liveDataError ? (
        <div style={{ padding: '30px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#fca5a5', fontSize: '14px' }}>
          ❌ Lỗi tải dữ liệu: {liveDataError}
        </div>
      ) : liveData.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
          Không có bản ghi nào trong bảng này.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              {tableId === 'sys_company' && (
                <tr>
                  <th>Company ID</th>
                  <th>Mã Công Ty</th>
                  <th>Tên Công Ty</th>
                  <th>Địa Chỉ</th>
                  <th>Mã Số Thuế</th>
                  <th>Trạng Thái</th>
                </tr>
              )}
              {tableId === 'sys_site' && (
                <tr>
                  <th>Site ID</th>
                  <th>Company ID</th>
                  <th>Mã Chi Nhánh</th>
                  <th>Tên Chi Nhánh</th>
                  <th>Địa Chỉ</th>
                  <th>Active</th>
                </tr>
              )}
              {tableId === 'sys_user' && (
                <tr>
                  <th>Username</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Cấp Phép</th>
                  <th>Quyền Admin</th>
                  {currentUser?.isAdmin && <th>Thao tác</th>}
                </tr>
              )}
              {tableId === 'sys_module' && (
                <tr>
                  <th>Module ID</th>
                  <th>Tên Phân Hệ</th>
                  <th>Trạng Thái</th>
                </tr>
              )}
              {tableId === 'sys_menu_group' && (
                <tr>
                  <th>Module Master ID</th>
                  <th>Group ID</th>
                  <th>Tên Nhóm Menu</th>
                  <th>Trạng Thái</th>
                </tr>
              )}
              {tableId === 'sys_menu_func' && (
                <tr>
                  <th>Module ID</th>
                  <th>Group ID</th>
                  <th>Function ID</th>
                  <th>Tên Chức Năng</th>
                  <th>Filter ID</th>
                  <th>Trạng Thái</th>
                </tr>
              )}
              {tableId === 'sys_menu_filter' && (
                <tr>
                  <th>Filter ID</th>
                  <th>Tên Bộ Lọc</th>
                  <th>Trạng Thái</th>
                </tr>
              )}
            </thead>
            <tbody>
              {liveData
                .filter(item => {
                  if (!searchTerm) return true;
                  const serialized = JSON.stringify(item).toLowerCase();
                  return serialized.includes(searchTerm.toLowerCase());
                })
                .map((item, idx) => (
                  <tr key={idx}>
                    {tableId === 'sys_company' && (
                      <>
                        <td><strong>{(item as CompanyInfo).companyID}</strong></td>
                        <td>{(item as CompanyInfo).companyCode || '-'}</td>
                        <td>{(item as CompanyInfo).companyName || '-'}</td>
                        <td>{(item as CompanyInfo).addressLine1 || '-'}</td>
                        <td>{(item as CompanyInfo).taxCode || '-'}</td>
                        <td>
                          <span className={`badge ${(item as CompanyInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as CompanyInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {tableId === 'sys_site' && (
                      <>
                        <td><strong>{(item as SiteInfo).companySiteID}</strong></td>
                        <td>{(item as SiteInfo).companyID}</td>
                        <td>{(item as SiteInfo).siteCode}</td>
                        <td>{(item as SiteInfo).siteName}</td>
                        <td>{(item as SiteInfo).addressLine1}</td>
                        <td>
                          <span className={`badge ${(item as SiteInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as SiteInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {tableId === 'sys_user' && (
                      <>
                        <td><strong>{(item as MastUserInfo).username}</strong></td>
                        <td>{(item as MastUserInfo).fullName || '-'}</td>
                        <td>{(item as MastUserInfo).email || '-'}</td>
                        <td>{(item as MastUserInfo).phone || '-'}</td>
                        <td>
                          <span className={`badge ${(item as MastUserInfo).authorized ? 'badge-success' : 'badge-error'}`}>
                            {(item as MastUserInfo).authorized ? 'Được cấp' : 'Khóa'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${(item as MastUserInfo).admin ? 'badge-info' : 'badge-error'}`}>
                            {(item as MastUserInfo).admin ? 'Admin' : 'Nhân viên'}
                          </span>
                        </td>
                        {currentUser?.isAdmin && (
                          <td>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={async () => {
                                const newPw = prompt(`Nhập mật khẩu mới cho tài khoản "${(item as MastUserInfo).username}":`);
                                if (!newPw) return;
                                try {
                                  const res = await apiService.resetPassword((item as MastUserInfo).username, newPw);
                                  alert(res.message);
                                } catch (err: any) {
                                  alert(`Lỗi: ${err.message}`);
                                }
                              }}
                            >
                              Reset Pass
                            </button>
                          </td>
                        )}
                      </>
                    )}
                    {tableId === 'sys_module' && (
                      <>
                        <td><strong>{(item as ModuleMasterInfo).moduleMasterID}</strong></td>
                        <td>{(item as ModuleMasterInfo).moduleMasterName}</td>
                        <td>
                          <span className={`badge ${(item as ModuleMasterInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as ModuleMasterInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {tableId === 'sys_menu_group' && (
                      <>
                        <td>{(item as MenuGroupInfo).moduleMasterID}</td>
                        <td>{(item as MenuGroupInfo).menuGroupID}</td>
                        <td>{(item as MenuGroupInfo).menuGroupName}</td>
                        <td>
                          <span className={`badge ${(item as MenuGroupInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as MenuGroupInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {tableId === 'sys_menu_func' && (
                      <>
                        <td>{(item as MenuFunctionInfo).moduleMasterID}</td>
                        <td>{(item as MenuFunctionInfo).menuGroupID}</td>
                        <td>{(item as MenuFunctionInfo).menuFunctionID}</td>
                        <td>{(item as MenuFunctionInfo).menuFunctionName}</td>
                        <td>{(item as MenuFunctionInfo).menuFilterID}</td>
                        <td>
                          <span className={`badge ${(item as MenuFunctionInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as MenuFunctionInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                    {tableId === 'sys_menu_filter' && (
                      <>
                        <td>{(item as MenuFilterInfo).menuFilterID}</td>
                        <td>{(item as MenuFilterInfo).menuFilterName}</td>
                        <td>
                          <span className={`badge ${(item as MenuFilterInfo).activeFlag ? 'badge-success' : 'badge-error'}`}>
                            {(item as MenuFilterInfo).activeFlag ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
