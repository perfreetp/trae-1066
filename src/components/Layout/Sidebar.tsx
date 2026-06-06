import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  CheckSquare,
  FileText,
  AlertTriangle,
  ClipboardList,
  Edit3,
  Send,
  Settings,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/dashboard', label: '首页仪表盘', icon: LayoutDashboard },
  { path: '/import', label: '资料导入', icon: FileUp },
  { path: '/verify', label: '数据核对', icon: CheckSquare },
  { path: '/summary', label: '重点摘要', icon: FileText },
  { path: '/warnings', label: '预警清单', icon: AlertTriangle },
  { path: '/disposal', label: '处置跟踪', icon: ClipboardList },
  { path: '/editor', label: '日报编辑', icon: Edit3 },
  { path: '/archive', label: '分发归档', icon: Send },
  { path: '/settings', label: '系统设置', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-primary-600 to-primary-800 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Waves className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white">防汛值班</h1>
              <p className="text-xs text-white/60">日报自动化工具</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                      collapsed && 'justify-center px-2'
                    )
                  }
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs text-white/60">当前值班</p>
            <p className="mt-1 text-sm font-medium text-white">张三</p>
            <p className="text-xs text-white/60">值班员</p>
          </div>
        </div>
      )}
    </aside>
  );
}
