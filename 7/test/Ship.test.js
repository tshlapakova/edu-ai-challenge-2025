import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(['12', '22', '32']);
  });

  describe('constructor', () => {
    test('creates ship with provided locations', () => {
      expect(ship.locations).toEqual(['12', '22', '32']);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('creates empty ship by default', () => {
      const emptyShip = new Ship();
      expect(emptyShip.locations).toEqual([]);
      expect(emptyShip.hits).toEqual([]);
    });
  });

  describe('hit', () => {
    test('hits valid location and returns true', () => {
      expect(ship.hit('22')).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    test('returns false for invalid location', () => {
      expect(ship.hit('99')).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });
  });

  describe('isHitAt', () => {
    test('returns true for hit location', () => {
      ship.hit('12');
      expect(ship.isHitAt('12')).toBe(true);
    });

    test('returns false for unhit location', () => {
      expect(ship.isHitAt('12')).toBe(false);
    });
  });

  describe('isSunk', () => {
    test('returns false when partially hit', () => {
      ship.hit('12');
      expect(ship.isSunk()).toBe(false);
    });

    test('returns true when all locations hit', () => {
      ship.hit('12');
      ship.hit('22');
      ship.hit('32');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('occupiesLocation', () => {
    test('returns true for occupied location', () => {
      expect(ship.occupiesLocation('22')).toBe(true);
    });

    test('returns false for unoccupied location', () => {
      expect(ship.occupiesLocation('99')).toBe(false);
    });
  });

  describe('getLength', () => {
    test('returns correct ship length', () => {
      expect(ship.getLength()).toBe(3);
    });
  });
}); 