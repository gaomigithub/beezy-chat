import { EncooBeeChatHttpClient } from "@/apis/EncooBeeChatHttpClient";
import { EncooBeeChatStreamClient } from "@/apis/EncooBeeChatStreamClient";
import { EncooBeeConfigHttpClient } from "@/apis/EncooBeeConfigHttpClient";
import { EncooBeeFileHttpClient } from "@/apis/EncooBeeFileHttpClient";
import { EncooBeePdfHttpClient } from "@/apis/EncooBeePdfHttpClient";
import { EncooProfileHttpClient } from "@/apis/EncooProfileHttpClient";
import { HttpAccessToken } from "@/apis/middlewares/authorization";
import { HttpClientOptions } from "@/apis/shared";
import { encooAuthService } from "@/pages/service/EncooAuthService";

async function getAccessToken(): Promise<HttpAccessToken | null> {
  const token = await encooAuthService.getToken();

  return {
    token: token?.token ?? "",
    nation: token?.type === "google" ? "International" : "China",
  };
}

export class EncooHttpService {
  private static _config: EncooBeeConfigHttpClient;
  public static get config() {
    if (this._config) {
      return this._config;
    }
    this._config = new EncooBeeConfigHttpClient();
    return this._config;
  }

  private static chatOptions: HttpClientOptions = {
    getBaseUrl: async () => {
      const config = await this.config.getConfig();
      // todo 国外没上，暂时都用一个
      return {
        China: config.endpoints.api,
        International: config.endpoints.api,
      };
    },
    getAccessToken,
  };

  private static authOptions: HttpClientOptions = {
    getBaseUrl: async () => {
      const config = await this.config.getConfig();
      // todo 国外没上，暂时都用一个
      return {
        China: config.endpoints.sso,
        International: config.endpoints.sso,
      };
    },
    getAccessToken,
  };

  private static _chatApi: EncooBeeChatStreamClient;
  public static get chatApi() {
    if (this._chatApi) {
      return this._chatApi;
    }

    this._chatApi = new EncooBeeChatStreamClient(this.chatOptions);
    return this._chatApi;
  }

  private static _chatQuota: EncooBeeChatHttpClient;

  public static get chatQuota() {
    if (this._chatQuota) {
      return this._chatQuota;
    }

    this._chatQuota = new EncooBeeChatHttpClient(this.chatOptions);
    return this._chatQuota;
  }

  private static _file: EncooBeeFileHttpClient;
  public static get file() {
    if (this._file) {
      return this._file;
    }

    this._file = new EncooBeeFileHttpClient(this.chatOptions);
    return this._file;
  }

  private static _pdf: EncooBeePdfHttpClient;
  public static get pdf() {
    if (this._pdf) {
      return this._pdf;
    }

    this._pdf = new EncooBeePdfHttpClient(this.chatOptions);
    return this._pdf;
  }

  private static _profile: EncooProfileHttpClient;
  public static get profile() {
    if (this._profile) {
      return this._profile;
    }

    this._profile = new EncooProfileHttpClient(this.authOptions);
    return this._profile;
  }
}
