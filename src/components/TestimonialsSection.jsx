'use client'
import React, { useEffect, useRef, useState } from 'react';

const TestimonialSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const viewMoreRef = useRef(null);

  // Sample testimonial data with audio URLs
  const testimonials = [
    {
      id: 1,
      name: "Jane Cooper",
      date: "April 28, 2025",
      image: "/beauty-skin.png",
      text: "This product has completely transformed my daily routine. The results are visible within just a few days of use.",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Sample audio
      extraContent: false
    },
    {
      id: 2,
      name: "Theresa Wecoy",
      date: "May 10, 2025",
      image: "/beauty-skin.png",
      text: "I've tried many similar products, but none come close to this one. The texture is perfect, and it leaves my skin feeling incredibly soft and refreshed. Highly recommend! The packaging is also beautiful and eco-friendly. I love how sustainable this brand is.",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 3,
      name: "Monzera Gurphy",
      date: "May 12, 2025",
      image: "/beauty-skin.png",
      text: "Silvara Blemish Control Serum has been a game-changer for my skin. Within weeks, my breakouts reduced and my skin texture feels smoother than ever. It absorbs quickly and doesn't leave any sticky residue!",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      extraContent: false
    }
  ];

  useEffect(() => {
    // Set initial state for all cards - stacked and hidden
    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.position = 'sticky';
        card.style.top = '10px';
        card.style.transform = `translateY(100px) scale(0.9)`;
        card.style.opacity = '0';
        card.style.zIndex = index + 1;
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    });

    // Header animation
    if (headerRef.current) {
      headerRef.current.style.opacity = '0';
      headerRef.current.style.transform = 'translateY(30px)';
    }

    // View more button initial state
    if (viewMoreRef.current) {
      viewMoreRef.current.style.opacity = '0';
      viewMoreRef.current.style.transform = 'translateY(30px)';
    }

    // Create scroll-triggered animations for each card
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardTop = cardRect.top + scrollY;
          const triggerPoint = cardTop - windowHeight + 100;
          
          if (scrollY > triggerPoint) {
            setTimeout(() => {
              // Adjust stacking offset for mobile
              const stackOffset = window.innerWidth < 768 ? 50 : 100;
              card.style.transform = `translateY(${index * stackOffset}px) scale(1)`;
              card.style.opacity = '1';
            }, index * 100);
          }
        }
      });
    };

    // Intersection Observer for header and view more button
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headerRef.current) {
              entry.target.style.transition = 'all 0.8s ease-out';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }

            if (entry.target === viewMoreRef.current) {
              setTimeout(() => {
                entry.target.style.transition = 'all 0.8s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }, 500);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Observe header and view more button
    if (headerRef.current) observer.observe(headerRef.current);
    if (viewMoreRef.current) observer.observe(viewMoreRef.current);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
          <div class="absolute w-full h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -top-40 left-0 animate-pulse"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-slate-800 mb-4 md:mb-6 leading-tight px-4 font-serif">
            What They Say<br />
            <span className="text-slate-600">About Beaucare Product</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
          </p>
        </div>

        {/* Cards Container with Stacking Space */}
        <div ref={containerRef} className="space-y-4 md:space-y-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              ref={(el) => (cardsRef.current[index] = el)}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 md:mt-20">
          <button
            ref={viewMoreRef}
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-full font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

// Audio Player Component
const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickRatio = clickX / progressWidth;
    const newTime = clickRatio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={!isLoaded}
        className={`
          w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg flex-shrink-0
          ${isLoaded 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-110 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 md:w-5 md:h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Waveform-style Progress Bar */}
      <div className="flex-1 h-6 md:h-8 flex items-center min-w-0">
        <div 
          ref={progressRef}
          className="relative w-full h-5 md:h-6 cursor-pointer flex items-center"
          onClick={handleProgressClick}
        >
          {/* Waveform background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center gap-0.5">
              {[...Array(window.innerWidth < 768 ? 40 : 60)].map((_, i) => {
                const height = Math.random() * (window.innerWidth < 768 ? 16 : 20) + 4;
                const isActive = i < (progressPercentage / 100) * (window.innerWidth < 768 ? 40 : 60);
                return (
                  <div
                    key={i}
                    className={`w-0.5 md:w-1 rounded-full transition-all duration-150 ${
                      isActive 
                        ? 'bg-gradient-to-t from-purple-400 to-purple-600' 
                        : 'bg-gray-300'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Time Display */}
      <div className="text-xs md:text-sm text-gray-600 font-medium min-w-[70px] md:min-w-[80px] text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

// Individual Testimonial Card Component
const TestimonialCard = React.forwardRef(({ testimonial }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-gradient-to-b from-gray-200 to-gray-400 backdrop-blur-sm rounded-3xl overflow-hidden mx-auto max-w-5xl
                 flex flex-col md:flex-row h-auto md:h-[400px]"
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Image Section */}
      <div className="w-full md:w-[60%] h-48 md:h-full relative">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Section */}
      <div className="w-[88%] max-md:-translate-y-5 max-md:translate-x-5 md:w-[50%] p-4 md:p-6 flex flex-col justify-between 
                      md:absolute md:bg-white md:h-[90%] rounded-2xl 
                      md:-translate-y-1/2 md:top-1/2 md:right-6 bg-white">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
            <h3 className="text-lg md:text-xl font-semibold text-slate-800">{testimonial.name}</h3>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-base md:text-lg">★</span>
              ))}
            </div>
          </div>
          <span className="text-xs md:text-sm text-slate-500 mb-3 md:mb-4 block">{testimonial.date}</span>
          
          <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-3 md:mb-4">
            {testimonial.text}
          </p>
          
          {testimonial.extraContent && (
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <p className="text-xs md:text-sm text-slate-600 italic">
                "This product has become a staple in my routine. The consistency and quality are unmatched!"
              </p>
            </div>
          )}
        </div>
        
        {/* Audio Player */}
        <div className="mt-3 md:mt-4">
          <AudioPlayer audioUrl={testimonial.audioUrl} />
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialSection;