

import React, { useState, useEffect } from 'react';
import { generateHeroCopy } from '../services/geminiService';

const prompts = {
  lateNight: [ // 11pm - 3am
    "Late-Night Cravings? Plan a Healthy Tomorrow.",
    "The City Sleeps, Your Health Goals Don't. Plan Ahead.",
    "Dreaming of a Healthier You? Let's Start Tomorrow.",
  ],
  earlyMorning: [ // 3am - 6am
    "Rise Before the Sun. Fuel Your Day the Right Way.",
    "An Early Start Deserves a Perfect Meal. Plan It Now.",
    "Good Morning, Early Bird! Your Healthy Meals Await.",
  ],
  morning: [ // 6am - 11am
    "Good Morning, Bangalore! What's for Lunch?",
    "Conquer Your Morning. We'veGot Your Lunch Covered.",
    "Fuel Your Productive Morning with a Healthy Meal Plan.",
  ],
  afternoon: [ // 11am - 3pm
    "Lunchtime Hustle? Get Freshness Delivered to Your Desk.",
    "The Perfect Mid-Day Fuel Is Just an Order Away.",
    "Don't Skip Lunch. Elevate It.",
  ],
  lateAfternoon: [ // 3pm - 7pm
    "Imagine a Perfect Dinner Tonight. Let's Make It Happen.",
    "Long Day? A Delicious, Healthy Dinner Is A Click Away.",
    "Finish Your Day Strong. A Chef-Crafted Meal Awaits.",
  ],
  evening: [ // 7pm - 11pm
    "Unwind with a Delicious, Guilt-Free Dinner.",
    "Dinner is Served. The Healthy, Hassle-Free Way.",
    "End Your Day on a High Note. A Perfect Meal Awaits.",
  ],
};

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


export const Hero: React.FC = () => {
  const [heroContent, setHeroContent] = useState({
    subtitle: "Nourish Your Life, One Bite at a Time",
  });
  const [specialGreeting, setSpecialGreeting] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [heroCopies, setHeroCopies] = useState([
    {
      headline: 'Unleash Your\nPeak Performance.',
      subheadline: 'Fuel your ambition with chef-crafted, nutritionist-designed meals, delivered effortlessly to your demanding Bengaluru lifestyle.'
    }
  ]);
  const [currentCopyIndex, setCurrentCopyIndex] = useState(0);


  useEffect(() => {
    // Check for special holidays
    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth() + 1}`;
    if (holidays[dateKey]) {
        setSpecialGreeting(holidays[dateKey]);
    }

    // Set time-based dynamic prompt
    const hour = today.getHours();
    let currentPrompts;

    if (hour >= 3 && hour < 6) {
        currentPrompts = prompts.earlyMorning;
    } else if (hour >= 6 && hour < 11) {
        currentPrompts = prompts.morning;
    } else if (hour >= 11 && hour < 15) {
        currentPrompts = prompts.afternoon;
    } else if (hour >= 15 && hour < 19) {
        currentPrompts = prompts.lateAfternoon;
    } else if (hour >= 19 && hour < 23) {
        currentPrompts = prompts.evening;
    } else {
        currentPrompts = prompts.lateNight;
    }
    
    const subtitle = currentPrompts[Math.floor(Math.random() * currentPrompts.length)];
    
    setHeroContent({ subtitle });

    // Fetch dynamic hero copy from Gemini
    const fetchHeroCopy = async () => {
        try {
            const copies = await generateHeroCopy();
            if (copies && copies.length > 0) {
                // Combine with the default one to ensure there's always something to show
                setHeroCopies(prev => [...prev, ...copies]);
            }
        } catch (error) {
            console.error("Failed to fetch hero copy:", error);
            // Fallback is already in state, so no action needed
        }
    };
    fetchHeroCopy();

  }, []);

  // Effect for rotating copy
  useEffect(() => {
    if (heroCopies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCopyIndex(prevIndex => (prevIndex + 1) % heroCopies.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [heroCopies.length]);
  
  const heroImageUrl = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&fm=webp";
  const currentCopy = heroCopies[currentCopyIndex];

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
            {heroContent.subtitle}
        </h2>
        <h1 key={currentCopyIndex} className="text-5xl sm:text-6xl lg:text-7xl font-bold font-iowan mb-4 leading-tight whitespace-normal animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.2s" style={{textShadow: '0 3px 15px rgba(0,0,0,0.6)'}}>
            {currentCopy.headline.split('\n').map((line, index) => (
                <span key={index} className="block">{line}</span>
            ))}
        </h1>
        <p key={`${currentCopyIndex}-sub`} className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8 text-white/90 animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.3s" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
            {currentCopy.subheadline}
        </p>
        <div className="animate-on-scroll" data-animation="fade-in" data-stagger-delay="0.4s">
            <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ripple-effect">
                <i className="fas fa-shopping-cart"></i> Order Now
            </a>
        </div>
      </div>
    </section>
  );
};
