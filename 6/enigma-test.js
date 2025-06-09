const { Enigma } = require('./enigma.js');

// Test functions
function runTests() {
  console.log('Running Enigma tests...');
  
  // Test 1: Basic encryption/decryption
  const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
  const message = 'HELLOWORLD';
  const encrypted = enigma1.process(message);
  
  // Reset rotor positions for decryption
  const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
  const decrypted = enigma2.process(encrypted);
  
  console.log('Test 1:');
  console.log('Original:', message);
  console.log('Encrypted:', encrypted);
  console.log('Decrypted:', decrypted);
  console.log('Test 1 ' + (message === decrypted ? 'PASSED' : 'FAILED'));
  
  // Test 2: Different rotor positions
  const enigma3 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  const message2 = 'TESTMESSAGE';
  const encrypted2 = enigma3.process(message2);
  
  const enigma4 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
  const decrypted2 = enigma4.process(encrypted2);
  
  console.log('\nTest 2:');
  console.log('Original:', message2);
  console.log('Encrypted:', encrypted2);
  console.log('Decrypted:', decrypted2);
  console.log('Test 2 ' + (message2 === decrypted2 ? 'PASSED' : 'FAILED'));

  // Test 3: Ring settings test
  const enigma5 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
  const message3 = 'RINGSETTINGS';
  const encrypted3 = enigma5.process(message3);
  
  const enigma6 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
  const decrypted3 = enigma6.process(encrypted3);
  
  console.log('\nTest 3:');
  console.log('Original:', message3);
  console.log('Encrypted:', encrypted3);
  console.log('Decrypted:', decrypted3);
  console.log('Test 3 ' + (message3 === decrypted3 ? 'PASSED' : 'FAILED'));

  // Test 4: Multiple plugboard pairs
  const enigma7 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D'], ['E', 'F']]);
  const message4 = 'PLUGBOARD';
  const encrypted4 = enigma7.process(message4);
  
  const enigma8 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B'], ['C', 'D'], ['E', 'F']]);
  const decrypted4 = enigma8.process(encrypted4);
  
  console.log('\nTest 4:');
  console.log('Original:', message4);
  console.log('Encrypted:', encrypted4);
  console.log('Decrypted:', decrypted4);
  console.log('Test 4 ' + (message4 === decrypted4 ? 'PASSED' : 'FAILED'));

  // Summary
  const allTests = [
    message === decrypted,
    message2 === decrypted2,
    message3 === decrypted3,
    message4 === decrypted4
  ];
  
  const passedTests = allTests.filter(test => test).length;
  console.log(`\n=== Test Summary ===`);
  console.log(`${passedTests}/${allTests.length} tests passed`);
  
  if (passedTests === allTests.length) {
    console.log('✅ All tests PASSED! Enigma machine is working correctly.');
  } else {
    console.log('❌ Some tests FAILED. Please check the implementation.');
  }
}

// Run tests when this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 