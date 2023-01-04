import crypto from "crypto";

function hkdf(
  salt: string | Buffer,
  ikm: Buffer,
  info: Buffer,
  length: number
) {
  const keyHmac = crypto.createHmac("sha256", salt);
  keyHmac.update(ikm);
  const key = keyHmac.digest();

  const infoHmac = crypto.createHmac("sha256", key);
  infoHmac.update(info);

  const ONE_BUFFER = new Buffer(1).fill(1);
  infoHmac.update(ONE_BUFFER);

  return infoHmac.digest().subarray(0, length);
}

export { hkdf };
