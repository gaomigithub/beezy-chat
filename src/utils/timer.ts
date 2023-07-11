export async function wait(time: number) {
  return new Promise<void>((resolve, reject) => {
    if (time <= 0) {
      resolve();
    }

    setTimeout(() => {
      resolve();
    }, time);
  });
}
