import { GAME_CONFIG, CELL_STATES, SHIP_ORIENTATIONS } from './constants.js';
import { Ship } from './Ship.js';

export class Board {
  constructor(showShips = false) {
    this.size = GAME_CONFIG.BOARD_SIZE;
    this.showShips = showShips;
    this.grid = this.#initializeGrid();
    this.ships = [];
    this.guesses = new Set();
  }

  /**
   * Initialize empty board grid
   * @private
   * @returns {string[][]} 2D array representing the board
   */
  #initializeGrid() {
    return Array.from({ length: this.size }, () => 
      Array.from({ length: this.size }, () => CELL_STATES.WATER)
    );
  }

  /**
   * Place ships randomly on the board
   * @param {number} numShips - Number of ships to place
   */
  placeShipsRandomly(numShips = GAME_CONFIG.NUM_SHIPS) {
    let placedShips = 0;
    
    while (placedShips < numShips) {
      const ship = this.#generateRandomShip();
      if (ship && this.#canPlaceShip(ship.locations)) {
        this.#placeShip(ship);
        placedShips++;
      }
    }
  }

  /**
   * Generate a random ship with valid locations
   * @private
   * @returns {Ship|null} Ship object or null if generation failed
   */
  #generateRandomShip() {
    const orientation = Math.random() < 0.5 ? 
      SHIP_ORIENTATIONS.HORIZONTAL : SHIP_ORIENTATIONS.VERTICAL;
    
    const { startRow, startCol } = this.#getRandomStartPosition(orientation);
    const locations = this.#generateShipLocations(startRow, startCol, orientation);
    
    return locations ? new Ship(locations) : null;
  }

  /**
   * Get random start position for ship placement
   * @private
   * @param {string} orientation - Ship orientation
   * @returns {object} Object with startRow and startCol
   */
  #getRandomStartPosition(orientation) {
    if (orientation === SHIP_ORIENTATIONS.HORIZONTAL) {
      return {
        startRow: Math.floor(Math.random() * this.size),
        startCol: Math.floor(Math.random() * (this.size - GAME_CONFIG.SHIP_LENGTH + 1))
      };
    } else {
      return {
        startRow: Math.floor(Math.random() * (this.size - GAME_CONFIG.SHIP_LENGTH + 1)),
        startCol: Math.floor(Math.random() * this.size)
      };
    }
  }

  /**
   * Generate ship locations based on start position and orientation
   * @private
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {string} orientation - Ship orientation
   * @returns {string[]|null} Array of location strings or null if invalid
   */
  #generateShipLocations(startRow, startCol, orientation) {
    const locations = [];
    
    for (let i = 0; i < GAME_CONFIG.SHIP_LENGTH; i++) {
      const row = orientation === SHIP_ORIENTATIONS.HORIZONTAL ? startRow : startRow + i;
      const col = orientation === SHIP_ORIENTATIONS.HORIZONTAL ? startCol + i : startCol;
      
      if (!this.#isValidCoordinate(row, col)) {
        return null;
      }
      
      locations.push(`${row}${col}`);
    }
    
    return locations;
  }

  /**
   * Check if coordinates are valid
   * @private
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} True if coordinates are valid
   */
  #isValidCoordinate(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Check if a ship can be placed at the given locations
   * @private
   * @param {string[]} locations - Array of location strings
   * @returns {boolean} True if ship can be placed
   */
  #canPlaceShip(locations) {
    return locations.every(location => {
      const [row, col] = this.#parseLocation(location);
      return this.grid[row][col] === CELL_STATES.WATER;
    });
  }

  /**
   * Place a ship on the board
   * @private
   * @param {Ship} ship - Ship to place
   */
  #placeShip(ship) {
    this.ships.push(ship);
    
    if (this.showShips) {
      ship.locations.forEach(location => {
        const [row, col] = this.#parseLocation(location);
        this.grid[row][col] = CELL_STATES.SHIP;
      });
    }
  }

  /**
   * Parse location string into row and column numbers
   * @private
   * @param {string} location - Location string (e.g., "34")
   * @returns {number[]} Array with [row, col]
   */
  #parseLocation(location) {
    return [parseInt(location[0]), parseInt(location[1])];
  }

  /**
   * Process a guess on this board
   * @param {string} guess - Guess string (e.g., "34")
   * @returns {object} Result object with hit, sunk, and ship info
   */
  processGuess(guess) {
    if (this.guesses.has(guess)) {
      return { hit: false, alreadyGuessed: true, sunk: false };
    }

    this.guesses.add(guess);
    const [row, col] = this.#parseLocation(guess);
    
    // Check if any ship is hit
    for (const ship of this.ships) {
      if (ship.hit(guess)) {
        this.grid[row][col] = CELL_STATES.HIT;
        return {
          hit: true,
          sunk: ship.isSunk(),
          alreadyGuessed: false,
          ship
        };
      }
    }

    // Miss
    this.grid[row][col] = CELL_STATES.MISS;
    return { hit: false, sunk: false, alreadyGuessed: false };
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} True if all ships are sunk
   */
  areAllShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }

  /**
   * Get the number of remaining ships
   * @returns {number} Number of ships that are not sunk
   */
  getRemainingShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Check if a coordinate has been guessed
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} True if coordinate has been guessed
   */
  hasBeenGuessed(row, col) {
    const location = `${row}${col}`;
    return this.guesses.has(location);
  }

  /**
   * Get the current state of the board
   * @returns {string[][]} 2D array representing current board state
   */
  getGrid() {
    return this.grid.map(row => [...row]);
  }
} 