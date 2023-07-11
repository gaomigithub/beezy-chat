import { v4 } from "uuid";

export function newGuid(): string {
  return v4();
}
