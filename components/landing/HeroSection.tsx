'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, ThumbsUp, Microscope, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection({ heroUrl }: { heroUrl?: string }) {
  const t = useTranslations('hero');

  return (
    <section className="relative pt-12 pb-24 px-4 md:px-16 overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-surface">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[70%] bg-primary-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[40%] h-[50%] bg-secondary-fixed/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-200"
          >
            <ShieldCheck className="w-4 h-4 fill-primary-700" />
            {t('badge')}
          </motion.div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-700 leading-tight">
            {t('headline')}
          </h1>

          <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
            {t('subheadline')}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant bg-surface-container px-4 py-2 rounded-xl border border-outline-variant">
              <Microscope className="w-4 h-4 text-primary-700" />
              {t('clinicallyTested')}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant bg-surface-container px-4 py-2 rounded-xl border border-outline-variant">
              <ThumbsUp className="w-4 h-4 text-primary-700" />
              {t('happyPatients')}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-4"
          >
            <a
              href="#offers"
              className="inline-flex items-center gap-2 bg-primary-700 text-white px-10 py-5 rounded-xl font-bold text-base uppercase tracking-wider hover:bg-primary-800 transition-all shadow-lg hover:shadow-glow group"
            >
              {t('exploreCombos')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Star rating */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-on-surface-variant">4.9/5 · 10,000+ Reviews</span>
          </div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative flex justify-center items-center"
        >
          {/* Pulsing ring */}
          <div className="absolute w-[85%] aspect-square rounded-full bg-primary-100/50 border border-primary-200/40 -z-10 animate-pulse-slow" />
          <div className="absolute w-[70%] aspect-square rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 -z-10" />

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {heroUrl ? (
              <img
                src={heroUrl}
                alt="IP Success Pilescare Combo Products"
                className="w-full max-w-[520px] object-contain drop-shadow-2xl"
              />
            ) : (
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIqvxcaixq08OoLg-lhRZ9Au1SsUc5mfJGxBkQFk0vXBE0O0FTBtlGnN0BDNVHHgEAIW3xXOV98VqeHrBRMqzOnfE5aLBxa305s6M7oHLQ5LOD62xWg6huDHfDhx0rzc48nWO5UU3Es9l4Z2W8NWaX1ibu0PaoHg4CV0IZVvXs70ziqBW0vHJafm0KwRHG8FfCcZfv_Bw0L1KK8uIYWw0d89rlUC5O0PqNTew_f7woaMBIuhJNy8D7D2HiwfLhSzVl5itxxpAnczA"
                alt="IP Success Pilescare Combo Products"
                width={520}
                height={520}
                className="object-contain drop-shadow-2xl"
                priority
              />
            )}
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-8 -left-4 md:left-0 bg-white rounded-2xl p-3 shadow-card border border-outline-variant/30 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-lg">🌿</div>
            <div>
              <div className="text-xs font-bold text-primary-700">AYUSH Approved</div>
              <div className="text-[10px] text-on-surface-variant">Certified</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-8 -right-4 md:right-0 bg-white rounded-2xl p-3 shadow-card border border-outline-variant/30 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-secondary-fixed/30 rounded-full flex items-center justify-center text-lg">✅</div>
            <div>
              <div className="text-xs font-bold text-primary-700">Free Delivery</div>
              <div className="text-[10px] text-on-surface-variant">Pan India</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
