export function getFunctionBody(func: () => void) {
  const functionCode = func.toString();
  const openBracketIndex = functionCode.indexOf("{");
  const closeBracketIndex = functionCode.lastIndexOf("}");
  const functionBody = functionCode.substring(
    openBracketIndex + 1,
    closeBracketIndex
  );
  return functionBody;
}

export function safeReplaceString(
  str: string,
  valueToReplace: string,
  replacement: string
) {
  const startIndex = str.indexOf(valueToReplace);
  const beginStr = str.slice(0, startIndex);
  const endStr = str.slice(startIndex + valueToReplace.length);
  const result = beginStr + replacement + endStr;
  return result;
}

export function getFrameIdFromCustomId(customId?: string): number {
  if (typeof customId !== "string" || !customId) {
    // represent for the main window
    return 0;
  }
  const isValidCustomId = customId.split("|").length === 3;
  return isValidCustomId ? +customId.split("|")[1] : 0;
}

export function getShortCustomId(customId?: string) {
  if (!customId) {
    return customId;
  }
  let items = customId.split("|");
  const customIdWithIframe = items[items.length - 1];
  items = customIdWithIframe.split("_");
  return items[items.length - 1];
}

export function isBrowserSettingsUrl(url: string) {
  return (
    url.indexOf("chrome://") === 0 ||
    url.indexOf("chrome-extension://") === 0 ||
    url.indexOf("edge://") === 0 ||
    url.indexOf("about:") === 0
  );
}

export function isSameUrl(url1: string, url2: string) {
  const uri1 = new URL(url1);
  const uri2 = new URL(url2);

  return uri1.origin === uri2.origin && uri1.pathname === uri2.pathname;
}

function isFull(pChar: string) {
  if (pChar.charCodeAt(0) > 128) {
    return true;
  } else {
    return false;
  }
}

export function getByteLength(str: string): number {
  let n = 0;
  for (let i = 0; i < str.length; i++) {
    n += str.charCodeAt(i) > 128 ? 2 : 1;
  }

  return n;
}

export function cutByte(str: string, len: number, endStr = "...") {
  // 原字符串长度
  const _strLen = str.length;

  let _cutString;

  let _lenCount = 0;

  let _ret = false;

  if (_strLen <= len / 2) {
    _cutString = str;
    _ret = true;
  }

  if (!_ret) {
    for (let i = 0; i < _strLen; i++) {
      if (isFull(str.charAt(i))) {
        _lenCount += 2;
      } else {
        _lenCount += 1;
      }

      if (_lenCount > len) {
        _cutString = str.substring(0, i);
        _ret = true;
        break;
      } else if (_lenCount === len) {
        _cutString = str.substring(0, i + 1);
        _ret = true;
        break;
      }
    }
  }

  if (!_ret) {
    _cutString = str;
    _ret = true;
  }

  return _cutString + endStr;
}

export function uint8ArrayToString(array: Uint8Array): string {
  let out, i, c;
  let char2, char3;

  out = "";
  const len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }

  return out;
}
