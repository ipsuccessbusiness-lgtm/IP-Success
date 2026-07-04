'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { INDIAN_STATES, formatPrice } from '@/lib/utils';
import { CheckCircle, Zap } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit number'),
  email: z.string().email().optional().or(z.literal('')),
  line1: z.string().min(3, 'Required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Select state'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit PIN'),
  pack: z.enum(['starter', 'best-value']),
  payment_method: z.enum(['razorpay', 'cod']),
  source: z.enum(['phone', 'whatsapp', 'website']),
  notes: z.string().optional(),
});

type QuickOrderForm = z.infer<typeof schema>;

const PACKS = {
  starter: { name: 'Starter Pack', price: 247500, display: '₹2,475' },
  'best-value': { name: 'Best Value Pack', price: 372500, display: '₹3,725' },
};

export default function QuickOrderPage() {
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<QuickOrderForm>({
    resolver: zodResolver(schema),
    defaultValues: { pack: 'best-value', payment_method: 'cod', source: 'phone' },
  });

  const selectedPack = watch('pack');

  const onSubmit = async (data: QuickOrderForm) => {
    setLoading(true);
    try {
      const pack = PACKS[data.pack];
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          line1: data.line1,
          line2: '',
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          packSlug: data.pack,
          payment_method: data.payment_method,
          amount: pack.price,
          source: data.source,
          notes: data.notes,
        }),
      });
      const order = await res.json();
      setOrderNum(order.order_number);
      setSuccess(true);
      reset();
    } catch {
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-700" />
          Quick Order
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Fast entry for phone and WhatsApp orders</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800 text-lg">Order Created! 🎉</p>
            <p className="text-green-700 text-sm mt-1">Order number: <strong>{orderNum}</strong></p>
            <button onClick={() => setSuccess(false)} className="mt-3 text-xs font-bold text-green-700 underline">
              Create another order
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm space-y-5">
        {/* Pack selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Pack *</label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(PACKS) as [string, { name: string; price: number; display: string }][]).map(([slug, pack]) => (
              <label
                key={slug}
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPack === slug ? 'border-primary-700 bg-primary-50' : 'border-outline-variant hover:border-primary-700/40'
                }`}
              >
                <input type="radio" value={slug} {...register('pack')} className="sr-only" />
                <span className="font-bold text-sm text-gray-900">{pack.name}</span>
                <span className="text-xl font-bold text-primary-700 mt-1">{pack.display}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer details */}
        <div className="grid grid-cols-2 gap-4">
          <Input id="qo-name" label="Customer Name" required {...register('name')} error={errors.name?.message} />
          <Input id="qo-phone" label="Phone Number" required maxLength={10} {...register('phone')} error={errors.phone?.message} />
        </div>
        <Input id="qo-email" label="Email (optional)" type="email" {...register('email')} error={errors.email?.message} />

        {/* Address */}
        <Input id="qo-address" label="Address" required placeholder="House, Street, Area" {...register('line1')} error={errors.line1?.message} />
        <div className="grid grid-cols-3 gap-3">
          <Input id="qo-city" label="City" required {...register('city')} error={errors.city?.message} />
          <Select
            id="qo-state"
            label="State"
            required
            placeholder="Select"
            options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
            {...register('state')}
            error={errors.state?.message}
          />
          <Input id="qo-pincode" label="PIN Code" required maxLength={6} {...register('pincode')} error={errors.pincode?.message} />
        </div>

        {/* Payment & Source */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            id="qo-payment"
            label="Payment Method"
            required
            options={[
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'razorpay', label: 'Online (Paid)' },
            ]}
            {...register('payment_method')}
          />
          <Select
            id="qo-source"
            label="Order Source"
            required
            options={[
              { value: 'phone', label: 'Phone Call' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'website', label: 'Website' },
            ]}
            {...register('source')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
          <textarea
            {...register('notes')}
            rows={2}
            placeholder="Any special instructions..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 resize-none"
          />
        </div>

        {/* Summary */}
        <div className="bg-primary-50 rounded-xl p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Order Total:</span>
          <span className="text-xl font-bold text-primary-700">{PACKS[selectedPack]?.display}</span>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          <Zap className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </form>
    </div>
  );
}
