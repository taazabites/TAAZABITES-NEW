
import React, { useRef } from 'react';

interface Faq {
    question: string;
    answer: string;
}

// FIX: Updated component to use React.FC and an interface for props to correctly handle React's `key` prop.
interface FaqItemProps {
    question: string;
    answer: string;
    staggerDelay: string;
    onToggle: (e: React.SyntheticEvent<HTMLDetailsElement>) => void;
}
const FaqItem: React.FC<FaqItemProps> = ({ question, answer, staggerDelay, onToggle }) => (
    <details 
        onToggle={onToggle} 
        className="bg-white rounded-xl group animate-on-scroll border border-zinc-200/60 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 open:shadow-2xl"
        data-animation="slide-fade-in-up" 
        data-stagger-delay={staggerDelay}
    >
        <summary className="font-semibold text-lg text-zinc-800 p-6 cursor-pointer list-none flex justify-between items-center transition-colors duration-300 group-hover:text-[var(--primary-dark)]">
            <span className="w-[90%]">{question}</span>
            <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                 <i 
                    className="fas fa-plus text-zinc-500 group-hover:text-[var(--primary-dark)] transition-transform duration-300 ease-out group-open:rotate-45"
                    aria-hidden="true"
                 ></i>
            </div>
        </summary>
        <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-open:max-h-[500px]">
            <div className="px-6 pb-6 pt-0 text-zinc-700 leading-relaxed">
                <p>{answer}</p>
            </div>
        </div>
    </details>
);

const FaqSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-zinc-100 rounded-lg p-5 h-20 w-full"></div>
        ))}
    </div>
);


export const Faq: React.FC<{ faqs: Faq[]; isLoading: boolean; }> = ({ faqs, isLoading }) => {
    const faqContainerRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
        if (e.currentTarget.open) {
            // When an item is opened, close all others
            const detailsElements = faqContainerRef.current?.querySelectorAll('details');
            detailsElements?.forEach(details => {
                if (details !== e.currentTarget) {
                    details.open = false;
                }
            });
        }
    };

    return (
        <section id="faq" className="py-16 sm:py-20 md:py-24 bg-[var(--section-bg-light-green)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Frequently Asked Questions
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                </div>
                <div ref={faqContainerRef} className="max-w-3xl mx-auto space-y-4" aria-live="polite" aria-busy={isLoading}>
                    {isLoading && <FaqSkeleton />}
                    {!isLoading && faqs.length > 0 && faqs.map((faq, i) => (
                        <FaqItem 
                            key={i} 
                            question={faq.question} 
                            answer={faq.answer} 
                            staggerDelay={`${i * 0.1}s`} 
                            onToggle={handleToggle} 
                        />
                    ))}
                    {!isLoading && faqs.length === 0 && (
                        <div className="text-center text-zinc-500 border-2 border-dashed border-zinc-300 p-8 rounded-lg animate-on-scroll is-visible" data-animation="fade-in">
                            <i className="fas fa-exclamation-circle text-4xl mb-3 text-zinc-400"></i>
                            <h3 className="font-semibold text-lg text-zinc-700">Questions? We have answers.</h3>
                            <p className="text-zinc-500 mt-1">
                                We're currently unable to load our FAQs. Please try refreshing the page, or contact us directly if you have any questions!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};