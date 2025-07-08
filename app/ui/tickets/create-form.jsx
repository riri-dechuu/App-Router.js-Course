// app/ui/tickets/create-form.jsx
'use client';

import { useState } from 'react'; // <--- NEW: Import useState
// REMOVE: import { useActionState } from 'react-dom'; // No longer needed
import { createTicket } from '@/app/lib/actions';
import {
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function CreateTicketForm() {
  const router = useRouter();

  // <--- NEW: State variables for form handling ---
  const [formError, setFormError] = useState(null); // General error message from server action
  const [fieldErrors, setFieldErrors] = useState({}); // Field-specific errors
  const [loading, setLoading] = useState(false); // Loading state for button
  const [successMessage, setSuccessMessage] = useState(null); // Optional success message

  // <--- NEW: handleSubmit function to handle form submission ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    setLoading(true); // Set loading to true when submission starts
    setFormError(null); // Clear previous general errors
    setFieldErrors({}); // Clear previous field errors
    setSuccessMessage(null); // Clear previous success messages

    const formData = new FormData(event.currentTarget); // Get form data directly from the event target

    // Call the createTicket Server Action directly
    // The first argument `null` is for `prevState`, which is used by useActionState/useFormState,
    // but not when calling the action directly.
    const result = await createTicket(null, formData);

    if (result && result.errors) {
      // If there are validation errors, update state
      setFieldErrors(result.errors);
      setFormError(result.message || 'Failed to create ticket due to validation errors.');
    } else if (result && result.message === 'Ticket created successfully!') {
      // If the ticket was created successfully
      setSuccessMessage(result.message);
      router.push('/dashboard/tickets'); // Redirect to the tickets list page
    } else {
      // Handle unexpected errors (e.g., database error without specific validation errors)
      setFormError(result?.message || 'An unexpected error occurred. Please try again.');
    }

    setLoading(false); // Set loading to false after submission
  };

  return (
    // <--- UPDATED: Use onSubmit handler instead of action prop for form ---
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Subject Input */}
        <div className="mb-4">
          <label htmlFor="subject" className="mb-2 block text-sm font-medium">
            Ticket Subject
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="Enter ticket subject"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="subject-error"
                // No need for `value` or `onChange` unless you want controlled inputs.
                // FormData.get() works well with uncontrolled inputs.
              />
            </div>
          </div>
          {/* <--- UPDATED: Use fieldErrors for displaying validation messages --- */}
          {fieldErrors?.subject ? (
            <div
              id="subject-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
            >
              {fieldErrors.subject.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        {/* Description Textarea */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Ticket Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe your issue in detail"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
              />
            </div>
          </div>
          {/* <--- UPDATED: Use fieldErrors for displaying validation messages --- */}
          {fieldErrors?.description ? (
            <div
              id="description-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
            >
              {fieldErrors.description.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        {/* Status (hidden input) */}
        <input type="hidden" name="status" value="Open" />

        {/* <--- NEW: Display General Form Error or Success Message --- */}
        {formError && (
            <div className="mt-2 text-sm text-red-500 flex items-center" aria-live="polite">
              <ExclamationCircleIcon className="h-5 w-5 mr-1" />
              <p>{formError}</p>
            </div>
        )}
        {successMessage && (
            <div className="mt-2 text-sm text-green-500 flex items-center" aria-live="polite">
              <p>{successMessage}</p>
            </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          disabled={loading} // <--- Disable if loading
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          disabled={loading} // <--- Disable if loading
        >
          {loading ? 'Creating...' : 'Create Ticket'} {/* <--- Show loading text */}
        </button>
      </div>
    </form>
  );
}