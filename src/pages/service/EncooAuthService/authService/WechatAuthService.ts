import { BeeToken } from '@/models/user'
import { onAuthStatusChangeCallback } from '@/pages/service/EncooAuthService'
import { IAuthService } from '@/pages/service/EncooAuthService/authService/IAuthService'
// import Browser from "webextension-polyfill";

export const TOKEN_STORAGE_KEY = '_token'

export class WechatAuthService implements IAuthService {
  private token: string | undefined = undefined
  constructor(loginCallback: onAuthStatusChangeCallback) {
    try {
      window?.addEventListener('message', (token: BeeToken) => {
        // 登录的没有传递类型
        if (token?.data?.access_token) {
          this.token = token?.data?.access_token
          this.login()

          loginCallback({ token: this.token, type: 'wechat' })
        }
      })
    } catch (error) {
      //
    }
  }

  public async login(): Promise<string> {
    // await Browser.storage.local.set({ [TOKEN_STORAGE_KEY]: this.token });
    await globalThis.window?.localStorage.setItem(
      TOKEN_STORAGE_KEY,
      this.token ?? ''
    )
    return this.token ?? ''
  }

  public async getToken(): Promise<string | undefined> {
    // const token = (await Browser.storage.local.get(TOKEN_STORAGE_KEY))[
    //   TOKEN_STORAGE_KEY
    // ];
    const token = await globalThis.window?.localStorage.getItem(
      TOKEN_STORAGE_KEY
    )

    return token ?? ''
  }

  public async logout() {
    // await Browser.storage.local.remove(TOKEN_STORAGE_KEY);
    await globalThis.window?.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}
