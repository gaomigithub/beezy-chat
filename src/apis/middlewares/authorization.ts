import { HttpClientMiddleware } from "@/apis/shared";

const authorizationHeaderName = "authorization";

export type ServerNationType = "International" | "China";
export interface HttpAccessToken {
  nation: ServerNationType;
  token: string;
}

export interface AuthorizationMiddlewareOptions {
  getBaseUrl: () => Promise<Record<ServerNationType, string>>;
  getAccessToken: () => Promise<HttpAccessToken | null>;
}

export const createAuthorizationMiddleware = (
  options: AuthorizationMiddlewareOptions
): HttpClientMiddleware => {
  return async (config, next) => {
    if (!config.headers) {
      config.headers = {};
    }
    const token = await options.getAccessToken();
    if (config.headers[authorizationHeaderName] === undefined) {
      if (token) {
        config.headers[authorizationHeaderName] = "Bearer " + token.token;
      }
    }

    if (token && config.baseURL === undefined) {
      config.baseURL = (await options.getBaseUrl())[token?.nation];
    }

    return next(config);
  };
};
