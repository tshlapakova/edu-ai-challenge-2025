const readline = require('readline');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function mod(n, m) {
  return ((n % m) + m) % m;
}

const ROTORS = [
  { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' }, // Rotor I
  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' }, // Rotor II
  { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }, // Rotor III
];
const REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

function plugboardSwap(c, pairs) {
  for (const [a, b] of pairs) {
    if (c === a) return b;
    if (c === b) return a;
  }
  return c;
}

class Rotor {
  constructor(wiring, notch, ringSetting = 0, position = 0) {
    this.wiring = wiring;
    this.notch = notch;
    this.ringSetting = ringSetting;
    this.position = position;
  }

  step() {
    this.position = mod(this.position + 1, 26);
  }

  atNotch() {
    return alphabet[mod(this.position, 26)] === this.notch;
  }

  // Fixed forward path through rotor
  forward(c) {
    // 1. Convert input character to number (0-25)
    const inputPos = alphabet.indexOf(c);
    
    // 2. Apply position and ring setting offset
    const shifted = mod(inputPos + this.position - this.ringSetting, 26);
    
    // 3. Pass through rotor wiring
    const wiringOutput = this.wiring[shifted];
    
    // 4. Reverse position and ring setting offset
    const outputPos = mod(alphabet.indexOf(wiringOutput) - this.position + this.ringSetting, 26);
    
    return alphabet[outputPos];
  }

  // Fixed backward path through rotor
  backward(c) {
    // 1. Convert input character to number (0-25)
    const inputPos = alphabet.indexOf(c);
    
    // 2. Apply position and ring setting offset
    const shifted = mod(inputPos + this.position - this.ringSetting, 26);
    
    // 3. Pass through inverse rotor wiring
    const wiringIndex = alphabet.indexOf(alphabet[shifted]);
    const throughWiring = alphabet[this.wiring.indexOf(alphabet[wiringIndex])];
    
    // 4. Reverse position and ring setting offset
    const outputPos = mod(alphabet.indexOf(throughWiring) - this.position + this.ringSetting, 26);
    
    return alphabet[outputPos];
  }
}

class Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i],
        ),
    );
    this.plugboardPairs = plugboardPairs;
  }

  stepRotors() {
    // Middle rotor also steps when right rotor is at notch
    if (this.rotors[1].atNotch()) {
      this.rotors[0].step();
      this.rotors[1].step();
    } else if (this.rotors[2].atNotch()) {
      this.rotors[1].step();
    }
    this.rotors[2].step();
  }

  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    
    this.stepRotors();
    
    // Initial plugboard substitution
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Forward through rotors
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    
    // Through reflector
    c = REFLECTOR[alphabet.indexOf(c)];
    
    // Backward through rotors
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }
    
    // Final plugboard substitution
    return plugboardSwap(c, this.plugboardPairs);
  }

  process(text) {
    return text
      .toUpperCase()
      .split('')
      .map((c) => this.encryptChar(c))
      .join('');
  }
}

function promptEnigma() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter message: ', (message) => {
    rl.question('Rotor positions (e.g. 0 0 0): ', (posStr) => {
      const rotorPositions = posStr.split(' ').map(Number);
      rl.question('Ring settings (e.g. 0 0 0): ', (ringStr) => {
        const ringSettings = ringStr.split(' ').map(Number);
        rl.question('Plugboard pairs (e.g. AB CD): ', (plugStr) => {
          const plugPairs =
            plugStr
              .toUpperCase()
              .match(/([A-Z]{2})/g)
              ?.map((pair) => [pair[0], pair[1]]) || [];

          const enigma = new Enigma(
            [0, 1, 2],
            rotorPositions,
            ringSettings,
            plugPairs,
          );
          const result = enigma.process(message);
          console.log('Output:', result);
          rl.close();
        });
      });
    });
  });
}

// Export classes and functions for testing
module.exports = {
  Enigma,
  Rotor,
  plugboardSwap,
  mod,
  ROTORS,
  REFLECTOR
};

// Run interactive prompt when this file is executed directly
if (require.main === module) {
  promptEnigma();
} 
