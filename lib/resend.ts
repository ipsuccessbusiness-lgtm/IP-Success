import { Resend } from 'resend';
import { Order, Product } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/utils';

// Resend initialization is done lazily inside the function to prevent build-time errors
export async function sendOrderConfirmationEmail(order: Order, product: Product) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email send.');
    return null;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'orders@ipsuccess.in',
    to: order.customer_email!,
    subject: `✅ Order Confirmed – ${order.order_number} | IP Success`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: #166534; color: white; padding: 32px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 8px 0 0; opacity: 0.85; }
          .body { padding: 32px; }
          .order-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5f3ea; }
          .row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; color: #166534; }
          .label { color: #64748b; }
          .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
          .whatsapp-btn { display: block; background: #25D366; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 13px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 IP Success</h1>
            <p>Your order is confirmed! Relief is on its way.</p>
          </div>
          <div class="body">
            <p>Dear <strong>${order.customer_name}</strong>,</p>
            <p>Thank you for choosing IP Success! Your order has been received and is being processed.</p>
            
            <div class="order-box">
              <div class="row">
                <span class="label">Order Number</span>
                <strong>${order.order_number}</strong>
              </div>
              <div class="row">
                <span class="label">Product</span>
                <span>${product.name}</span>
              </div>
              <div class="row">
                <span class="label">Payment Method</span>
                <span class="badge">${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Paid'}</span>
              </div>
              <div class="row">
                <span class="label">Order Date</span>
                <span>${formatDateTime(order.created_at)}</span>
              </div>
              <div class="row">
                <span class="label">Total Amount</span>
                <span>${formatPrice(order.total_amount)}</span>
              </div>
            </div>

            <h3>🏠 Delivery Address</h3>
            <p>
              ${order.customer_address.line1}<br>
              ${order.customer_address.line2 ? order.customer_address.line2 + '<br>' : ''}
              ${order.customer_address.city}, ${order.customer_address.state} – ${order.customer_address.pincode}
            </p>

            <p>Expected delivery: <strong>3-5 business days</strong></p>
            
            <a class="whatsapp-btn" href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I need help with my order ${order.order_number}">
              📱 Chat on WhatsApp for Support
            </a>
            
            <p style="color:#64748b; font-size:14px;">
              For any queries, please contact us at +91 99250 50013 or reply to this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 IP Success Ayurvedic Healthcare · Ahmedabad, Gujarat</p>
            <p>Results may vary from person to person.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Email send error:', error);
    throw error;
  }

  return data;
}
