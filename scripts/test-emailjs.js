// Test script for EmailJS configuration
// Run this in the browser console on the contact page

console.log('🧪 Testing EmailJS Configuration...');

// Check if EmailJS is loaded
if (typeof emailjs !== 'undefined') {
  console.log('✅ EmailJS library is loaded');
} else {
  console.log('❌ EmailJS library is not loaded');
}

// Check configuration
const config = {
  serviceId: 'service_yrh023k',
  templateId: 'template_ai626fd',
  publicKey: 'ZXrwCuxwrxS2AQqD8'
};

console.log('📧 EmailJS Configuration:', config);

// Test email sending (uncomment to test)
/*
emailjs.send(
  config.serviceId,
  config.templateId,
  {
    from_name: "Test User",
    from_email: "test@example.com",
    phone: "+233123456789",
    subject: "Test Message",
    message: "This is a test message from the console.",
    category: "general",
    to_name: "Ghana Transport Support Team",
    to_email: "manuel.yooung84@gmail.com"
  },
  config.publicKey
).then(
  function(response) {
    console.log('✅ Email sent successfully:', response);
  },
  function(error) {
    console.error('❌ Email failed to send:', error);
  }
);
*/

console.log('🔍 Check the console above for EmailJS status');
console.log('💡 To test email sending, uncomment the test code above');
console.log('🎯 Current service ID: service_yrh023k');
