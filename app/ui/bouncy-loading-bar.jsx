'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import '@/app/ui/bouncy-loading-bar.css';

const NUM_DOTS = 5;
const DOT_ANIMATION_DELAY = 100;
const LOADING_DURATION = 1500;

export default function BouncyLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visibleDots, setVisibleDots] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setVisibleDots(0);

    let dotInterval;
    let loadingTimeout;

    dotInterval = setInterval(() => {
      setVisibleDots(prev => {
        if (prev < NUM_DOTS) {
          return prev + 1;
        }
        clearInterval(dotInterval);
        return prev;
      });
    }, DOT_ANIMATION_DELAY);

    loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      setVisibleDots(0);
      clearInterval(dotInterval);
    }, LOADING_DURATION);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(loadingTimeout);
      setIsLoading(false);
      setVisibleDots(0);
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="bouncy-loading-bar-container">
      {Array.from({ length: NUM_DOTS }).map((_, index) => (
        <div
          key={index}
          className={`bouncy-loading-bar-dot ${index < visibleDots ? 'is-visible' : ''}`}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
