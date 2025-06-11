import { GAME_CONFIG } from './constants.js';

export class Ship {
  constructor(locations = []) {
    this.locations = locations;
    this.hits = new Array(locations.length).fill(false);
  }

  /**
   * Check if the ship is hit at a specific location
   * @param {string} location - Location string (e.g., "34")
   * @returns {boolean} True if hit, false otherwise
   */
  isHitAt(location) {
    const index = this.locations.indexOf(location);
    return index !== -1 && this.hits[index];
  }

  /**
   * Hit the ship at a specific location
   * @param {string} location - Location string (e.g., "34")
   * @returns {boolean} True if the location was part of this ship, false otherwise
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index !== -1) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  /**
   * Check if the ship is completely sunk
   * @returns {boolean} True if all parts are hit, false otherwise
   */
  isSunk() {
    return this.hits.every(hit => hit);
  }

  /**
   * Check if the ship occupies a specific location
   * @param {string} location - Location string (e.g., "34")
   * @returns {boolean} True if the ship occupies this location
   */
  occupiesLocation(location) {
    return this.locations.includes(location);
  }

  /**
   * Get the ship's length
   * @returns {number} Number of locations occupied by the ship
   */
  getLength() {
    return this.locations.length;
  }
} 