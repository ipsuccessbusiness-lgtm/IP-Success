import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/resend';

const PACK_PRODUCT_SLUGS: Record<string, string> = {
  'starter': 'starter-pack',
  'best-value': 'best-value-pack',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, phone, email, line1, line2, city, state, pincode,
      packSlug, payment_method, amount,
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
    } = body;

    const supabase = await createAdminClient();

    // Verify Razorpay signature if online payment
    if (payment_method === 'razorpay') {
      const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Get product
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .ilike('name', packSlug === 'starter' ? '%Starter%' : '%Best Value%')
      .single();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check and deduct inventory
    const { data: inventory } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', product.id)
      .single();

    if (inventory && inventory.quantity < 1) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        customer_address: { line1, line2, city, state, pincode },
        product_id: product.id,
        quantity: 1,
        unit_price: amount,
        total_amount: amount,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'paid',
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        order_status: payment_method === 'cod' ? 'new' : 'confirmed',
        language: 'en',
        source: 'website',
      })
      .select()
      .single();

    if (error) throw error;

    // Deduct inventory
    if (inventory) {
      await supabase
        .from('inventory')
        .update({ quantity: inventory.quantity - 1 })
        .eq('product_id', product.id);
    }

    // Send confirmation email if email provided
    if (email) {
      try {
        await sendOrderConfirmationEmail(order, product);
      } catch (emailError) {
        console.error('Email failed:', emailError);
        // Don't fail order if email fails
      }
    }

    return NextResponse.json({ order_number: order.order_number, id: order.id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let query = supabase
    .from('orders')
    .select('*, product:products(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) query = query.eq('order_status', status);
  if (search) query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.ilike.%${search}%`);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data, total: count, page, limit });
}
