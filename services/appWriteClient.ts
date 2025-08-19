import { Client, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://syd.cloud.appwrite.io/v1")
  .setProject("6890acce002062099f0a");

export const database = new Databases(client);
export const storage = new Storage(client);
