// app/lib/actions.js
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres'; // Assuming this is your direct postgres connection
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth'; // To get user session
import { fetchTicketsByUserId } from '@/app/lib/data'; // For tickets data fetching (used by getTicketsForUser)

// Initialize your PostgreSQL connection
const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

// =============================================================
// Invoice-related Schemas and Actions (from Next.js tutorial)
// =============================================================

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * @typedef {Object} State
 * @property {{ customerId?: string[], amount?: string[], status?: string[] }} [errors]
 * @property {string | null} [message]
 */

export async function createInvoice(prevState, formData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Database Error: Failed to Create Invoice.', error); // Added console.error for debugging
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function updateInvoice(id, prevState, formData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error: Failed to Update Invoice.', error); // Added console.error for debugging
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    console.error('Database Error: Failed to Delete Invoice.', error);
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

// =============================================================
// Authentication Action
// =============================================================

export async function authenticate(prevState, formData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// =============================================================
// Ticket-related Schemas and Actions
// =============================================================

// Schema for validating ticket form data
const TicketFormSchema = z.object({
  id: z.string().optional(), // ID is optional for creation, used for updates
  subject: z.string().min(1, { message: 'Subject cannot be empty.' }),
  description: z.string().min(1, { message: 'Description cannot be empty.' }),
  status: z.enum(['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'], {
    invalid_type_error: 'Please select a valid status for the ticket.',
  }).default('Open'), // Default to 'Open' for new tickets
});

// Schema for creating a new ticket (omits 'id' from input)
const CreateTicketInputSchema = TicketFormSchema.omit({ id: true });

// Server Action to create a new ticket
export async function createTicket(prevState, formData) {
  // 1. Get the current user ID from the session
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: 'Authentication Error: User not logged in.',
      errors: {},
    };
  }

  // 2. Validate form fields using the Zod schema
  const validatedFields = CreateTicketInputSchema.safeParse({
    subject: formData.get('subject'),
    description: formData.get('description'),
    status: formData.get('status'), // This will typically be 'Open' from the hidden input in create-form
  });

  // 3. Handle validation errors
  if (!validatedFields.success) {
    console.error('Validation Error for Create Ticket:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Ticket.',
    };
  }

  // 4. Extract validated data and prepare timestamps
  const { subject, description, status } = validatedFields.data;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // 5. Insert data into the database
  try {
    await sql`
      INSERT INTO tickets (user_id, subject, description, status, created_at, updated_at)
      VALUES (${userId}, ${subject}, ${description}, ${status}, ${createdAt}::timestamp, ${updatedAt}::timestamp)
    `;
  } catch (error) {
    console.error('Database Error: Failed to Create Ticket.', error);
    return {
      message: 'Database Error: Failed to Create Ticket. Please try again.',
      errors: {},
    };
  }

  // 6. Revalidate the cache for the tickets list page to show the new ticket
  revalidatePath('/dashboard/tickets');
  // Return a success message. The client-side form will handle redirection.
  return { message: 'Ticket created successfully!', errors: {} };
}

// Server Action for polling tickets (from previous step)
export async function getTicketsForUser() {
  const session = await auth(); // Get the current user session
  const userId = session?.user?.id; // Extract user ID

  if (!userId) {
    // If user is not authenticated, return an empty array or throw an error.
    // Returning empty array is often better for client components expecting data.
    return [];
  }

  try {
    // Use the fetchTicketsByUserId from data.js, which already handles noStore() and error logging
    const tickets = await fetchTicketsByUserId(userId);
    // Ensure dates are correctly formatted if needed by client, or just pass as Date objects
    // fetchTicketsByUserId should already return data ready for client
    return tickets;
  } catch (error) {
    console.error('Error in getTicketsForUser Server Action:', error);
    // Throwing an error here will be caught by the client component's useEffect
    throw new Error('Failed to retrieve tickets for the user.');
  }
}

// =============================================================
// NEW: Update Ticket Server Action (Placeholder - will be implemented soon)
// =============================================================

// const UpdateTicketInputSchema = TicketFormSchema.omit({ id: true }); // Example schema for update, if different from creation

export async function updateTicket(id, prevState, formData) {
  // This will be implemented in the next phase
  // For now, it's a placeholder to avoid errors if called
  console.log(`Placeholder: updateTicket called for ID: ${id}`);
  return { message: 'Update ticket functionality not yet implemented.', errors: {} };
}

// =============================================================
// NEW: Delete Ticket Server Action (Placeholder - will be implemented soon)
// =============================================================

export async function deleteTicket(id) {
  // This will be implemented later
  // For now, it's a placeholder
  console.log(`Placeholder: deleteTicket called for ID: ${id}`);
  return { message: 'Delete ticket functionality not yet implemented.' };
}