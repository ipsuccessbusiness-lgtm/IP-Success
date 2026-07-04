'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <section className="py-20 px-4 md:px-16 bg-surface-container-low" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-4xl font-bold text-primary-700 text-center mb-12"
        >
          {t('title')}
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-outline-variant overflow-hidden"
            >
              <button
                id={`faq-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-primary-50 transition-colors"
              >
                <span className="font-semibold text-on-surface pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary-700 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-outline-variant pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
