export enum BeeErrorCode {
  NoAuth = 0,
}

export interface BeeError extends Error {
  __bee: true;

  code: number;
}

export function createBeeError(code: number, message: string): BeeError {
  const error = new Error(message) as BeeError;
  error.code = code;

  error.__bee = true;
  return error;
}

export function isBeeError(error: unknown): error is BeeError {
  return (error as BeeError | undefined)?.__bee === true;
}

export function errorToString(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  const e = error as { message?: string };

  return e?.message ? e.message : `${e}`;
}
