'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';

export default function SplitPortal() {
  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row font-sans bg-black overflow-y-auto md:overflow-hidden">
      {/* TOP BRANDING OVERLAY */}
      <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none w-full px-4">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl md:text-3xl font-black text-white tracking-widest uppercase drop-shadow-xl"
        >
          Prysal Creative Hub
        </motion.h2>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-gray-400 text-xs md:text-base font-semibold mt-1 md:mt-2 tracking-wider"
        >
          Choose your service to continue
        </motion.p>
      </div>
      
      {/* LEFT: DESIGN HUB */}
      <Link href="/design" className="relative min-h-[50vh] md:min-h-screen md:h-full w-full md:w-1/2 group cursor-pointer border-b md:border-b-0 md:border-r border-neutral-800 overflow-hidden block">
        <motion.div 
          initial={{ flex: 1 }}
          whileHover={{ flex: 1.15 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-neutral-950">
            <img 
              src="/api/image?path=C:/Users/user/.gemini/antigravity-ide/brain/fe75fad9-9551-41f9-82ac-bcda122be709/uiux_designing_1783950475310.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700" 
              alt="Design Hub Background"
            />
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/60 via-neutral-950 to-neutral-950 group-hover:opacity-80 transition-opacity duration-700"></div>
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 md:mb-6 shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500"
            >
              <Icons.MonitorSmartphone size={32} className="text-white md:w-10 md:h-10" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
            >
              Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hub</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm md:text-xl font-medium max-w-sm mt-2"
            >
              Web Design, UI/UX, Brand Identity, Digital Marketing & Video Production.
            </motion.p>
            
            <div className="mt-4 md:mt-8 flex items-center space-x-2 text-blue-400 font-bold opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-900/30 px-4 py-2 md:px-6 md:py-3 rounded-full border border-blue-500/30 text-sm md:text-base">
              <span>I need Websites & Logos</span>
              <Icons.ArrowRight size={20} />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* RIGHT: PRINT HUB */}
      <Link href="/print" className="relative min-h-[50vh] md:min-h-screen md:h-full w-full md:w-1/2 group cursor-pointer overflow-hidden block">
        <motion.div 
          initial={{ flex: 1 }}
          whileHover={{ flex: 1.15 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-neutral-900">
            <img 
              src="/api/image?path=C:/Users/user/.gemini/antigravity-ide/brain/fe75fad9-9551-41f9-82ac-bcda122be709/print_poster_1783887843621.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700" 
              alt="Print Hub Background"
            />
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/30 via-neutral-900 to-neutral-900 group-hover:opacity-95 transition-opacity duration-700"></div>
            {/* Ink splash / print pattern effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-4 md:mb-6 shadow-2xl shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500"
            >
              <Icons.Printer size={32} className="text-white md:w-10 md:h-10" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
            >
              Print <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Shop</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm md:text-xl font-medium max-w-sm mt-2"
            >
              Printouts, Photocopying, Flex Banners, Custom Mugs & Event Invitations.
            </motion.p>

            <div className="mt-4 md:mt-8 flex items-center space-x-2 text-amber-400 font-bold opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-amber-900/30 px-4 py-2 md:px-6 md:py-3 rounded-full border border-amber-500/30 text-sm md:text-base">
              <span>I need Physical Prints</span>
              <Icons.ArrowRight size={20} />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Center Logo Overlay (Desktop Only) */}
      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-full bg-black border-4 border-neutral-900 items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-default">
        <img src="/api/logo" alt="Prysal Logo" className="w-12 h-12 object-contain filter invert opacity-90" />
      </div>

    </main>
  );
}
