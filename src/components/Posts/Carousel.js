import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Carousel = ({ posts = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mouseX, setMouseX] = useState(0);

  useEffect(() => {
    if (!isPaused && !isAnimating) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [currentIndex, posts.length, isPaused, isAnimating]);

  const handleMouseMove = useCallback((e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const mouseXPercentage = ((e.clientX - left) / width) * 100;
    setMouseX(mouseXPercentage);
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? posts.length - 1 : prevIndex - 1;
      setTimeout(() => setIsAnimating(false), 600);
      return newIndex;
    });
  }, [posts.length, isAnimating]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === posts.length - 1 ? 0 : prevIndex + 1;
      setTimeout(() => setIsAnimating(false), 600);
      return newIndex;
    });
  }, [posts.length, isAnimating]);

  const getCardStyle = useCallback((index) => {
    const diff = (index - currentIndex + posts.length) % posts.length;
    const mouseOffset = (mouseX - 50) * 0.02;

    let transform = '';
    let opacity = 0;
    let zIndex = 0;
    let filter = '';

    if (diff === 0) { 
      transform = `
        perspective(2000px) 
        rotateY(${mouseOffset}deg) 
        translateZ(0)
      `;
      opacity = 1;
      zIndex = 30;
    } else if (diff === 1 || diff === -posts.length + 1) { 
      transform = `
        perspective(2000px) 
        rotateY(${25 + mouseOffset}deg) 
        translateZ(-250px) 
        translateX(50%)
      `;
      opacity = 0.8;
      zIndex = 20;
      filter = 'brightness(0.7)';
    } else if (diff === -1 || diff === posts.length - 1) { 
      transform = `
        perspective(2000px) 
        rotateY(${ -25 + mouseOffset}deg) 
        translateZ(-250px) 
        translateX(-50%)
      `;
      opacity = 0.8;
      zIndex = 20;
      filter = 'brightness(0.7)';
    }

    return {
      transform,
      opacity,
      zIndex,
      filter
    };
  }, [currentIndex, posts.length, mouseX]);

  if (!posts.length) return null;

  return (
    <div className="relative w-full py-4">
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/5 dark:to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.2),transparent)]" />
      
      <div 
        className="relative h-[400px] w-full overflow-visible mx-auto max-w-6xl"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setMouseX(50);
        }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {posts.map((post, index) => {
              const slideKey = post._id || `slide-${index}-${Date.now()}`;
              const style = getCardStyle(index);
              
              return (
                <Link
                  key={slideKey}
                  to={post.link || `/post/${post._id}`}
                  className="absolute w-[90%] h-[95%] transition-all duration-700 ease-out hover:cursor-pointer will-change-transform"
                  style={{
                    transform: style.transform,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    filter: style.filter,
                  }}
                >
                  <div className="relative h-full w-full rounded-2xl overflow-hidden 
                                shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                                backdrop-blur-sm bg-white/30 dark:bg-black/30
                                group hover:shadow-[0_20px_50px_rgb(0,0,0,0.3)] dark:hover:shadow-[0_20px_50px_rgb(0,0,0,0.5)]
                                transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent dark:from-black/90 dark:via-black/40 dark:to-black/20" />
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{post.title}</h3>
                      {post.description && (
                        <p className="text-base text-gray-100 dark:text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 导航按钮 */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm
                     text-gray-800 dark:text-gray-200
                     hover:bg-white/50 dark:hover:bg-gray-800/50
                     transition-all duration-300
                     shadow-lg hover:shadow-xl"
            style={{ zIndex: 40 }}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                     bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm
                     text-gray-800 dark:text-gray-200
                     hover:bg-white/50 dark:hover:bg-gray-800/50
                     transition-all duration-300
                     shadow-lg hover:shadow-xl"
            style={{ zIndex: 40 }}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
