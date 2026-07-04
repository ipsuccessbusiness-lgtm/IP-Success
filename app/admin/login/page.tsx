'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-fixed/10 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card-hover border border-outline-variant overflow-hidden">
          {/* Header */}
          <div className="bg-primary-700 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl font-serif">IP</span>
            </div>
            <h1 className="text-white font-serif text-2xl font-bold">Admin Panel</h1>
            <p className="text-white/70 text-sm mt-1">IP Success Ayurvedic Healthcare</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            <h2 className="font-semibold text-on-surface text-lg">Sign In</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                id="admin-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ipsuccess.in"
                required
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  id="admin-password"
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full mt-2"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          Protected admin area · IP Success Ayurvedic Healthcare
        </p>
      </motion.div>
    </div>
  );
}
