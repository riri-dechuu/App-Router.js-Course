import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import NextTopLoader from 'nextjs-toploader';
    
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
        <NextTopLoader color="#29d" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} showSpinner={false} easing="ease" speed={200} shadow="0 0 10px #29d,0 0 5px #29d" />
        {children}
      </body>
    </html>
  );
}
    