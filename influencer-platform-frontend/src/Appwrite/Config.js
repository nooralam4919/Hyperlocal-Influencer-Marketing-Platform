import conf from "../conf/conf";
import { Client, Account, Databases, ID, Storage, Query } from "appwrite";

class Service {
  client = new Client();
  account;
  database;
  storage;

  constructor() {
    this.client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteID);

    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // =========================
  // CREATOR SECTION
  // =========================

  async createCreator({
    name,
    niche,
    followers,
    city,
    engagement,
    instagram,
    youtube,
    role,
  }) {
    try {
      return await this.database.createDocument(
        conf.appWriteDatabaseId,
        conf.creatorCollectionId,
        ID.unique(),
        {
          name,
          niche,
          followers,
          city,
          engagement,
          instagram,
          youtube,
          role,
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getCreators() {
    try {
      return await this.database.listDocuments(
        conf.appWriteDatabaseId,
        conf.creatorCollectionId,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getCreator(id) {
    try {
      return await this.database.getDocument(
        conf.appWriteDatabaseId,
        conf.creatorCollectionId,
        id,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getCreatorsByCity(city) {
    try {
      return await this.database.listDocuments(
        conf.appWriteDatabaseId,
        conf.creatorCollectionId,
        [Query.equal("city", city)],
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getCreatorsByNiche(niche) {
    try {
      return await this.database.listDocuments(
        conf.appWriteDatabaseId,
        conf.creatorCollectionId,
        [Query.equal("niche", niche)],
      );
    } catch (err) {
      console.log(err);
    }
  }

  // =========================
  // OWNER SECTION
  // =========================

  async createOwner({ companyName, brandType, website, city, budget, role }) {
    try {
      return await this.database.createDocument(
        conf.appWriteDatabaseId,
        conf.ownerCollectionId,
        ID.unique(),
        {
          companyName,
          brandType,
          website,
          city,
          budget,
          role,
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getOwners() {
    try {
      return await this.database.listDocuments(
        conf.appWriteDatabaseId,
        conf.ownerCollectionId,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getOwner(id) {
    try {
      return await this.database.getDocument(
        conf.appWriteDatabaseId,
        conf.ownerCollectionId,
        id,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getOwnersByCity(city) {
    try {
      return await this.database.listDocuments(
        conf.appWriteDatabaseId,
        conf.ownerCollectionId,
        [Query.equal("city", city)],
      );
    } catch (err) {
      console.log(err);
    }
  }

  // =========================
  // STORAGE SECTION
  // =========================

  async uploadProfileImage(file) {
    try {
      return await this.storage.createFile(
        conf.appWriteBucket,
        ID.unique(),
        file,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProfile(fileId) {
    try {
      return await this.storage.deleteFile(conf.appWriteBucket, fileId);
    } catch (err) {
      console.log(err);
    }
  }

  getFilePreview(fileId) {
    return this.storage.getFilePreview(conf.appWriteBucket, fileId);
  }

  // =========================
  // COLLAB REQUEST SECTION
  // =========================

  async collabRequest(data) {
    try {
      return await this.database.createDocument(
        conf.appWriteDatabaseId,
        conf.collabCollectionId,
        ID.unique(),
        data,
      );
    } catch (err) {
      console.log(err);
    }
  }
}

const service = new Service();

export default service;
