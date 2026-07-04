'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STEPS = [
  { num: '01', titleKey: 'step1Title' as const, descKey: 'step1Desc' as const, emoji: '🩺' },
  { num: '02', titleKey: 'step2Title' as const, descKey: 'step2Desc' as const, emoji: '🌿' },
  { num: '03', titleKey: 'step3Title' as const, descKey: 'step3Desc' as const, emoji: '💊' },
  { num: '04', titleKey: 'step4Title' as const, descKey: 'step4Desc' as const, emoji: '✅' },
];

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  return (
    <section className="py-24 px-4 md:px-16 bg-surface-container-low" id="how-it-works">
      <div className="max-w-[1280px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-4xl font-bold text-center text-primary-700 mb-16"
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-secondary-fixed to-primary-200" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group text-center md:text-left"
            >
              {/* Step number circle */}
              <div className="relative flex justify-center md:justify-start mb-6">
                <div className="w-14 h-14 rounded-full bg-primary-700 text-white font-bold text-lg flex items-center justify-center shadow-card group-hover:shadow-glow transition-all duration-300 z-10 relative">
                  {step.emoji}
                </div>
                <div className="absolute inset-0 flex justify-center md:justify-start">
                  <div className="w-14 h-14 rounded-full bg-secondary-fixed/30 animate-pulse-slow" />
                </div>
              </div>

              {/* Big number watermark */}
              <div className="text-[64px] font-bold text-primary-700/8 leading-none mb-2 -mt-2 select-none">
                {step.num}
              </div>

              <div className="-mt-8 relative">
                <h3 className="font-bold text-lg text-primary-700 mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
