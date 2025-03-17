import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Initialize the Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Track shown toasts to prevent duplicates
const shownToasts = new Set<string>();

// Function to show toast only if it hasn't been shown recently
const showUniqueToast = (message: string, type: 'success' | 'error', id?: string) => {
  const toastId = id || message;
  if (!shownToasts.has(toastId)) {
    shownToasts.add(toastId);
    
    if (type === 'success') {
      toast.success(message, { id: toastId });
    } else {
      toast.error(message, { id: toastId });
    }
    
    // Remove from tracking after some time to allow the message to be shown again later if needed
    setTimeout(() => {
      shownToasts.delete(toastId);
    }, 5000);
  }
};

export interface FormSubmission {
  name: string;
  email: string;
  message: string;
}

/**
 * Handles form submissions by saving them to the Supabase database
 * @param formData The form data to submit
 * @returns Object containing success status and message
 */
export async function submitForm(formData: FormSubmission): Promise<{ success: boolean; message: string }> {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        message: 'All fields are required'
      };
    }

    // Insert the form submission into the database
    const { error } = await supabase
      .from('form_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error submitting form:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit form. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Form submitted successfully!'
    };
  } catch (error: any) {
    console.error('Unexpected error submitting form:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred. Please try again.'
    };
  }
}