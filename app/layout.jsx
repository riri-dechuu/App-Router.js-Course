import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DotLoadingBar = dynamic(() => import('@/app/ui/dot-loading-bar'), { ssr: false });
    
export const metadata = {
  title: {
    template: '%s | Next.js Dashboard', 
    default: 'Next.js Dashboard', 
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://nextjs-dashboard-app-router-example.vercel.app'), 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={null}>
          <DotLoadingBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
    