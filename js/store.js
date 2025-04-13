/**
 * Store UI variables
 */
let storeScreen;
let storeItems = [];
let storeItemButtons = [];
let closeStoreButton;
let storeScrollContainer;
let storeScrollMask;
let storeScrollContent;
let isDragging = false;
let startY = 0;
let startScrollY = 0;
let imageCache = {};
let storeOverlay;
let storeScrollArea;

/**
 * Open the Oncade store
 * @param {object} game - The Phaser game instance
 */
function openStore(game) {
    if (typeof getStoreItems === 'function') {
        // Pause the game while in store
        game.scene.scenes[0].physics.pause();
        
        // Create store screen background
        storeScreen = game.scene.scenes[0].add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.8);
        storeScreen.setOrigin(0, 0);
        storeScreen.setDepth(100);
        storeScreen.setScrollFactor(0);
        
        // Create a transparent overlay to capture all clicks
        storeOverlay = game.scene.scenes[0].add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0);
        storeOverlay.setOrigin(0, 0);
        storeOverlay.setDepth(99); // Just below the store screen
        storeOverlay.setScrollFactor(0);
        storeOverlay.setInteractive();
        storeOverlay.on('pointerdown', (pointer) => {
            // Prevent the click from propagating to the game
            pointer.event.stopPropagation();
        });
        
        // Add store title
        const storeTitle = game.scene.scenes[0].add.text(game.config.width / 2, 50, 'STORE', {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center'
        });
        storeTitle.setOrigin(0.5);
        storeTitle.setDepth(101);
        storeTitle.setScrollFactor(0);
        
        // Add close button
        closeStoreButton = game.scene.scenes[0].add.text(game.config.width - 40, 30, 'X', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { x: 10, y: 5 }
        }).setInteractive();
        closeStoreButton.setOrigin(0.5);
        closeStoreButton.setDepth(101);
        closeStoreButton.setScrollFactor(0);
        closeStoreButton.on('pointerdown', () => closeStore(game));
        
        // Add loading text
        const loadingText = game.scene.scenes[0].add.text(game.config.width / 2, game.config.height / 2, 'Loading store items...', {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center'
        });
        loadingText.setOrigin(0.5);
        loadingText.setDepth(101);
        loadingText.setScrollFactor(0);
        
        // Get store items
        getStoreItems().then(items => {
            // Remove loading text
            loadingText.destroy();
            
            // Store the items
            storeItems = items;
            
            // Display items
            displayStoreItems(game, items);
        }).catch(error => {
            console.error('Error loading store items:', error);
            loadingText.setText('Error loading store items. Please try again later.');
        });
    }
}

/**
 * Load an image from a URL and add it to the Phaser texture cache
 * @param {object} game - The Phaser game instance
 * @param {string} url - The URL of the image
 * @param {string} key - The key to use for the texture
 * @param {function} callback - Function to call when the image is loaded
 */
function loadImageFromURL(game, url, key, callback) {
    // Check if the image is already in the cache
    if (imageCache[key]) {
        callback(imageCache[key]);
        return;
    }
    
    // Create a new image element
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Set up the onload handler
    img.onload = function() {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image to the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Add the canvas to the Phaser texture cache
        game.textures.addCanvas(key, canvas);
        
        // Store in our cache
        imageCache[key] = key;
        
        // Call the callback
        callback(key);
    };
    
    // Set up the onerror handler
    img.onerror = function() {
        console.error('Failed to load image:', url);
        callback(null);
    };
    
    // Set the source to start loading
    img.src = url;
}

/**
 * Display store items in a vertical layout with scrolling
 * @param {object} game - The Phaser game instance
 * @param {Array} items - Array of store items
 */
function displayStoreItems(game, items) {
    if (!items || items.length === 0) {
        // Display "no items" message
        const noItemsText = game.scene.scenes[0].add.text(game.config.width / 2, game.config.height / 2, 'No items available in the store.', {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center'
        });
        noItemsText.setOrigin(0.5);
        noItemsText.setDepth(101);
        noItemsText.setScrollFactor(0);
        return;
    }
    
    // Clear any existing item buttons
    storeItemButtons.forEach(button => button.destroy());
    storeItemButtons = [];
    
    // Calculate layout dimensions
    const itemWidth = game.config.width * 0.95; // 95% of screen width
    const itemHeight = 150;
    const padding = 20;
    const topMargin = 150; // Increased top margin to avoid covering the close button
    const scrollAreaHeight = game.config.height - topMargin - 50; // Adjusted scroll area height
    
    // Create scroll container
    storeScrollContainer = game.scene.scenes[0].add.container(0, 0);
    storeScrollContainer.setDepth(101);
    storeScrollContainer.setScrollFactor(0);
    storeScrollContainer.setPosition(game.config.width / 2, topMargin);
    
    // Create scroll mask
    storeScrollMask = game.scene.scenes[0].add.graphics();
    storeScrollMask.fillStyle(0x000000, 0);
    storeScrollMask.fillRect(-itemWidth / 2, 0, itemWidth, scrollAreaHeight);
    storeScrollContainer.add(storeScrollMask);
    
    // Create scroll content container
    storeScrollContent = game.scene.scenes[0].add.container(0, 0);
    storeScrollContent.setMask(new Phaser.Display.Masks.GeometryMask(storeScrollMask));
    storeScrollContainer.add(storeScrollContent);
    
    // Make the scroll area interactive for touch/mouse scrolling
    storeScrollArea = game.scene.scenes[0].add.rectangle(
        game.config.width / 2, 
        topMargin + scrollAreaHeight / 2, 
        itemWidth, 
        scrollAreaHeight, 
        0x000000, 
        0
    ).setInteractive();
    storeScrollArea.setOrigin(0.5);
    storeScrollArea.setDepth(100);
    storeScrollArea.setScrollFactor(0);
    
    // Add pointer down event to start scrolling
    storeScrollArea.on('pointerdown', (pointer) => {
        isDragging = true;
        startY = pointer.y;
        startScrollY = storeScrollContent.y;
        // Prevent the click from propagating to the game
        pointer.event.stopPropagation();
    });
    
    // Add global pointer up event to stop scrolling
    game.scene.scenes[0].input.on('pointerup', () => {
        isDragging = false;
    });
    
    // Add global pointer move event for scrolling
    game.scene.scenes[0].input.on('pointermove', (pointer) => {
        if (isDragging) {
            const deltaY = pointer.y - startY;
            const contentHeight = items.length * (itemHeight + padding) - padding;
            const maxScroll = 0;
            const minScroll = -(contentHeight - scrollAreaHeight);
            
            // Update scroll content position
            let newY = startScrollY + deltaY;
            newY = Math.min(maxScroll, Math.max(minScroll, newY));
            storeScrollContent.y = newY;
        }
    });
    
    // Add mouse wheel support for scrolling
    game.scene.scenes[0].input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
        const contentHeight = items.length * (itemHeight + padding) - padding;
        const maxScroll = 0;
        const minScroll = -(contentHeight - scrollAreaHeight);
        
        // Update scroll content position based on wheel movement
        let newY = storeScrollContent.y + deltaY;
        newY = Math.min(maxScroll, Math.max(minScroll, newY));
        storeScrollContent.y = newY;
    });
    
    // Display items vertically
    items.forEach((item, index) => {
        const y = index * (itemHeight + padding);
        
        // Create item container
        const itemContainer = game.scene.scenes[0].add.container(0, y);
        itemContainer.setDepth(101);
        
        // Add item background
        const itemBg = game.scene.scenes[0].add.rectangle(0, 0, itemWidth, itemHeight, 0x333333);
        itemContainer.add(itemBg);
        
        // Add item image if available
        if (item.imageUrl) {
            const imageSize = 100;
            // Create a placeholder rectangle while the image loads
            const imagePlaceholder = game.scene.scenes[0].add.rectangle(
                -itemWidth/2 + imageSize/2 + 5, // Reduced left padding from 10 to 5
                20, // Moved down by 20 pixels to create space for the title
                imageSize, 
                imageSize, 
                0x666666
            );
            imagePlaceholder.setOrigin(0.5);
            itemContainer.add(imagePlaceholder);
            
            // Generate a unique key for this image
            const imageKey = 'item_image_' + item._id;
            
            // Load the image from URL
            loadImageFromURL(game, item.imageUrl, imageKey, function(textureKey) {
                if (textureKey) {
                    // Create the image with the loaded texture
                    const image = game.scene.scenes[0].add.image(-itemWidth/2 + imageSize/2 + 5, 20, textureKey); // Moved down by 20 pixels
                    image.setDisplaySize(imageSize, imageSize);
                    image.setOrigin(0.5);
                    itemContainer.add(image);
                    
                    // Remove the placeholder
                    imagePlaceholder.destroy();
                } else {
                    // If loading failed, show an error icon
                    const errorIcon = game.scene.scenes[0].add.text(
                        -itemWidth/2 + imageSize/2 + 5, // Reduced left padding from 10 to 5
                        20, // Moved down by 20 pixels
                        '⚠️', 
                        { font: '24px Arial' }
                    );
                    errorIcon.setOrigin(0.5);
                    itemContainer.add(errorIcon);
                    imagePlaceholder.destroy();
                }
            });
        }
        
        // Add item name
        const itemName = game.scene.scenes[0].add.text(0, -itemHeight/2 + 20, item.name || 'Item', {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: itemWidth - 10 } // Reduced word wrap width from 20 to 10
        });
        itemName.setOrigin(0.5, 0);
        itemContainer.add(itemName);
        
        // Add item price
        const itemPrice = game.scene.scenes[0].add.text(0, itemHeight/2 - 40, `$${(item.price/100).toFixed(2) || '0.00'}`, {
            font: '20px Arial',
            fill: '#ffff00',
            align: 'center'
        });
        itemPrice.setOrigin(0.5, 0);
        itemContainer.add(itemPrice);
        
        // Add buy button
        const buyButton = game.scene.scenes[0].add.text(0, itemHeight/2 - 10, 'BUY', {
            font: '18px Arial',
            fill: '#ffffff',
            backgroundColor: '#4a90e2',
            padding: { x: 10, y: 5 }
        }).setInteractive();
        buyButton.setOrigin(0.5, 0);
        buyButton.on('pointerdown', (pointer) => {
            purchaseItem(item._id);
            // Prevent the click from propagating to the game
            pointer.event.stopPropagation();
        });
        itemContainer.add(buyButton);
        
        // Add to scroll content
        storeScrollContent.add(itemContainer);
        
        // Add to store item buttons array
        storeItemButtons.push(itemContainer);
    });
}

/**
 * Close the store and resume the game
 * @param {object} game - The Phaser game instance
 */
function closeStore(game) {
    // Remove store screen and all UI elements
    if (storeScreen) {
        storeScreen.destroy();
        storeScreen = null;
    }
    
    // Remove store overlay
    if (storeOverlay) {
        storeOverlay.destroy();
        storeOverlay = null;
    }
    
    // Remove scroll area
    if (storeScrollArea) {
        storeScrollArea.destroy();
        storeScrollArea = null;
    }
    
    // Remove all store item buttons
    storeItemButtons.forEach(button => button.destroy());
    storeItemButtons = [];
    
    // Remove scroll elements
    if (storeScrollContainer) {
        storeScrollContainer.destroy();
        storeScrollContainer = null;
    }
    
    // Remove close button
    if (closeStoreButton) {
        closeStoreButton.destroy();
        closeStoreButton = null;
    }
    
    // Remove any text elements that might be part of the store UI
    // This includes the store title, loading text, and error messages
    game.scene.scenes[0].children.list.forEach(child => {
        if (child.type === 'Text' && child.depth >= 100) {
            child.destroy();
        }
    });
    
    // Reset dragging state
    isDragging = false;
    
    // Resume the game
    game.scene.scenes[0].physics.resume();
}

/**
 * Check if the store is currently open
 * @returns {boolean} - True if the store is open, false otherwise
 */
function isStoreOpen() {
    return storeScreen !== null;
}

// Export the store functions
window.openStore = openStore;
window.closeStore = closeStore;
window.isStoreOpen = isStoreOpen; 