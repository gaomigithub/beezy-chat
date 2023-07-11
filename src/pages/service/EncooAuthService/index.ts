import { FireBaseAuthService } from '@/pages/service/EncooAuthService/authService/FireBaseAuthService'
import { IAuthService } from '@/pages/service/EncooAuthService/authService/IAuthService'
import { WechatAuthService } from '@/pages/service/EncooAuthService/authService/WechatAuthService'
import { WebExtensionEvent } from '@/utils/event'
// import Browser from "webextension-polyfill";

export const LOGIN_TYPE_STORAGE_KEY = '_loginType'
export type LoginType = 'google' | 'wechat' | 'feishu'

export interface AuthInfo {
  token: string
  type: LoginType
}

export type onAuthStatusChangeCallback = (
  info?: AuthInfo
) => Promise<void> | void

export class EncooAuthService {
  authServices: Map<LoginType, IAuthService>
  public onAuthStatusChange: WebExtensionEvent<onAuthStatusChangeCallback>

  constructor() {
    this.onAuthStatusChange = new WebExtensionEvent()

    const loginCallback = (info?: AuthInfo) => {
      this.setLoginType(info?.type)
      this.fireAuthStatusChangeEvent(info)
    }
    this.authServices = new Map()
    this.authServices.set('google', new FireBaseAuthService())
    this.authServices.set('wechat', new WechatAuthService(loginCallback))
  }

  private fireAuthStatusChangeEvent(info?: AuthInfo) {
    this.onAuthStatusChange.listeners.forEach((callback) => callback(info))
  }

  private async getLoginType(): Promise<LoginType | undefined> {
    // const loginType = (await Browser.storage.local.get(LOGIN_TYPE_STORAGE_KEY))[
    //   LOGIN_TYPE_STORAGE_KEY
    // ];

    const _loginType = await globalThis.window?.localStorage.getItem(
      LOGIN_TYPE_STORAGE_KEY
    )
    const loginType = _loginType ? (_loginType as LoginType) : undefined

    return loginType
  }

  private async setLoginType(type: LoginType | undefined) {
    if (type) {
      //   await Browser.storage.local.set({ [LOGIN_TYPE_STORAGE_KEY]: type });
      await globalThis.window?.localStorage.setItem(
        LOGIN_TYPE_STORAGE_KEY,
        type
      )
    } else {
      //   await Browser.storage.local.remove(LOGIN_TYPE_STORAGE_KEY);
      await globalThis.window?.localStorage.removeItem(LOGIN_TYPE_STORAGE_KEY)
    }
  }

  public async login(type: LoginType): Promise<AuthInfo | undefined> {
    if (type === 'wechat') {
      // "wechat" 是被动收消息 这里不支持主动登录
      return
    }

    const token = await this.authServices.get(type)?.login()
    await this.setLoginType(type)
    if (token) {
      this.fireAuthStatusChangeEvent({ token, type })
      return { token, type }
    }
  }

  public async getToken(): Promise<AuthInfo | undefined> {
    const loginType = await this.getLoginType()

    if (!loginType) {
      return
    }

    const token = await this.authServices.get(loginType)?.getToken()

    if (!token) {
      return
    }

    return {
      token,
      type: loginType,
    }
  }

  public async logout() {
    const loginType = await this.getLoginType()
    if (loginType) {
      await this.authServices.get(loginType)?.logout()
      await this.setLoginType(undefined)

      this.fireAuthStatusChangeEvent(undefined)
    }
  }
}

export const encooAuthService = new EncooAuthService()
