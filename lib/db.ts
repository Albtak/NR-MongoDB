import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env or .env.local");
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/** Same MongoClient connection your API routes should reuse */
export default clientPromise;

/** DB handle from that client (optional name overrides default DB in the URI). */
export async function getDb(name?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(name);
}
