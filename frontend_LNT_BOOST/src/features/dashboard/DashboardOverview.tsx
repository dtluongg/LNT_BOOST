import { Building2, Layers, Users, Check } from 'lucide-react';
import type { User, SiteDto, ModuleDto } from '../../types';

interface DashboardOverviewProps {
  currentUser: User | null;
  authorizedSites: SiteDto[];
  siteModules: ModuleDto[];
  activeSiteName: string;
}

export default function DashboardOverview({
  currentUser,
  authorizedSites,
  siteModules,
  activeSiteName
}: DashboardOverviewProps) {
  return (
    <div className="fade-in">
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary-color)' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Site Cấu Hình</h3>
            <p>{authorizedSites.length} Chi nhánh</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)' }}>
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h3>Phân Hệ Được Duyệt</h3>
            <p>{siteModules.length} Modules</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-color)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Người dùng đăng nhập</h3>
            <p>{currentUser?.username} ({currentUser?.isAdmin ? 'Quản trị viên' : 'Nhân viên'})</p>
          </div>
        </div>
      </div>

      <div className="data-card">
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} style={{ color: 'var(--success-color)' }} />
          Trạng thái tích hợp Backend REST API & SQL Server
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
          Hệ thống đã thiết lập đường truyền live-data thông qua tệp cấu hình proxy Vite. Bạn có thể nhấp chuột vào các bảng trong danh mục <strong>"Dữ Liệu Hệ Thống (Live DB)"</strong> ở phía dưới sidebar bên trái để thực hiện gọi trực tiếp API và hiển thị cấu trúc thực của bảng dữ liệu đang hoạt động trên hệ quản trị cơ sở dữ liệu SQL Server.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '10px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
            <h4 style={{ fontSize: '13px', color: 'black', marginBottom: '6px' }}>Thông tin tài khoản đang kết nối</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Tên tài khoản: <code style={{ color: 'black' }}>{currentUser?.username}</code></div>
              <div>Họ và tên: <code style={{ color: 'black' }}>{currentUser?.fullName || 'Chưa thiết lập'}</code></div>
              <div>Quyền hạn: <code style={{ color: 'black' }}>{currentUser?.isAdmin ? 'Admin (tblMastUser.Admin = true)' : 'User'}</code></div>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
            <h4 style={{ fontSize: '13px', color: 'black', marginBottom: '6px' }}>Thông tin Site làm việc hiện tại</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Site đang chọn: <code style={{ color: 'black' }}>{activeSiteName}</code></div>
              <div>Site ID: <code style={{ color: 'black' }}>{currentUser?.defaultCompanyID || 'Mặc định'}</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
