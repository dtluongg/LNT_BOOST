import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Đang tải dữ liệu...' }: LoadingSpinnerProps) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '60px 0', 
      gap: '12px' 
    }}>
      <RefreshCw className="animate-spin" size={28} style={{ color: 'var(--primary-color)' }} />
      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{message}</span>
    </div>
  );
}
