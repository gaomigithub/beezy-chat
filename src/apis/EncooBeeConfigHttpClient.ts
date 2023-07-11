import { HttpConfig } from '@/models/httpConfig'
import axios from 'axios'
// import Browser from "webextension-polyfill";

const HTTPConfigStorageKey = 'bee-httpConfig'

const cacheTime = 5 * 60 * 1000

interface HTTPConfigCache {
  config: HttpConfig
  modifyTime: number
}

export class EncooBeeConfigHttpClient {
  public async getEndpoint() {
    // switch (process.env.NODE_ENV) {
    //   case 'development' || 'test':
    //     return 'https://beezy-chat.bottime.com'
    //     // return 'https://chat.beezy.cool' // 调试
    //   case 'production':
    //     return globalThis.window?.location.origin
    // }
    return 'https://chat.beezy.cool' // 调试
  }

  // const items = await Browser.storage.local.get(HTTPConfigStorageKey);
  public async getConfig(): Promise<HttpConfig> {
    const items = await globalThis.window?.localStorage.getItem(
      HTTPConfigStorageKey
    )

    const cache = items
      ? JSON.parse(items)
      : (undefined as HTTPConfigCache | undefined)

    if (
      cache &&
      cache.config.endpoints &&
      Date.now() - cache.modifyTime <= cacheTime
    ) {
      await globalThis.window?.localStorage.setItem(
        HTTPConfigStorageKey,
        JSON.stringify({
          config: cache.config,
          modifyTime: Date.now(),
        })
      )

      return cache.config
    }

    const host = await this.getEndpoint()

    const response =
      process.env.NODE_ENV !== 'production'
        ? await axios.get(`${host}/config.json`)
        : await axios.get(`/config.json`)

    await globalThis.window?.localStorage.setItem(
      HTTPConfigStorageKey,
      JSON.stringify({
        config: response.data,
        modifyTime: Date.now(),
      })
    )

    return response.data
  }
}
