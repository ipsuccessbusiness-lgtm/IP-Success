'use client';

import { motion } from 'framer-motion';

const SEALS = [
  { icon: '🛡️', label: 'GMP Certified' },
  { icon: '🌿', label: 'AYUSH Approved' },
  { icon: '👥', label: '10,000+ Patients' },
  { icon: '🔬', label: 'Clinically Proven' },
  { icon: '🚚', label: 'Free Shipping' },
  { icon: '🔒', label: 'Secure Payments' },
  { icon: '↩', label: '30-Day Guarantee' },
  { icon: '📋', label: '100% Ayurvedic' },
];

export default function TrustSeals() {
  return (
    <section className="py-10 bg-white border-y border-outline-variant overflow-hidden">
      <div className="flex animate-[scroll_25s_linear_infinite] gap-0 w-max">
        {[...SEALS, ...SEALS].map((seal, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 px-10 opacity-60 hover:opacity-100 transition-opacity cursor-default flex-shrink-0"
          >
            <span className="text-3xl">{seal.icon}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant whitespace-nowrap">
              {seal.label}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
