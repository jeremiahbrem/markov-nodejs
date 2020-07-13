const { MarkovMachine } = require("./markov");

describe("MarkovMachine functions", function () {

    let markov;

    beforeEach(function () {
        markov = new MarkovMachine("the cat in the hat");
    })

    test('makeChains', function() {
      expect(markov.words).toEqual(["the", "cat", "in", "the", "hat"]);
      expect(markov.chains['the']).toEqual(["cat", "hat"]);
      expect(markov.chains['cat']).toEqual(["in"]);
      expect(markov.chains['in']).toEqual(["the"]);
      expect(markov.chains['hat']).toEqual([null]);
    });

    test('makeText', function() {
        let text = markov.makeText();
        let splitText = text.split(/[ \r\n]+/);
        expect(text.length).toBeGreaterThanOrEqual(1);

        // check if each word in output is in Markov object.words, and if next 
        // word is in object.chains values 
        for (let i = 0; i < splitText.length; i++) {
            let word = splitText[i];
            expect(markov.words).toContain(word);
            if (splitText[i + 1]) {
                expect(markov.chains[word]).toContain(splitText[i + 1]);
            }
        }
    })

    test('findStart', function() {
        let newMarkov = new MarkovMachine("The cat is in the hat. Inside the hat is the cat.");
        expect(['The', 'Inside']).toContain(newMarkov.findStart());
    })

    test('findStart no cap', function() {
        let newMarkov = new MarkovMachine("cat is in the hat");
        expect('cat is in the hat').toContain(newMarkov.findStart());
    })

    test('makeBigramChains', function() {
        let chains = markov.makeBigramChains();
        expect(markov.getBigramWords()).toEqual(["the cat", "cat in", "in the", "the hat"]);
        expect(chains['the cat']).toEqual(["in"]);
        expect(chains['cat in']).toEqual(["the"]);
        expect(chains['in the']).toEqual(["hat"]);
        expect(chains['the hat']).toEqual([null]);
    });

    test('findBigramStart', function() {
        let newMarkov = new MarkovMachine("The cat is in the hat. Inside the hat is the cat.");
        expect(['The cat', 'Inside the']).toContain(newMarkov.findBigramStart());
    })

    test('makeBigramText', function() {
        let text = markov.makeBigramText();
        let words = markov.getBigramWords();
        let chains = markov.makeBigramChains();
        let splitText = text.split(/[ \r\n]+/);
        expect(text.length).toBeGreaterThanOrEqual(1);

        // check if each word in output is in Markov object.words, and if next 
        // word is in object.chains values 
        for (let i = 1; i < splitText.length; i++) {
            let twoWords = `${splitText[i - 1]} ${splitText[i]}`;
            expect(words).toContain(twoWords);
            if (splitText[i + 1]) {
                expect(chains[twoWords]).toContain(splitText[i + 1]);
            }
        }
    })
});