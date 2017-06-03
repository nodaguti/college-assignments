import assert from 'assert';
import path from 'path';
import BigInt from 'big-integer';
import parsePem from '../src/cli';
import encrypt, { encode } from '../src/encrypter';
import decrypt, { decode } from '../src/decrypter';

const ascii = {
  text: 'cat',
  encoded: '6513012',
  encrypted: '26032679829159854672825522386178309364452478313446869173149399986284690920241',
};

const utf8 = {
  text: '朝焼け',
  encoded: '113376151482449',
  encrypted: '69185568354934566596456090813474818662381731164687428469498354651856353945321',
};

const long = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  encoded: '1386241180838314256659693112250408734752565034088645260391708544569909568611813839056726771729657189818671155552974062186085113120623257194862817696832534931949065014352940927481660351079956608322683756760143196853781476872706452311653152410798650494399065597581283874622327736801041854442796585949669674727937708792363327011377342512358593458647104986923575501547940669477933715270778669296565371924655172374939432984722741653935403178016587051311802477485686675564782150923359909029607834087673227566504724560508073610577516333085147951787877434917617942116525382906854814387419019888175598496583928843368880608007245518855839046539840333122424922462774925259601745059888594912430810758349833589466572535813820862743304142891867000512387792734573384648361131605592256587343727083720653230520214155350322270999987237105499533137871130650361076253843434719882706513856703458704881886237631844760986171537627602766049227441317812132703222576266599446908407619141874259861428911375067045863738207606801210976154990126901820042654261983958294648208288482547119828505202093358',
};

let pem;

before(async () => {
  pem = await parsePem(path.join(__dirname, 'private-key.pem'));
});

describe('encrypter.js', () => {
  describe('encode()', () => {
    it('should encode a ascii string', () => {
      const encoded = encode({ text: ascii.text });

      assert(BigInt.isInstance(encoded) === true);
      assert(encoded.toString() === ascii.encoded);
    });

    it('should encode a utf-8 string', () => {
      const encoded = encode({ text: utf8.text, encoding: 'utf8' });

      assert(BigInt.isInstance(encoded) === true);
      assert(encoded.toString() === utf8.encoded);
    });

    it('should encode a long string', () => {
      const encoded = encode({ text: long.text });

      assert(BigInt.isInstance(encoded) === true);
      assert(encoded.toString() === long.encoded);
    });
  });

  describe('encrypt()', () => {
    it('should encrypt a ascii string', () => {
      const encrypted = encrypt({
        modulus: pem.modulus,
        publicExponent: pem.publicExponent,
        text: ascii.text,
      });

      assert(typeof encrypted === 'string');
      assert(encrypted === ascii.encrypted);
    });

    it('should encrypt a utf-8 string', () => {
      const encrypted = encrypt({
        modulus: pem.modulus,
        publicExponent: pem.publicExponent,
        text: utf8.text,
        encoding: 'utf8',
      });

      assert(typeof encrypted === 'string');
      assert(encrypted === utf8.encrypted);
    });

    it('should throw an error if an input is too long', () => {
      let err;
      let ret;

      try {
        ret = encrypt({
          modulus: pem.modulus,
          publicExponent: pem.publicExponent,
          text: long.text,
        });
      } catch (ex) {
        err = ex;
      } finally {
        assert(err !== undefined);
        assert(err.message === 'The input text was too long; The message to be encrypted should be shorter than 256 bits. (was 3559 bits)');
        assert(ret === undefined);
      }
    });
  });
});

describe('decrypter.js', () => {
  describe('decode()', () => {
    it('should decode an encoded ascii string', () => {
      const decoded = decode({ encoded: BigInt(ascii.encoded) });

      assert(typeof decoded === 'string');
      assert(decoded === ascii.text);

      const encoded = encode({ text: ascii.text });
      const decoded2 = decode({ encoded });

      assert(decoded2 === ascii.text);
    });

    it('should decode an encoded utf-8 string', () => {
      const decoded = decode({ encoded: BigInt(utf8.encoded), encoding: 'utf8' });

      assert(typeof decoded === 'string');
      assert(decoded === utf8.text);

      const encoded = encode({ text: utf8.text, encoding: 'utf8' });
      const decoded2 = decode({ encoded, encoding: 'utf8' });

      assert(decoded2 === utf8.text);
    });

    it('should decode a long encoded string', () => {
      const decoded = decode({ encoded: BigInt(long.encoded) });

      assert(typeof decoded === 'string');
      assert(decoded === long.text);

      const encoded = encode({ text: long.text });
      const decoded2 = decode({ encoded });

      assert(decoded2 === long.text);
    });
  });

  describe('decrypt()', () => {
    it('should decrypt an encrypted ascii string', () => {
      const decrypted = decrypt({
        modulus: pem.modulus,
        privateExponent: pem.privateExponent,
        cipher: ascii.encrypted,
      });

      assert(typeof decrypted === 'string');
      assert(decrypted === ascii.text);

      const encrypted = encrypt({
        modulus: pem.modulus,
        publicExponent: pem.publicExponent,
        text: ascii.text,
      });
      const decrypted2 = decrypt({
        modulus: pem.modulus,
        privateExponent: pem.privateExponent,
        cipher: encrypted,
      });

      assert(decrypted2 === ascii.text);
    });

    it('should decrypt an encrypted utf-8 string', () => {
      const decrypted = decrypt({
        modulus: pem.modulus,
        privateExponent: pem.privateExponent,
        cipher: utf8.encrypted,
        encoding: 'utf8',
      });

      assert(typeof decrypted === 'string');
      assert(decrypted === utf8.text);

      const encrypted = encrypt({
        modulus: pem.modulus,
        publicExponent: pem.publicExponent,
        text: utf8.text,
        encoding: 'utf8',
      });
      const decrypted2 = decrypt({
        modulus: pem.modulus,
        privateExponent: pem.privateExponent,
        cipher: encrypted,
        encoding: 'utf8',
      });

      assert(decrypted2 === utf8.text);
    });
  });
});
