# Flappy Bird ![Flappy Bird](img/favicon.png) 
A Flappy Bird game in [Phaser 3](https://phaser.io/) with [Oncade](https://oncade.io) integration.

[Check it live!](https://stavros-oncade.github.io/flappy-bird)

## Table of Contents
* [Game screenshots](#game-screenshots)
* [Assets](#assets)
* [How to](#how-to)
    * [Run it](#run-it)
    * [Generate documentation](#generate-documentation)
* [Oncade Integration](#oncade-integration)
* [Credential Management](#credential-management)
* [License](#license)

## Game screenshots
![Main menu](img/print01.png)

*Main menu*

![Playing](img/print02.png)

*Playing*

![Game over screen](img/print03.png)

*Game over*

## Assets
The assets used in this project came from the project [FlapPyBird](https://github.com/sourabhv/FlapPyBird) created by [Sourabh Verma](https://github.com/sourabhv).

## How to 

### Run it
1. Clone this repository or click Download ZIP in right panel and extract it 
```
git clone https://github.com/Stavros-oncade/flappy-bird.git 
```
2. Install dependencies
```
npm install
```
3. Create a `.env` file with your credentials (see Credential Management section)
4. Run the development server
```
npm run dev
``` 

### Generate documentation
1. Install [documentation.js](http://documentation.js.org/)
```
npm install -g documentation
```
2. Generate game.js documentation
```
documentation build js/game.js -f md > docs/game.md
```

## Oncade Integration
This version of Flappy Bird includes integration with the Oncade SDK, allowing for:
- Score tracking and leaderboards
- Achievement system
- Social features
- Cross-platform compatibility

To use the Oncade features, make sure to:
1. Include your Oncade API credentials
2. Initialize the Oncade SDK in your game
3. Use the provided integration methods for score submission and achievements

## Credential Management
This project uses a secure approach to manage API credentials:

1. For local development:
   - Create a `.env` file in the root directory with your credentials:
     ```
     ONCADE_API_KEY=your_api_key_here
     ONCADE_GAME_ID=your_game_id_here
     ```
   - The `.env` file is excluded from git via `.gitignore`
   - Run `npm run dev` to generate the config file from your `.env` and start the server

2. For production deployment:
   - The GitHub Actions workflow automatically generates the config file with your production credentials
   - Add your Oncade API credentials as GitHub repository secrets:
     - Go to Settings > Secrets and variables > Actions
     - Add `ONCADE_API_KEY` and `ONCADE_GAME_ID` secrets

## License

[MIT License](http://opensource.org/licenses/MIT)

## Credits
- Original game by [Igor Rozani](https://github.com/IgorRozani/flappy-bird)
- Modified and enhanced with Oncade integration by [Stavros-oncade](https://github.com/Stavros-oncade)
