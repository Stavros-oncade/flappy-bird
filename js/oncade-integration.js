/**
 * Oncade SDK Integration for Flappy Bird
 * This file handles the integration with the Oncade SDK for user authentication,
 * session management, and in-app purchases.
 */

// Global SDK instance
let oncadeSDK = null;

/**
 * Initialize the Oncade SDK
 * @returns {Promise<boolean>} Whether initialization was successful
 */
async function initializeOncadeSDK() {
  try {
    // Create SDK instance with configuration
    oncadeSDK = new OncadeSDK({
      apiKey: config.oncade.apiKey,
      gameId: config.oncade.gameId,
    });

    // Initialize the SDK
    const initialized = await oncadeSDK.initialize();
    
    if (initialized) {
      console.log('Oncade SDK initialized successfully');
      return await checkSession();
    } else {
      console.error('Failed to initialize Oncade SDK');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Oncade SDK:', error);
    return false;
  }
}

/**
 * Check if the user has a valid session
 * @returns {Promise<boolean>} Whether the session is valid
 */
async function checkSession() {
  try {
    const sessionInfo = await oncadeSDK.getSessionInfo();
    
    if (!sessionInfo.isValid) {
      console.error('No valid session available');
      return false;
    }
        
    console.log('Session is valid');
    return true;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

/**
 * Handle user login
 */
async function userLogin() {
  try {
    const loginUrl = oncadeSDK.getLoginURL({
      gameId: oncadeSDK.config.gameId,
      redirectUrl: window.location.origin + '/post-login'
    });
    
    // Redirect to login page
    window.location.href = loginUrl;
  } catch (error) {
    console.error('Error getting login URL:', error);
  }
}

/**
 * Get the store catalog
 * @returns {Promise<Array>} List of available items
 */
async function getStoreItems() {
  try {
    const catalog = await oncadeSDK.getStoreCatalog();
    console.log('Available items:', catalog);
    return catalog;
  } catch (error) {
    console.error('Error getting store catalog:', error);
    return [];
  }
}

/**
 * Purchase an item
 * @param {string} itemId - ID of the item to purchase
 */
async function purchaseItem(itemId) {
  try {
    const purchaseUrl = await oncadeSDK.getPurchaseURL({
      itemId,
      redirectUrl: window.location.origin + '/success'
    });
    
    if (purchaseUrl) {
      // Redirect to complete the purchase
      window.location.href = purchaseUrl;
    }
  } catch (error) {
    console.error('Error getting purchase URL:', error);
  }
}

/**
 * Check purchase history
 * @returns {Promise<Array>} List of purchases
 */
async function checkPurchaseHistory() {
  try {
    const sessionInfo = await oncadeSDK.getSessionInfo();
    
    if (!sessionInfo.isValid) {
      console.error('No valid session available');
      return null;
    }
    
    if (!sessionInfo.hasUserId) {
      console.log('User not authenticated - no purchase history available');
      return null;
    }
    
    const purchases = await oncadeSDK.getPurchaseHistory();
    return purchases;
  } catch (error) {
    console.error('Error checking purchase history:', error);
    return null;
  }
}

/**
 * Get a tip URL from Oncade
 * @returns {Promise<string>} URL to redirect for tipping
 */
async function getTipURL() {
  try {
    if (!oncadeSDK) {
      console.error('Oncade SDK not initialized');
      return null;
    }
        // Get the tip URL from Oncade
    const tipUrl = await oncadeSDK.getTipURL({
      redirectUrl: window.location.origin + '/post-tip.html'
    });
    
    console.log('Tip URL obtained successfully');
    return tipUrl;
  } catch (error) {
    console.error('Error getting tip URL:', error);
    return null;
  }
}

// Initialize the SDK when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const initialized = await initializeOncadeSDK();
  if (initialized) {
    console.log('Oncade SDK ready for use');
  } else {
    console.warn('Oncade SDK initialization failed or user not authenticated');
  }
});

// Export the tip function
window.getTipURL = getTipURL; 