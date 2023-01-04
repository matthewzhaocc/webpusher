import { v4 as uuidv4 } from "uuid";
import client from "../db/connection";

class SubscriberProvider {
  async subscribe(identifier: string, subscribeBody: any) {
    const subscriberId = uuidv4();
    await client.db("webpusher").collection("subscribers").insertOne({
      owner: identifier,
      subscriberId,
      config: subscribeBody,
    });

    return subscriberId;
  }

  async listSubscribers() {
    const cursor = client.db("webpusher").collection("subscribers").find();

    const subscribers = cursor.toArray();
    await cursor.close();
    return subscribers;
  }

  async listSubscriberByIdentifier(identifier: string) {
    const cursor = client.db("webpusher").collection("subscribers").find();

    const subscribers = await cursor.filter({ owner: identifier }).toArray();
    cursor.close();

    return subscribers;
  }
}

const subscriberProvider = new SubscriberProvider();

export default subscriberProvider;
