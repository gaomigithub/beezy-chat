export function filterNonNullish<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((e) => e != null) as T[];
}

export function getItem<T>(arr: T[], index: number): T | undefined {
  return index < arr.length ? arr[index] : undefined;
}

export function last<T>(arr: T[]): T | undefined {
  return getItem(arr, arr.length - 1);
}

export function chained(actions: ((...args: any[]) => any)[]) {
  return function (input: any) {
    return actions.reduce(function (input, action) {
      return action(input);
    }, input);
  };
}
