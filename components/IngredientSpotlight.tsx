import React from 'react';

export const IngredientSpotlight: React.FC = () => {
    const ingredient = {
        name: "Avocado",
        title: "The Nutrient-Dense Powerhouse",
        description: "Packed with monounsaturated fats, fiber, and potassium, avocados support heart health, improve digestion, and provide a creamy, satisfying texture to our bowls. We source our Hass avocados from the best local farms.",
        imageUrl: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=800&q=75",
        imageSrcSet: "https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=400&q=75 400w, https://cdn.urbanpiper.com/media/bizmedia/2025/10/25/KwM7z-0b571135-d864-4cc9-826d-f40132708c1c.jpg?format=webp&w=800&q=75 800w",
    };

    return (
        <section id="ingredient-spotlight" className="py-16 sm:py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative animate-on-scroll" data-animation="slide-in-left">
                        <div className="absolute w-[95%] h-full bg-gradient-to-tr from-green-100/80 to-lime-50 rounded-3xl transform rotate-3 -z-10"></div>
                        <div className="rounded-2xl shadow-2xl overflow-hidden aspect-square max-w-lg mx-auto image-container">
                             <img
                                src={ingredient.imageUrl}
                                srcSet={ingredient.imageSrcSet}
                                sizes="(max-width: 1023px) 90vw, 450px"
                                alt={`Spotlight on ${ingredient.name}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                            />
                        </div>
                    </div>
                    <div className="animate-on-scroll" data-animation="slide-in-right">
                        <p className="font-semibold text-[var(--accent-secondary)] mb-2">Ingredient Spotlight</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] mb-4">
                            {ingredient.name}: {ingredient.title}
                        </h2>
                        <p className="text-zinc-600 text-lg leading-relaxed">
                            {ingredient.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};