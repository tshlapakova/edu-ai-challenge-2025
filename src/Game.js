import { HumanPlayer, CPUPlayer } from './Player.js';
import { GameRenderer } from './GameRenderer.js';
import { InputHandler } from './InputHandler.js';

/**
 * Main Game class that orchestrates the Sea Battle game
 */
export class Game {
  constructor() {
    this.inputHandler = new InputHandler();
    this.renderer = new GameRenderer();
    this.humanPlayer = null;
    this.cpuPlayer = null;
    this.currentPlayer = null;
    this.gameOver = false;
    this.winner = null;
  }

  /**
   * Initialize the game
   */
  async initialize() {
    console.log('Initializing Sea Battle...');
    
    // Create players
    this.humanPlayer = new HumanPlayer(this.inputHandler);
    this.cpuPlayer = new CPUPlayer();
    
    // Human player goes first
    this.currentPlayer = this.humanPlayer;
    
    this.renderer.displayGameStart();
  }

  /**
   * Start and run the main game loop
   */
  async start() {
    await this.initialize();
    
    while (!this.gameOver) {
      await this.playTurn();
      this.switchPlayer();
    }
    
    await this.endGame();
  }

  /**
   * Play a single turn
   */
  async playTurn() {
    // Display current game state
    this.renderer.displayBoards(this.humanPlayer, this.cpuPlayer);
    this.renderer.displayTurn(this.currentPlayer.name);
    
    // Get player's guess
    const guess = await this.currentPlayer.makeGuess();
    
    // Process the guess
    const opponent = this.getOpponent();
    const result = opponent.receiveAttack(guess);
    
    // Update player's knowledge of opponent board
    this.currentPlayer.processGuessResult(guess, result);
    
    // Display result
    this.renderer.displayAttackResult(this.currentPlayer.name, guess, result);
    
    // Check for game over conditions
    this.checkGameOver();
    
    // Small delay for CPU moves to make it more readable
    if (this.currentPlayer.name === 'CPU') {
      await this.sleep(1000);
    }
  }

  /**
   * Get the opponent of the current player
   * @returns {Player} The opponent player
   */
  getOpponent() {
    return this.currentPlayer === this.humanPlayer ? this.cpuPlayer : this.humanPlayer;
  }

  /**
   * Switch to the other player
   */
  switchPlayer() {
    if (!this.gameOver) {
      this.currentPlayer = this.currentPlayer === this.humanPlayer ? 
        this.cpuPlayer : this.humanPlayer;
    }
  }

  /**
   * Check if the game is over
   */
  checkGameOver() {
    if (this.humanPlayer.hasLost()) {
      this.gameOver = true;
      this.winner = 'CPU';
    } else if (this.cpuPlayer.hasLost()) {
      this.gameOver = true;
      this.winner = 'Human';
    }
  }

  /**
   * Handle game end
   */
  async endGame() {
    // Display final board state
    this.renderer.displayBoards(this.humanPlayer, this.cpuPlayer);
    
    // Display game over message
    this.renderer.displayGameOver(this.winner);
    
    // Display final stats
    this.renderer.displayStats(this.humanPlayer, this.cpuPlayer);
    
    // Ask if player wants to play again
    const playAgain = await this.inputHandler.getConfirmation('Would you like to play again?');
    
    if (playAgain) {
      await this.restart();
    } else {
      this.cleanup();
    }
  }

  /**
   * Restart the game
   */
  async restart() {
    // Reset game state
    this.gameOver = false;
    this.winner = null;
    
    // Re-initialize and start
    await this.start();
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.inputHandler.close();
    console.log('\nThanks for playing Sea Battle!');
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>} Promise that resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle errors gracefully
   * @param {Error} error - Error that occurred
   */
  handleError(error) {
    console.error('An error occurred:', error.message);
    this.cleanup();
    process.exit(1);
  }
} 