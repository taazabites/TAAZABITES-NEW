import React, { useState, useEffect, useRef, useCallback } from 'react';

interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: string[];
  badge?: string;
  nutritionInfo: string;
  orderLink: string;
}

const menuItemsData: MenuItemProps[] = [
    { name: "High Protein Egg Chicken Meal", description: "Grilled chicken with boiled eggs and seasonal vegetables.", price: "349", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/HYC3ipj-ea1cb459-9f06-4842-9f10-c36beef7395f.jpg?format=webp&w=400&q=75", tags: ["high-protein", "keto", "chefs-pick"], badge: "Chef's Pick", nutritionInfo: "Calories: 450, Protein: 40g, Carbs: 10g, Fat: 28g", orderLink: "https://taazabites.in/item/5215583/fit-feast-chicken-veggies-egg" },
    { name: "Quinoa Power Bowl with Grilled Paneer", description: "Nutrient-packed quinoa with grilled paneer and fresh veggies.", price: "379", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/XQI0vGF-c0de1c2c-b08a-4bf6-94b7-7cb7547c811a.jpg", tags: ["vegetarian", "high-protein", "healthy-start"], badge: "Healthy Start", nutritionInfo: "Calories: 450, Protein: 22g, Carbs: 50g, Fat: 18g", orderLink: "https://taazabites.in/item/5518227/protein-boost-paneer-quinoa-bowl" },
    { name: "Premium Chicken Pink Pasta", description: "Creamy pink sauce with tender chicken and fresh herbs.", price: "459", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/VruXdfjp-e6ccb5c5-fa1f-4e5d-90bc-12161af1fa18.jpg?format=webp&w=400&q=75", tags: ["high-protein", "indulgent"], badge: "Indulgent", nutritionInfo: "Calories: 550, Protein: 35g, Carbs: 50g, Fat: 25g", orderLink: "https://taazabites.in/item/3454075/premium-chicken-pink-pasta" },
    { name: "Dry Fruit Whey Protein Shake", description: "A powerhouse shake with whey protein, almonds, and more.", price: "269", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/15/bCSV8-f1b53677-3e7a-42ac-8e0f-46ed6af19bb6.jpg?format=webp&w=400&q=75", tags: ["high-protein", "keto", "healthy-boost"], badge: "Healthy Boost", nutritionInfo: "Calories: 380, Protein: 25g, Carbs: 30g, Fat: 18g", orderLink: "https://taazabites.in/item/5298366/dry-fruit-whey-protein-shake300ml" },
    { name: "Dry Fruit Chia Pudding", description: "Chia seeds, assorted dry fruits and natural sweeteners.", price: "319", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/03/s9ZRSy5-f46b9d1a-8aca-471a-ae55-11652376cce1.jpg?format=webp&w=400&q=75", tags: ["vegetarian", "healthy-start", "healthy-boost"], badge: "Healthy Start", nutritionInfo: "Calories: 350, Protein: 10g, Carbs: 45g, Fat: 15g", orderLink: "https://taazabites.in/item/5379667/dry-fruit-chia-pudding-350g" },
    { name: "Protein Scramble Rice Bowl", description: "Scrambled eggs, veggie rice, and juicy chicken breast.", price: "349", imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/09/09/5x3bE-3c79d21a-07b6-498b-81fa-649a1c953380.jpg?format=webp&w=400&q=75", tags: ["high-protein"], nutritionInfo: "Calories: 480, Protein: 38g, Carbs: 30g, Fat: 24g", orderLink: "https://taazabites.in/item/5215586/protein-scramble-chicken-egg-rice-bowl" },
];

// Dynamically generate filter options from menu data
const allTags = [...new Set(menuItemsData.flatMap(item => item.tags))];
const tagLabels: { [key: string]: string } = {
    'high-protein': 'High Protein',
    'vegetarian': 'Vegetarian',
    'keto': 'Keto',
    'new-item': 'New',
    'healthy-start': 'Healthy Start',
    'chefs-pick': "Chef's Pick",
    'indulgent': 'Indulgent',
    'healthy-boost': 'Healthy Boost'
};
// Filter and sort tags based on our desired order and existence in data
const availableTags = Object.keys(tagLabels).filter(tag => allTags.includes(tag));


const SocialShareButtons: React.FC<{ name: string; orderLink: string; tags: string[] }> = ({ name, orderLink, tags }) => {
    const shareText = `Check out this delicious "${name}" from Taazabites! Healthy and delicious.`;
    const shareUrl = orderLink;
    const hashtags = ['Taazabites', ...tags.map(t => t.replace(/-/g, ''))].join(',');

    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&hashtags=${hashtags}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-500">Share:</span>
            <div className="flex items-center gap-3 text-lg">
                <a href={shareLinks.whatsapp} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="text-zinc-400 hover:text-[#25D366] transition-colors"><i className="fab fa-whatsapp"></i></a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"><i className="fab fa-twitter"></i></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-zinc-400 hover:text-[#1877F2] transition-colors"><i className="fab fa-facebook-f"></i></a>
            </div>
        </div>
    );
};

const MenuItem: React.FC<MenuItemProps & { onNutritionClick: () => void; staggerDelay: string; }> = ({ name, description, price, imageUrl, badge, onNutritionClick, staggerDelay, orderLink, tags }) => {
    // The useState for image loading has been removed to prevent an unnecessary re-render.
    // The 'is-loaded' class is now added directly in the onLoad event handler for a micro-optimization.
    const baseUrl = imageUrl.split('?')[0];
    const srcSet = `${baseUrl}?format=webp&w=320&q=75 320w, ${baseUrl}?format=webp&w=480&q=75 480w, ${baseUrl}?format=webp&w=640&q=75 640w`;

    return (
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl h-full animate-on-scroll border border-zinc-200/60" data-animation="slide-fade-in-up" data-stagger-delay={staggerDelay}>
            <div className="relative image-container aspect-[4/3]">
                {badge && <span className="absolute top-4 left-4 bg-[var(--accent-secondary)] text-white text-xs font-bold px-3 py-1 rounded-full z-10">{badge}</span>}
                <img 
                    src={imageUrl}
                    srcSet={srcSet}
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
                    alt={`A delicious bowl of ${name} from Taazabites, Bengaluru's top healthy meal delivery.`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                />
            </div>
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold font-iowan text-zinc-800 group-hover:text-[var(--primary-dark)] transition-colors">{name}</h3>
                <p className="text-zinc-600 text-sm mt-2 flex-grow">{description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-xl sm:text-2xl font-extrabold text-zinc-900">₹{price}</p>
                    <button onClick={onNutritionClick} className="text-sm font-semibold text-[var(--primary-dark)] hover:underline flex items-center gap-1">
                        Nutrition <i className="fas fa-info-circle text-xs"></i>
                    </button>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200/70">
                    <SocialShareButtons name={name} orderLink={orderLink} tags={tags} />
                </div>
            </div>
            <div className="p-4 sm:p-6 pt-0 mt-auto">
                <a href={orderLink} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3 px-4 rounded-lg font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-all duration-300 flex items-center justify-center gap-2 ripple-effect transform group-hover:scale-105">
                    <i className="fas fa-shopping-cart"></i> Order Now
                </a>
            </div>
        </article>
    );
};


const Modal: React.FC<{ isVisible: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isVisible, onClose, title, children }) => {
    if (!isVisible) return null;
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative animate-on-scroll" data-animation="scale-up" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h3 className="text-xl font-bold font-iowan text-[var(--primary-dark)]">{title}</h3>
            <button onClick={onClose} className="text-2xl text-zinc-400 hover:text-zinc-600">&times;</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    );
};

export const Menu: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

    const handleFilterToggle = (tag: string) => {
        setSelectedFilters(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    const filteredItems = selectedFilters.length === 0
        ? menuItemsData
        : menuItemsData.filter(item =>
            selectedFilters.some(filter => item.tags.includes(filter))
        );

    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (!isMobile || filteredItems.length <= 1) {
            resetTimeout();
            return;
        }

        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length),
            4000 // Change slide every 4 seconds
        );
        return () => {
            resetTimeout();
        };
    }, [currentIndex, filteredItems.length, isMobile, resetTimeout]);
    
    // Reset index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedFilters]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    const handleNutritionClick = (item: MenuItemProps) => {
        const nutritionParts = item.nutritionInfo.split(', ').map(part => {
            const [key, value] = part.split(': ');
            return { key, value };
        });

        setModalContent({
            title: item.name,
            content: (
                <div className="space-y-2">
                    {nutritionParts.map(({ key, value }) => (
                        <div key={key} className="flex justify-between items-baseline text-sm border-b border-zinc-100 py-1">
                            <span className="font-semibold text-zinc-600">{key}</span>
                            <span className="text-zinc-800 font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            )
        });
    };
    
    const FilterButton = ({ value, label, isActive, onClick }: { value: string; label: string; isActive: boolean; onClick: (value: string) => void; }) => (
      <button 
        onClick={() => onClick(value)}
        aria-pressed={isActive}
        className={`px-4 py-2 sm:px-5 text-sm rounded-full font-semibold transition-all duration-300 ${isActive ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30' : 'bg-white text-zinc-600 hover:bg-zinc-100'}`}
      >
        {label}
      </button>
    );

    return (
        <section id="menu" className="py-16 sm:py-20 md:py-24 bg-[var(--section-bg-light-green)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Our Signature Dishes
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                </div>

                <nav aria-label="Filter dishes" className="flex justify-center flex-wrap items-center gap-2 sm:gap-3 mb-10 animate-on-scroll" data-animation="slide-fade-in-up" data-stagger-delay="0.1s">
                    <FilterButton value="all" label="All" isActive={selectedFilters.length === 0} onClick={() => setSelectedFilters([])} />
                    {availableTags.map(tag => (
                        <FilterButton key={tag} value={tag} label={tagLabels[tag]} isActive={selectedFilters.includes(tag)} onClick={handleFilterToggle} />
                    ))}
                </nav>
                
                {/* Carousel for mobile, Grid for lg+ */}
                <div className="relative lg:hidden">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {filteredItems.map((item) => (
                                <div key={item.name} className="w-full flex-shrink-0 px-2 flex justify-center">
                                    <div className="w-[90%]">
                                        <MenuItem
                                            name={item.name}
                                            description={item.description}
                                            price={item.price}
                                            imageUrl={item.imageUrl}
                                            tags={item.tags}
                                            badge={item.badge}
                                            nutritionInfo={item.nutritionInfo}
                                            orderLink={item.orderLink}
                                            onNutritionClick={() => handleNutritionClick(item)}
                                            staggerDelay="0s"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {filteredItems.length > 1 && (
                        <div className="flex justify-center gap-3 mt-8">
                            {filteredItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-[var(--primary)] scale-125' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                                    aria-label={`Go to dish ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
                    {filteredItems.map((item, index) => (
                       <MenuItem
                            key={item.name}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            imageUrl={item.imageUrl}
                            tags={item.tags}
                            badge={item.badge}
                            nutritionInfo={item.nutritionInfo}
                            orderLink={item.orderLink}
                            onNutritionClick={() => handleNutritionClick(item)}
                            staggerDelay={`${index * 0.05}s`}
                        />
                    ))}
                </div>
            </div>
            <Modal isVisible={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
                {modalContent?.content}
            </Modal>
        </section>
    );
};