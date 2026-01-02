import { postMemberPublicKey } from "../services/keyApi";

/**
 * ArrayBuffer를 Base64 문자열로 변환합니다.
 * @param buffer ArrayBuffer
 * @returns Base64 인코딩 문자열
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Base64 문자열을 ArrayBuffer로 변환합니다.
 * @param base64 Base64 인코딩 문자열
 * @returns ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * 고정된 32바이트 키 (예시)
 * AES‑256을 위해 32바이트(256비트) 키가 필요합니다.
 */
const FIXED_SYMMETRIC_KEY_BYTES = new Uint8Array([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32,
]);

/**
 * 고정된 AES‑GCM 대칭키(CryptoKey)를 반환합니다.
 * @returns {Promise<CryptoKey>} 고정된 AES‑GCM 대칭키
 */
export async function getFixedSymmetricKey(): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "raw",
    FIXED_SYMMETRIC_KEY_BYTES.buffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * 주어진 수신자의 RSA-OAEP 공개키로 고정된 AES‑GCM 대칭키를 암호화합니다.
 *
 * @param publicKey - 수신자의 RSA-OAEP 공개키 (CryptoKey)
 * @returns 암호화된 고정 대칭키 (Base64 문자열)
 */
export async function encryptFixedSymmetricKey(publicKey: CryptoKey): Promise<string> {
  // 1. 고정된 대칭키를 가져옴
  const symmetricKey = await getFixedSymmetricKey();
  // 2. 고정 대칭키를 raw 형식으로 내보냄
  const rawKey = await window.crypto.subtle.exportKey("raw", symmetricKey);
  // 3. RSA-OAEP를 사용하여 고정 대칭키(rawKey)를 수신자의 공개키로 암호화
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    rawKey
  );
  // 4. 암호화된 결과를 Base64 문자열로 변환하여 반환
  return arrayBufferToBase64(encryptedKeyBuffer);
}

export async function registerFixedSymmetricKey(recipientPublicKeyB64: string) {
  // 수신자의 공개키를 RSA-OAEP CryptoKey 객체로 변환
  const recipientPublicKey = await window.crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(recipientPublicKeyB64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
  // 고정된 대칭키를 가져옴
  const fixedKey = await getFixedSymmetricKey();
  // 고정 대칭키를 암호화 (RSA-OAEP로 암호화)
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientPublicKey,
    await window.crypto.subtle.exportKey("raw", fixedKey)
  );
  const encryptedSymmetricKey = arrayBufferToBase64(encryptedKeyBuffer);
  // 서버에 등록
  const result = await postMemberPublicKey(encryptedSymmetricKey);
  console.log("고정 대칭키 등록 결과:", result);
}

/**
 * AES-GCM 256비트 대칭키를 생성합니다.
 */
// export async function generateSymmetricKey(): Promise<CryptoKey> {
//   return window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
//     "encrypt",
//     "decrypt",
//   ]);
// }

/**
 * 고정된 12바이트 IV (예: 모두 0인 배열)
 * (보안상의 위험이 있으므로 실제 운영 환경에서는 권장하지 않습니다.)
 */
export const FIXED_IV: Uint8Array = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

/**
 * 평문 메시지를 AES-GCM 대칭키와 고정 IV(FIXED_IV)를 사용하여 암호화합니다.
 * @param plainText 평문 메시지
 * @param key AES-GCM 대칭키 (CryptoKey)
 * @returns 암호문 (ArrayBuffer)
 */
export async function encryptMessageAES(plainText: string, key: CryptoKey): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  // 고정 IV 사용
  return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: FIXED_IV }, key, data);
}

/**
 * AES-GCM 대칭키와 고정 IV를 사용하여 암호문을 복호화합니다.
 * @param cipherText 암호문 (ArrayBuffer)
 * @param key AES-GCM 대칭키 (CryptoKey)
 * @returns 복호화된 평문 문자열
 */
export async function decryptMessageAES(cipherText: ArrayBuffer, key: CryptoKey): Promise<string> {
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: FIXED_IV },
    key,
    cipherText
  );
  return new TextDecoder().decode(decryptedBuffer);
}
