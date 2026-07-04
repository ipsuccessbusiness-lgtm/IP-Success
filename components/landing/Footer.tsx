'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-surface-container py-16 px-4 md:px-16 border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="font-serif font-bold text-2xl text-primary-700">IP Success</div>
          <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
            {t('tagline')}
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="https://wa.me/919925050013"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.303.145.348.491 1.2.535 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289-.087.101-.182.226-.26.303-.094.094-.193.197-.082.387.111.19.493.814.997 1.264.648.578 1.194.757 1.368.847.174.09.274.075.376-.041.101-.116.434-.506.549-.68.116-.174.231-.145.39-.087.159.058 1.012.477 1.185.564.173.087.289.129.332.202.043.073.043.418-.101.823z"/>
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.01 8.01 0 0 1-8 8z"/>
              </svg>
            </a>
            <a href="mailto:support@ipsuccess.in" className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
              <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-primary-700 mb-5 text-sm uppercase tracking-wider">{t('quickLinks')}</h4>
          <nav className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <a href="#offers" className="hover:text-primary-700 transition-colors">Combo Offers</a>
            <a href="#how-it-works" className="hover:text-primary-700 transition-colors">Relief Protocol</a>
            <a href="#testimonials" className="hover:text-primary-700 transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-primary-700 transition-colors">FAQ</a>
          </nav>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-primary-700 mb-5 text-sm uppercase tracking-wider">{t('support')}</h4>
          <nav className="flex flex-col gap-3 text-sm text-on-surface-variant">
            <a href="tel:+919925050013" className="hover:text-primary-700 transition-colors">+91 99250 50013</a>
            <a href="#" className="hover:text-primary-700 transition-colors">{t('shipping')}</a>
            <a href="#" className="hover:text-primary-700 transition-colors">{t('privacy')}</a>
            <a href="#" className="hover:text-primary-700 transition-colors">{t('terms')}</a>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-outline-variant text-center text-xs text-on-surface-variant/60">
        {t('copyright')}
      </div>
    </footer>
  );
}
