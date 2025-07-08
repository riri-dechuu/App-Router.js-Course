// app/ui/tickets/table.jsx
'use client'; // This directive is crucial to make this a Client Component

import { useEffect, useState } from 'react';
import { getTicketsForUser } from '@/app/lib/actions'; // Import the Server Action for polling
import Link from 'next/link'; // <--- THIS IS THE MISSING IMPORT!

export default function TicketTable({ initialTickets }) {
  // Use state to manage the tickets data, initialized with server-fetched data
  const [tickets, setTickets] = useState(initialTickets);
  // State for loading indicator during polling
  const [loading, setLoading] = useState(false);
  // State for displaying polling errors
  const [error, setError] = useState(null);

  // useEffect hook for implementing polling
  useEffect(() => {
    const pollTickets = async () => {
      setLoading(true); // Set loading state
      setError(null);   // Clear previous errors
      try {
        // Call the Server Action to get the latest tickets
        const latestTickets = await getTicketsForUser();
        setTickets(latestTickets); // Update the state with the new data
      } catch (err) {
        console.error("Failed to poll tickets:", err);
        setError("Failed to load latest tickets. Please refresh the page.");
      } finally {
        setLoading(false); // Clear loading state
      }
    };

    // Immediately fetch tickets when the component mounts (optional, but good for freshness)
    // pollTickets(); // You can uncomment this if you want an immediate refresh after initial load

    // Set up the interval for polling (e.g., every 10 seconds = 10000 ms)
    const intervalId = setInterval(pollTickets, 10000);

    // Cleanup function: clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Update local state if the initialTickets prop changes (e.g., due to a full server re-render)
  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  // Display a message if no tickets are found
  if (!tickets || tickets.length === 0) {
    return <p className="mt-4 text-center text-gray-500">No tickets found.</p>;
  }

  return (
    <div className="mt-6 flow-root">
      {/* Loading and Error Indicators for Polling */}
      {loading && <p className="text-center text-blue-500">Updating tickets...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              {/* Ensure no extra characters or excessive whitespace within this tr */}
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Subject</th>
                <th scope="col" className="px-3 py-5 font-medium">Description</th>
                <th scope="col" className="px-3 py-5 font-medium">Status</th>
                <th scope="col" className="px-3 py-5 font-medium">Created At</th>
                <th scope="col" className="px-3 py-5 font-medium">Last Updated</th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Map over the 'tickets' state for rendering */}
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{ticket.subject}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="max-w-xs truncate">{ticket.description}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* Styling the status badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'On Hold' ? 'bg-orange-100 text-orange-800' :
                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'Closed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* Format date for display */}
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* Format updated_at for display */}
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/tickets/${ticket.id}`} className="text-blue-600 hover:underline">View</Link>
                      <Link href={`/dashboard/tickets/${ticket.id}/edit`} className="text-gray-600 hover:underline">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}