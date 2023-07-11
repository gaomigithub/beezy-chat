export function getMainUrl(url: string) {
  const uri = new URL(url);
  return `${uri.origin}/${uri.pathname}`;
}

export function isWebUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
