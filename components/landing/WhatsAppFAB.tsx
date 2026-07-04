'use client';

import { motion } from 'framer-motion';

export default function WhatsAppFAB() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919925050013';

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=Hi, I want to know more about IP Success Piles Care combo.`}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-fab"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      
      {/* WhatsApp icon */}
      <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.303.145.348.491 1.2.535 1.288.043.087.072.188.014.303-.058.116-.087.188-.173.289-.087.101-.182.226-.26.303-.094.094-.193.197-.082.387.111.19.493.814.997 1.264.648.578 1.194.757 1.368.847.174.09.274.075.376-.041.101-.116.434-.506.549-.68.116-.174.231-.145.39-.087.159.058 1.012.477 1.185.564.173.087.289.129.332.202.043.073.043.418-.101.823zM12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.01 8.01 0 0 1-8 8z"/>
      </svg>

      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-outline-variant">
        Chat with Doctor 💬
      </span>
    </motion.a>
  );
}
