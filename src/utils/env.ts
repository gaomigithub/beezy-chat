export type nodeEnv = "production" | "development" | undefined;

export function getEnv(): nodeEnv {
  return process.env.NODE_ENV as nodeEnv;
}
