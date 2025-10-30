
import React, { useState, useEffect, useRef } from 'react';
import { generateMealPlan } from '../services/geminiService';

interface Meal {
    name: string;
    reason: string;
}

interface DailyTotals {
    calories: string;
    protein: string;
}

interface MealPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    summary: string;
    dailyTotals: DailyTotals;
}

const MealPlanSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-zinc-100 p-5 rounded-lg flex items-start gap-4">
                <div className="bg-zinc-200 w-12 h-12 rounded-full flex-shrink-0"></div>
                <div className="flex-grow">
                    <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-200 rounded w-full"></div>
                </div>
            </div>
        ))}
    </div>
);

const MultiSelectDropdown: React.FC<{
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}> = ({ options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    const handleSelect = (option: string) => {
        let newSelected: string[];

        if (option === 'Any') {
            newSelected = selected.includes('Any') ? [] : ['Any'];
        } else {
            const currentSelected = selected.filter(item => item !== 'Any');
            if (currentSelected.includes(option)) {
                newSelected = currentSelected.filter(item => item !== option);
            } else {
                newSelected = [...currentSelected, option];
            }
        }
        
        if (newSelected.length === 0) {
          newSelected = ['Any'];
        }
        onChange(newSelected);
    };
    
    const isPlaceholder = selected.length === 0 || (selected.length === 1 && selected[0] === 'Any');

    const getDisplayValue = () => {
        if (isPlaceholder) {
            return 'Any Preference';
        }
        if (selected.length === 1) {
            return selected[0];
        }
        return `${selected.length} preferences selected`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white p-3 rounded-lg border-2 border-zinc-200 outline-none focus:border-[var(--primary)] transition-all flex justify-between items-center text-left"
            >
                <span className={`truncate ${isPlaceholder ? 'text-zinc-400' : 'text-zinc-800'}`}>{getDisplayValue()}</span>
                <i className={`fas fa-chevron-down text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-zinc-200 p-2">
                    {options.map(option => (
                        <label key={option} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleSelect(option)}
                                className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export const MealPlanner: React.FC = () => {
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['Any']);
    const [formData, setFormData] = useState({
        healthGoal: 'Weight Loss',
        dislikes: '',
        nutritionalGoals: '',
    });
    const [errors, setErrors] = useState({
        dislikes: '',
        nutritionalGoals: '',
    });

    const validate = () => {
        const newErrors = { dislikes: '', nutritionalGoals: '' };
        let isValid = true;

        if (formData.dislikes.length > 100) {
            newErrors.dislikes = 'Please keep this under 100 characters.';
            isValid = false;
        }

        if (formData.nutritionalGoals.length > 100) {
            newErrors.nutritionalGoals = 'Please keep this under 100 characters.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        setError('');
        setPlan(null);

        try {
            const result = await generateMealPlan(dietaryPreferences, formData.healthGoal, formData.dislikes, formData.nutritionalGoals);
            setPlan(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred while generating the plan.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const mealIcons = { breakfast: 'fa-coffee', lunch: 'fa-sun', dinner: 'fa-moon' };

    return (
        <section id="meal-planner" className="py-16 sm:py-20 md:py-24 bg-white text-zinc-800">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-lime-100/50 p-6 md:p-8 rounded-2xl shadow-2xl animate-on-scroll" data-animation="scale-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                           Bengaluru's #1 AI Meal Planner
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                        </h2>
                        <p className="mt-4 text-zinc-600">Let our AI nutritionist craft a perfect 1-day meal plan from our Bengaluru kitchen, tailored to your health goals!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 form-glow">
                        <div className="relative">
                            <label htmlFor="dietaryPreference" className="block text-sm font-semibold mb-1 text-zinc-700">Dietary Preference</label>
                             <i className="fas fa-leaf absolute top-10 left-4 text-zinc-400 z-10"></i>
                            <div className="pl-10 relative">
                                <MultiSelectDropdown
                                    options={['Any', 'Vegetarian', 'High-Protein', 'Keto']}
                                    selected={dietaryPreferences}
                                    onChange={setDietaryPreferences}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label htmlFor="healthGoal" className="block text-sm font-semibold mb-1 text-zinc-700">Health Goal</label>
                            <i className="fas fa-flag-checkered absolute top-10 left-4 text-zinc-400"></i>
                            <select id="healthGoal" name="healthGoal" value={formData.healthGoal} onChange={handleChange} className="w-full bg-white p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none appearance-none focus:border-[var(--primary)] transition-all">
                                <option>Weight Loss</option><option>Muscle Gain</option><option>Maintain Health</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="nutritionalGoals" className="block text-sm font-semibold mb-1 text-zinc-700">Nutritional Goals (optional)</label>
                            <div className="relative">
                                <i className="fas fa-bullseye absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400"></i>
                                <input type="text" id="nutritionalGoals" name="nutritionalGoals" value={formData.nutritionalGoals} onChange={handleChange} placeholder="e.g., low-carb, high-fiber" className={`w-full bg-white p-3 pl-10 rounded-lg border-2  outline-none placeholder:text-zinc-400 focus:border-[var(--primary)] transition-all ${errors.nutritionalGoals ? 'border-red-500' : 'border-zinc-200'}`} />
                            </div>
                            {errors.nutritionalGoals && <p className="text-red-500 text-xs mt-1">{errors.nutritionalGoals}</p>}
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="dislikes" className="block text-sm font-semibold mb-1 text-zinc-700">Dislikes or Allergies (optional)</label>
                             <div className="relative">
                                 <i className="fas fa-thumbs-down absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400"></i>
                                 <input type="text" id="dislikes" name="dislikes" value={formData.dislikes} onChange={handleChange} placeholder="e.g., mushrooms, nuts" className={`w-full bg-white p-3 pl-10 rounded-lg border-2 outline-none placeholder:text-zinc-400 focus:border-[var(--primary)] transition-all ${errors.dislikes ? 'border-red-500' : 'border-zinc-200'}`} />
                             </div>
                             {errors.dislikes && <p className="text-red-500 text-xs mt-1">{errors.dislikes}</p>}
                        </div>
                        <button type="submit" disabled={isLoading} className="md:col-span-2 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-white font-bold py-3 px-6 rounded-lg text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-400 disabled:from-zinc-400 disabled:shadow-none disabled:scale-100 disabled:text-zinc-500 ripple-effect">
                            {isLoading ? <><div className="meal-plan-loader"></div><span>Crafting Your Plan...</span></> : <>✨ Generate My Plan</>}
                        </button>
                    </form>

                    <div id="mealPlanResult" className="space-y-4">
                        {isLoading && <MealPlanSkeleton />}
                        {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
                        {!isLoading && !plan && !error && (
                            <div className="text-center text-zinc-500 border-2 border-dashed border-zinc-300 p-8 rounded-lg">
                                <i className="fas fa-magic text-3xl mb-3 text-zinc-400"></i>
                                <p className="font-semibold">Unlock your personalized meal plan!</p>
                                <p className="text-zinc-500 text-sm mt-1">Tell us your goals and we'll design a delicious day for you.</p>
                            </div>
                        )}
                        {plan && (
                            <div className="space-y-4 animate-fade-in-pop">
                                {(['breakfast', 'lunch', 'dinner'] as const).map((mealType, index) => (
                                    <div key={mealType} className="bg-white shadow-lg p-4 sm:p-5 rounded-lg flex items-start gap-4 border border-zinc-100">
                                        <div className="bg-zinc-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl text-[var(--primary)] flex-shrink-0">
                                            <i className={`fas ${mealIcons[mealType]}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{mealType}</p>
                                            <h4 className="font-bold text-lg text-[var(--primary-dark)]">{plan[mealType].name}</h4>
                                            <p className="text-sm text-zinc-600">{plan[mealType].reason}</p>
                                        </div>
                                    </div>
                                ))}
                                
                                {plan.dailyTotals && (
                                    <div className="mt-6">
                                        <div className="bg-white/60 p-4 sm:p-5 rounded-lg border-2 border-dashed border-zinc-200">
                                            <h4 className="text-lg font-bold text-center text-[var(--primary-dark)] mb-3">Daily Nutrition Projection</h4>
                                            <div className="flex justify-around text-center">
                                                <div>
                                                    <p className="text-xl font-bold text-[var(--accent-secondary)]">{plan.dailyTotals.calories}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">Calories</p>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-[var(--accent-secondary)]">{plan.dailyTotals.protein}</p>
                                                    <p className="text-sm text-zinc-600 font-medium">Protein</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {plan.summary && (
                                     <blockquote className="bg-[var(--primary-light)] border-l-4 border-[var(--primary)] p-4 rounded-r-lg" >
                                        <p className="text-[var(--primary-dark)] italic font-semibold">"{plan.summary}"</p>
                                    </blockquote>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
