/**
 * Simple script to generate config.js for local development
 * Reads credentials from .env file
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get credentials from environment variables
const credentials = {
  apiKey: process.env.ONCADE_API_KEY,
  gameId: process.env.ONCADE_GAME_ID
};

// Validate credentials
if (!credentials.apiKey || !credentials.gameId) {
  console.error('Error: Missing credentials in .env file');
  console.error('Please create a .env file with ONCADE_API_KEY and ONCADE_GAME_ID');
  process.exit(1);
}

// Create the config file content - completely replace the file
const configContent = `/**
 * Configuration file for Oncade integration
 * Generated for local development
 */

const config = {
    oncade: {
        apiKey: '${credentials.apiKey}',
        gameId: '${credentials.gameId}'
    }
};
`;

// Write the config file - completely replace it
fs.writeFileSync(path.join(__dirname, '..', 'js', 'config.js'), configContent);
console.log('Local config file generated successfully!'); 