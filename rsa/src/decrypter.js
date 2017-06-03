import BigInt from 'big-integer';
import padStart from 'string.prototype.padstart';

padStart.shim();

/**
 * @param encoded {BigInt}
 * @param encoding {'ascii'|'utf8'}
 */
export function decode({ encoded, encoding }) {
  const bits = encoding === 'utf8' ? 16 : 8;
  const binary = encoded.toString(2);

  return binary
    .padStart(Math.ceil(binary.length / bits) * bits, '0')
    .match(new RegExp(`.{${bits}}`, 'g'))
    .map((bin) => Number.parseInt(bin, 2))
    .map((code) => String.fromCharCode(code))
    .join('');
}

/**
 * @param modulus {BigInt}
 * @param privateExponent {BigInt}
 * @param cipher {String}
 * @param encoding {'ascii'|'utf8'}
 * @return {String}
 */
export default function decrypt({ modulus, privateExponent, cipher, encoding }) {
  const encoded = BigInt(cipher)
    .modPow(privateExponent, modulus);

  return decode({ encoded, encoding });
}
