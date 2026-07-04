'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, ShieldCheck } from 'lucide-react';

const painPoints = [
  {
    icon: Brain,
    titleKey: 'fearTitle' as const,
    descKey: 'fearDesc' as const,
  },
  {
    icon: AlertCircle,
    titleKey: 'painTitle' as const,
    descKey: 'painDesc' as const,
  },
  {
    icon: ShieldCheck,
    titleKey: 'safeTitle' as const,
    descKey: 'safeDesc' as const,
  },
];

export default function PainSection() {
  const t = useTranslations('pain');

  return (
    <section className="bg-primary-700 text-white py-20 px-4 md:px-16 overflow-hidden relative">
      {/* Background decorative SVG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0 80 C 30 20 70 20 100 80" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl italic leading-tight text-white/95"
        >
          "{t('headline')}"
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all group"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-secondary-fixed/20 rounded-2xl flex items-center justify-center group-hover:bg-secondary-fixed/30 transition-all">
                    <Icon className="w-7 h-7 text-secondary-fixed" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3 text-white">{t(point.titleKey)}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{t(point.descKey)}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#offers"
            className="inline-flex items-center gap-2 bg-secondary-fixed text-primary-700 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg text-sm"
          >
            See Our Natural Solution →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
