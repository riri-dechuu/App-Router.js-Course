import { lusitana } from '@/app/ui/fonts';

export default function Page() {

  return (
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Customers Page
      </h1>
    );
  }

  export const metadata = {
  title: 'Customers',
};