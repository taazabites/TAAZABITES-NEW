

import React, { useState, useEffect } from 'react';
import { generateHeroCopy } from '../services/geminiService';

const holidays: { [key: string]: string } = {
    "1-1": "Happy New Year, Bangalore!",
    "26-1": "Happy Republic Day!",
    "15-8": "Happy Independence Day!",
    "2-10": "Wishing you a peaceful Gandhi Jayanti.",
    // Note: Diwali's date is variable. A more robust solution would use a library.
    // This is a placeholder for demonstration.
    "1-11": "Happy Diwali! May your life be full of light and joy.", 
    "25-12": "Merry Christmas and Happy Holidays!",
};

const defaultCopy = {
    headline: "Intelligent Fuel.\nEffortless Success.",
    subheadline: "Unlock your optimal health with our revolutionary AI meal planner and gourmet healthy meal delivery, exclusively in Bengaluru."
};


export const Hero: React.FC = () => {
  const [specialGreeting, setSpecialGreeting] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [heroCopy, setHeroCopy] = useState(defaultCopy);

  useEffect(() => {
    // Check for special holidays
    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth() + 1}`;
    if (holidays[dateKey]) {
        setSpecialGreeting(holidays[dateKey]);
    }

    const fetchHeroCopy = async () => {
        try {
            const copies = await generateHeroCopy();
            if (copies && copies.length > 0) {
                const randomIndex = Math.floor(Math.random() * copies.length);
                setHeroCopy(copies[randomIndex]);
            }
        } catch (error) {
            // "Failed to fetch dynamic hero copy:", error
            // Fallback to default copy is already handled by initial state
        }
    };

    fetchHeroCopy();
  }, []);
  
  const heroImageUrl = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&fm=webp";

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
        });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      <div className="absolute inset-0 image-container">
        <img
          src={`${heroImageUrl}&w=1920&q=50`}
          srcSet={`${heroImageUrl}&w=640&q=50 640w, ${heroImageUrl}&w=1280&q=50 1280w, ${heroImageUrl}&w=1920&q=50 1920w`}
          sizes="100vw"
          alt="A healthy and colorful bowl of food with fresh ingredients"
          className={`w-full h-full object-cover animate-ken-burns ${isImageLoaded ? 'is-loaded' : ''}`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
      </div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-5xl">
        {specialGreeting && (
            <div className="mb-4 animate-on-scroll" data-animation="fade-in">
                <p className="inline-block bg-[var(--accent)] text-zinc-900 font-bold px-4 py-2 rounded-full text-lg shadow-lg">
                    {specialGreeting}
                </p>
            </div>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold text-white/90 mb-3 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.1s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
          Imagine a Perfect Dinner Tonight. Let's Make It Happen.
        </h2>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-iowan mb-4 leading-tight whitespace-pre-line animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.2s" style={{textShadow: '0 3px 15px rgba(0,0,0,0.6)'}}>
            {heroCopy.headline}
        </h1>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8 text-white/90 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.3s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
            {heroCopy.subheadline}
        </p>

        {/* Feature Callouts */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 my-8 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.4s">
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <i className="fas fa-concierge-bell text-[var(--accent)]"></i>
                <span>Chef-Crafted Meals</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <i className="fas fa-robot text-[var(--accent)]"></i>
                <span>AI-Powered Plans</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <i className="fas fa-truck-fast text-[var(--accent)]"></i>
                <span>Fresh & Fast Delivery</span>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.5s">
            <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ripple-effect w-full sm:w-auto">
                <i className="fas fa-shopping-cart"></i> Order Now
            </a>
            <div className="relative w-full sm:w-auto">
                <a href="#subscriptions" onClick={handleNavLinkClick} className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ripple-effect w-full">
                    <i className="fas fa-calendar-alt"></i> View Subscriptions
                </a>
                <span className="absolute -top-3 -right-3 bg-white text-[var(--primary-dark)] text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-lg animate-pulse-badge">
                    Best Value
                </span>
            </div>
            <a href="#corporate-booking" onClick={handleNavLinkClick} className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white shadow-lg hover:scale-105 hover:bg-white/20 transition-all duration-300 ripple-effect w-full sm:w-auto">
                 <i className="fas fa-briefcase"></i> Corporate Plans
            </a>
        </div>
      </div>
    </section>
  );
};