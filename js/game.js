/**
 * 
 * Game configurations.
 * @name configurations
 */
const configurations = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

/**
 *  Game assets.
 *  @name assets
 */
const assets = {
    bird: {
        red: 'bird-red',
        yellow: 'bird-yellow',
        blue: 'bird-blue'
    },
    obstacle: {
        pipe: {
            green: {
                top: 'pipe-green-top',
                bottom: 'pipe-green-bottom'
            },
            red: {
                top: 'pipe-red-top',
                bottom: 'pipe-red-bo'
            }
        }
    },
    scene: {
        width: 144,
        background: {
            day: 'background-day',
            night: 'background-night'
        },
        ground: 'ground',
        gameOver: 'game-over',
        restart: 'restart-button',
        messageInitial: 'message-initial'
    },
    scoreboard: {
        width: 25,
        base: 'number',
        number0: 'number0',
        number1: 'number1',
        number2: 'number2',
        number3: 'number3',
        number4: 'number4',
        number5: 'number5',
        number6: 'number6',
        number7: 'number7',
        number8: 'number8',
        number9: 'number9'
    },
    animation: {
        bird: {
            red: {
                clapWings: 'red-clap-wings',
                stop: 'red-stop'
            },
            blue: {
                clapWings: 'blue-clap-wings',
                stop: 'blue-stop'
            },
            yellow: {
                clapWings: 'yellow-clap-wings',
                stop: 'yellow-stop'
            }
        },
        ground: {
            moving: 'moving-ground',
            stop: 'stop-ground'
        }
    }
}

// Game
/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
const game = new Phaser.Game(configurations)
/**
 * If it had happened a game over.
 * @type {boolean}
 */
let gameOver
/**
 * If the game has been started.
 * @type {boolean}
 */
let gameStarted
/**
 * Up button component.
 * @type {object}
 */
let upButton
/**
 * Restart button component.
 * @type {object}
 */
let restartButton
/**
 * Game over banner component.
 * @type {object}
 */
let gameOverBanner
/**
 * Message initial component.
 * @type {object}
 */
let messageInitial
/**
 * Menu button component.
 * @type {object}
 */
let menuButton
/**
 * Store button component.
 * @type {object}
 */
let storeButton
/**
 * Main menu store button component.
 * @type {object}
 */
let mainMenuStoreButton
/**
 * Main menu tip button component.
 * @type {object}
 */
let mainMenuTipButton
/**
 * High score text component.
 * @type {object}
 */
let highScoreText
/**
 * New record text component.
 * @type {object}
 */
let newRecordText
/**
 * Current high score.
 * @type {number}
 */
let highScore = 0
// Bird
/**
 * Player component.
 * @type {object}
 */
let player
/**
 * Bird name asset.
 * @type {string}
 */
let birdName
/**
 * Quantity frames to move up.
 * @type {number}
 */
let framesMoveUp
// Background
/**
 * Day background component.
 * @type {object}
 */
let backgroundDay
/**
 * Night background component.
 * @type {object}
 */
let backgroundNight
/**
 * Ground component.
 * @type {object}
 */
let ground
// pipes
/**
 * Pipes group component.
 * @type {object}
 */
let pipesGroup
/**
 * Gaps group component.
 * @type {object}
 */
let gapsGroup
/**
 * Counter till next pipes to be created.
 * @type {number}
 */
let nextPipes
/**
 * Current pipe asset.
 * @type {object}
 */
let currentPipe
// score variables
/**
 * Scoreboard group component.
 * @type {object}
 */
let scoreboardGroup
/**
 * Score counter.
 * @type {number}
 */
let score

/**
 *   Load the game assets.
 */
function preload() {
    // Backgrounds and ground
    this.load.image(assets.scene.background.day, 'assets/background-day.png')
    this.load.image(assets.scene.background.night, 'assets/background-night.png')
    this.load.spritesheet(assets.scene.ground, 'assets/ground-sprite.png', {
        frameWidth: 336,
        frameHeight: 112
    })

    // Pipes
    this.load.image(assets.obstacle.pipe.green.top, 'assets/pipe-green-top.png')
    this.load.image(assets.obstacle.pipe.green.bottom, 'assets/pipe-green-bottom.png')
    this.load.image(assets.obstacle.pipe.red.top, 'assets/pipe-red-top.png')
    this.load.image(assets.obstacle.pipe.red.bottom, 'assets/pipe-red-bottom.png')

    // Start game
    this.load.image(assets.scene.messageInitial, 'assets/message-initial.png')

    // End game
    this.load.image(assets.scene.gameOver, 'assets/gameover.png')
    this.load.image(assets.scene.restart, 'assets/restart-button.png')

    // Birds
    this.load.spritesheet(assets.bird.red, 'assets/bird-red-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.blue, 'assets/bird-blue-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.yellow, 'assets/bird-yellow-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })

    // Numbers
    this.load.image(assets.scoreboard.number0, 'assets/number0.png')
    this.load.image(assets.scoreboard.number1, 'assets/number1.png')
    this.load.image(assets.scoreboard.number2, 'assets/number2.png')
    this.load.image(assets.scoreboard.number3, 'assets/number3.png')
    this.load.image(assets.scoreboard.number4, 'assets/number4.png')
    this.load.image(assets.scoreboard.number5, 'assets/number5.png')
    this.load.image(assets.scoreboard.number6, 'assets/number6.png')
    this.load.image(assets.scoreboard.number7, 'assets/number7.png')
    this.load.image(assets.scoreboard.number8, 'assets/number8.png')
    this.load.image(assets.scoreboard.number9, 'assets/number9.png')
}

/**
 *   Create the game objects (images, groups, sprites and animations).
 */
function create() {
    // Load high score from local storage
    loadHighScore();
    
    backgroundDay = this.add.image(assets.scene.width, 256, assets.scene.background.day).setInteractive()
    backgroundDay.on('pointerdown', moveBird)
    backgroundNight = this.add.image(assets.scene.width, 256, assets.scene.background.night).setInteractive()
    backgroundNight.visible = false
    backgroundNight.on('pointerdown', moveBird)

    gapsGroup = this.physics.add.group()
    pipesGroup = this.physics.add.group()
    scoreboardGroup = this.physics.add.staticGroup()

    ground = this.physics.add.sprite(assets.scene.width, 458, assets.scene.ground)
    ground.setCollideWorldBounds(true)
    ground.setDepth(10)

    messageInitial = this.add.image(assets.scene.width, 156, assets.scene.messageInitial)
    messageInitial.setDepth(30)
    messageInitial.visible = false

    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

    // Ground animations
    this.anims.create({
        key: assets.animation.ground.moving,
        frames: this.anims.generateFrameNumbers(assets.scene.ground, {
            start: 0,
            end: 2
        }),
        frameRate: 15,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.ground.stop,
        frames: [{
            key: assets.scene.ground,
            frame: 0
        }],
        frameRate: 20
    })

    // Red Bird Animations
    this.anims.create({
        key: assets.animation.bird.red.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.red, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.red.stop,
        frames: [{
            key: assets.bird.red,
            frame: 1
        }],
        frameRate: 20
    })

    // Blue Bird animations
    this.anims.create({
        key: assets.animation.bird.blue.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.blue, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.blue.stop,
        frames: [{
            key: assets.bird.blue,
            frame: 1
        }],
        frameRate: 20
    })

    // Yellow Bird animations
    this.anims.create({
        key: assets.animation.bird.yellow.clapWings,
        frames: this.anims.generateFrameNumbers(assets.bird.yellow, {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: assets.animation.bird.yellow.stop,
        frames: [{
            key: assets.bird.yellow,
            frame: 1
        }],
        frameRate: 20
    })

    prepareGame(this)

    gameOverBanner = this.add.image(assets.scene.width, 200, assets.scene.gameOver)
    gameOverBanner.setDepth(20)
    gameOverBanner.visible = false

    restartButton = this.add.text(assets.scene.width, 410, 'Play again', {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#4a90e2',
        padding: { x: 120, y: 10 }
    }).setInteractive()
    restartButton.setOrigin(0.5) // Center the text horizontally and vertically
    restartButton.on('pointerdown', restartGame)
    restartButton.setDepth(20)
    restartButton.visible = false

    // Create high score text
    highScoreText = this.add.text(assets.scene.width, 340, 'Your Best: ' + highScore, {
        font: '20px Arial',
        fill: '#ffffff',
        backgroundColor: '#a0a0a0',
        padding: { x: 5, y: 5 }
    }).setInteractive()
    highScoreText.setOrigin(0.5) // Center the text horizontally and vertically
    highScoreText.setDepth(20)
    highScoreText.visible = false
    
    // Create new record text
    newRecordText = this.add.text(assets.scene.width, 260, `NEW RECORD!`, {
        font: '24px Arial',
        fill: '#ffff00',
        backgroundColor: '#000000',
        padding: { x: 120, y: 10 }
    }).setInteractive()
    newRecordText.setOrigin(0.5) // Center the text horizontally and vertically
    newRecordText.setDepth(20)
    newRecordText.visible = false

    // Create menu button as text instead of image - centered
    menuButton = this.add.text(assets.scene.width, 470, 'Quit to Main', {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#4a90e2',
        padding: { x: 120, y: 10 }
    }).setInteractive()
    menuButton.setOrigin(0.5) // Center the text horizontally and vertically
    menuButton.on('pointerdown', returnToMenu)
    menuButton.setDepth(20)
    menuButton.visible = false
    
    // Create main menu store button as text - centered
    mainMenuStoreButton = this.add.text(assets.scene.width, 460, 'Store', {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#4a90e2',
        padding: { x: 120, y: 10 }
    }).setInteractive()
    mainMenuStoreButton.setOrigin(0.5) // Center the text horizontally and vertically
    mainMenuStoreButton.on('pointerdown', openGameStore)
    mainMenuStoreButton.setDepth(20)
    mainMenuStoreButton.visible = true // Visible by default for main menu
    
    // Create main menu tip button as text - centered
    mainMenuTipButton = this.add.text(assets.scene.width, 400, 'Tip Developer', {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#4a90e2',
        padding: { x: 80, y: 10 }
    }).setInteractive()
    mainMenuTipButton.setOrigin(0.5) // Center the text horizontally and vertically
    mainMenuTipButton.on('pointerdown', openTipPage)
    mainMenuTipButton.setDepth(20)
    mainMenuTipButton.visible = true // Visible by default for main menu
}

/**
 *  Update the scene frame by frame, responsible for move and rotate the bird and to create and move the pipes.
 */
function update() {
    if (gameOver || !gameStarted)
        return

    if (framesMoveUp > 0)
        framesMoveUp--
    else if (Phaser.Input.Keyboard.JustDown(upButton))
        moveBird()
    else {
        player.setVelocityY(120)

        if (player.angle < 90)
            player.angle += 1
    }

    pipesGroup.children.iterate(function (child) {
        if (child == undefined)
            return

        if (child.x < -50)
            child.destroy()
        else
            child.setVelocityX(-100)
    })

    gapsGroup.children.iterate(function (child) {
        child.body.setVelocityX(-100)
    })

    nextPipes++
    if (nextPipes === 130) {
        makePipes(game.scene.scenes[0])
        nextPipes = 0
    }
}

/**
 *  Bird collision event.
 *  @param {object} player - Game object that collided, in this case the bird. 
 */
function hitBird(player) {
    this.physics.pause()

    gameOver = true
    gameStarted = false

    player.anims.play(getAnimationBird(birdName).stop)
    ground.anims.play(assets.animation.ground.stop)

    // Check if current score is a new high score
    if (isNewHighScore(score)) {
        saveHighScore(score);
        newRecordText.setText(`NEW RECORD! ${score}`);
        newRecordText.visible = true;
    } else {
        newRecordText.visible = false;
    }
    
    // Update high score text
    highScoreText.setText('High Score: ' + highScore);
    highScoreText.visible = true;

    gameOverBanner.visible = true
    restartButton.visible = true
    menuButton.visible = true
    // Remove store button from game over screen
    // storeButton.visible = true
    
    // Hide main menu store button when game is over
    if (mainMenuStoreButton) mainMenuStoreButton.visible = false
}

/**
 * Update the score when the bird passes through a gap.
 * @param {object} player - Bird component.
 * @param {object} gap - Gap component.
 */
function updateScore(_, gap) {
    if (!gameStarted || gameOver) return

    score++
    gap.destroy()

    if (score % 10 == 0) {
        backgroundDay.visible = !backgroundDay.visible
        backgroundNight.visible = !backgroundNight.visible

        if (currentPipe === assets.obstacle.pipe.green)
            currentPipe = assets.obstacle.pipe.red
        else
            currentPipe = assets.obstacle.pipe.green
    }

    updateScoreboard()

    // Submit score to Oncade when it changes
    if (typeof submitScore === 'function') {
        submitScore(score);
    }
}

/**
 * Create pipes and gap in the game.
 * @param {object} scene - Game scene.
 */
function makePipes(scene) {
    if (!gameStarted || gameOver) return

    const pipeTopY = Phaser.Math.Between(-120, 120)

    const gap = scene.add.line(288, pipeTopY + 210, 0, 0, 0, 98)
    gapsGroup.add(gap)
    gap.body.allowGravity = false
    gap.visible = false

    const pipeTop = pipesGroup.create(288, pipeTopY, currentPipe.top)
    pipeTop.body.allowGravity = false

    const pipeBottom = pipesGroup.create(288, pipeTopY + 420, currentPipe.bottom)
    pipeBottom.body.allowGravity = false
}

/**
 * Move the bird in the screen.
 */
function moveBird() {
    if (gameOver)
        return

    if (!gameStarted)
        startGame(game.scene.scenes[0])

    player.setVelocityY(-400)
    player.angle = -15
    framesMoveUp = 5
}

/**
 * Get a random bird color.
 * @return {string} Bird color asset.
 */
function getRandomBird() {
    switch (Phaser.Math.Between(0, 2)) {
        case 0:
            return assets.bird.red
        case 1:
            return assets.bird.blue
        case 2:
        default:
            return assets.bird.yellow
    }
}

/**
 * Get the animation name from the bird.
 * @param {string} birdColor - Game bird color asset.
 * @return {object} - Bird animation asset.
 */
function getAnimationBird(birdColor) {
    switch (birdColor) {
        case assets.bird.red:
            return assets.animation.bird.red
        case assets.bird.blue:
            return assets.animation.bird.blue
        case assets.bird.yellow:
        default:
            return assets.animation.bird.yellow
    }
}

/**
 * Update the game scoreboard.
 */
function updateScoreboard() {
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if (scoreAsString.length == 1)
        scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
    else {
        let initialPosition = assets.scene.width - ((score.toString().length * assets.scoreboard.width) / 2)

        for (let i = 0; i < scoreAsString.length; i++) {
            scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
            initialPosition += assets.scoreboard.width
        }
    }
}

/**
 * Restart the game. 
 * Clean all groups, hide game over objects and stop game physics.
 */
function restartGame() {
    pipesGroup.clear(true, true)
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    player.destroy()
    gameOverBanner.visible = false
    restartButton.visible = false
    menuButton.visible = false
    highScoreText.visible = false
    newRecordText.visible = false
    // Remove store button from game over screen
    // storeButton.visible = false
    
    // Close store if it's open
    if (typeof window.isStoreOpen === 'function' && window.isStoreOpen()) {
        window.closeStore(game);
    }

    const gameScene = game.scene.scenes[0]
    prepareGame(gameScene)

    gameScene.physics.resume()
}

/**
 * Restart all variable and configurations, show main and recreate the bird.
 * @param {object} scene - Game scene.
 */
function prepareGame(scene) {
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = assets.obstacle.pipe.green
    score = 0
    gameOver = false
    backgroundDay.visible = true
    backgroundNight.visible = false
    messageInitial.visible = true
    
    // Show main menu store button and hide game over store button
    if (mainMenuStoreButton) mainMenuStoreButton.visible = true
    if (mainMenuTipButton) mainMenuTipButton.visible = true

    birdName = getRandomBird()
    player = scene.physics.add.sprite(60, 265, birdName)
    player.setCollideWorldBounds(true)
    player.anims.play(getAnimationBird(birdName).clapWings, true)
    player.body.allowGravity = false

    scene.physics.add.collider(player, ground, hitBird, null, scene)
    scene.physics.add.collider(player, pipesGroup, hitBird, null, scene)

    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)

    ground.anims.play(assets.animation.ground.moving, true)
}

/**
 * Start the game, create pipes and hide the main menu.
 * @param {object} scene - Game scene.
 */
function startGame(scene) {
    // Clear any existing pipes or gaps
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    
    // Set game state
    gameStarted = true
    gameOver = false
    messageInitial.visible = false
    
    // Hide main menu store button when game starts
    if (mainMenuStoreButton) mainMenuStoreButton.visible = false
    if (mainMenuTipButton) mainMenuTipButton.visible = false
    
    // Create initial score display
    const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
    score0.setDepth(20)
    
    // Reset bird position and physics
    if (player) {
        player.setPosition(60, 265)
        player.setVelocityY(0)
        player.angle = 0
        player.body.allowGravity = true
    }
    
    // Create initial pipes
    makePipes(scene)
}

/**
 * Return to the main menu.
 */
function returnToMenu() {
    // Clear all game elements
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    
    // Destroy the player if it exists
    if (player) {
        player.destroy()
    }
    
    // Hide game over elements
    gameOverBanner.visible = false
    restartButton.visible = false
    menuButton.visible = false
    highScoreText.visible = false
    newRecordText.visible = false
    
    // Close store if it's open
    if (typeof window.isStoreOpen === 'function' && window.isStoreOpen()) {
        window.closeStore(game);
    }
    
    // Reset game state
    gameStarted = false
    gameOver = false
    
    // Reset world state
    const gameScene = game.scene.scenes[0]
    gameScene.physics.pause()
    
    // Prepare the game for a fresh start
    prepareGame(gameScene)
    
    // Resume physics
    gameScene.physics.resume()
}

/**
 * Open the Oncade store
 */
function openGameStore() {
    if (typeof window.openStore === 'function') {
        window.openStore(game);
    }
}

/**
 * Open the tip page
 */
function openTipPage() {
    if (typeof window.getTipURL === 'function') {
        window.getTipURL().then(tipUrl => {
            if (tipUrl) {
                window.location.href = tipUrl;
            } else {
                console.error('Failed to get tip URL');
                // Show a message to the user that they need to be logged in
                const tipErrorText = game.scene.scenes[0].add.text(assets.scene.width, 400, 'Please log in to tip', {
                    font: '20px Arial',
                    fill: '#ffffff',
                    backgroundColor: '#ff0000',
                    padding: { x: 10, y: 5 }
                });
                tipErrorText.setOrigin(0.5);
                tipErrorText.setDepth(30);
                
                // Remove the error message after 3 seconds
                game.scene.scenes[0].time.delayedCall(3000, () => {
                    tipErrorText.destroy();
                });
            }
        });
    }
}

/**
 * Load the high score from local storage.
 */
function loadHighScore() {
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
    }
}

/**
 * Save the high score to local storage.
 * @param {number} newHighScore - The new high score to save.
 */
function saveHighScore(newHighScore) {
    localStorage.setItem('flappyBirdHighScore', newHighScore);
    highScore = newHighScore;
}

/**
 * Check if the current score is a new high score.
 * @param {number} currentScore - The current score to check.
 * @return {boolean} - True if the current score is a new high score.
 */
function isNewHighScore(currentScore) {
    return currentScore > highScore;
}