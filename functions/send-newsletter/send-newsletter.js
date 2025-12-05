// functions/send-newsletter/send-newsletter.js
const nodemailer = require('nodemailer');

// In production, you'd want to use a proper database
// For now, we'll use a simple in-memory array
let subscribers = [];

exports.handler = async (event, context) => {
  console.log('Newsletter function called with method:', event.httpMethod);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { action, email, writingTitle, writingUrl } = JSON.parse(event.body);
      console.log('Action:', action);

      if (action === 'subscribe') {
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          console.log(`New subscriber: ${email}`);
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Successfully subscribed!' 
          })
        };
      }

      if (action === 'notify') {
        console.log(`Sending newsletter for: ${writingTitle} to ${subscribers.length} subscribers`);
        
        // Check environment variables
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
          throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_PASS environment variables.');
        }

        // FIXED: createTransport (not createTransporter)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.GMAIL_USER,
          subject: 'New writing post from Lukas',
          html: `
            <div style="font-family: 'NeueHaasDisplay-Light', Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
              <p>Hey,</p>
              <p>I saw you subscribed to my writing. Thanks for that - I just posted a new one in case you are interested :)</p>
              ${writingTitle ? `<p style="margin: 20px 0;"><strong>${writingTitle}</strong></p>` : ''}
              ${writingUrl ? `<p><a href="${writingUrl}" style="color: #000; text-decoration: underline;">Read the post</a></p>` : ''}
              <p style="margin-top: 30px;">Best,<br>Lukas</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #666; text-align: center;">
                You received this because you subscribed to updates from Lukas Kubiena's writing.
              </p>
            </div>
          `
        };

        // Send to all subscribers
        const emailPromises = subscribers.map(subscriberEmail => {
          console.log(`Sending email to: ${subscriberEmail}`);
          return transporter.sendMail({
            ...mailOptions,
            to: subscriberEmail
          });
        });

        await Promise.all(emailPromises);
        console.log(`✅ Successfully sent newsletter to ${subscribers.length} subscribers`);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: `Newsletter sent to ${subscribers.length} subscribers`,
            count: subscribers.length
          })
        };
      }

      if (action === 'list') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            count: subscribers.length,
            subscribers: subscribers
          })
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Invalid action' 
        })
      };

    } catch (error) {
      console.error('Newsletter function error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Internal server error',
          error: error.message
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};