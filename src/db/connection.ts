import { MongoClient } from "mongodb";

let client: MongoClient = new MongoClient(process.env.MONGO_URI as string);

(async () => {
  client = await client.connect();
  console.log("Mongo Client connected successfully");
})();

export default client;
