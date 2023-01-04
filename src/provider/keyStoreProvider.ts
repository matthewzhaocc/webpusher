import crypto from "crypto";
import b64url from "base64url";

class KeyStoreProvider {
  mintKeys() {
    const curve = crypto.createECDH("prime256v1");
    curve.generateKeys();
    let pubKey = curve.getPublicKey();
    let privKey = curve.getPrivateKey();

    if (privKey.length < 32) {
      const padding = Buffer.alloc(32 - privKey.length);
      padding.fill(0);
      privKey = Buffer.concat([padding, privKey]);
    }

    if (pubKey.length < 65) {
      const padding = Buffer.alloc(65 - pubKey.length);
      padding.fill(0);
      pubKey = Buffer.concat([padding, pubKey]);
    }

    return {
      pubKey: b64url(pubKey),
      privKey: b64url(privKey),
    };
  }
}

const keyStoreProvider = new KeyStoreProvider();

export default keyStoreProvider;
