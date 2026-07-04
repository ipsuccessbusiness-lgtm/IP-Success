import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatPrice, formatDateTime, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils';
import OrderDetailActions from '@/components/admin/OrderDetailActions';
import PrintButton from '@/components/admin/PrintButton';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, MapPin, Package, CreditCard, Hash, Truck, AlertCircle, ShoppingBag, Receipt } from 'lucide-react';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <Link href="/admin/orders" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">{order.order_number}</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                {order.source}
              </span>
            </div>
            <p className="text-primary-100 text-sm font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-300" />
              Placed on {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm backdrop-blur-md border border-white/20 ${
            order.order_status === 'delivered' ? 'bg-green-500/20 text-green-50' :
            order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-50' :
            'bg-white text-primary-900'
          }`}>
            {ORDER_STATUS_LABELS[order.order_status]}
          </span>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm backdrop-blur-md border border-white/20 ${
            order.payment_status === 'paid' ? 'bg-green-500/20 text-green-50' : 'bg-orange-500/20 text-orange-50'
          }`}>
            Payment: <span className="uppercase">{order.payment_status}</span>
          </span>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="flex gap-3 flex-wrap">
        <PrintButton
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm group"
          id="btn-print-invoice"
        >
          <Receipt className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          Print Invoice
        </PrintButton>
        <a
          href={`/admin/orders/${order.id}/shipping-label`}
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-xl text-sm font-bold hover:bg-primary-100 transition-all shadow-sm group"
        >
          <Package className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
          Shipping Label
        </a>
        <a
          href={`https://wa.me/91${order.customer_phone}?text=Hi ${order.customer_name}, your IP Success order ${order.order_number} has been dispatched!`}
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-bold hover:bg-[#1da851] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.39.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.822-4.739 10.562-10.564 10.562z"/></svg>
          WhatsApp Customer
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Info) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Card */}
          <div className="bg-white rounded-3xl p-1 overflow-hidden border border-outline-variant shadow-sm">
            <div className="bg-surface-container/30 rounded-[22px] p-6 sm:p-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <User className="w-4 h-4" />
                </div>
                Customer Details
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</p>
                    <p className="font-semibold text-gray-900 text-lg">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</p>
                    <a href={`tel:+91${order.customer_phone}`} className="font-semibold text-primary-700 hover:underline text-lg">
                      +91 {order.customer_phone}
                    </a>
                  </div>
                  {order.customer_email && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</p>
                      <p className="font-semibold text-gray-900">{order.customer_email}</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent hidden sm:block" />
                  <div className="sm:pl-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Delivery Address</p>
                    <div className="bg-white rounded-2xl p-4 border border-outline-variant/60 shadow-sm leading-relaxed text-sm font-medium text-gray-700">
                      {order.customer_address.line1}
                      {order.customer_address.line2 && <><br />{order.customer_address.line2}</>}
                      <br />
                      {order.customer_address.city}, {order.customer_address.state}
                      <br />
                      <span className="inline-block mt-2 font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                        PIN: {order.customer_address.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-3xl p-1 overflow-hidden border border-outline-variant shadow-sm">
            <div className="bg-surface-container/30 rounded-[22px] p-6 sm:p-8">
              <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                Order Summary
              </h2>
              
              <div className="bg-white rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100 flex-shrink-0">
                    <Package className="w-8 h-8 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{order.product?.name || 'Unknown Product'}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">Quantity: <span className="font-bold text-gray-700">{order.quantity}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-700 text-xl">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50/50 border-t border-outline-variant/60 p-4 sm:p-5 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment Method</p>
                      <p className="font-bold text-gray-900 capitalize text-sm">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</p>
                    </div>
                  </div>
                  {order.razorpay_payment_id && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center">
                        <Hash className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Transaction ID</p>
                        <p className="font-mono font-bold text-gray-900 text-xs mt-0.5">{order.razorpay_payment_id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {order.notes && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-1 border border-yellow-200/60 shadow-sm">
              <div className="bg-white/40 backdrop-blur-sm rounded-[22px] p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-yellow-900 mb-1 uppercase tracking-wider">Admin Notes</h3>
                  <p className="text-yellow-800 font-medium leading-relaxed">{order.notes}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Actions/Updates) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <OrderDetailActions order={order} />
          </div>
        </div>

      </div>
    </div>
  );
}
