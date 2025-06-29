// test-gmail.js
// Simple test to verify Gmail connection
const nodemailer = require('nodemailer');

async function testGmailConnection() {
  try {
    console.log('🧪 Testing Gmail connection...');
    
    // Replace these with your actual credentials for testing
    const testUser = 'lukaskub16@gmail.com';
    const testPass = 'kzvt tmfg seeg ubid'; // Replace with actual app password
    
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: testUser,
        pass: testPass
      }
    });
    
    console.log('Verifying connection...');
    await transporter.verify();
    
    console.log('✅ Gmail connection successful!');
    console.log('Sending test email...');
    
    const info = await transporter.sendMail({
      from: testUser,
      to: testUser, // Send to yourself for testing
      subject: 'Test Email from Newsletter Function',
      text: 'This is a test email to verify Gmail connection works.',
      html: '<p>This is a test email to verify Gmail connection works.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Gmail connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication failed. Please check:');
      console.log('1. 2-Step Verification is enabled');
      console.log('2. App Password is correct (16 characters)');
      console.log('3. Using the App Password, not your regular Gmail password');
    }
  }
}

testGmailConnection();