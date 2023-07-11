import {
  AuthorizationMiddlewareOptions,
  createAuthorizationMiddleware,
} from "@/apis/middlewares/authorization";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type HttpClientOptions = AuthorizationMiddlewareOptions;

export type EncooBeeResponseBase = {
  id: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
};
export interface HttpClientMiddleware {
  (
    requestConfig: AxiosRequestConfig,
    next: (requestConfig: AxiosRequestConfig) => Promise<AxiosResponse>
  ): Promise<AxiosResponse>;
}

export const createBaseUrlMiddleware = (options: {
  getBaseUrl: () => string;
}): HttpClientMiddleware => {
  return async (config, next) => {
    if (config.baseURL === undefined) {
      config.baseURL = options.getBaseUrl();
    }
    return next(config);
  };
};

export class HttpClient {
  private readonly _axios: AxiosInstance = axios.create();
  private readonly _middlewares: HttpClientMiddleware[] = [];

  use(middleware: HttpClientMiddleware) {
    this._middlewares.push(middleware);
  }

  request<TResponse>(
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosResponse<TResponse>> {
    return this._getMiddlewareNext(0)(requestConfig) as Promise<
      AxiosResponse<TResponse>
    >;
  }
  private _getMiddlewareNext(index: number) {
    const middleware = this._middlewares[index];
    return (requestConfig: AxiosRequestConfig) =>
      middleware
        ? middleware(requestConfig, this._getMiddlewareNext(index + 1))
        : this._axios.request(requestConfig);
  }
}
export class HttpClientBase extends HttpClient {
  constructor(protected options: HttpClientOptions) {
    super();

    this.use(
      createAuthorizationMiddleware({
        getBaseUrl: options.getBaseUrl,
        getAccessToken: options.getAccessToken,
      })
    );
  }
}
