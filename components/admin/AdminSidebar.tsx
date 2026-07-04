'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, ShoppingCart, Zap, Package, BarChart3,
  FileText, Star, Settings, LogOut, Menu, X, ChevronLeft, CreditCard
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/quick-order', label: 'Quick Order', icon: Zap },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/content', label: 'Content CMS', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('p-4 border-b border-outline-variant flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">IP</span>
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-primary-700 text-sm">IP Success</div>
            <div className="text-[10px] text-on-surface-variant">Admin Panel</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-xl transition-all duration-200 group',
                collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
                active
                  ? 'bg-primary-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4.5 h-4.5')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-outline-variant space-y-1">
        {!collapsed && (
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <span className="text-xs">↗</span> View Site
          </a>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center rounded-xl transition-all w-full text-red-600 hover:bg-red-50',
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-outline-variant transition-all duration-300 relative flex-shrink-0',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <SidebarContent />
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-white border border-outline-variant rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          <ChevronLeft className={cn('w-3 h-3 text-gray-500 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-outline-variant rounded-xl p-2 shadow-md"
      >
        <Menu className="w-5 h-5 text-primary-700" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
