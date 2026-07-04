'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'gu', label: 'GU' },
  { code: 'hinglish', label: 'HGL' },
];

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const saved = document.cookie.match(/locale=([^;]+)/)?.[1] || 'en';
    setCurrentLang(saved);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLangChange = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setCurrentLang(code);
    setLangOpen(false);
    window.location.reload();
  };

  const navLinks = [
    { href: '#offers', label: t('offers') },
    { href: '#how-it-works', label: t('howItWorks') },
    { href: '#benefits', label: t('benefits') },
    { href: '#testimonials', label: t('testimonials') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-outline-variant'
          : 'bg-white/80 backdrop-blur-sm border-b border-outline-variant/50'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center gap-2">
          {logoUrl && (
            <img src={logoUrl} alt="IP Success Logo" className="h-10 md:h-12 w-auto object-contain" />
          )}
          <div>
            <div className="font-serif font-bold text-2xl md:text-3xl text-primary-700 tracking-tight">
              IP Success
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-medium -mt-0.5 hidden sm:block">
              Ayurvedic Piles Care
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-1 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-on-surface-variant hover:text-primary-700 transition-colors py-2 px-3 rounded-md hover:bg-primary-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              id="lang-selector-btn"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-xs font-bold text-on-surface-variant border border-outline-variant rounded-lg px-3 py-1.5 hover:border-primary-700 hover:text-primary-700 transition-all"
            >
              {LANGUAGES.find(l => l.code === currentLang)?.label || 'EN'}
              <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-outline-variant rounded-xl shadow-lg py-1 z-50 min-w-[100px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={cn(
                      'w-full text-left px-4 py-2 text-xs font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors',
                      currentLang === lang.code && 'text-primary-700 bg-primary-50 font-bold'
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="text-right border-l border-outline-variant pl-4">
            <div className="text-[9px] uppercase tracking-widest text-on-surface-variant">Expert Help</div>
            <a href="tel:+919925050013" className="text-primary-700 font-bold text-sm flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              +91 99250 50013
            </a>
          </div>

          <a
            href="#offers"
            className="bg-primary-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-800 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {t('orderNow')}
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a href="tel:+919925050013" className="text-primary-700 p-2">
            <Phone className="w-5 h-5" />
          </a>
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-primary-700 p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-on-surface-variant hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-outline-variant mt-2">
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-full border transition-all',
                    currentLang === lang.code
                      ? 'bg-primary-700 text-white border-primary-700'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary-700 hover:text-primary-700'
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <a
              href="#offers"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 bg-primary-700 text-white text-center px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider"
            >
              {t('orderNow')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
