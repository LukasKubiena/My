// functions/send-newsletter/send-newsletter.js
const nodemailer = require('nodemailer');

// In production, you'd want to use a proper database
// For now, we'll use Netlify's built-in KV storage or a simple file approach
let subscribers = [];

exports.handler = async (event, context) => {
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
      const { action, email, blogTitle, blogUrl } = JSON.parse(event.body);

      if (action === 'subscribe') {
        // Add email to subscribers list
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
        // Configure email transporter
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER, // lukasmariakubiena@gmail.com
            pass: process.env.GMAIL_PASS  // App-specific password
          }
        });

        const mailOptions = {
          from: 'lukasmariakubiena@gmail.com',
          subject: 'New blog post from Lukas',
          html: `
            <div style="font-family: 'NeueHaasDisplay-Light', Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
              <p>Hey,</p>
              <p>I saw you subscribed to my blog. Thanks for that - I just posted a new one in case you are interested :)</p>
              ${blogTitle ? `<p style="margin: 20px 0;"><strong>${blogTitle}</strong></p>` : ''}
              ${blogUrl ? `<p><a href="${blogUrl}" style="color: #000; text-decoration: underline;">Read the post</a></p>` : ''}
              <p style="margin-top: 30px;">Best,<br>Lukas</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #666; text-align: center;">
                You received this because you subscribed to updates from Lukas Kubiena's blog.
              </p>
            </div>
          `
        };

        // Send to all subscribers
        const emailPromises = subscribers.map(subscriberEmail => {
          return transporter.sendMail({
            ...mailOptions,
            to: subscriberEmail
          });
        });

        await Promise.all(emailPromises);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: `Notification sent to ${subscribers.length} subscribers`,
            count: subscribers.length
          })
        };
      }

      if (action === 'list') {
        // Optional: Get subscriber count (for admin use)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            count: subscribers.length,
            subscribers: subscribers // Remove this in production for privacy
          })
        };
      }

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