import BigInt from 'big-integer';
import padStart from 'string.prototype.padstart';

padStart.shim();

/**
 * @param text {String}
 * @param encoding {'ascii'|'utf8'}
 * @return {BigInt}
 */
export function encode({ text, encoding }) {
  const bits = encoding === 'utf8' ? 16 : 8;

  const binary = text
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(bits, '0'))
    .join('');

  return BigInt(binary, 2);
}

/**
 * @param modulus {BigInt}
 * @param publicExponent {BigInt}
 * @param text {String}
 * @param encoding {'ascii'|'utf8'}
 * @return {String}
 */
export default function encrypt({ modulus, publicExponent, text, encoding }) {
  const encoded = encode({ text, encoding });

  if (encoded.gt(modulus)) {
    const limit = modulus.toString(2).length;
    const bits = encoded.toString(2).length;

    throw new Error(`The input text was too long; The message to be encrypted should be shorter than ${limit} bits. (was ${bits} bits)`);
  }

  return encoded
    .modPow(publicExponent, modulus)
    .toString();
}
