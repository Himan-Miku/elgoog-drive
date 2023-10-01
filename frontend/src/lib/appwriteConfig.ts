import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6516cefac5f24e866af2");

const databases = new Databases(client);
const collectionId = "6519651a1c1aeec7a854";
const databaseId = "651964d905efd4e67224";

export { databases, collectionId, databaseId };
