import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, packSlug } = await request.json();

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount, // already in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { packSlug },
    });

    return NextResponse.json({
      orderId: order.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
