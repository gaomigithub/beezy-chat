export function safeIncrementWithWrapAround(value: number) {
  if (value >= Number.MAX_SAFE_INTEGER) {
    value = 0;
  }
  return value + 1;
}
