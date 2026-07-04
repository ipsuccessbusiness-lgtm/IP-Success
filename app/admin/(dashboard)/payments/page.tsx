import { createClient } from '@/lib/supabase/server';
import PaymentsTable from '@/components/admin/PaymentsTable';
import { CreditCard, IndianRupee } from 'lucide-react';

export default async function PaymentsPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, payment_method, payment_status, total_amount, razorpay_payment_id, created_at')
    .order('created_at', { ascending: false });

  // Compute stats
  const totalCollected = (orders || [])
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total_amount, 0);
  
  const pendingCod = (orders || [])
    .filter(o => o.payment_method === 'cod' && o.payment_status === 'pending')
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-700" />
            Payments Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all transactions (Razorpay & COD)</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-green-50 px-5 py-3 rounded-2xl border border-green-200">
            <p className="text-xs font-bold uppercase text-green-700 mb-1">Total Collected</p>
            <p className="text-xl font-bold text-green-900 flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {(totalCollected / 100).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-orange-50 px-5 py-3 rounded-2xl border border-orange-200">
            <p className="text-xs font-bold uppercase text-orange-700 mb-1">Pending COD</p>
            <p className="text-xl font-bold text-orange-900 flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {(pendingCod / 100).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
      
      <PaymentsTable initialOrders={orders || []} />
    </div>
  );
}
