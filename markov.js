/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let chains = {};
    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i];
      if (i == this.words.length - 1 && !chains[word]) {
        chains[word] = [null];
        this.chains = chains;
      }
      else if (i == this.words.length - 1 && chains[word]) {
        chains[word].push(null);
        this.chains = chains;
      }
      else if (chains[word]) {
        chains[word].push(this.words[i + 1]);
      }
      else {
        chains[word] = [this.words[i + 1]];
      }
    }
  }

  // Find starting word that is capital and begins a sentence
  findStart() {
    let count = 0;
    let randIndex;
    // arbitary stop point if no word found meets criteria
    while (count < 1000) {
      if (!this.words) {
        return null;
      }
      randIndex = Math.floor(Math.random() * this.words.length);
      let wordCheck = this.words[randIndex];
      let ifCapital = (wordCheck[0] === wordCheck[0].toUpperCase());
      let previousWord = this.words[randIndex - 1];
      if (randIndex === 0 && ifCapital) {
        return this.words[0];
      }
      if (ifCapital && previousWord[previousWord.length - 1] === '.') {
        return wordCheck;
      }
      count++;
    }
    return this.words[randIndex];
  }

  /** return random text from chains */
  makeText(numWords = 100) {
    let startWord = this.findStart();
    let word = startWord;
    let output = [startWord];
    
    // Ends output if word is null, maximum number of words is reached, or a period is reached.
    while (word != null && output.length <= 100 && word[word.length - 1] !== '.') {
      let lastWord = output[output.length - 1];
      let randNextIndex = Math.floor(Math.random() * this.chains[lastWord].length);
      word = this.chains[lastWord][randNextIndex];

      if (word) {
        output.push(word);
      }
    }
    return output.join(" ");
  }

  // Bigram approach ***********************************************************************
  makeTextBigram(numWords = 100) {
    let bigramWords = getBigramWords();
  }

  getBigramWords() {
    let bigramWords = [];
    for (let i = 0; i < this.words.length - 1; i++) {
      let joinedWords = [this.words[i], this.words[i + 1]].join(' ');
      bigramWords.push(joinedWords);
    }
    return bigramWords;
  }

  makeBigramChains() {
    let chains = {};
    let bigramWords = this.getBigramWords();
    for (let i = 0; i < bigramWords.length; i++) {
      let words = bigramWords[i];
      if (i == bigramWords.length - 1 && !chains[words]) {
        chains[words] = [null];
        return chains;
      }
      else if (i == bigramWords.length - 1 && chains[words]) {
        chains[words].push(null);
        return chains;
      }
      else if (chains[words]) {
        let nextWord = bigramWords[i + 1].split(' ')[1];
        chains[words].push(nextWord);
      }
      else {
        let nextWord = bigramWords[i + 1].split(' ')[1];
        chains[words] = [nextWord];
      }
    }
  }

  findBigramStart() {
    let count = 0;
    let randIndex;
    let words = this.getBigramWords();
    // arbitary stop point if no word found meets criteria
    while (count < 1000) {
      if (!words) {
        return null;
      }
      randIndex = Math.floor(Math.random() * words.length);
      let wordCheck = words[randIndex];
      let ifCapital = (wordCheck[0] === wordCheck[0].toUpperCase());
      let previousWord = words[randIndex - 1];
      if (randIndex === 0 && ifCapital) {
        return words[0];
      }
      if (ifCapital && previousWord[previousWord.length - 1] === '.') {
        return wordCheck;
      }
      count++;
    }
    return words[randIndex];
  }  

  makeBigramText(numWords = 100) {
    let startWords = this.findBigramStart();
    let chains = this.makeBigramChains();
    let word = startWords;
    startWords = startWords.split(/[ \r\n]+/);
    let output = [startWords[0], startWords[1]];
    
    // Ends output if word is null, maximum number of words is reached, or a period is reached.
    while (word != null && output.length <= 100 && word[word.length - 1] !== '.') {
      let lastWords = [output[output.length - 2], output[output.length - 1]].join(' ');
      let randNextIndex = Math.floor(Math.random() * chains[lastWords].length);
      word = chains[lastWords][randNextIndex];

      if (word) {
        output.push(word);
      }
    }
    return output.join(" ");
  }

  //generator function that outputs one word at time
  *generator() {
    let markovText = this.makeBigramText().split(/[ \r\n]+/);
    for (let i = 0; i < markovText.length; i++) {
      if (i == 0) {
        yield markovText[0];
      }
      else {
        yield " " + markovText[i];
      }  
    }
  }

}

module.exports = {MarkovMachine};
