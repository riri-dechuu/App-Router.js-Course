// app/lib/data.js
import { sql } from '@vercel/postgres';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache'; // <--- ADD THIS IMPORT

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  try {
    const data = await sql`SELECT * FROM revenue`;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function fetchLatestInvoices() {
  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error: Failed to fetch the latest invoices.', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
              SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
              SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices`;

    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(invoiceCount.rows[0].count ?? '0');
    const numberOfCustomers = Number(customerCount.rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(invoiceStatus.rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatus.rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error: Failed to fetch card data.', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query,
  currentPage,
) {
  const parsedCurrentPage = Number(currentPage) || 1;
  const offset = (parsedCurrentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error: Failed to fetch invoices.', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error: Failed to fetch total number of invoices.', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id) {
  try {
    const data = await sql`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));

    return invoice[0] || null;
  } catch (error) {
    // Check if the error is a NeonDbError with code '22P02' (invalid text representation)
    if (error && typeof error === 'object' && 'code' in error && error.code === '22P02') {
      console.error('Database Error: Invalid UUID format for invoice ID.', error);
      return null;
    }
    console.error('Database Error: Failed to fetch invoice by ID.', error);
    throw new Error('Failed to fetch invoice by ID.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;
    return customers.rows;
  } catch (err) {
    console.error('Database Error: Failed to fetch all customers.', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query) {
  try {
    const data = await sql`
    SELECT
      customers.id,
      customers.name,
      customers.email,
      customers.image_url,
      COUNT(invoices.id) AS total_invoices,
      SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
      SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
    FROM customers
    LEFT JOIN invoices ON customers.id = invoices.customer_id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
    GROUP BY customers.id, customers.name, customers.email, customers.image_url
    ORDER BY customers.name ASC
    `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error: Failed to fetch customer table.', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// --- ADD THESE NEW FUNCTIONS FOR TICKETS ---
export async function fetchTicketsByUserId(userId) {
  noStore(); // Prevents this function from being cached, ensuring fresh data on each call

  try {
    const data = await sql`
      SELECT
        id,
        user_id,
        subject,
        description,
        status,
        created_at,
        updated_at
      FROM tickets
      WHERE user_id = ${userId}
      ORDER BY created_at DESC;
    `;

    return data.rows; // Returns an array of ticket objects

  } catch (error) {
    console.error('Database Error: Failed to fetch tickets by user ID.', error);
    throw new Error('Failed to fetch tickets.');
  }
}

export async function fetchTicketById(ticketId) {
  noStore();
  try {
    const data = await sql`
      SELECT * FROM tickets WHERE id = ${ticketId};
    `;
    return data.rows[0]; // Return the first (and only) ticket
  } catch (error) {
    console.error('Database Error: Failed to fetch ticket by ID.', error);
    throw new Error('Failed to fetch single ticket.');
  }
}