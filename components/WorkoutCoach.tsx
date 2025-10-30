import React, { useState } from 'react';
import { generateWorkoutSuggestion } from '../services/geminiService';

const WorkoutResultSkeleton = () => (
    <div className="space-y-4 animate-pulse mt-6">
        <div className="h-6 bg-zinc-200 rounded w-1/3"></div>
        <div className="space-y-2">
            <div className="h-4 bg-zinc-200 rounded w-full"></div>
            <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-zinc-200 rounded w-1/3 mt-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-zinc-200 rounded w-full"></div>
            <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
            <div className="h-4 bg-zinc-200 rounded w-full"></div>
        </div>
    </div>
);

export const WorkoutCoach: React.FC = () => {
    const [healthGoal, setHealthGoal] = useState('Weight Loss');
    const [workout, setWorkout] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setWorkout('');

        try {
            const result = await generateWorkoutSuggestion(healthGoal);
            setWorkout(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderResult = (text: string) => {
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
            .replace(/\n/g, '<br />');
        
        // Wrap lists
        html = html.replace(/(<li.*?>.*?<\/li>)/gs, '<ul>$1</ul>').replace(/<\/ul><br \/><ul>/g, '');
        return html;
    };

    return (
        <section id="workout-coach" className="py-16 sm:py-20 md:py-24 bg-[var(--section-bg-light-green)]">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-[var(--primary-dark)] inline-block relative pb-2">
                        Your AI Workout Coach
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                    <p className="mt-4 text-zinc-600">Complement your healthy meals with a quick, AI-generated workout plan. No equipment needed!</p>
                </div>

                <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-200/60 animate-on-scroll" data-animation="fade-in">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 form-glow">
                        <div className="w-full sm:w-1/2 relative">
                            <label htmlFor="healthGoalWorkout" className="sr-only">Health Goal</label>
                            <i className="fas fa-flag-checkered absolute top-1/2 -translate-y-1/2 left-4 text-zinc-400"></i>
                            <select 
                                id="healthGoalWorkout" 
                                value={healthGoal} 
                                onChange={(e) => setHealthGoal(e.target.value)} 
                                className="w-full bg-white p-3 pl-10 rounded-lg border-2 border-zinc-200 outline-none appearance-none focus:border-[var(--primary)] transition-all"
                            >
                                <option>Weight Loss</option>
                                <option>Muscle Gain</option>
                                <option>Maintain Health</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full sm:w-1/2 bg-gradient-to-r from-[var(--accent-secondary)] to-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-zinc-400 disabled:from-zinc-400 disabled:shadow-none disabled:scale-100 ripple-effect"
                        >
                            {isLoading ? <div className="meal-plan-loader"></div> : <><i className="fas fa-dumbbell"></i><span>Generate Workout</span></>}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-200">
                        {isLoading && <WorkoutResultSkeleton />}
                        {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
                        {!isLoading && !workout && !error && (
                            <div className="text-center text-zinc-500 p-6">
                                <i className="fas fa-running text-3xl mb-3 text-zinc-400"></i>
                                <p className="font-semibold">Select your goal and get a personalized workout!</p>
                            </div>
                        )}
                        {workout && (
                            <div className="prose prose-zinc max-w-none ai-results animate-fade-in-pop" dangerouslySetInnerHTML={{ __html: renderResult(workout) }}></div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};