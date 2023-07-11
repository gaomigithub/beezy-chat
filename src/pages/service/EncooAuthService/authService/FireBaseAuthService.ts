import { IAuthService } from "@/pages/service/EncooAuthService/authService/IAuthService";
import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

export class FireBaseAuthService implements IAuthService {
  private auth: Auth;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyC9PNjRARKVCqgIEbtRTWoUYu6Oqk_iX80",
      authDomain: "beezy-d7f49.firebaseapp.com",
      projectId: "beezy-d7f49",
      storageBucket: "beezy-d7f49.appspot.com",
      messagingSenderId: "415429498675",
      appId: "1:415429498675:web:de3cfde61d407a79d91046",
      measurementId: "G-BWVELQLDEL",
    };
    const app = initializeApp(firebaseConfig);

    this.auth = getAuth(app);
  }

  private async getAuthToken(interactive: boolean) {
    return new Promise<string>((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError || !token) {
          reject(
            `SSO ended with an error: ${JSON.stringify(
              chrome.runtime.lastError
            )}`
          );
          return;
        }
        const credential = GoogleAuthProvider.credential(null, token);

        signInWithCredential(this.auth, credential)
          .then((userCredential) => {
            const user = this.auth.currentUser;
            if (!user) {
              reject("SSO ended with an error.");
              return;
            }
            user
              .getIdToken()
              .then((t) => resolve(t))
              .catch((e) => reject(e));
          })
          .catch((error: unknown) => {
            reject(error);
          });
      });
    });
  }

  public async login() {
    return await this.getAuthToken(true);
  }

  public async getToken(): Promise<string | undefined> {
    const token = await this.auth.currentUser?.getIdToken();
    if (token) {
      return token;
    }

    try {
      return await this.getAuthToken(false);
    } catch (error) {
      return undefined;
    }
  }

  public async logout() {
    await this.auth.signOut();
  }
}
