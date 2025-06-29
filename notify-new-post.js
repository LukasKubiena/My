// notify-new-post.js
// Run this script when you publish a new blog post

async function notifySubscribers(blogTitle, blogUrl) {
  const SITE_URL = 'https://lukaskubiena.com'; // Replace with your actual domain
  
  try {
    console.log(`📧 Sending newsletter for: ${blogTitle}`);
    
    const response = await fetch(`${SITE_URL}/.netlify/functions/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'notify',
        blogTitle: blogTitle,
        blogUrl: blogUrl
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
  title: "Your New Blog Post Title",
  url: "https://lukaskubiena.com/blog/post.html?post=6"
};

// Uncomment to send notification:
// notifySubscribers(newPost.title, newPost.url);

// Uncomment to check subscriber count:
// getSubscriberCount();

module.exports = { notifySubscribers, getSubscriberCount };