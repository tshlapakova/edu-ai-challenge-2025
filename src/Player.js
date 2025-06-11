import { GAME_CONFIG, CPU_MODES } from './constants.js';
import { Board } from './Board.js';

/**
 * Base Player class
 */
export class Player {
  constructor(name, showShips = false) {
    this.name = name;
    this.board = new Board(showShips);
    this.opponentBoard = new Board(false);
    this.setupBoard();
  }

  /**
   * Set up the player's board with ships
   */
  setupBoard() {
    this.board.placeShipsRandomly(GAME_CONFIG.NUM_SHIPS);
  }

  /**
   * Check if the player has lost (all ships sunk)
   * @returns {boolean} True if player has lost
   */
  hasLost() {
    return this.board.areAllShipsSunk();
  }

  /**
   * Get remaining ships count
   * @returns {number} Number of remaining ships
   */
  getRemainingShipsCount() {
    return this.board.getRemainingShipsCount();
  }

  /**
   * Process an opponent's guess on this player's board
   * @param {string} guess - Guess string
   * @returns {object} Result of the guess
   */
  receiveAttack(guess) {
    return this.board.processGuess(guess);
  }

  /**
   * Make a guess (to be implemented by subclasses)
   * @abstract
   * @returns {Promise<string>} Promise resolving to guess string
   */
  async makeGuess() {
    throw new Error('makeGuess method must be implemented by subclasses');
  }

  /**
   * Process the result of a guess made by this player
   * @param {string} guess - The guess that was made
   * @param {object} result - Result of the guess
   */
  processGuessResult(guess, result) {
    // Update opponent board representation
    const [row, col] = [parseInt(guess[0]), parseInt(guess[1])];
    
    if (result.hit) {
      this.opponentBoard.grid[row][col] = 'X';
    } else {
      this.opponentBoard.grid[row][col] = 'O';
    }
    
    // Add to guesses to track what we've tried
    this.opponentBoard.guesses.add(guess);
  }
}

/**
 * Human Player class
 */
export class HumanPlayer extends Player {
  constructor(inputHandler) {
    super('Human', true); // Show ships for human player
    this.inputHandler = inputHandler;
  }

  /**
   * Make a guess by asking for user input
   * @returns {Promise<string>} Promise resolving to guess string
   */
  async makeGuess() {
    while (true) {
      const input = await this.inputHandler.getInput('Enter your guess (e.g., 00): ');
      
      if (this.#isValidGuess(input)) {
        if (this.opponentBoard.hasBeenGuessed(parseInt(input[0]), parseInt(input[1]))) {
          console.log('You already guessed that location!');
          continue;
        }
        return input;
      }
      
      console.log('Oops, input must be exactly two digits (e.g., 00, 34, 98).');
    }
  }

  /**
   * Validate user input
   * @private
   * @param {string} input - User input
   * @returns {boolean} True if input is valid
   */
  #isValidGuess(input) {
    if (!input || input.length !== 2) return false;
    
    const row = parseInt(input[0]);
    const col = parseInt(input[1]);
    
    return !isNaN(row) && !isNaN(col) && 
           row >= 0 && row < GAME_CONFIG.BOARD_SIZE &&
           col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
  }
}

/**
 * CPU Player class with hunt and target modes
 */
export class CPUPlayer extends Player {
  constructor() {
    super('CPU', false); // Don't show ships for CPU
    this.mode = CPU_MODES.HUNT;
    this.targetQueue = [];
    this.lastHit = null;
  }

  /**
   * Make a guess using AI strategy
   * @returns {Promise<string>} Promise resolving to guess string
   */
  async makeGuess() {
    let guess;
    
    if (this.mode === CPU_MODES.TARGET && this.targetQueue.length > 0) {
      guess = this.#getTargetGuess();
    } else {
      // Switch to hunt mode if we were in target mode but have no targets
      if (this.mode === CPU_MODES.TARGET) {
        this.mode = CPU_MODES.HUNT;
      }
      guess = this.#getHuntGuess();
    }
    
    console.log(`CPU guesses: ${guess}`);
    return guess;
  }

  /**
   * Get a guess in target mode (when hunting around a known hit)
   * @private
   * @returns {string} Guess string
   */
  #getTargetGuess() {
    while (this.targetQueue.length > 0) {
      const target = this.targetQueue.shift();
      const [row, col] = [parseInt(target[0]), parseInt(target[1])];
      
      if (!this.opponentBoard.hasBeenGuessed(row, col)) {
        return target;
      }
    }
    
    // If no valid targets, switch to hunt mode
    this.mode = CPU_MODES.HUNT;
    return this.#getHuntGuess();
  }

  /**
   * Get a guess in hunt mode (random search)
   * @private
   * @returns {string} Guess string
   */
  #getHuntGuess() {
    let row, col;
    
    do {
      row = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
      col = Math.floor(Math.random() * GAME_CONFIG.BOARD_SIZE);
    } while (this.opponentBoard.hasBeenGuessed(row, col));
    
    return `${row}${col}`;
  }

  /**
   * Process the result of a guess and update AI state
   * @param {string} guess - The guess that was made
   * @param {object} result - Result of the guess
   */
  processGuessResult(guess, result) {
    super.processGuessResult(guess, result);
    
    if (result.hit) {
      if (result.sunk) {
        // Ship sunk, return to hunt mode
        this.mode = CPU_MODES.HUNT;
        this.targetQueue = [];
        this.lastHit = null;
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = CPU_MODES.TARGET;
        this.lastHit = guess;
        this.#addAdjacentTargets(guess);
      }
    } else if (this.mode === CPU_MODES.TARGET && this.targetQueue.length === 0) {
      // Miss in target mode with no more targets
      this.mode = CPU_MODES.HUNT;
    }
  }

  /**
   * Add adjacent cells to target queue
   * @private
   * @param {string} hitLocation - Location of the hit
   */
  #addAdjacentTargets(hitLocation) {
    const row = parseInt(hitLocation[0]);
    const col = parseInt(hitLocation[1]);
    
    const adjacentCells = [
      { r: row - 1, c: col },     // North
      { r: row + 1, c: col },     // South
      { r: row, c: col - 1 },     // West
      { r: row, c: col + 1 }      // East
    ];
    
    adjacentCells.forEach(({ r, c }) => {
      if (this.#isValidCoordinate(r, c) && !this.opponentBoard.hasBeenGuessed(r, c)) {
        const target = `${r}${c}`;
        if (!this.targetQueue.includes(target)) {
          this.targetQueue.push(target);
        }
      }
    });
  }

  /**
   * Check if coordinates are valid
   * @private
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} True if coordinates are valid
   */
  #isValidCoordinate(row, col) {
    return row >= 0 && row < GAME_CONFIG.BOARD_SIZE && 
           col >= 0 && col < GAME_CONFIG.BOARD_SIZE;
  }
} 