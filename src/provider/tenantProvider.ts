import mongoClient from "../db/connection";
import { v4 as uuidv4 } from "uuid";
import keyStoreProvider from "./keyStoreProvider";

class TenantProvider {
  constructor() {}
  public async create(sub: string): Promise<string> {
    const existing = await this.getByOwner(sub);
    if (existing) {
      return existing.identifier;
    }
    const uniqueId = uuidv4();
    const key = keyStoreProvider.mintKeys();
    await mongoClient.db("webpusher").collection("tenant").insertOne({
      identifier: uniqueId,
      owner: sub,
      privKey: key.privKey,
      pubKey: key.pubKey,
    });

    return uniqueId;
  }

  public async getByOwner(sub: string) {
    const tenant = await mongoClient
      .db("webpusher")
      .collection("tenant")
      .findOne({
        owner: sub,
      });

    return tenant;
  }

  public async getByIdentifier(identifier: string) {
    const tenant = await mongoClient
      .db("webpusher")
      .collection("tenant")
      .findOne({ identifier });
    return tenant;
  }
}

const tenantProvider = new TenantProvider();

export default tenantProvider;
