import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between flex-shrink-0 lg:pl-6 pl-16">
          <div className="text-sm text-on-surface-variant">
            Welcome back, <span className="font-semibold text-primary-700">{user?.email || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-on-surface-variant bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
              🌿 IP Success Admin
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
