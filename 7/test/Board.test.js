import { Board } from '../src/Board.js';
import { GAME_CONFIG, CELL_STATES } from '../src/constants.js';

// Mock Math.random for deterministic tests
const originalRandom = Math.random;
const mockRandom = (values) => {
  let index = 0;
  Math.random = jest.fn(() => {
    if (index >= values.length) index = 0;
    return values[index++];
  });
};

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(false);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('constructor', () => {
    test('creates board with correct size', () => {
      expect(board.size).toBe(GAME_CONFIG.BOARD_SIZE);
      expect(board.grid).toHaveLength(GAME_CONFIG.BOARD_SIZE);
      expect(board.grid[0]).toHaveLength(GAME_CONFIG.BOARD_SIZE);
    });

    test('initializes grid with water', () => {
      board.grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(CELL_STATES.WATER);
        });
      });
    });

    test('creates board with showShips option', () => {
      const visibleBoard = new Board(true);
      expect(visibleBoard.showShips).toBe(true);
    });

    test('initializes empty ships array and guesses set', () => {
      expect(board.ships).toEqual([]);
      expect(board.guesses).toBeInstanceOf(Set);
      expect(board.guesses.size).toBe(0);
    });
  });

  describe('placeShipsRandomly', () => {
    beforeEach(() => {
      // Mock random values for deterministic ship placement
      mockRandom([
        0.3, // horizontal orientation
        0.2, 0.1, // position for first ship
        0.7, // vertical orientation  
        0.5, 0.3, // position for second ship
        0.2, // horizontal orientation
        0.8, 0.6  // position for third ship
      ]);
    });

    test('places correct number of ships', () => {
      board.placeShipsRandomly(2);
      expect(board.ships).toHaveLength(2);
    });

    test('places ships with correct length', () => {
      board.placeShipsRandomly(1);
      expect(board.ships[0].getLength()).toBe(GAME_CONFIG.SHIP_LENGTH);
    });

    test('ships have valid locations', () => {
      board.placeShipsRandomly(1);
      const ship = board.ships[0];
      ship.locations.forEach(location => {
        expect(location).toMatch(/^\d\d$/);
        const row = parseInt(location[0]);
        const col = parseInt(location[1]);
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(GAME_CONFIG.BOARD_SIZE);
        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(GAME_CONFIG.BOARD_SIZE);
      });
    });

    test('shows ships on board when showShips is true', () => {
      const visibleBoard = new Board(true);
      mockRandom([0.3, 0.2, 0.1]); // Reset mock for this test
      visibleBoard.placeShipsRandomly(1);
      
      let shipCells = 0;
      visibleBoard.grid.forEach(row => {
        row.forEach(cell => {
          if (cell === CELL_STATES.SHIP) shipCells++;
        });
      });
      expect(shipCells).toBe(GAME_CONFIG.SHIP_LENGTH);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      mockRandom([0.3, 0.2, 0.1]);
      board.placeShipsRandomly(1);
    });

    test('processes miss correctly', () => {
      const result = board.processGuess('99');
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      expect(board.grid[9][9]).toBe(CELL_STATES.MISS);
      expect(board.guesses.has('99')).toBe(true);
    });

    test('processes hit correctly', () => {
      const ship = board.ships[0];
      const location = ship.locations[0];
      const result = board.processGuess(location);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      expect(result.ship).toBe(ship);
      
      const row = parseInt(location[0]);
      const col = parseInt(location[1]);
      expect(board.grid[row][col]).toBe(CELL_STATES.HIT);
    });

    test('detects already guessed location', () => {
      board.processGuess('99');
      const result = board.processGuess('99');
      
      expect(result.alreadyGuessed).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
    });

    test('detects sunk ship', () => {
      const ship = board.ships[0];
      
      // Hit all locations except last
      for (let i = 0; i < ship.locations.length - 1; i++) {
        board.processGuess(ship.locations[i]);
      }
      
      // Hit last location
      const result = board.processGuess(ship.locations[ship.locations.length - 1]);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });
  });

  describe('areAllShipsSunk', () => {
    beforeEach(() => {
      mockRandom([0.3, 0.2, 0.1, 0.7, 0.5, 0.3]);
      board.placeShipsRandomly(2);
    });

    test('returns false when no ships are sunk', () => {
      expect(board.areAllShipsSunk()).toBe(false);
    });

    test('returns false when some ships are sunk', () => {
      const firstShip = board.ships[0];
      firstShip.locations.forEach(location => {
        board.processGuess(location);
      });
      expect(board.areAllShipsSunk()).toBe(false);
    });

    test('returns true when all ships are sunk', () => {
      board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          board.processGuess(location);
        });
      });
      expect(board.areAllShipsSunk()).toBe(true);
    });
  });

  describe('getRemainingShipsCount', () => {
    beforeEach(() => {
      mockRandom([0.3, 0.2, 0.1, 0.7, 0.5, 0.3]);
      board.placeShipsRandomly(2);
    });

    test('returns correct count with no ships sunk', () => {
      expect(board.getRemainingShipsCount()).toBe(2);
    });

    test('returns correct count with one ship sunk', () => {
      const firstShip = board.ships[0];
      firstShip.locations.forEach(location => {
        board.processGuess(location);
      });
      expect(board.getRemainingShipsCount()).toBe(1);
    });

    test('returns zero when all ships sunk', () => {
      board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          board.processGuess(location);
        });
      });
      expect(board.getRemainingShipsCount()).toBe(0);
    });
  });

  describe('hasBeenGuessed', () => {
    test('returns false for unguessed location', () => {
      expect(board.hasBeenGuessed(5, 5)).toBe(false);
    });

    test('returns true for guessed location', () => {
      board.processGuess('55');
      expect(board.hasBeenGuessed(5, 5)).toBe(true);
    });
  });

  describe('getGrid', () => {
    test('returns copy of grid', () => {
      const grid = board.getGrid();
      expect(grid).toEqual(board.grid);
      expect(grid).not.toBe(board.grid); // Should be a copy
    });

    test('modifications to returned grid do not affect original', () => {
      const grid = board.getGrid();
      grid[0][0] = 'X';
      expect(board.grid[0][0]).toBe(CELL_STATES.WATER);
    });
  });
}); 