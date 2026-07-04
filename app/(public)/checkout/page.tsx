'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { INDIAN_STATES } from '@/lib/utils';
import type { CheckoutFormData } from '@/types';

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void };
  }
}

const PACKS = {
  starter: {
    name: 'Starter Pack',
    subtitle: 'For Initial Stage Relief',
    price: 247500,
    displayPrice: '₹2,475',
    items: ['1x Pilescare Syrup (500ml)', '1x DOUBLE-STEM Cell Powder (100g)'],
  },
  'best-value': {
    name: 'Best Value Pack',
    subtitle: 'For Chronic Cases & Bleeding',
    price: 372500,
    displayPrice: '₹3,725',
    originalPrice: '₹4,950',
    items: ['2x Pilescare Syrup (500ml)', '1x DOUBLE-STEM Cell Powder (100g)'],
  },
} as const;

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  line1: z.string().min(5, 'Enter your full address'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(2, 'Select your state'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  payment_method: z.enum(['razorpay', 'cod']),
});

function CheckoutForm() {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const packSlug = (searchParams.get('pack') || 'best-value') as keyof typeof PACKS;
  const pack = PACKS[packSlug] || PACKS['best-value'];

  const [codEnabled, setCodEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { payment_method: 'cod' },
  });

  const paymentMethod = watch('payment_method');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch settings for COD toggle
    fetch('/api/settings/cod')
      .then(r => r.json())
      .then(d => setCodEnabled(d.enabled))
      .catch(() => setCodEnabled(true));

    return () => { document.body.removeChild(script); };
  }, []);

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    try {
      if (data.payment_method === 'razorpay') {
        // Create Razorpay order
        const rzpRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: pack.price, packSlug }),
        });
        const { orderId, key } = await rzpRes.json();

        const rzp = new window.Razorpay({
          key,
          amount: pack.price,
          currency: 'INR',
          name: 'IP Success',
          description: pack.name,
          order_id: orderId,
          prefill: { name: data.name, email: data.email, contact: `+91${data.phone}` },
          theme: { color: '#166534' },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const orderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...data,
                packSlug,
                payment_method: 'razorpay',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: pack.price,
              }),
            });
            const order = await orderRes.json();
            setOrderNumber(order.order_number);
            setSuccess(true);
          },
        });
        rzp.open();
      } else {
        // COD order
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            packSlug,
            payment_method: 'cod',
            amount: pack.price,
          }),
        });
        const order = await orderRes.json();
        setOrderNumber(order.order_number);
        setSuccess(true);
      }
    } catch (err) {
      alert('Something went wrong. Please try again or call us.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 space-y-6"
      >
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-primary-700" />
        </div>
        <h2 className="font-serif text-3xl text-primary-700 font-bold">Order Placed Successfully! 🎉</h2>
        <p className="text-on-surface-variant">
          Your order <strong>{orderNumber}</strong> has been received.
          <br />Expected delivery in 3-5 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/919925050013?text=Hi, I placed an order ${orderNumber}. Please confirm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold"
          >
            Confirm on WhatsApp
          </a>
          <a href="/" className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-xl font-bold">
            Back to Home
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto py-12 px-4 md:px-16">
      <h1 className="font-serif text-3xl font-bold text-primary-700 mb-8">{t('title')}</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Details */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
              <h2 className="font-bold text-lg text-primary-700">{t('personalDetails')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="checkout-name"
                  label={t('name')}
                  required
                  placeholder="Rahul Kumar"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  id="checkout-phone"
                  label={t('phone')}
                  required
                  placeholder="9876543210"
                  maxLength={10}
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </div>
              <Input
                id="checkout-email"
                label={t('email')}
                type="email"
                placeholder="rahul@email.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
              <h2 className="font-bold text-lg text-primary-700">{t('deliveryAddress')}</h2>
              <Input
                id="checkout-line1"
                label={t('line1')}
                required
                placeholder="House No, Street, Area"
                {...register('line1')}
                error={errors.line1?.message}
              />
              <Input
                id="checkout-line2"
                label={t('line2')}
                placeholder="Landmark (optional)"
                {...register('line2')}
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  id="checkout-city"
                  label={t('city')}
                  required
                  placeholder="Ahmedabad"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Select
                  id="checkout-state"
                  label={t('state')}
                  required
                  placeholder="Select State"
                  options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
                  {...register('state')}
                  error={errors.state?.message}
                />
                <Input
                  id="checkout-pincode"
                  label={t('pincode')}
                  required
                  placeholder="380001"
                  maxLength={6}
                  {...register('pincode')}
                  error={errors.pincode?.message}
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
              <h2 className="font-bold text-lg text-primary-700">{t('paymentMethod')}</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-primary-700 bg-primary-50' : 'border-outline-variant hover:border-primary-700/40'}`}>
                  <input type="radio" value="razorpay" {...register('payment_method')} className="accent-primary-700 w-4 h-4" />
                  <div>
                    <div className="font-semibold text-sm">{t('payOnline')}</div>
                    <div className="text-xs text-on-surface-variant">UPI, Cards, Net Banking – Secure & Instant</div>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">UPI</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">Card</span>
                  </div>
                </label>
                {codEnabled && (
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-700 bg-primary-50' : 'border-outline-variant hover:border-primary-700/40'}`}>
                    <input type="radio" value="cod" {...register('payment_method')} className="accent-primary-700 w-4 h-4" />
                    <div>
                      <div className="font-semibold text-sm">{t('cashOnDelivery')}</div>
                      <div className="text-xs text-on-surface-variant">Pay when your order arrives</div>
                    </div>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Available</span>
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full text-base"
            >
              {loading ? t('processing') : t('placeOrder')}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm sticky top-24">
            <h2 className="font-bold text-lg text-primary-700 mb-4">{t('orderSummary')}</h2>
            
            <div className="bg-primary-50 rounded-xl p-4 mb-4">
              <div className="font-bold text-primary-700">{pack.name}</div>
              <div className="text-xs text-on-surface-variant italic mb-3">{pack.subtitle}</div>
              <ul className="space-y-1">
                {pack.items.map((item, i) => (
                  <li key={i} className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-sm border-t border-outline-variant pt-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('delivery')}</span>
                <span className="text-green-600 font-semibold">{t('free')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-primary-700 pt-2 border-t border-outline-variant">
                <span>{t('total')}</span>
                <span>{pack.displayPrice}</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="bg-white rounded-2xl p-4 border border-outline-variant shadow-sm">
            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: '100% Secure Payments' },
                { icon: Truck, text: 'Free Delivery Pan India' },
                { icon: RotateCcw, text: '30-Day Satisfaction Guarantee' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Icon className="w-4 h-4 text-primary-700 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
