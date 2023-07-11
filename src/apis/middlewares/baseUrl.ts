import { HttpClientMiddleware } from "@/apis/shared";

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
