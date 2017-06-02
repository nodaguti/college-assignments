# Viterbi

This program tries to tag each words with [the universal part-of-speech tags](https://github.com/nyxtom/salient/blob/master/lib/salient/corpus/universal_tagset/README) using Viterbi algorithm.

You have to install the latest Node.js (7.x) to run this program.

## Build

```console
$ yarn install
$ yarn run build
```

## Preparation

To parse and generate a model file for HMM POS tagging, run:

```console
$ node lib/cli.js parseCorpus brown
```

and it will create `model.json` in the working directory.

## POS Tagging

To tag an arbitrary sentence, run:

```console
$ node lib/cli.js tag 'A brief reference will be presented by him.'
Probability: 0
[ { token: '<s>', tagId: 0, tag: '<s>' },
  { token: 'A', tagId: 1, tag: 'DET' },
  { token: 'brief', tagId: 3, tag: 'ADJ' },
  { token: 'reference', tagId: 2, tag: 'NOUN' },
  { token: 'will', tagId: 4, tag: 'VERB' },
  { token: 'be', tagId: 4, tag: 'VERB' },
  { token: 'presented', tagId: 4, tag: 'VERB' },
  { token: 'by', tagId: 5, tag: 'ADP' },
  { token: 'him', tagId: 10, tag: 'PRON' },
  { token: '.', tagId: 0, tag: '<s>' },
  { token: '</s>', tagId: 0, tag: '<s>' } ]
```

## Acknowledgement

- [Brown Corpus](https://archive.org/details/BrownCorpus) by Nelson Francis and Henry Kucera, licensed under [CC BY NC](http://creativecommons.org/licenses/by-nc/3.0/).
