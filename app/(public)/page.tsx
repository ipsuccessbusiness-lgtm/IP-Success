import HeroSection from '@/components/landing/HeroSection';
import PainSection from '@/components/landing/PainSection';
import ComboOffersSection from '@/components/landing/ComboOffersSection';
import TrustSeals from '@/components/landing/TrustSeals';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FaqSection from '@/components/landing/FaqSection';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  let heroUrl = '';
  let testimonials = [];
  try {
    const { data: contentData } = await supabase.from('site_content').select('value_en').eq('key', 'hero_image').single();
    if (contentData?.value_en) {
      heroUrl = contentData.value_en;
    }
    const { data: tData } = await supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order');
    if (tData) testimonials = tData;
  } catch (e) {
    // Ignore error if table is missing
  }

  return (
    <>
      <HeroSection heroUrl={heroUrl} />
      <TrustSeals />
      <PainSection />
      <ComboOffersSection />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection />

      {/* Final CTA Band */}
      <section className="bg-primary-700 py-16 px-4 md:px-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-bold mb-4">
          Don&apos;t Let Piles Control Your Life
        </h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Join thousands of patients who found permanent relief. Order today and get FREE delivery across India.
        </p>
        <a
          href="#offers"
          className="inline-block bg-secondary-fixed text-primary-700 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl"
        >
          Yes, I Want Permanent Relief
        </a>
      </section>
    </>
  );
}
