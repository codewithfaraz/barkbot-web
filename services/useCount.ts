import { database } from "./appWriteClient";
const DATABASE_ID = "6890ae4300264bd6744f";
const COLLECTION_ID = "68a404f2002f2f9d1b25";
export const useCount = () => {
  const addUser = async () => {
    try {
      const userCount = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );

      const usersCount = userCount.documents[0].count;
      const documentId = userCount.documents[0].$id;
      const updatedDocument = await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        documentId,
        {
          count: usersCount + 1,
        }
      );
      console.log(updatedDocument);
    } catch (error) {
      console.log(error);
    }
  };
  return { addUser };
};
