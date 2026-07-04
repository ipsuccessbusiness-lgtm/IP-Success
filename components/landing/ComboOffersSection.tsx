'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const PACKS = [
  {
    id: 'starter',
    nameKey: 'starterName' as const,
    subtitleKey: 'starterSubtitle' as const,
    priceKey: 'starterPrice' as const,
    originalPriceKey: null,
    items: ['starterItem1', 'starterItem2'] as const,
    benefits: ['starterBenefit1', 'starterBenefit2', 'starterBenefit3'] as const,
    ctaKey: 'starterCta' as const,
    popular: false,
    packSlug: 'starter',
    price: 247500, // paise
  },
  {
    id: 'best-value',
    nameKey: 'bestName' as const,
    subtitleKey: 'bestSubtitle' as const,
    priceKey: 'bestPrice' as const,
    originalPriceKey: 'bestOriginal' as const,
    items: ['bestItem1', 'bestItem2'] as const,
    benefits: ['bestBenefit1', 'bestBenefit2', 'bestBenefit3', 'bestBenefit4'] as const,
    ctaKey: 'bestCta' as const,
    popular: true,
    packSlug: 'best-value',
    price: 372500,
  },
] as const;

export default function ComboOffersSection() {
  const t = useTranslations('offers');

  return (
    <section className="py-24 px-4 md:px-16 bg-surface" id="offers">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-700">
            {t('title')}
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                'relative flex flex-col rounded-2xl transition-all duration-300 group',
                pack.popular
                  ? 'bg-primary-700 text-white border-4 border-secondary-fixed shadow-2xl md:scale-105 z-10'
                  : 'bg-white border border-outline-variant shadow-card hover:shadow-card-hover'
              )}
            >
              {/* Popular badge */}
              {pack.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-secondary-fixed text-primary-700 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md whitespace-nowrap">
                  <Star className="w-4 h-4 fill-primary-700" />
                  {t('mostPopular')}
                </div>
              )}

              <div className="p-8 md:p-10 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className={cn('font-serif text-2xl font-bold', pack.popular ? 'text-white' : 'text-primary-700')}>
                      {t(pack.nameKey)}
                    </h3>
                    <p className={cn('mt-1 text-sm italic', pack.popular ? 'text-primary-fixed' : 'text-on-surface-variant')}>
                      {t(pack.subtitleKey)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-4xl font-bold font-serif', pack.popular ? 'text-white' : 'text-primary-700')}>
                      {t(pack.priceKey)}
                    </div>
                    {pack.originalPriceKey && (
                      <div className={cn('text-sm line-through', pack.popular ? 'text-white/60' : 'text-on-surface-variant/60')}>
                        {t(pack.originalPriceKey)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items included */}
                <div className={cn('p-5 rounded-xl border mb-6', pack.popular ? 'bg-white/10 border-white/20' : 'bg-surface-container-low border-outline-variant/30')}>
                  <ul className="space-y-3">
                    {pack.items.map((itemKey) => (
                      <li key={itemKey} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle className={cn('w-5 h-5 flex-shrink-0', pack.popular ? 'text-secondary-fixed' : 'text-secondary')} />
                        {t(itemKey)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="flex-grow space-y-2 mb-8">
                  <p className={cn('text-xs font-bold uppercase tracking-widest mb-3', pack.popular ? 'text-secondary-fixed' : 'text-on-surface-variant')}>
                    Benefits:
                  </p>
                  <ul className="space-y-2">
                    {pack.benefits.map((bKey) => (
                      <li key={bKey} className={cn('flex gap-2 text-sm', pack.popular ? 'text-white/90' : 'text-on-surface-variant')}>
                        <span className="text-secondary-fixed mt-0.5">•</span>
                        {t(bKey)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <a
                  href={`/checkout?pack=${pack.packSlug}`}
                  id={`cta-${pack.packSlug}`}
                  className={cn(
                    'block w-full text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg',
                    pack.popular
                      ? 'bg-secondary-fixed text-primary-700 hover:bg-white'
                      : 'bg-white text-primary-700 border-2 border-primary-700 hover:bg-primary-700 hover:text-white'
                  )}
                >
                  {t(pack.ctaKey)}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-sm text-on-surface-variant"
        >
          🔒 Secure payments · 📦 Free shipping across India · ↩ 30-day satisfaction guarantee
        </motion.p>
      </div>
    </section>
  );
}
