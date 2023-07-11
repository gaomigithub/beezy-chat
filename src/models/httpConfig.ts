export interface HttpConfig {
  endpoints: {
    sso: string;
    api: string;
  };
  env: "dev" | "pro";
}
