const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export const searchFoodImage = async (query) => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return null;
  }

  try {
    // Clean and enhance the search query for better food results
    const foodQuery = `${query} food dish meal cuisine delicious`.replace(/[^a-zA-Z\s]/g, '');
    
    console.log('Searching for image:', foodQuery); // Debug log
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(foodQuery)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Unsplash response:', data); // Debug log
    
    if (data.results && data.results.length > 0) {
      const image = data.results[0];
      return {
        url: image.urls.regular,
        thumbnail: image.urls.small,
        alt: image.alt_description || query,
        photographer: image.user.name,
        photographerUrl: image.user.links.html,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};

// Stable food emoji - no random selection to prevent blinking
export const getFoodEmoji = (recipeName) => {
  const name = recipeName.toLowerCase();
  
  if (name.includes('pizza')) return '🍕';
  if (name.includes('burger')) return '🍔';
  if (name.includes('pasta') || name.includes('spaghetti')) return '🍝';
  if (name.includes('salad')) return '🥗';
  if (name.includes('soup')) return '🍲';
  if (name.includes('chicken')) return '🍗';
  if (name.includes('fish') || name.includes('salmon')) return '🐟';
  if (name.includes('rice')) return '🍚';
  if (name.includes('bread')) return '🍞';
  if (name.includes('cake') || name.includes('dessert')) return '🍰';
  if (name.includes('coffee')) return '☕';
  if (name.includes('smoothie') || name.includes('juice')) return '🥤';
  if (name.includes('beef') || name.includes('steak')) return '🥩';
  if (name.includes('egg')) return '🥚';
  if (name.includes('fruit')) return '🍎';
  
  // Use hash of recipe name for consistent emoji selection
  const hash = recipeName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const foodEmojis = ['🍳', '🥘', '🍛', '🍜', '🥙', '🌮', '🥪','🌭','🌯','🥗','🍕','🍟','🍱','🍲','🍝','🧆'];
  return foodEmojis[Math.abs(hash) % foodEmojis.length];
};
