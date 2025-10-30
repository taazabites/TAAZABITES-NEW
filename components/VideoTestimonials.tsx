import React, { useState } from 'react';

const videoData = [
    {
        id: 'vid1',
        thumbnail: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&fm=webp&w=400&q=75',
        videoUrl: 'https://www.youtube.com/embed/40_6hW_iIsY',
        author: "Priya Singh",
        title: "My Energy Levels are Through the Roof!",
    },
    {
        id: 'vid2',
        thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&fm=webp&w=400&q=75',
        videoUrl: 'https://www.youtube.com/embed/AdJFE1sp_BE',
        author: "Amit Patel",
        title: "Finally, Healthy Food That's Not Boring",
    },
    {
        id: 'vid3',
        thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&fm=webp&w=400&q=75',
        videoUrl: 'https://www.youtube.com/embed/1k32426nqjA',
        author: "Corporate Client",
        title: "Our Team Loves the Corporate Plan",
    }
];

export const VideoTestimonials: React.FC = () => {
    const [activeVideo, setActiveVideo] = useState(videoData[0]);

    return (
        <section id="video-testimonials" className="py-16 sm:py-20 md:py-28 bg-zinc-800 text-white bg-gradient-to-br from-slate-900 via-zinc-900 to-black">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12 animate-on-scroll" data-animation="slide-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-iowan text-white inline-block relative pb-2">
                        Hear From Our Community
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[var(--accent)]"></span>
                    </h2>
                </div>
                <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
                    {/* Main Video Player */}
                    <div className="lg:w-2/3 w-full animate-on-scroll" data-animation="scale-up">
                        <div className="aspect-video bg-black rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border-2 border-white/20">
                           <iframe
                                key={activeVideo.id} // Re-mounts iframe on video change
                                width="100%"
                                height="100%"
                                src={`${activeVideo.videoUrl}?modestbranding=1&rel=0&controls=1`}
                                title={`Testimonial from ${activeVideo.author}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="animate-fade-in"
                            ></iframe>
                        </div>
                    </div>

                    {/* Playlist: Horizontal carousel on mobile, vertical list on desktop */}
                    <div className="lg:w-1/3 w-full flex-shrink-0 animate-on-scroll flex overflow-x-auto gap-4 py-2 lg:flex-col lg:space-y-4 lg:gap-0 lg:py-0 hide-scrollbar snap-x snap-mandatory" data-animation="slide-in-right" data-stagger-delay="0.2s">
                        {videoData.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => setActiveVideo(video)}
                                className={`w-4/5 sm:w-3/5 md:w-1/2 lg:w-full flex-shrink-0 snap-center flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left ${activeVideo.id === video.id ? 'bg-white/20 scale-105' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 image-container">
                                    <img 
                                        src={video.thumbnail} 
                                        alt={`Thumbnail for ${video.author}'s testimonial`}
                                        className="w-full h-full object-cover" 
                                        loading="lazy"
                                        decoding="async"
                                        onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
                                     />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{video.author}</h4>
                                    <p className="text-sm text-white/60">{video.title}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </section>
    );
};