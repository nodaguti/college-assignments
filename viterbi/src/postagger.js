import salient from 'salient';
import fill from 'lodash.fill';
import model from '../model.json';

const tokeniser = new salient.tokenizers.WordPunctTokenizer();

export default class PosTagger {

  static tag(sentence) {
    const tags = Object.keys(model.posBigramProbs);
    const tokens = tokeniser.tokenize(sentence);

    tokens.unshift('<s>');

    const T = tokens.length;
    const S = tags.length;
    const V = fill(Array(T + 1), 0).map(() => fill(Array(S), 0)); // probability table
    const B = fill(Array(T + 1), 0).map(() => fill(Array(S), 0)); // back-pointer table

    V[0][0] = 1;

    tokens.forEach((_, i) => {
      const token = tokens[i + 1];
      if (!token) return;

      tags.forEach((tj, j) => {
        let maxProb = 0;
        let argMaxProb = 0;

        tags.forEach((tk, k) => {
          const prob =
            V[i][k]
            * (model.posBigramProbs[tk][tj] || 0.00000001) // psedo-smoothing
            * (model.wordGenProbs[tj][token.toLowerCase()] || 0.00000001); // psedo-smoothing

          // console.log({
          //   tk,
          //   tj,
          //   token,
          //   V: V[i][k],
          //   'tk -> tj': model.posBigramProbs[tk][tj],
          //   'tj -> token': model.wordGenProbs[tj][token.toLowerCase()],
          // });

          if (prob > maxProb) {
            maxProb = prob;
            argMaxProb = k;
          }
        });

        V[i + 1][j] = maxProb;
        B[i + 1][j] = argMaxProb;
      });
    });

    const taggedTokens = [];
    let maxProb = 0;
    let argMaxProb = 0;

    V[T].forEach((vj, j) => {
      if (vj > maxProb) {
        maxProb = vj;
        argMaxProb = j;
      }
    });

    taggedTokens[T] = {
      token: '</s>',
      tagId: argMaxProb,
      tag: tags[argMaxProb],
    };

    for (let j = T - 1; j >= 0; j -= 1) {
      const tagId = B[j + 1][taggedTokens[j + 1].tagId];

      taggedTokens[j] = {
        token: tokens[j],
        tagId,
        tag: tags[tagId],
      };
    }

    return {
      prob: maxProb,
      taggedTokens,
    };
  }

}
