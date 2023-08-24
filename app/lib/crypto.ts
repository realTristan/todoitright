/**
 * SHA256 Encryption
 */
export async function sha256(text: string) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Base64 Encoding
 */
export function base64encode(text: string) {
  const buff: number[] = [];
  for (let i = 0; i < text.length; i++) {
    buff.push(text.charCodeAt(i));
  }

  return btoa(String.fromCharCode.apply(null, buff));
}

/**
 * Base64 Decoding
 */
export function base64decode(text: string) {
  const buff = atob(text);
  const arr = [];
  for (let i = 0; i < buff.length; i++) {
    arr.push(buff.charCodeAt(i));
  }

  return String.fromCharCode.apply(null, arr);
}
