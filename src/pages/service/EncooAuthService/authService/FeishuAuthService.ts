import { BeeToken } from '@/models/user'
import { onAuthStatusChangeCallback } from '@/pages/service/EncooAuthService'
import { IAuthService } from '@/pages/service/EncooAuthService/authService/IAuthService'
// import Browser from "webextension-polyfill";

export const TOKEN_STORAGE_KEY = '_token'

export class FeishuAuthService implements IAuthService {
  private token: string | undefined = undefined
  constructor(loginCallback: onAuthStatusChangeCallback) {
    try {
      window?.addEventListener('message', (token: BeeToken) => {
        // 登录的没有传递类型
        console.log(11111111111, token)
        const data = token?.data

        if (data) {
          const accessToken = data.access_token
          console.log(2222222222, { data })

          if (accessToken) {
            console.log(333333, accessToken)

            this.token = accessToken
            this.login()

            loginCallback({ token: this.token, type: 'feishu' })
          }
        }
      })
    } catch (error) {
      //
    }
  }

  public async login(): Promise<string> {
    // await Browser.storage.local.set({ [TOKEN_STORAGE_KEY]: this.token });
    console.log(44444, this.token)
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
