import { GAME_CONFIG } from './constants.js';

/**
 * GameRenderer handles all display and UI logic
 */
export class GameRenderer {
  /**
   * Display both player and opponent boards side by side
   * @param {Player} humanPlayer - Human player instance
   * @param {Player} cpuPlayer - CPU player instance
   */
  displayBoards(humanPlayer, cpuPlayer) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Header with column numbers
    const header = this.#createHeader();
    console.log(`${header}     ${header}`);
    
    // Display each row
    for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
      const opponentRow = this.#formatBoardRow(i, humanPlayer.opponentBoard.getGrid());
      const playerRow = this.#formatBoardRow(i, humanPlayer.board.getGrid());
      console.log(`${opponentRow}    ${playerRow}`);
    }
    
    console.log('\n');
  }

  /**
   * Create header row with column numbers
   * @private
   * @returns {string} Formatted header string
   */
  #createHeader() {
    let header = '  ';
    for (let i = 0; i < GAME_CONFIG.BOARD_SIZE; i++) {
      header += `${i} `;
    }
    return header;
  }

  /**
   * Format a single board row
   * @private
   * @param {number} rowIndex - Row index
   * @param {string[][]} grid - Board grid
   * @returns {string} Formatted row string
   */
  #formatBoardRow(rowIndex, grid) {
    let rowStr = `${rowIndex} `;
    for (let j = 0; j < GAME_CONFIG.BOARD_SIZE; j++) {
      rowStr += `${grid[rowIndex][j]} `;
    }
    return rowStr;
  }

  /**
   * Display game start message
   */
  displayGameStart() {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${GAME_CONFIG.NUM_SHIPS} enemy ships.`);
    console.log('Boards created and ships placed.');
  }

  /**
   * Display attack result
   * @param {string} attacker - Name of attacking player
   * @param {string} guess - The guess made
   * @param {object} result - Result of the attack
   */
  displayAttackResult(attacker, guess, result) {
    if (result.alreadyGuessed) {
      console.log(`${attacker} already guessed that location!`);
      return;
    }

    if (result.hit) {
      console.log(`${attacker.toUpperCase()} HIT at ${guess}!`);
      if (result.sunk) {
        console.log(`${attacker} sunk a battleship!`);
      }
    } else {
      console.log(`${attacker.toUpperCase()} MISS at ${guess}.`);
    }
  }

  /**
   * Display game over message
   * @param {string} winner - Name of the winning player
   */
  displayGameOver(winner) {
    console.log('\n' + '='.repeat(50));
    if (winner === 'Human') {
      console.log('*** CONGRATULATIONS! You sunk all enemy battleships! ***');
    } else {
      console.log('*** GAME OVER! The CPU sunk all your battleships! ***');
    }
    console.log('='.repeat(50));
  }

  /**
   * Display turn indicator
   * @param {string} playerName - Name of current player
   */
  displayTurn(playerName) {
    if (playerName === 'CPU') {
      console.log("\n--- CPU's Turn ---");
    }
  }

  /**
   * Display game statistics
   * @param {Player} humanPlayer - Human player instance
   * @param {Player} cpuPlayer - CPU player instance
   */
  displayStats(humanPlayer, cpuPlayer) {
    console.log(`\nRemaining ships - You: ${humanPlayer.getRemainingShipsCount()}, CPU: ${cpuPlayer.getRemainingShipsCount()}`);
  }

  /**
   * Clear console (works on most terminals)
   */
  clearScreen() {
    console.clear();
  }

  /**
   * Display a separator line
   */
  displaySeparator() {
    console.log('-'.repeat(40));
  }
} 