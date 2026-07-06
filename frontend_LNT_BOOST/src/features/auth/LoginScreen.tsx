import { useState } from 'react';
import './LoginScreen.css';
import {
  Lock,
  User as UserIcon,
  Globe,
  ShieldCheck,
  ShoppingCart,
  Factory,
  BarChart3,
  Users,
  Home,
  Eye,
  EyeOff,
  RefreshCw,
  X
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSubmit: (username: string, password: string) => Promise<void>;
  loginLoading: boolean;
  loginError: string | null;
}

export default function LoginScreen({ onLoginSubmit, loginLoading, loginError }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSubmit(username, password);
  };

  return (
    <div className="login-split-container">
      {/* CỘT TRÁI - QUẢNG BÁ THƯƠNG HIỆU & MODULES */}
      <div className="login-brand-side">
        <div className="brand-overlay"></div>

        {/* LOGO */}
        <div className="brand-logo-container">
          <img src="/lntlogo.png" alt="LNTBOOST Logo" className="brand-logo-img" />
          <div className="brand-logo-text">
            <h2>LNT<span style={{ color: '#0ea5e9' }}>BOOST</span></h2>
            <span>BUSINESS SUITE</span>
          </div>
        </div>

        {/* HEADINGS */}
        <div className="brand-content-middle">
          <h1>
            One Platform.<br />
            <span className="text-glow-blue">Infinite Possibilities.</span>
          </h1>
          <p className="brand-subtitle">
            Integrated. Intelligent. Innovative.<br />
            Empowering your business, every day.
          </p>
        </div>

        {/* CÁC CHỨC NĂNG MODULES CUNG CẤP */}
        <div className="brand-modules-grid">
          <div className="brand-module-item">
            <div className="module-icon-circle">
              <ShoppingCart size={20} />
            </div>
            <h4>SCM</h4>
            <span>Supply Chain<br />Management</span>
          </div>

          <div className="brand-module-item">
            <div className="module-icon-circle">
              <Factory size={20} />
            </div>
            <h4>MANUFACTURING</h4>
            <span>Production<br />Excellence</span>
          </div>

          <div className="brand-module-item">
            <div className="module-icon-circle">
              <BarChart3 size={20} />
            </div>
            <h4>FINANCE</h4>
            <span>Financial<br />Control</span>
          </div>

          <div className="brand-module-item">
            <div className="module-icon-circle">
              <Users size={20} />
            </div>
            <h4>HR</h4>
            <span>Workforce<br />Management</span>
          </div>

          <div className="brand-module-item">
            <div className="module-icon-circle">
              <Home size={20} />
            </div>
            <h4>WMS</h4>
            <span>Warehouse<br />Management</span>
          </div>
        </div>

        {/* FOOTER BÊN TRÁI */}
        <div className="brand-footer">
          © 2026 LNTBOOST. All rights reserved.
        </div>
      </div>

      {/* CỘT PHẢI - FORM ĐĂNG NHẬP */}
      <div className="login-form-side">
        <div className="login-form-panel">

          {/* LỰA CHỌN NGÔN NGỮ */}
          <div className="lang-picker-container">
            <div className="lang-picker">
              <Globe size={16} />
              <span>English</span>
              <ChevronDownIcon />
            </div>
          </div>

          {/* TIÊU ĐỀ CHÀO MỪNG */}
          <div className="form-welcome-header">
            <h1>Welcome Back!</h1>
            <p>Sign in to access your LNTBOOST account</p>
          </div>

          {/* BÁO LỖI (NẾU CÓ) */}
          {loginError && (
            <div className="login-error-alert fade-in">
              <X size={16} className="error-close-icon" />
              <span>{loginError}</span>
            </div>
          )}

          {/* FORM ĐĂNG NHẬP THỰC TẾ */}
          <form onSubmit={handleSubmit} className="form-actual">
            <div className="form-group-field">
              <label>Username</label>
              <div className="input-field-wrapper">
                <UserIcon className="field-prefix-icon" size={18} />
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-field" style={{ marginTop: '20px' }}>
              <label>Password</label>
              <div className="input-field-wrapper">
                <Lock className="field-prefix-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* REMEMBER & FORGOT */}
            <div className="form-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-pw-link">Forgot Password?</a>
            </div>

            {/* NÚT SIGN IN */}
            <button type="submit" className="signin-submit-btn" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* KHUNG TRỐNG Ở DƯỚI (NHƯ TRONG HÌNH MINH HỌA) */}
          {/**
          <div className="login-graphic-box">
            <p>💡 Login with admin account:</p>
            <code>User: administrator | Pass: lasantha@admin</code>
          </div>
           */}

          {/* CHỮ KÝ DƯỚI FORM */}
          <div className="form-footer-signature">
            <ShieldCheck size={16} />
            <span>Secure login powered by <strong>LNTBOOST</strong></span>
          </div>

        </div>
      </div>
    </div>
  );
}

// Icon nhỏ cho dropdown ngôn ngữ
function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px', opacity: 0.8 }}>
      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
