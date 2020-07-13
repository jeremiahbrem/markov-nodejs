/** Command-line tool to generate Markov text. */
const fs = require('fs');
const { MarkovMachine } = require('./markov');
const axios = require('axios');

// gather command line arguments
const path = process.argv;

// outputs Markov text from url contents
async function printMarkovUrlText(path) {
  try {
    const response = await axios.get(`${path}`);
    const markovText = new MarkovMachine(response.data);
    console.log(markovText.makeBigramText());
  } catch (error) {
    console.log(`There was a problem accessing the url. Error message: ${error.message}`);
  }
}

// outputs Markov text from file contents
function printMarkovFileText(path) {
  const fs = require('fs');

  try {
    const markovText = new MarkovMachine(fs.readFileSync(`${path}`, 'utf8'));
    console.log(markovText.makeBigramText());
  } catch (error) {
    console.error(`There was a problem accessing the file. Error message: ${error.message}`);
    process.exit(1);
  }
}

// returns relevant function depending on path being a file or url
function selectFunction(path) {
    if (path[2] === 'file') {
      return printMarkovFileText(path[3]);
    }
    else if (path[2] === 'url') {
      return printMarkovUrlText(path[3]);
    }
    else {
        console.log("First argument must be either 'file' or 'url'.")
    }
  }

  function generatorOutput() {
      
  }
  
  // export relevant function
  module.exports = selectFunction(path);