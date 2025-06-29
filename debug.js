// functions/send-newsletter/send-newsletter.js
// Simplified version for testing - replace your current function with this temporarily

let subscribers = [];

exports.handler = async (event, context) => {
  console.log('Newsletter function called with method:', event.httpMethod);
  console.log('Environment check - GMAIL_USER exists:', !!process.env.GMAIL_USER);
  console.log('Environment check - GMAIL_PASS exists:', !!process.env.GMAIL_PASS);
  
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
      console.log('Request body:', event.body);
      const { action, email, blogTitle, blogUrl } = JSON.parse(event.body);
      console.log('Parsed action:', action);

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
            message: 'Successfully subscribed!',
            email: email
          })
        };
      }

      if (action === 'notify') {
        console.log('Notify action called for:', blogTitle);
        console.log('Current subscribers:', subscribers);
        
        // For now, just simulate sending without actually sending
        // We'll add nodemailer back once we confirm this works
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: `Newsletter prepared for ${subscribers.length} subscribers`,
            count: subscribers.length,
            blogTitle: blogTitle,
            blogUrl: blogUrl,
            subscribers: subscribers
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
          message: 'Invalid action',
          action: action
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
          error: error.message,
          stack: error.stack
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