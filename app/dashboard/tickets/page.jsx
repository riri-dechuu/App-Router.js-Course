// app/dashboard/tickets/page.jsx
import { fetchTicketsByUserId } from '@/app/lib/data'; // Import the data fetching function
import { auth } from '@/auth'; // Import your authentication utility
import TicketTable from '@/app/ui/tickets/table'; // Import the client component for displaying tickets
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline'; 

export default async function TicketsPage() {
  // Get the current user session to retrieve the user ID
  const session = await auth();
  const userId = session?.user?.id;

  // Handle the case where the user is not logged in or their ID is missing
  if (!userId) {
    // You might want to redirect to login or show a more robust error message
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Please log in to view your tickets.</p>
      </main>
    );
  }

  // Fetch the initial tickets for the user on the server
  // This data will be passed as `initialTickets` to the client component
  let initialTickets = [];
  try {
    initialTickets = await fetchTicketsByUserId(userId);
  } catch (error) {
    console.error("Error fetching initial tickets:", error);
    // You can display an error message on the page if the initial fetch fails
    return (
      <main>
       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>My Tickets Overview</h1>
        <p className="text-red-500">Failed to load tickets. Please try again later.</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>My Tickets Overview</h1>
      {/* Pass the initial data fetched on the server to the client component */}
      <TicketTable initialTickets={initialTickets} />
      {/* Updated button styling below */}
      <div className="mt-4 flex justify-end">
        <Link
          href="/dashboard/tickets/create"
          // <--- UPDATED CLASSNAME TO MATCH OTHER BUTTONS ---
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Create New Ticket</span>{' '}
          <PlusIcon className="h-5 md:ml-4" /> {/* <--- ADDED ICON */}
        </Link>
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Tickets',
};