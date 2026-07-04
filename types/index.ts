// All TypeScript interfaces for the IP Success application

export type Language = 'en' | 'hi' | 'gu' | 'hinglish';

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'new' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
export type OrderSource = 'website' | 'phone' | 'whatsapp';

export interface Product {
  id: string;
  name: string;
  name_hi: string;
  name_gu: string;
  price: number; // in paise
  original_price: number | null;
  description: string;
  description_hi: string;
  description_gu: string;
  items_included: string[];
  benefits: string[];
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
  product?: Product;
}

export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: CustomerAddress;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  order_status: OrderStatus;
  tracking_id: string | null;
  courier_name: string | null;
  language: Language;
  notes: string | null;
  source: OrderSource;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  review: string;
  review_hi: string | null;
  review_gu: string | null;
  rating: number;
  avatar_initials: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value_en: string;
  value_hi: string | null;
  value_gu: string | null;
  value_hinglish: string | null;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

// Checkout form types
export interface CheckoutFormData {
  name: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: PaymentMethod;
}

// Dashboard stats
export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}
