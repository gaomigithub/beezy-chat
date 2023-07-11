export function getAllElesByTag(
  ele: Document | Element,
  tag: string
): HTMLCollection {
  return ele.getElementsByTagName(tag);
}

export function getSessionAttributeName(
  sessionId: string,
  attr: string
): string {
  return `data-scrape-session-${attr}-${sessionId}`;
}

export function hasSessionAttribute(
  ele: Element,
  sessionId: string,
  attr: string
): boolean {
  if (ele.nodeType !== 1) {
    return false;
  }
  return !!ele.getAttribute(getSessionAttributeName(sessionId, attr));
}

export function setSessionAttribute(
  element: Element,
  sessionId: string,
  attr: string
): void {
  element.setAttribute(getSessionAttributeName(sessionId, attr), "true");
}

export function removeSessionAttribute(
  element: Element,
  sessionId: string,
  attr: string
) {
  element.removeAttribute(getSessionAttributeName(sessionId, attr));
}
