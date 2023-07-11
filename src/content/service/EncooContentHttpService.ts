import { EncooBeeChatStreamClient } from '@/apis/EncooBeeChatStreamClient'
import { EncooBeeConfigHttpClient } from '@/apis/EncooBeeConfigHttpClient'
import { HttpAccessToken } from '@/apis/middlewares/authorization'
import { HttpClientOptions } from '@/apis/shared'
import { encooAuthService } from '@/pages/service/EncooAuthService'
// import Browser from "webextension-polyfill";

async function getAccessToken(): Promise<HttpAccessToken | null> {
  const token = await encooAuthService.getToken()

  return {
    token: token?.token ?? '',
    nation: token?.type === 'google' ? 'International' : 'China',
  }
}

export class EncooContentHttpService {
  private static _config: EncooBeeConfigHttpClient
  private static get config() {
    if (this._config) {
      return this._config
    }
    this._config = new EncooBeeConfigHttpClient()
    return this._config
  }

  private static chartOptions: HttpClientOptions = {
    getBaseUrl: async () => {
      const config = await this.config.getConfig()
      // todo 国外没上，暂时都用一个
      return {
        China: config.endpoints.api,
        International: config.endpoints.api,
      }
    },
    getAccessToken,
  }

  private static _chatApi: EncooBeeChatStreamClient
  public static get chatApi() {
    if (this._chatApi) {
      return this._chatApi
    }

    this._chatApi = new EncooBeeChatStreamClient(this.chartOptions)
    return this._chatApi
  }
}
