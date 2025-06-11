import { GAME_CONFIG, CELL_STATES, CPU_MODES, SHIP_ORIENTATIONS } from '../src/constants.js';

describe('Constants', () => {
  describe('GAME_CONFIG', () => {
    test('should have correct board size', () => {
      expect(GAME_CONFIG.BOARD_SIZE).toBe(10);
      expect(typeof GAME_CONFIG.BOARD_SIZE).toBe('number');
    });

    test('should have correct number of ships', () => {
      expect(GAME_CONFIG.NUM_SHIPS).toBe(3);
      expect(typeof GAME_CONFIG.NUM_SHIPS).toBe('number');
    });

    test('should have correct ship length', () => {
      expect(GAME_CONFIG.SHIP_LENGTH).toBe(3);
      expect(typeof GAME_CONFIG.SHIP_LENGTH).toBe('number');
    });

    test('should have all required properties', () => {
      expect(GAME_CONFIG).toHaveProperty('BOARD_SIZE');
      expect(GAME_CONFIG).toHaveProperty('NUM_SHIPS');
      expect(GAME_CONFIG).toHaveProperty('SHIP_LENGTH');
    });
  });

  describe('CELL_STATES', () => {
    test('should have all required cell states', () => {
      expect(CELL_STATES.WATER).toBe('~');
      expect(CELL_STATES.SHIP).toBe('S');
      expect(CELL_STATES.HIT).toBe('X');
      expect(CELL_STATES.MISS).toBe('O');
    });

    test('should have correct types', () => {
      Object.values(CELL_STATES).forEach(state => {
        expect(typeof state).toBe('string');
        expect(state.length).toBe(1);
      });
    });

    test('should have unique values', () => {
      const values = Object.values(CELL_STATES);
      const uniqueValues = [...new Set(values)];
      expect(values.length).toBe(uniqueValues.length);
    });
  });

  describe('CPU_MODES', () => {
    test('should have correct CPU modes', () => {
      expect(CPU_MODES.HUNT).toBe('hunt');
      expect(CPU_MODES.TARGET).toBe('target');
    });

    test('should have all required modes', () => {
      expect(CPU_MODES).toHaveProperty('HUNT');
      expect(CPU_MODES).toHaveProperty('TARGET');
    });
  });

  describe('SHIP_ORIENTATIONS', () => {
    test('should have correct orientations', () => {
      expect(SHIP_ORIENTATIONS.HORIZONTAL).toBe('horizontal');
      expect(SHIP_ORIENTATIONS.VERTICAL).toBe('vertical');
    });

    test('should have all required orientations', () => {
      expect(SHIP_ORIENTATIONS).toHaveProperty('HORIZONTAL');
      expect(SHIP_ORIENTATIONS).toHaveProperty('VERTICAL');
    });
  });
}); 