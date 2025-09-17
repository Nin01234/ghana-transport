import emailjs from '@emailjs/browser';

// EmailJS configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_yrh023k',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_ai626fd',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ZXrwCuxwrxS2AQqD8',
  RECIPIENT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_RECIPIENT_EMAIL || 'manuel.young84@gmail.com',
  RECIPIENT_NAME: process.env.NEXT_PUBLIC_CONTACT_RECIPIENT_NAME || 'Ghana Transport Support Team',
};

// Initialize EmailJS
export const initEmailJS = () => {
  try {
    if (!EMAILJS_CONFIG.PUBLIC_KEY) {
      throw new Error('EmailJS public key is not configured');
    }
    
    // Check if EmailJS is already initialized
    if (emailjs.init) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('EmailJS initialized successfully with key:', EMAILJS_CONFIG.PUBLIC_KEY);
    } else {
      throw new Error('EmailJS library not properly loaded');
    }
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    throw error;
  }
};

// Check if EmailJS is properly configured
export const isEmailJSConfigured = () => {
  return !!(EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID && EMAILJS_CONFIG.PUBLIC_KEY);
};

// Check if EmailJS is loaded and ready
export const isEmailJSReady = () => {
  return typeof emailjs !== 'undefined' && 
         typeof emailjs.init === 'function' && 
         typeof emailjs.send === 'function';
};

// Wait for EmailJS to be ready
export const waitForEmailJS = async (timeout = 5000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (isEmailJSReady()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return false;
};

// Send email function
export const sendEmail = async (templateParams: Record<string, any>) => {
  try {
    // Validate required parameters
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
      throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
    }

    // Validate template parameters
    if (!templateParams.from_name || !templateParams.from_email || !templateParams.message) {
      throw new Error('Required template parameters are missing.');
    }

    // Ensure EmailJS is ready
    if (!isEmailJSReady()) {
      console.log('EmailJS not ready, waiting...');
      const isReady = await waitForEmailJS();
      if (!isReady) {
        throw new Error('EmailJS failed to initialize within timeout period');
      }
    }

    console.log('Sending email with params:', {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templateId: EMAILJS_CONFIG.TEMPLATE_ID,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      templateParams
    });

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    
    console.log('EmailJS response:', response);
    
    return {
      success: true,
      messageId: response.text,
    };
  } catch (error) {
    console.error('EmailJS Error Details:', {
      error,
      errorType: typeof error,
      errorKeys: error && typeof error === 'object' ? Object.keys(error) : 'no error object',
      errorMessage: error instanceof Error ? error.message : 'No message',
      errorStack: error instanceof Error ? error.stack : 'No stack'
    });
    
    // Provide more specific error messages
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === 'string') {
      throw new Error(error);
    } else if (error && typeof error === 'object') {
      // Handle EmailJS specific errors
      const emailjsError = error as any;
      if (emailjsError.text) {
        throw new Error(`EmailJS Error: ${emailjsError.text}`);
      } else if (emailjsError.message) {
        throw new Error(`EmailJS Error: ${emailjsError.message}`);
      } else {
        throw new Error('EmailJS failed to send email. Please check your configuration.');
      }
    } else {
      throw new Error('Failed to send email. Please try again later.');
    }
  }
};

// Send contact form email
export const sendContactFormEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  recipientEmail: string;
}) => {
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
    category: formData.category,
    to_name: EMAILJS_CONFIG.RECIPIENT_NAME,
    to_email: formData.recipientEmail, // Use user-provided recipient email
    // Additional fields that EmailJS template might need
    reply_to: formData.email,
    user_email: formData.email,
    user_name: formData.name,
    user_phone: formData.phone,
    inquiry_category: formData.category,
    inquiry_subject: formData.subject,
    inquiry_message: formData.message,
  };

  console.log('Sending contact form email with params:', templateParams);

  return await sendEmail(templateParams);
};
