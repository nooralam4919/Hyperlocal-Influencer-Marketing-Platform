import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

class AuthService {
  client = new Client();
  Account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteID);

    this.Account = new Account(this.client);
  }

  // CREATE ACCOUNT
  async createAccount({
    name,
    email,
    password,
    role,
  }) {
    try {
      const userAccount = await this.Account.create(
          ID.unique(),
          email,
          password,
          name
        );

      if (userAccount) {
        // LOGIN AFTER SIGNUP
        await this.login({ email, password });

        // SAVE ROLE
        await this.Account.updatePrefs({
          role: role,
        });

        return userAccount;
      }
    } catch (err) {
      throw err;
    }
  }

  // LOGIN
  async login({ email, password }) {
    try {
      return await this.Account.createEmailPasswordSession(
        email,
        password
      );
    } catch (err) {
      throw err;
    }
  }

  // GET CURRENT USER
  async getCurrentUser() {
    try {
      return await this.Account.get();
    } catch (err) {
      return null;
    }
  }

  // LOGOUT
  async logOut() {
    try {
      await this.Account.deleteSession("current");
    } catch (err) {
      console.log(err);
    }
  }
}

const authService = new AuthService();

export default authService;