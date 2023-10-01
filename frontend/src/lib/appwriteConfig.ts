import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT!);

const databases = new Databases(client);
const collectionId = process.env.APPWRITE_COLLECTION;
const databaseId = process.env.APPWRITE_DATABASE;

export { databases, collectionId, databaseId };
