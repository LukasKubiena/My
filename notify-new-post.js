// notify-new-post.js
// Run this script when you publish a new writing post

async function notifySubscribers(writingTitle, writingUrl) {
  // Make sure to include the full URL with protocol
  const SITE_URL = 'https://lukaskubiena.com';
  
  try {
    console.log(`📧 Sending newsletter for: ${writingTitle}`);
    
    const response = await fetch(`${SITE_URL}/.netlify/functions/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'notify',
        writingTitle: writingTitle,
        writingUrl: writingUrl
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Newsletter sent successfully!');
      console.log(`📬 Sent to ${result.count} subscribers`);
    } else {
      console.error('❌ Failed to send newsletter:', result.message);
    }
  } catch (error) {
    console.error('❌ Error sending newsletter:', error);
  }
}

// Function to get subscriber count (optional)
async function getSubscriberCount() {
  const SITE_URL = 'https://lukaskubiena.com';
  
  try {
    const response = await fetch(`${SITE_URL}/.netlify/functions/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'list'
      })
    });

    const result = await response.json();
    console.log(`📊 Current subscribers: ${result.count}`);
    return result.count;
  } catch (error) {
    console.error('❌ Error getting subscriber count:', error);
    return 0;
  }
}

// Example usage:
// When you publish a new post, update these values and run:
const newPost = {
  title: "Your New Writing Post Title",
  url: "https://lukaskubiena.com/writing/post.html?post=6"
};

// Uncomment to send notification:
notifySubscribers(newPost.title, newPost.url);

// Uncomment to check subscriber count:
getSubscriberCount();

module.exports = { notifySubscribers, getSubscriberCount };