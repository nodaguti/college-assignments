# RSA

> Simple RSA encrypter/decrypter implemented in JavaScript

You have to install the latest Node.js (7.x) to run this program.

**Note: You shouldn't use this program in practical/critical situation because it doesn't pad the input and thus the output is vulnerable to known attacks.**

## How to build

```console
$ yarn install
$ yarn run build
```

## Usages

```console
$ node lib/cli.js [command] [--pem path] [--modulus num] [--publicExponent num] [--privateExponent num] [--text str] [--cipher str] [--encoding encoding]
```

### encrypt

```console
$ node lib/cli.js encrypt --pem path/to/public-key.pem --text 'This is a pen.'
75985344775793295738344403827427160215292114581748213995902356563719034311839
```

```console
$ node lib/cli.js encrypt --pem path/to/public-key.pem --text '朝焼け' --encoding utf8
69185568354934566596456090813474818662381731164687428469498354651856353945321
```

#### Arguments

|Name|Desc.|
|:--|:--|
|pem|A path to a pem file containing a public key. This overrides the following two options (`modulus` and `publicExponent`).|
|modulus|A number called *modulus* in an output of `openssl rsa` with `-text` option.|
|publicExponent|A number called *publicExponent* in an output of `openssl rsa` with `-text` option.|
|text|A string to be encrypted.|
|encoding|`'ascii' or 'utf8'` Specify `utf8` if your input contains any non-ascii characters.|

### decrypt

```console
$ node lib/cli.js decrypt --pem path/to/private-key.pem --cipher '75985344775793295738344403827427160215292114581748213995902356563719034311839'
This is a pen.
```

```console
$ node lib/cli.js decrypt --pem path/to/private-key.pem --cipher '69185568354934566596456090813474818662381731164687428469498354651856353945321' --encoding utf8
朝焼け
```

#### Arguments

|Name|Desc.|
|:--|:--|
|pem|A path to a pem file containing a private key. This overrides the following two options (`modulus` and `privateExponent`).|
|modulus|A number called *modulus* in an output of `openssl rsa` with `-text` option.|
|privateExponent|A number called *privateExponent* in an output of `openssl rsa` with `-text` option.|
|cipher|A string to be decrypted.|
|encoding|`'ascii' or 'utf8'` Specify `utf8` if your input contains any non-ascii characters.|

## Tests

```console
$ yarn test
```

## License

MIT License
