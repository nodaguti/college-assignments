/* eslint-disable no-console */

import path from 'path';
import fs from 'fs-extra-promise';
import PosTagger from './postagger';
import Parsers from './parsers';

const commands = {
  async parseCorpus(name) {
    const parse = Parsers[name];
    const corpusPath = path.join(__dirname, '..', 'corpora', name);

    if (!parse) {
      console.error(`No parser called ${name} was found.`);
      return;
    }

    console.log(`Parsing ${name}...`);
    console.time('parseCorpus');

    const {
      wordGenProbs,
      posBigramProbs,
    } = await parse(corpusPath);

    console.log('Writing parsed data to model.json...');

    await fs.writeFileAsync('model.json', JSON.stringify({ wordGenProbs, posBigramProbs }));

    console.log('Done!');
    console.timeEnd('parseCorpus');
  },

  tag(sentence) {
    const { prob, taggedTokens } = PosTagger.tag(sentence);

    console.log(`Probability: ${prob}`);
    console.log(taggedTokens);
  },
};

// Drop the first argument that is a path to this file.
const args = process.argv.slice(2);

const command = args.shift();

if (typeof commands[command] !== 'function') {
  console.error(`${command} is not available!`);
} else {
  try {
    commands[command](...args);
  } catch (e) {
    console.error(e);
  }
}
