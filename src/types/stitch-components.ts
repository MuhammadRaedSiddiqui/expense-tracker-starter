// TypeScript interfaces for Stitch-based components

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export interface StatusBadgeProps {
  status: 'success' | 'pending' | 'failed' | 'warning';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  title?: string;
  actions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export interface SidebarProps {
  navigationItems: NavigationItemProps[];
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
}

export interface HeaderProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onUserClick?: () => void;
  className?: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  type: 'income' | 'expense';
}

export interface MetricData {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
}
