// app/lib/definitions.js
// This file describes example data shapes used across the app.

// Example of what a user object might look like
export const User = {
  id: '',
  name: '',
  email: '',
  password: '',
};

// Customer object shape
export const Customer = {
  id: '',
  name: '',
  email: '',
  image_url: '',
};

// Invoice object shape
export const Invoice = {
  id: '',
  customer_id: '',
  amount: 0,
  date: '',
  status: 'pending', // or 'paid'
};

// Revenue object shape
export const Revenue = {
  month: '',
  revenue: 0,
};

// Latest invoice with formatted amount
export const LatestInvoice = {
  id: '',
  name: '',
  image_url: '',
  email: '',
  amount: '', // formatted as a string
};

// This was a TypeScript type. In JS, just define as comment or object shape.
export const LatestInvoiceRawExample = {
  id: '',
  name: '',
  image_url: '',
  email: '',
  amount: 0, // this is before formatting
};

export const InvoicesTable = {
  id: '',
  customer_id: '',
  name: '',
  email: '',
  image_url: '',
  date: '',
  amount: 0,
  status: 'pending',
};

export const CustomersTableExample = {
  id: '',
  name: '',
  email: '',
  image_url: '',
  total_invoices: 0,
  total_pending: 0,
  total_paid: 0,
};

export const FormattedCustomersTable = {
  id: '',
  name: '',
  email: '',
  image_url: '',
  total_invoices: 0,
  total_pending: '', // formatted as string
  total_paid: '', // formatted as string
};

export const CustomerField = {
  id: '',
  name: '',
};

export const InvoiceForm = {
  id: '',
  customer_id: '',
  amount: 0,
  status: 'pending',
};

// --- ADD THIS NEW OBJECT FOR TICKET ---
export const Ticket = {
  id: '',
  user_id: '',
  subject: '',
  description: '',
  status: 'Open', // 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'
  created_at: '',
  updated_at: '',
};