'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView, animate } from 'framer-motion';
import * as Icons from 'lucide-react';
import Image from 'next/image';

const CountingNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numStr = value.replace(/[^0-9]/g, '');
  const suffix = value.replace(/[0-9]/g, '');
  const targetNum = parseInt(numStr, 10);

  const [count, setCount] = useState(1);

  useEffect(() => {
    if (isNaN(targetNum) || !isInView) return;

    const controls = animate(1, targetNum, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v))
    });

    return controls.stop;
  }, [targetNum, isInView]);

  if (isNaN(targetNum)) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
};

const WHY_CHOOSE_US = [
  { title: "Premium Quality", icon: "Award", desc: "Top-tier materials and flawless execution." },
  { title: "Fast Delivery", icon: "Zap", desc: "Lightning-fast turnaround times for every project." },
  { title: "Unlimited Revisions", icon: "RefreshCw", desc: "We don't stop until you are 100% satisfied." },
  { title: "Affordable Pricing", icon: "Tag", desc: "Unbeatable value without compromising quality." },
  { title: "Experienced Designers", icon: "PenTool", desc: "A team of industry veterans at your disposal." },
  { title: "Friendly Support", icon: "Heart", desc: "We treat every client like our only client." },
  { title: "Creative Solutions", icon: "Lightbulb", desc: "Innovative approaches to complex design problems." },
  { title: "Customer Satisfaction", icon: "ThumbsUp", desc: "A track record of exceeding expectations." }
];


export default function Home() {
  const [content, setContent] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const validImages = content?.hero?.images ? content.hero.images.filter(img => img !== null && img !== '') : [];

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    fetch('/api/content?site=design')
      .then(res => res.json())
      .then(data => setContent(data));

      const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsMobileMenuOpen(false); // Close mobile menu on scroll

      const sections = ['home', 'services', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (validImages.length === 0) return;
    if (currentImg >= validImages.length) setCurrentImg(0);
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [validImages.length, currentImg]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-sm">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#000000] text-gray-200 relative">
      {/* Global Floating Particles with 3D Physics & Mouse Repulsion */}
      <ParticleCanvas />

      {/* 1. Header (Offer Banner + Navbar) */}
      <header className="fixed w-full z-50 top-0 flex flex-col">
        {content.offer?.isActive && (
          <div className="bg-brand-gradient text-white text-center py-3 px-4 text-sm font-bold shadow-md overflow-hidden">
            {content.offer.text}
          </div>
        )}

        {/* Navbar (Minimalist) */}
        <nav className="w-full bg-black/80 backdrop-blur-md border-b border-neutral-700 transition-all duration-300">
          <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-24'}`}>
            <div className="flex items-center space-x-3">
              <img src="/api/logo" alt="Prysal Printhub Logo" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-10' : 'h-16'}`} />
              <div className="font-black text-2xl tracking-tight hidden sm:block text-white">PRYSAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">DESIGN HUB</span></div>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-bold">
              {['home', 'services', 'contact'].map(section => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`relative py-2 transition-colors capitalize ${activeSection === section ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {section}
                  {activeSection === section && (
                    <motion.div
                      layoutId="navParticle"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-gradient shadow-[0_0_8px_rgba(217,70,239,0.9)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="/print" className="text-xs font-bold text-gray-400 hover:text-white bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-colors flex items-center space-x-2">
                <Icons.Repeat size={14} />
                <span>Switch to Print Hub</span>
              </a>
              <MagneticButton href={content.social?.whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center bg-brand-gradient hover:opacity-90 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg transition-all">
                Contact Us
              </MagneticButton>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <a href="/print" className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full flex items-center justify-center border border-white/10" aria-label="Switch to Print Hub">
                <Icons.Repeat size={20} />
              </a>
              <button
                className="text-white p-2 relative w-12 h-12 flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                      <Icons.X size={28} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                      <Icons.Menu size={28} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-neutral-900 border-b border-neutral-700 overflow-hidden"
              >
                <div className="flex flex-col p-6 space-y-6 text-center text-lg font-bold">
                  {['home', 'services', 'contact'].map(section => (
                    <a
                      key={section}
                      href={`#${section}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`capitalize ${activeSection === section ? 'text-blue-400' : 'text-white'}`}
                    >
                      {section}
                    </a>
                  ))}

                  <a
                    href={content.social?.whatsapp || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-brand-gradient hover:opacity-90 text-white py-4 rounded-xl shadow-lg mt-2"
                  >
                    Contact Us
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* 1.5. Custom Festive Banner (Parallax) */}
      {content.customHero?.isActive && content.customHero.image && (
        <section className={`w-full aspect-[4/3] md:aspect-[21/9] max-h-[600px] relative overflow-hidden flex items-center justify-center ${content.offer?.isActive ? 'mt-[160px] md:mt-[135px]' : 'mt-28 md:mt-24'}`}>
          <motion.div style={{ y: parallaxY }} className="w-full h-[120%] absolute top-[-10%] z-0">
            <Image
              src={content.customHero.image.startsWith('http') ? content.customHero.image : content.customHero.image.startsWith('/uploads') ? content.customHero.image : `/api/image?path=${content.customHero.image}`}
              alt="Special Offer"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
            {content.customHero.headline && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-xl"
              >
                {content.customHero.headline}
              </motion.h2>
            )}
            {content.customHero.subheadline && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-2xl text-gray-200 font-medium mb-8 drop-shadow-lg max-w-2xl"
              >
                {content.customHero.subheadline}
              </motion.p>
            )}
            {content.customHero.hasButton && content.customHero.buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <a 
                  href={content.social?.whatsapp || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-brand-gradient hover:opacity-90 text-white px-8 py-4 rounded-full font-bold shadow-2xl transition-transform hover:scale-105 group/btn"
                >
                  <span className="text-lg">{content.customHero.buttonText}</span>
                  <Icons.ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 opacity-50 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
        </section>
      )}

      {/* 2. Hero Section (Credible & Corporate with Slider) */}
      <section id="home" className={`relative pb-16 px-6 ${content.customHero?.isActive ? 'pt-20' : 'pt-40'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight flex flex-wrap"
            >
              {content.hero.headline.split(' ').map((word, idx) => (
                <motion.span
                  key={idx}
                  className="mr-4 lg:mr-6 mb-2"
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -90 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: { type: 'spring', damping: 12, stiffness: 100 }
                    }
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-xl md:text-2xl text-gray-500 leading-relaxed max-w-xl"
            >
              {content.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-y border-neutral-700 py-8"
            >
              {content.hero.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-4xl font-black"><CountingNumber value={stat.value} /></span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full relative aspect-square max-h-[600px] max-w-[600px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {validImages.length > 0 && (
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <Image
                    src={(validImages[currentImg] || validImages[0]).startsWith('http') ? (validImages[currentImg] || validImages[0]) : (validImages[currentImg] || validImages[0]).startsWith('/uploads') ? (validImages[currentImg] || validImages[0]) : `/api/image?path=${(validImages[currentImg] || validImages[0])}`}
                    alt="Hero Showcase"
                    fill
                    priority
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImg(idx)}
                  aria-label={`View slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentImg ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80 hover:scale-110'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>


      </section>

      {/* 3. The 4 Categories Visual Portfolio */}
      <section id="services" className="py-16 bg-neutral-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Our Expertise</h2>
            <p className="mt-4 text-gray-400 text-lg">Creative design for modern brands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.categories && content.categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
                className="relative bg-neutral-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-neutral-700 group overflow-hidden aspect-[4/5] md:aspect-[5/4] min-h-[400px]"
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image src={category.image.startsWith('http') ? category.image : category.image.startsWith('/uploads') ? category.image : `/api/image?path=${category.image}`} alt={category.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-10">
                  <h3 className="text-2xl md:text-3xl font-black mb-3 text-white tracking-tight">{category.title}</h3>
                  <p className="text-gray-300 text-sm md:text-lg mb-6 leading-relaxed max-w-md">{category.desc}</p>

                  <ul className="space-y-3">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center space-x-3 text-gray-400 font-medium">
                        <Icons.CheckCircle2 size={18} className="text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href="#contact"
                    className="mt-8 inline-flex items-center justify-center space-x-2 bg-brand-gradient text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all w-fit group/btn"
                  >
                    <span>Place Order</span>
                    <Icons.ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.25 Why Choose Us Clean Marquee */}
      <section className="py-8 bg-neutral-900 border-y border-neutral-800 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-[200%] items-center justify-start animate-marquee whitespace-nowrap">
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center space-x-12 px-6">
              {WHY_CHOOSE_US.map((item, idx) => {
                const Icon = Icons[item.icon];
                return (
                  <div key={idx} className="flex items-center space-x-12">
                    <div className="flex items-center space-x-4 group cursor-default">
                      <div className="w-12 h-12 rounded-full bg-neutral-800/50 flex items-center justify-center border border-neutral-700/50 group-hover:border-blue-500/50 transition-all duration-300">
                        <Icon size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">
                        {item.title}
                      </span>
                    </div>
                    {/* Seamless separator */}
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 6s linear infinite;
          }
          @media (min-width: 768px) {
            .animate-marquee {
              animation: marquee 40s linear infinite;
            }
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* 2.5 Trusted By Section */}
      <section className="py-12 border-y border-neutral-700 bg-neutral-800/30 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-[0.2em] mb-10">Trusted By Businesses Across Sri Lanka</h3>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            <span className="text-lg md:text-xl font-bold text-neutral-400">Konnect BPO Technologies (PVT) Ltd</span>
            <span className="text-lg md:text-xl font-bold text-neutral-400">NEW FOOD CORNER (PVT) LTD</span>
            <span className="text-lg md:text-xl font-bold text-neutral-400">Dilan Trading Company PVT LTD</span>
            <span className="text-lg md:text-xl font-bold text-neutral-400">Aarundhraa universals pvt ltd</span>
          </div>
        </div>
      </section>

      {/* 3.5 Client Testimonials */}
      <section className="py-16 bg-neutral-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Client Testimonials</h2>
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <span className="text-xl font-bold text-white mr-2">5/5</span>
              {[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} size={24} fill="currentColor" />)}
              <span className="text-gray-400 ml-2">on Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Abishek Rathnakumar", rating: 5, text: "Highly recommend this printing shop in Matale! They offer a wide range of services, including digital, offset, and custom printing, all at unbeatable prices. They are incredibly professional and ensures you get exactly what you want, whether it's personalized designs or large-scale projects. From banners to business cards, they deliver excellent quality and attention to detail. Truly the best place for all your printing needs in Matale for the best price and quality!", date: "A year ago", initials: "AR" },
              { name: "Indhrajith Ragunaathan", rating: 5, text: "Prysal Print Hub is the best place for all your graphic design needs. The designers are very talented and always bring fresh ideas to the table. Their attention to detail and commitment to customer satisfaction make them stand out. I will definitely return for more services!", date: "Recent", initials: "IR" },
              { name: "Dev Rishi", rating: 5, text: "Highly Recommended! I got 1,000 visiting cards printed from Prysal Print Hub, and they exceeded my expectations! Great design, top-notch print quality, and fast service. Highly professional team, will definitely return for future projects", date: "Recent", initials: "DR" }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-neutral-800 rounded-[2rem] p-6 md:p-8 border border-neutral-700 flex flex-col justify-between hover:border-neutral-600 transition-colors"
              >
                <div>
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(review.rating)].map((_, i) => <Icons.Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-8">"{review.text}"</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Icons.CheckCircle2 size={14} className="text-blue-500" />
                      <span className="text-xs text-gray-500">Verified • {review.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          


        </div>
      </section>

      {/* 4. Minimalist Contact Section with Particle Animation */}
      <section id="contact" className="py-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          {/* Left: Google Map */}
          <div className="w-full lg:w-1/2 relative h-[350px] lg:h-[450px] rounded-3xl overflow-hidden border border-neutral-700 shadow-lg">
            <iframe 
              src="https://maps.google.com/maps?q=733,%20mandandawela,%20Matale%2021000&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>

          {/* Right: Contact Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-white">Let's Talk.</h2>
            <p className="text-xl text-gray-400 mb-8">Ready to start your next big project? Reach out to our team.</p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10">
              <a href={`tel:${content.contact.phone}`} className="flex items-center justify-center space-x-3 bg-neutral-800 hover:bg-neutral-700 px-8 py-4 rounded-2xl transition-all shadow-sm hover:shadow-md group border border-neutral-700 hover:border-neutral-600">
                <Icons.Phone className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{content.contact.phone}</span>
              </a>
              <a href={`mailto:${content.contact.email}`} className="flex items-center justify-center space-x-3 bg-brand-gradient text-white px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Icons.Mail className="text-white/80" />
                <span className="text-xl font-bold">{content.contact.email}</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start items-center space-x-6 border-t border-neutral-700 pt-8">
              {content.social?.instagram && (
                <a href={content.social.instagram} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all shadow-md hover:-translate-y-1">
                  <Icons.Instagram size={24} />
                </a>
              )}
              {content.social?.facebook && (
                <a href={content.social.facebook} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-md hover:-translate-y-1">
                  <Icons.Facebook size={24} />
                </a>
              )}
              {content.social?.whatsapp && (
                <a href={content.social.whatsapp} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all shadow-md hover:-translate-y-1">
                  <Icons.MessageCircle size={24} />
                </a>
              )}
            </div>


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-neutral-700 bg-neutral-900">
        © {new Date().getFullYear()} Prysal Creative Hub. All rights reserved.
      </footer>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-[999]">
        <MagneticButton
          href={content.social?.whatsapp || "https://wa.me/1234567890"}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all"
        >
          <Icons.MessageCircle size={28} />
        </MagneticButton>
      </div>

      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[999]"
          >
            <MagneticButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-neutral-700 transition-all"
            >
              <Icons.ArrowUp size={24} />
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;

    // Brand gradient colors
    const colors = ['#d946ef', '#a855f7', '#3b82f6'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    resize();

    class Particle {
      constructor() {
        this.reset();
        // Fast forward life so the screen starts full
        const randomLife = Math.floor(Math.random() * 800);
        this.x += this.speedX * randomLife;
        this.y += this.speedY * randomLife;
        this.life = randomLife;
        this.size = Math.max(0.1, this.maxSize * (1 - this.life / 800));
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.maxSize = Math.random() * 6 + 4;
        this.size = this.maxSize;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5 + 0.2;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
        this.life = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        this.life++;
        this.size = Math.max(0, this.maxSize * (1 - this.life / 800));

        // Physics: Mouse Repulsion
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.x -= dx * 0.03;
          this.y -= dy * 0.03;
        }

        // Reset if offscreen or dead
        if (this.x > canvas.width + 100 || this.x < -100 || this.y > canvas.height + 100 || this.y < -100 || this.life > 800 || this.size <= 0) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.restore();
      }
    }

    const numParticles = Math.min(window.innerWidth / 15, 60);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const MagneticButton = ({ children, className, href, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.a
      href={href}
      onClick={onClick}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`magnetic ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springFollowerX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.05 });
  const springFollowerY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.05 });

  useEffect(() => {
    if (window.innerWidth <= 992) return;

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    const interactives = document.querySelectorAll('a, button, input, textarea, select');
    interactives.forEach(el => el.style.cursor = 'none');

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', updateMousePosition);

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .magnetic, input, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      interactives.forEach(el => el.style.cursor = '');
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (pointer: fine) {

        }
      `}} />
      {/* Follower */}
      <motion.div
        className="absolute top-0 left-0 border rounded-full pointer-events-none mix-blend-difference z-[9999]"
        style={{ x: springFollowerX, y: springFollowerY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHovering ? 64 : 32,
          height: isHovering ? 64 : 32,
          backgroundColor: isHovering ? '#ffffff' : 'transparent',
          borderColor: '#ffffff',
          borderWidth: isHovering ? 0 : 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      {/* Core Dot */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none mix-blend-difference z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          backgroundColor: '#ffffff',
          borderRadius: '50%',
        }}
        transition={{ type: 'tween', duration: 0.1 }}
      />
    </div>
  );
};
