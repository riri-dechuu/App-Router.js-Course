// app/lib/placeholder-data.js

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a', // This is the ID for 'user@nextmail.com'
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456', // IMPORTANT: Never use plain text passwords in production! This is for mock data only.
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

// --- ADD THIS NEW ARRAY FOR TICKETS ---
const tickets = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    user_id: users[0].id, // Linked to the first user in the `users` array
    subject: 'Login Issue on Mobile',
    description: 'Cannot log into the dashboard using my mobile phone browser (Safari). Works on desktop.',
    status: 'Open',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'b1c2d3e4-f5a6-7890-1234-56789abcdef1',
    user_id: users[0].id, // Linked to the first user
    subject: 'Feature Request: Dark Mode',
    description: 'Requesting a dark mode toggle for the dashboard interface for better night viewing.',
    status: 'In Progress',
    created_at: '2024-05-15T14:30:00Z',
    updated_at: '2024-07-07T09:15:00Z', // Updated recently
  },
  {
    id: 'c1d2e3f4-a5b6-7890-1234-56789abcdef2',
    user_id: users[0].id, // Linked to the first user
    subject: 'Report Generation Error',
    description: 'PDF generation fails for invoices spanning more than 3 months. Error code: 500.',
    status: 'On Hold', // Example status
    created_at: '2024-04-20T11:45:00Z',
    updated_at: '2024-05-01T16:00:00Z',
  },
  {
    id: 'd1e2f3g4-h5i6-7890-1234-56789abcdef3',
    user_id: users[0].id, // Linked to the first user
    subject: 'Password Reset Not Working',
    description: 'Clicked password reset link, but it expired immediately. Tried multiple times.',
    status: 'Resolved', // Example status
    created_at: '2024-03-10T08:00:00Z',
    updated_at: '2024-03-12T17:00:00Z',
  },
  {
    id: 'e1f2g3h4-i5j6-7890-1234-56789abcdef4',
    user_id: users[0].id, // Linked to the first user
    subject: 'Old Ticket - Closed',
    description: 'This is an example of a previously closed ticket.',
    status: 'Closed', // Example status
    created_at: '2023-11-01T09:00:00Z',
    updated_at: '2023-11-05T10:00:00Z',
  },
];


export { users, customers, invoices, revenue, tickets }; // <--- ADD 'tickets' to the export list