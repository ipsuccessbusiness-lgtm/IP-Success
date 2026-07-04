'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    location: 'Ahmedabad, Gujarat',
    initials: 'RK',
    review: '"Maine 5 saal se piles ki dikkat jheli hai. Best Value Pack lene ke 10 din baad hi bleeding band ho gayi. Thank you IP Success!"',
    rating: 5,
    color: 'bg-primary-100',
    textColor: 'text-primary-700',
  },
  {
    name: 'Amit Sharma',
    location: 'Indore, MP',
    initials: 'AS',
    review: '"Operation ka darr tha, par wife ne ye recommend kiya. Initial relief was fast. 1 month baad ab bilkul theek hoon."',
    rating: 5,
    color: 'bg-primary-700',
    textColor: 'text-white',
  },
  {
    name: 'Vijay M.',
    location: 'Surat, Gujarat',
    initials: 'VM',
    review: '"Effective medicine with no side effects. The powder is very strong for reducing swelling. Highly recommended for chronic piles."',
    rating: 5,
    color: 'bg-secondary-fixed',
    textColor: 'text-primary-700',
  },
  {
    name: 'Priya Patel',
    location: 'Vadodara, Gujarat',
    initials: 'PP',
    review: '"I was embarrassed to talk about this problem. IP Success team was very supportive and the medicine worked in just 2 weeks!"',
    rating: 5,
    color: 'bg-primary-100',
    textColor: 'text-primary-700',
  },
  {
    name: 'Suresh Reddy',
    location: 'Hyderabad, Telangana',
    initials: 'SR',
    review: '"Doctor suggested surgery but my friend told me about IP Success. Tried it and got relief without any operation. Highly recommend!"',
    rating: 5,
    color: 'bg-primary-700',
    textColor: 'text-white',
  },
  {
    name: 'Meena Joshi',
    location: 'Jaipur, Rajasthan',
    initials: 'MJ',
    review: '"Ayurvedic treatment se darr tha ki kaam karega ya nahi. But 5 din mein hi improvement dikhne lagi. Ab completely fit hoon."',
    rating: 5,
    color: 'bg-secondary-fixed',
    textColor: 'text-primary-700',
  },
];

interface Testimonial {
  id?: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  avatar_initials?: string;
  initials?: string;
  image_url?: string;
  video_url?: string;
  color?: string;
  textColor?: string;
}

export default function TestimonialsSection({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const t = useTranslations('testimonials');
  
  const displayTestimonials = testimonials.length > 0 ? testimonials : TESTIMONIALS;

  return (
    <section className="py-24 px-4 md:px-16 bg-white" id="testimonials">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-700 mb-4">
            {t('title')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span>4.9/5 from 10,000+ verified patients</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.map((t_item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="glass-card p-8 rounded-2xl flex flex-col hover:shadow-card-hover transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t_item.rating }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Media Display */}
              {(t_item.image_url || t_item.video_url) && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {t_item.video_url ? (
                    <video src={t_item.video_url} className="w-full h-48 object-cover" controls preload="metadata" />
                  ) : t_item.image_url ? (
                    <img src={t_item.image_url} alt={`${t_item.name}'s testimonial`} className="w-full h-48 object-cover" />
                  ) : null}
                </div>
              )}

              <p className="text-on-surface-variant italic text-sm leading-relaxed flex-grow mb-6">
                {t_item.review}
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-11 h-11 ${t_item.color || 'bg-primary-100'} rounded-full flex items-center justify-center ${t_item.textColor || 'text-primary-700'} font-bold text-sm flex-shrink-0`}>
                  {t_item.avatar_initials || t_item.initials}
                </div>
                <div>
                  <div className="font-bold text-primary-700 text-sm">{t_item.name}</div>
                  <div className="text-xs text-on-surface-variant">{t_item.location}</div>
                </div>
                <div className="ml-auto">
                  <div className="text-[10px] text-on-surface-variant font-medium bg-surface-container px-2 py-1 rounded-full">✓ Verified</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
