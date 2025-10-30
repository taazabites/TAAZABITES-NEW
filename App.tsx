

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Menu } from './components/Menu';
import { CorporateBooking } from './components/CorporateBooking';
import { Subscriptions } from './components/Subscriptions';
import { MealPlanner } from './components/MealPlanner';
import { NutritionApproach } from './components/NutritionApproach';
import { Testimonials } from './components/Testimonials';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import { ExitIntentModal } from './components/ExitIntentModal';
import { AiSearch } from './components/Feedback';
import { About } from './components/About';
import { IngredientSpotlight } from './components/IngredientSpotlight';
import { generateMetaDescription, generateFaqContent } from './services/geminiService';
import { Faq } from './components/Faq';
import { WorkoutCoach } from './components/WorkoutCoach';
import { VideoTestimonials } from './components/VideoTestimonials';

const App: React.FC = () => {
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string; }[]>([]);
  const [isFaqLoading, setIsFaqLoading] = useState(true);

  // Helper function to update meta tags for dynamic SEO
  const updateMetaTag = (identifier: 'name' | 'property', value: string, content: string) => {
    let element = document.querySelector(`meta[${identifier}="${value}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(identifier, value);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  useEffect(() => {
    // Performance: Hide loader quickly after initial render for better perceived speed.
    const loaderTimeout = setTimeout(() => setIsLoaderVisible(false), 500);
    
    // Exit-intent modal trigger: show after 1 to 3 minutes
    const minDelay = 60 * 1000; // 1 minute
    const maxDelay = 3 * 60 * 1000; // 3 minutes
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    const exitModalTimer = setTimeout(() => {
        if (!sessionStorage.getItem('exitModalShown')) {
            setIsExitModalOpen(true);
            sessionStorage.setItem('exitModalShown', 'true');
        }
    }, randomDelay);

    // AI-Powered Dynamic SEO Content
    const fetchSeoContent = async () => {
        // Meta description
        try {
            const result = await generateMetaDescription();
            if (result && result.description) {
                updateMetaTag('name', 'description', result.description);
                updateMetaTag('property', 'og:description', result.description);
                updateMetaTag('name', 'twitter:description', result.description);
            }
        } catch (error) {
            console.error("Failed to fetch dynamic meta description:", error);
        }
    };
    fetchSeoContent();

    // AI-Powered FAQ Content
    const fetchFaqData = async () => {
        try {
            setIsFaqLoading(true);
            const faqData = await generateFaqContent();
            if (faqData && faqData.length > 0) {
                setFaqs(faqData);

                // Dynamically update JSON-LD for SEO
                const script = document.querySelector('script[type="application/ld+json"]');
                if (script) {
                    try {
                        const jsonLd = JSON.parse(script.textContent || '{}');
                        if (jsonLd['@graph']) {
                            const faqPage = jsonLd['@graph'].find((item: any) => item['@type'] === 'FAQPage');
                            if (faqPage) {
                                faqPage.mainEntity = faqData.map(faq => ({
                                    '@type': 'Question',
                                    name: faq.question,
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: faq.answer,
                                    },
                                }));
                                script.textContent = JSON.stringify(jsonLd);
                            }
                        }
                    } catch (e) {
                        console.error("Failed to parse or update FAQ JSON-LD script.", e);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load FAQ content:", error);
            // Fallback: The component will show an error message.
        } finally {
            setIsFaqLoading(false);
        }
    };
    fetchFaqData();


    return () => {
      clearTimeout(loaderTimeout);
      clearTimeout(exitModalTimer);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentScroll = window.scrollY;
    setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Intersection Observer for animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.staggerDelay;
            if (delay) {
              el.style.animationDelay = delay;
            }
            el.classList.add('is-visible');
            observerInstance.unobserve(el);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      animatedElements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      animatedElements.forEach(el => el.classList.add('is-visible'));
    }
  }, [isFaqLoading]); // Re-run observer setup when FAQ data finishes loading to include new elements.
  
  // Ripple Effect Handler
  useEffect(() => {
    const applyRipple = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('.ripple-effect');
        if (!target) return;

        // Create ripple
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');
        
        // Remove old ripple
        const existingRipple = target.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        target.appendChild(ripple);
    };

    document.addEventListener('click', applyRipple);
    return () => document.removeEventListener('click', applyRipple);
  }, []);


  return (
    <div className="bg-[var(--off-white)] text-[#333] font-sans antialiased">
      {isLoaderVisible && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex items-center justify-center transition-opacity duration-500">
          <div className="pulse-loader w-12 h-12 rounded-full bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/50"></div>
        </div>
      )}

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[1300]">
        <div 
          className="h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-secondary)] transition-all duration-200" 
          style={{ width: `${scrollProgress}%` }}>
        </div>
      </div>

      <a className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-[var(--primary)] focus:text-white focus:p-2 focus:z-[10000]" href="#main-content">
        Skip to main content
      </a>

      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <Menu />
        <CorporateBooking />
        <Subscriptions />
        <MealPlanner />
        <WorkoutCoach />
        <NutritionApproach />
        <IngredientSpotlight />
        <Testimonials />
        <VideoTestimonials />
        <Faq faqs={faqs} isLoading={isFaqLoading} />
        <CtaSection />
      </main>
      <Footer />
      <FloatingWidgets onSearchClick={() => setIsSearchOpen(true)} />
      <ExitIntentModal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)} />
      <AiSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default App;