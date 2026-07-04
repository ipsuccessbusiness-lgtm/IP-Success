import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import LabelActions from '@/components/admin/LabelActions';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('order_number').eq('id', id).single();
  return { title: order ? `Shipping Label – ${order.order_number}` : 'Shipping Label' };
}

export default async function ShippingLabelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, product:products(name)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm">
      <style>{`
        .label { border: 3px solid #000; padding: 20px; max-width: 400px; font-family: Arial, sans-serif; background: #fff; color: #000; }
        .header { border-bottom: 2px solid #000; pb-4 mb-4; display: flex; justify-content: space-between; align-items: center; }
        .brand { font-size: 24px; font-weight: bold; }
        .section { margin-top: 16px; }
        .section h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 6px; }
        .section p { font-size: 15px; line-height: 1.5; font-weight: 500; }
        .from { border-top: 1px dashed #ccc; padding-top: 12px; margin-top: 12px; font-size: 12px; color: #666; }
        .order-num { font-size: 13px; font-weight: bold; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; }
        .cod-badge { background: #000; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; margin: 0; padding: 0; }
        }
      `}</style>
      <LabelActions />
      <div className="label print-section">
          <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '12px' }}>
            <div>
              <div className="brand" style={{ fontSize: '22px', fontWeight: 'bold' }}>IP Success</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Ayurvedic Piles Care</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="order-num" style={{ fontSize: '12px', fontWeight: 'bold', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{order.order_number}</div>
              {order.payment_method === 'cod' && (
                <div className="cod-badge" style={{ marginTop: '4px', background: '#dc2626', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' }}>
                  COD – {formatPrice(order.total_amount)}
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h2 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: '6px' }}>DELIVER TO</h2>
            <p style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.6' }}>
              {order.customer_name}<br />
              {order.customer_address.line1}<br />
              {order.customer_address.line2 && <>{order.customer_address.line2}<br /></>}
              {order.customer_address.city}, {order.customer_address.state}<br />
              PIN: {order.customer_address.pincode}
            </p>
            <p style={{ marginTop: '8px', fontSize: '15px', fontWeight: 'bold' }}>
              📱 +91 {order.customer_phone}
            </p>
          </div>

          {order.tracking_id && (
            <div className="section" style={{ marginTop: '12px' }}>
              <h2 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>TRACKING</h2>
              <p style={{ fontWeight: 'bold' }}>{order.courier_name} · {order.tracking_id}</p>
            </div>
          )}

          <div className="from" style={{ borderTop: '1px dashed #ccc', paddingTop: '12px', marginTop: '12px', fontSize: '12px', color: '#555' }}>
            <strong>FROM:</strong> IP Success Ayurvedic Healthcare<br />
            Ahmedabad, Gujarat – 380001 · +91 99250 50013
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: '#888', borderTop: '1px solid #eee', paddingTop: '8px' }}>
            Product: {order.product?.name}
          </div>
      </div>
    </div>
  );
}
