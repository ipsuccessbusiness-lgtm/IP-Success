import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = await createAdminClient();

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Update order payment status
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_payment_id: paymentId,
        order_status: 'confirmed',
      })
      .eq('razorpay_order_id', orderId);
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('razorpay_order_id', orderId);
  }

  return NextResponse.json({ received: true });
}
