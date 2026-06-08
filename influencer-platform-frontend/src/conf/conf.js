/*
 * CHANGES & REASONS:
 *
 * 1. Added `creatorCollectionId`, `ownerCollectionId`, `collabCollectionId`
 *    REASON: Config.js uses all three collection IDs (createCreator, createOwner,
 *            collabRequest) but they were missing from conf.js → would return
 *            `undefined` at runtime causing Appwrite database calls to fail.
 *
 * 2. Add the corresponding env vars to your .env file:
 *    VITE_APPWRITE_CREATOR_COLLECTION_ID="your_id"
 *    VITE_APPWRITE_OWNER_COLLECTION_ID="your_id"
 *    VITE_APPWRITE_COLLAB_COLLECTION_ID="your_id"
 */

const conf = {
    appWriteUrl:          String(import.meta.env.VITE_APPWRITE_APPWRITE_URL),
    appWriteID:           String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabaseId:   String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteBucket:       String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    // FIX 1: Added missing collection IDs used in Config.js
    creatorCollectionId:  String(import.meta.env.VITE_APPWRITE_CREATOR_COLLECTION_ID),
    ownerCollectionId:    String(import.meta.env.VITE_APPWRITE_OWNER_COLLECTION_ID),
    collabCollectionId:   String(import.meta.env.VITE_APPWRITE_COLLAB_COLLECTION_ID),
}

export default conf;
