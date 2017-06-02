# Programming Assignment A1

This program tries to tag each words with [the universal part-of-speech tags](https://github.com/nyxtom/salient/blob/master/lib/salient/corpus/universal_tagset/README).

## Instructions

You have to install the latest Node.js (7.x) to run this program.

### Preparation

To parse and generate a model file for HMM POS tagging, run:

```console
$ node lib/cli.js parseCorpus brown
```

and it will create `model.json` in the working directory.

### POS Tagging

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

## Thoughts on Implementation
The first thing I'd been careful of is write code as clearly as possible. I made an effort to keep naming variables, methods and classes meaningfully and understandably. I also avoid mutating existing variables to make code clear.

At the same time, I was aware of creating an efficient program. For example, in `parser/brown.js`, reading and parsing each files of Brown Corpus is processed concurrently and each results are merged after loading all files, which was the hardest part of this programming.


## Future Work
The biggest remaining task is implement proper and appropriate smoothing technique, which is currently temporarily processed by simply replacing `undefined` with the constant `0.00000001` if there is no probability record for a certain word/POS tag (See postagger.js#L33). It seems working, but it is surely not cool.

Secondly, always emitting `0` for a probability is not a good thing, which I think is caused by float calculation's limitation of JavaScript. Possibly it could be resolved if I port this program into Python or Scilab, but please forgive me, I just wanted to try creating a NLP program with JavaScript. However, when it comes to using this program in practive, not being able to check a probability value is a little bit unuseful, thus it could also be a part of future work.

In addition, I'd like to make it possible to use other corpora as well such as Penn TreeBank and Wikitionary, which I couldn't finish implementing due to time limitation, to improve precision. In fact, there is already a machanism to replace Brown Corpus with another corpus under the hood, so only I have to work on is just create another parsing program under `src/parsers/`.

Finally, it's really regretful not to have been able to evaluate my program quontitatively, so that could be another thing I want to tackle next time.

## Examples

### Almost Good
```
$ node lib/cli.js tag 'I wanted to be a teacher in the future.'
Probability: 0
[ { token: '<s>', tagId: 0, tag: '<s>' },
  { token: 'I', tagId: 10, tag: 'PRON' },
  { token: 'wanted', tagId: 4, tag: 'VERB' },
  { token: 'to', tagId: 9, tag: 'PRT' },
  { token: 'be', tagId: 4, tag: 'VERB' },
  { token: 'a', tagId: 1, tag: 'DET' },
  { token: 'teacher', tagId: 2, tag: 'NOUN' },
  { token: 'in', tagId: 5, tag: 'ADP' },
  { token: 'the', tagId: 1, tag: 'DET' },
  { token: 'future', tagId: 2, tag: 'NOUN' },
  { token: '.', tagId: 0, tag: '<s>' },
  { token: '</s>', tagId: 0, tag: '<s>' } ]
```

```
$ node lib/cli.js tag 'We are going to go picnic tomorrow if it is sunny and not windy, but I am afraid that it will be cold tomorrow.'
Probability: 0
[ { token: '<s>', tagId: 0, tag: '<s>' },
  { token: 'We', tagId: 10, tag: 'PRON' },
  { token: 'are', tagId: 4, tag: 'VERB' },
  { token: 'going', tagId: 4, tag: 'VERB' },
  { token: 'to', tagId: 9, tag: 'PRT' },
  { token: 'go', tagId: 4, tag: 'VERB' },
  { token: 'picnic', tagId: 2, tag: 'NOUN' },
  { token: 'tomorrow', tagId: 2, tag: 'NOUN' },
  { token: 'if', tagId: 5, tag: 'ADP' },
  { token: 'it', tagId: 10, tag: 'PRON' },
  { token: 'is', tagId: 4, tag: 'VERB' },
  { token: 'sunny', tagId: 3, tag: 'ADJ' },
  { token: 'and', tagId: 8, tag: 'CONJ' },
  { token: 'not', tagId: 7, tag: 'ADV' },
  { token: 'windy', tagId: 3, tag: 'ADJ' },
  { token: ',', tagId: 6, tag: '.' },
  { token: 'but', tagId: 8, tag: 'CONJ' },
  { token: 'I', tagId: 10, tag: 'PRON' },
  { token: 'am', tagId: 4, tag: 'VERB' },
  { token: 'afraid', tagId: 3, tag: 'ADJ' },
  { token: 'that', tagId: 5, tag: 'ADP' },
  { token: 'it', tagId: 10, tag: 'PRON' },
  { token: 'will', tagId: 4, tag: 'VERB' },
  { token: 'be', tagId: 4, tag: 'VERB' },
  { token: 'cold', tagId: 3, tag: 'ADJ' },
  { token: 'tomorrow', tagId: 2, tag: 'NOUN' },
  { token: '.', tagId: 0, tag: '<s>' },
  { token: '</s>', tagId: 0, tag: '<s>' } ]
```

For the above two results, the final full stop `.` is inappropriately determined as `<s>`, which should be `.`.

### Poor
```
$ node lib/cli.js tag 'Time flies like an arrow.'
Probability: 0
[ { token: '<s>', tagId: 0, tag: '<s>' },
  { token: 'Time', tagId: 2, tag: 'NOUN' },
  { token: 'flies', tagId: 2, tag: 'NOUN' },
  { token: 'like', tagId: 5, tag: 'ADP' },
  { token: 'an', tagId: 1, tag: 'DET' },
  { token: 'arrow', tagId: 2, tag: 'NOUN' },
  { token: '.', tagId: 0, tag: '<s>' },
  { token: '</s>', tagId: 0, tag: '<s>' } ]
```

When looking up `flies` in the `model.json`, you can see the probability for NOUN is `0.000029065120402261268`, and VERB is lower than that, `0.00002188782489740082`, which might be the reason why the tagger determins this `flies` as NOUN.
