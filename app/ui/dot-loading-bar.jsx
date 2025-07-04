'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import '@/app/ui/dot-loading-bar.css';

export default function DotLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate load duration

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="dot-loading-bar-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="dot-loading-bar-dot" />
      ))}
    </div>
  );
}
