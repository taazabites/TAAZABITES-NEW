import React, { useState, useRef, useEffect } from 'react';

const StepCard = ({ number, icon, title, text, staggerDelay }: { number: string; icon: string; title: string; text: string; staggerDelay: string; }) => (
    <article className="relative pt-8 sm:pt-12 animate-on-scroll z-10" data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-zinc-200/60 flex flex-col items-center text-center h-full">
            <div className="absolute -top-8 sm:-top-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--primary)] to-lime-400 text-white rounded-full shadow-lg border-4 border-white">
                <i className={`fas ${icon} text-2xl sm:text-3xl`}></i>
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center bg-[var(--accent-secondary)] text-white text-sm font-bold rounded-full border-2 border-white shadow-sm">
                {number}
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-iowan text-[var(--primary-dark)] mb-2 mt-8">{title}</h3>
            <p className="text-zinc-600 max-w-xs text-sm flex-grow">{text}</p>
        </div>
    </article>
);


export const HowItWorks: React.FC = () => {
    const steps = [
        { number: "1", icon: "fa-magic", title: "Craft Your Plan", text: "Select from our curated menu or let our AI nutritionist design a personalized plan tailored to your unique goals and tastes.", staggerDelay: "0s" },
        { number: "2", icon: "fa-utensils", title: "We Cook & Deliver", text: "Our culinary experts craft each meal using the freshest local ingredients, which is then delivered straight to your doorstep.", staggerDelay: "0.2s" },
        { number: "3", icon: "fa-rocket", title: "Heat, Eat & Conquer", text: "No prep, no cleanup. Just heat, enjoy, and feel the energy to conquer your day. Healthy eating has never been this simple.", staggerDelay: "0.4s" }
    ];
    
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLElement | null)[]>([]);

    const handleDotClick = (index: number) => {
        stepRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = stepRefs.current.indexOf(entry.target as HTMLElement);
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                root: scrollContainerRef.current,
                threshold: 0.7,
            }
        );

        const currentStepRefs = stepRefs.current;
        currentStepRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentStepRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-white overflow-x-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Healthy Eating, Simplified
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-zinc-600">Get fresh, nutritionist-designed meals delivered to your doorstep in just three easy steps.</p>
                </div>

                {/* Mobile Slider */}
                <div className="lg:hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-pl-4 hide-scrollbar -mx-4 px-4 py-8"
                    >
                        {steps.map((step, index) => (
                             <div 
                                key={index}
                                ref={el => { stepRefs.current[index] = el; }}
                                className={`flex-shrink-0 w-[85vw] max-w-sm snap-center px-2 transition-all duration-500 ease-in-out transform ${activeIndex === index ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}`}
                             >
                                <StepCard 
                                    number={step.number}
                                    icon={step.icon}
                                    title={step.title}
                                    text={step.text}
                                    staggerDelay="0s" 
                                />
                            </div>
                        ))}
                    </div>
                     <div className="flex justify-center gap-3 mt-4">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-[var(--primary)] scale-125' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                                aria-label={`Go to step ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-x-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 mt-[-100px] -z-10">
                        <svg width="100%" height="2">
                            <line x1="15%" y1="1" x2="85%" y2="1" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" />
                        </svg>
                    </div>
                    {steps.map(step => (
                        <StepCard 
                            key={step.number} 
                            number={step.number}
                            icon={step.icon}
                            title={step.title}
                            text={step.text}
                            staggerDelay={step.staggerDelay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};