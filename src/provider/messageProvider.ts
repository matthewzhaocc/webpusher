import crypto from "crypto";

import { hkdf } from "../util/util";
import { ISubscriber } from "../types/subscriber";

class MessageProvider {
  constructor(private subscriber: ISubscriber) {}

  async send(payload: Buffer) {
    // Generate salt
    const salt = crypto.randomBytes(16);

    // Generate local keys
    const curve = crypto.createECDH("prime256v1");
    curve.generateKeys();

    const localPub = curve.getPublicKey();
    const localPriv = curve.getPrivateKey();

    // Generate Shared secret
    const sharedSecret = curve.computeSecret(
      this.subscriber.config.keys.p256dh,
      "base64"
    );

    // PRK
    const authEncBuff = new Buffer("Content-Encoding: auth\0", "utf8");
    const prk = hkdf(
      this.subscriber.config.keys.auth,
      sharedSecret,
      authEncBuff,
      32
    );

    // Context
    const keyLabel = new Buffer("P-256\0", "utf8");

    const subscriberPubKey = new Buffer(
      this.subscriber.config.keys.p256dh,
      "base64"
    );

    const subscriptionPubKeyLength = new Uint8Array(2);
    subscriptionPubKeyLength[0] = 0;
    subscriptionPubKeyLength[1] = subscriberPubKey.length;

    const localPublicKeyLength = new Uint8Array(2);
    subscriptionPubKeyLength[0] = 0;
    subscriptionPubKeyLength[1] = subscriberPubKey.length;

    const contextBuffer = Buffer.concat([
      keyLabel,
      subscriptionPubKeyLength,
      subscriberPubKey,
      localPublicKeyLength,
      localPub,
    ]);

    // Content Encryption Key
    const nonceEncBuffer = new Buffer("Content-Encoding: nonce\0", "utf8");
    const nonceInfo = Buffer.concat([nonceEncBuffer, contextBuffer]);

    const cekEncBuffer = new Buffer("Content-Encoding: aesgcm\0");
    const cekInfo = Buffer.concat([cekEncBuffer, contextBuffer]);

    // The nonce should be 12 bytes long
    const nonce = hkdf(salt, prk, nonceInfo, 12);

    // The CEK should be 16 bytes long
    const contentEncryptionKey = hkdf(salt, prk, cekInfo, 16);

    // Encrypt!!!
    const cipher = crypto.createCipheriv(
      "id-aes128-GCM",
      contentEncryptionKey,
      nonce
    );

    const padding = new Buffer(2);
    // The buffer must be only zeros, except the length
    padding.fill(0);
    padding.writeUInt16BE(0, 0);

    const result = cipher.update(Buffer.concat([padding, payload]));
    cipher.final();

    const encryptedPayload = Buffer.concat([
      result,
      (cipher as any).getAuthTags(),
    ]);
  }
}
