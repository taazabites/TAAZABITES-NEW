

import React, { useEffect, useState } from 'react';

// --- Reusable Content Blocks for DRY Code ---

const BrandInfo: React.FC = () => (
    <>
        <a href="#hero" className="flex items-center gap-2 text-3xl font-bold font-iowan mb-4">
            <span className="text-[var(--primary)]">taaza</span>
            <span className="text-[var(--accent-secondary)]">bites</span>
            <sup className="text-xs top-[-1em] text-zinc-400">™</sup>
        </a>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">Taazabites is Bengaluru's choice for the best healthy food delivery. We offer chef-crafted, nutritionist-designed meals for a healthier you, delivered fresh every day across Bengaluru.</p>
    </>
);

const BusinessLinkButton: React.FC<{ href: string; brandName: string; brandColorClass: string; textColorClass?: string; }> = ({ href, brandName, brandColorClass, textColorClass = 'text-white' }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center justify-center px-4 py-3 rounded-lg ${brandColorClass} transition-all duration-300 hover:scale-105 hover:shadow-lg w-full`}
        aria-label={`Find us on ${brandName}`}
    >
        <span className={`font-bold ${textColorClass} transition-colors duration-300`}>{brandName}</span>
    </a>
);

const businessLinksData = [
    { href: "https://www.zomato.com/hi/bangalore/taaza-bites-hosur-road-bangalore", brandName: 'Zomato', brandColorClass: 'bg-[#EF4F5F] hover:bg-red-600' },
    { href: "https://www.swiggy.com/city/bangalore/taaza-bites-hosa-road-bellandur-sarjapur-rest826917", brandName: 'Swiggy', brandColorClass: 'bg-[#FC8019] hover:bg-orange-600' },
    { href: "https://jsdl.in/DT-15ZJTT2REVN", brandName: 'Justdial', brandColorClass: 'bg-[#ffc107] hover:bg-yellow-500', textColorClass: 'text-zinc-900' }
];

const BusinessLinksGroup: React.FC = () => (
    <div className="mt-6">
        <h5 className="font-semibold text-white/80 mb-3">Find us on:</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {businessLinksData.map(link => (
                <BusinessLinkButton
                    key={link.brandName}
                    href={link.href}
                    brandName={link.brandName}
                    brandColorClass={link.brandColorClass}
                    textColorClass={link.textColorClass}
                />
            ))}
        </div>
    </div>
);

const SocialIcon: React.FC<{ href: string; icon: string; label: string }> = ({ href, icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-zinc-400 hover:text-[var(--primary)] text-xl transition-colors duration-300">
        <i className={`fab fa-${icon}`}></i>
    </a>
);

const socialLinksData = [
    { href: "https://www.facebook.com/taazabites", icon: 'facebook-f', label: 'Facebook' },
    { href: "https://www.instagram.com/taazabites", icon: 'instagram', label: 'Instagram' },
    { href: "https://twitter.com/taazabites", icon: 'twitter', label: 'Twitter' },
    { href: "#", icon: 'linkedin-in', label: 'LinkedIn' }
];

const SocialLinksGroup: React.FC = () => (
    <div className="mt-8">
        <h5 className="font-semibold text-white/80 mb-3">Follow Us:</h5>
        <div className="flex items-center gap-5">
            {socialLinksData.map(link => (
                <SocialIcon key={link.label} href={link.href} icon={link.icon} label={link.label} />
            ))}
        </div>
    </div>
);


const ContactItem: React.FC<{ href: string; icon: string; title: string; value: string; isExternal?: boolean; }> = ({ href, icon, title, value, isExternal }) => (
    <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : ''} className="group flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-white/10">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors shrink-0">
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <p className="font-bold text-white">{title}</p>
            <p className="text-zinc-400 group-hover:text-white transition-colors text-sm">{value}</p>
        </div>
    </a>
);

const ContactInfo: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 py-8 border-y border-white/10">
        <ContactItem href="https://share.google/QhJqtjedmoC0h7Hsr" icon="fa-map-marker-alt" title="Our Location" value="Kasavanahalli, Bengaluru" isExternal />
        <ContactItem href="tel:+917975771457" icon="fa-phone" title="Call Us" value="+91 7975771457" />
        <ContactItem href="mailto:Taazabitesindia@gmail.com" icon="fa-envelope" title="Email Us" value="Taazabitesindia@gmail.com" />
    </div>
);

const NewsletterForm: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setMessage('Please enter a valid email address.');
            setIsError(true);
        } else {
            setMessage('Thank you for subscribing!');
            setIsError(false);
            setEmail('');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const wrapperClass = isMobile ? "" : "lg:col-span-3";
    const formClass = "flex gap-2";

    return (
        <div className={wrapperClass}>
            <h4 className={`text-lg font-bold font-iowan text-white mb-4 tracking-wide ${isMobile ? 'text-center' : ''}`}>Stay Fresh</h4>
            {!isMobile && <p className="text-zinc-400 text-sm mb-4">Get updates on new meals, exclusive offers, and health tips delivered to your inbox.</p>}
            <form onSubmit={handleNewsletterSubmit} className={`${formClass} ${isMobile ? 'max-w-sm mx-auto' : ''}`}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none placeholder:text-zinc-500" />
                <button type="submit" aria-label="Subscribe" className="bg-[var(--accent-secondary)] text-white font-bold w-14 h-14 rounded-lg hover:bg-[#F84D15] shadow-lg shadow-[var(--accent-secondary)]/20 hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
            {message && <p className={`text-sm mt-2 text-center ${isError ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
        </div>
    );
};

const Copyright: React.FC<{ year: number }> = ({ year }) => (
     <div className="text-center text-zinc-500 text-sm pt-8 mt-8 border-t border-white/10">
        <p>© {year} Taazabites™. All rights reserved.</p>
        <p className="mt-1">FSSAI Lic. No.: <a href="#" className="font-semibold text-zinc-400 hover:text-[var(--primary)] transition-colors">21223188002425</a></p>
    </div>
);


// --- Link Data & Sub-components for Links ---

const quickLinks = [
    { href: "#hero", text: "Home" }, { href: "#menu", text: "Menu" },
    { href: "#about", text: "About Us" }, { href: "#faq", text: "FAQ" }
];
const servicesLinks = [
    { href: "#subscriptions", text: "Meal Plans" }, { href: "#corporate-booking", text: "Corporate Catering" },
    { href: "#meal-planner", text: "AI Planner" }, { href: "#nutrition-approach", text: "Our Approach" }
];
const legalLinks = [
    { href: "https://taazabites.in/privacy-policy", text: "Privacy Policy" }, { href: "https://taazabites.in/terms-conditions", text: "Terms of Service" },
    { href: "https://taazabites.in/return-and-refund-policy", text: "Refund Policy" }, { href: "https://taazabites.in/shipping-policy", text: "Shipping Policy" },
];

const FooterLink: React.FC<{ href: string; text: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void; }> = ({ href, text, onClick }) => {
    const isInternalAnchor = href.startsWith('#');
    return (
        <li>
            <a 
                href={href} 
                onClick={onClick}
                target={isInternalAnchor ? undefined : "_blank"}
                rel={isInternalAnchor ? undefined : "noopener noreferrer"}
                className="text-zinc-400 hover:text-[var(--primary)] transition-colors duration-300 flex items-center gap-2 group"
            >
                <span className="w-0 h-px bg-[var(--primary)] group-hover:w-3 transition-all duration-300"></span>
                <span>{text}</span>
            </a>
        </li>
    );
};

const FooterLinkColumn: React.FC<{ title: string; links: { href: string; text: string }[]; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void; }> = ({ title, links, onClick }) => (
    <div>
        <h4 className="text-lg font-bold font-iowan text-white mb-4 tracking-wide">{title}</h4>
        <ul className="space-y-3">
            {links.map((link) => <FooterLink key={link.text} href={link.href} text={link.text} onClick={onClick} />)}
        </ul>
    </div>
);

const CollapsibleFooterLinks: React.FC<{ title: string; links: { href: string; text: string }[]; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void; }> = ({ title, links, onClick }) => (
    <details className="border-b border-white/10 py-2 group">
        <summary className="font-semibold text-lg text-white list-none cursor-pointer flex justify-between items-center py-2">
            {title}
            <span className="group-open:rotate-45 transition-transform"><i className="fas fa-plus"></i></span>
        </summary>
        <ul className="space-y-3 pt-3 pb-4">
            {links.map(link => {
                const isInternalAnchor = link.href.startsWith('#');
                return (
                    <li key={link.text}>
                        <a 
                            href={link.href}
                            onClick={onClick}
                            target={isInternalAnchor ? undefined : "_blank"}
                            rel={isInternalAnchor ? undefined : "noopener noreferrer"}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            {link.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    </details>
);


export const Footer: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    useEffect(() => setYear(new Date().getFullYear()), []);

    const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        }
    };

    return (
        <footer className="bg-gradient-to-t from-gray-900 via-black to-black text-zinc-300 pt-20 pb-8">
            <div className="container mx-auto px-4">

                {/* --- MOBILE LAYOUT --- */}
                <div className="lg:hidden space-y-8">
                    <BrandInfo />
                    <ContactInfo />
                    <BusinessLinksGroup />
                    <SocialLinksGroup />
                    <NewsletterForm isMobile />
                    <div>
                        <CollapsibleFooterLinks title="Quick Links" links={quickLinks} onClick={handleFooterLinkClick} />
                        <CollapsibleFooterLinks title="Our Services" links={servicesLinks} onClick={handleFooterLinkClick} />
                        <CollapsibleFooterLinks title="Legal" links={legalLinks} onClick={handleFooterLinkClick} />
                    </div>
                </div>

                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden lg:block">
                    <div className="grid lg:grid-cols-12 gap-12 mb-12">
                        <div className="lg:col-span-3">
                            <BrandInfo />
                            <BusinessLinksGroup />
                            <SocialLinksGroup />
                        </div>
                        <div className="lg:col-span-2"><FooterLinkColumn title="Quick Links" links={quickLinks} onClick={handleFooterLinkClick} /></div>
                        <div className="lg:col-span-2"><FooterLinkColumn title="Our Services" links={servicesLinks} onClick={handleFooterLinkClick} /></div>
                        <div className="lg:col-span-2"><FooterLinkColumn title="Legal" links={legalLinks} onClick={handleFooterLinkClick} /></div>
                        <NewsletterForm />
                    </div>
                    <ContactInfo />
                </div>
                
                {/* --- COMMON COPYRIGHT --- */}
                <Copyright year={year} />
            </div>
        </footer>
    );
};