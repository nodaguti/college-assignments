/* eslint-disable no-console */

import minimist from 'minimist';
import fs from 'fs-extra';
import unpack from 'rsa-unpack';
import BigInt from 'big-integer';
import encrypt from './encrypter';
import decrypt from './decrypter';

const parsePem = async (pemPath) => {
  const pemString = await fs.readFile(pemPath, 'utf-8');
  const rsa = unpack(pemString);

  // Convert big integers represented as Buffer into BigInt
  Object.keys(rsa)
    .forEach((key) => {
      if (Buffer.isBuffer(rsa[key])) {
        rsa[key] = BigInt(rsa[key].toString('hex'), 16);
      }
    });

  return rsa;
};

export default parsePem;

const commands = {
  async encrypt({ pem, modulus, publicExponent, text, encoding }) {
    const keys = Object.assign(
      {
        modulus: BigInt(modulus),
        privateExponent: BigInt(publicExponent),
      },
      pem ? await parsePem(pem) : {},
    );
    const cipher = encrypt({ text, encoding, ...keys });

    console.log(cipher);
  },

  async decrypt({ pem, modulus, privateExponent, cipher, encoding }) {
    const keys = Object.assign(
      {
        modulus: BigInt(modulus),
        privateExponent: BigInt(privateExponent),
      },
      pem ? await parsePem(pem) : {},
    );
    const text = decrypt({ cipher, encoding, ...keys });

    console.log(text);
  },
};

const argv = process.argv.slice(2);
const command = argv.shift();
const args = minimist(argv, {
  string: [
    'pem',
    'modulus',
    'publicExponent',
    'privateExponent',
    'text',
    'cipher',
    'encoding',
  ],
  default: {
    encoding: 'ascii',
  },
});

if (typeof commands[command] !== 'function') {
  console.error(`${command} is not available!`);
} else {
  (async () => {
    try {
      await commands[command](args);
    } catch (e) {
      console.error(e);
    }
  })();
}
