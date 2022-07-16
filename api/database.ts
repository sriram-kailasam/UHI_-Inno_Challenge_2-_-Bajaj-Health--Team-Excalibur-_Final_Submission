import { MongoClient } from 'mongodb'
import { dbUrl } from './configuration';

let dbClient: MongoClient;

export async function getDbClient() {

  if (dbClient) return dbClient;

  dbClient = new MongoClient(dbUrl!);
  await dbClient.connect()

  console.log("Mongodb connected")

  return dbClient;
}