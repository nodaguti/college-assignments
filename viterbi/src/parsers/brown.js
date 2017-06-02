import fs from 'fs-extra-promise';
import path from 'path';
import update from 'lodash.update';
import mergeWith from 'lodash.mergewith';
import cloneDeep from 'lodash.clonedeep';

const POSMappingPath = path.join(__dirname, '../../node_modules/salient/lib/salient/corpus/universal_tagset/en-brown.map');

async function fetchPOSMapping() {
  const file = await fs.readFileAsync(POSMappingPath, 'utf-8');

  return file
    .split(/[\n\r]+/)
    .filter((line) => !!line)
    .reduce((map, line) => {
      const [brownTag, universalTag] = line.split(/\t/);

      return Object.assign({}, map, { [brownTag]: universalTag });
    }, {});
}

async function parseFile({ filePath, mapToUnivTag }) {
  const file = await fs.readFileAsync(filePath, 'utf-8');

  return file
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter((line) => !!line)
    .map((line) => {
      const items = line.split(' ');
      const tokens = items.map((token) => {
        const slashPos = token.lastIndexOf('/');

        return [
          token.substring(0, slashPos).toLowerCase(),
          token.substring(slashPos + 1).toUpperCase(),
        ];
      });

      tokens.unshift(['<s>', '<s>']);
      tokens.push(['</s>', '</s>']);

      return tokens;
    })
    .reduce(({ wordGenCounts, posBigramCounts }, tokens) => {
      tokens.forEach(([word, brownTag], idx) => {
        const univTag = mapToUnivTag[brownTag] || brownTag;

        update(wordGenCounts, [univTag, word], (count) => (count ? count + 1 : 1));

        const prevToken = tokens[idx - 1];

        if (prevToken) {
          const prevBrownTag = prevToken[1];
          const prevUnivTag = mapToUnivTag[prevBrownTag] || prevBrownTag;

          update(posBigramCounts, [prevUnivTag, univTag], (count) => (count ? count + 1 : 1));
        }
      });

      return { wordGenCounts, posBigramCounts };
    }, {
      wordGenCounts: {},
      posBigramCounts: {},
    });
}

export default async function parse(dir) {
  try {
    const filelist = await fs.readdirAsync(dir);
    const mapToUnivTag = await fetchPOSMapping();

    const results = await Promise.all(
      filelist
        .filter((filename) => !filename.startsWith('.'))
        .map((filename) => parseFile({
          filePath: path.join(dir, filename),
          mapToUnivTag,
        })),
    );

    const merger = (objValue, srcValue) => mergeWith(
      objValue || {},
      srcValue,
      (objCount, srcCount) => (objCount ? objCount + srcCount : srcCount),
    );

    const {
      partialWordGenCounts: wordGenCounts,
      partialPosBigramCounts: posBigramCounts,
    } = results.reduce((
      {
        partialWordGenCounts,
        partialPosBigramCounts,
      },
      {
        wordGenCounts: fileWordGenCounts,
        posBigramCounts: filePosBigramCounts,
      },
    ) => ({
      partialWordGenCounts: mergeWith(partialWordGenCounts, fileWordGenCounts, merger),
      partialPosBigramCounts: mergeWith(partialPosBigramCounts, filePosBigramCounts, merger),
    }), {
      partialWordGenCounts: {},
      partialPosBigramCounts: {},
    });

    const countsToProbs = (counts) => {
      const clonedCounts = cloneDeep(counts);

      Object
        .keys(clonedCounts)
        .forEach((key) => {
          const obj = clonedCounts[key];
          const sum = Object
            .keys(obj)
            .reduce((_sum, k) => _sum + obj[k], 0);
          Object
            .keys(obj)
            .forEach((k) => (obj[k] /= sum));
        });

      return clonedCounts;
    };

    return {
      wordGenProbs: countsToProbs(wordGenCounts),
      posBigramProbs: countsToProbs(posBigramCounts),
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return {};
}
