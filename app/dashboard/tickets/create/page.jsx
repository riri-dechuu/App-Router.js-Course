// app/dashboard/tickets/create/page.jsx
import { lusitana } from '@/app/ui/fonts'; // For consistent styling
import CreateTicketForm from '@/app/ui/tickets/create-form'; // We'll create this next

export const metadata = {
  title: 'Create Ticket',
};

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Create New Support Ticket</h1>
      <CreateTicketForm /> {/* This is the form component we will build next */}
    </main>
  );
}