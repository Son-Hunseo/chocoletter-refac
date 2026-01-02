import { arrayBufferToBase64, base64ToArrayBuffer } from "./encryption";

/**
 * memberId를 기반으로 RSA-OAEP 키 페어를 생성하고 로컬에 저장합니다.
 * 만약 이미 키 페어가 존재한다면 새로 생성하지 않습니다.
 *
 * @param memberId - KakaoLoginCallback.tsx 등에서 전달받은 사용자의 memberId
 */
export async function generateAndStoreKeyPairForMember(memberId: string): Promise<void> {
  const publicKeyStorageKey = `memberPublicKey_${memberId}`;
  const privateKeyStorageKey = `memberPrivateKey_${memberId}`;

  // 이미 키가 존재하면 새로 생성하지 않고 종료합니다.
  if (localStorage.getItem(publicKeyStorageKey) && localStorage.getItem(privateKeyStorageKey)) {
    console.log("키 페어가 이미 존재합니다.");
    return;
  }

  try {
    // RSA-OAEP 키 페어 생성 (2048비트, SHA-256 사용)
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // 키 내보내기(export) 허용
      ["encrypt", "decrypt"]
    );

    // 공개키(exported as spki)와 개인키(exported as pkcs8)를 내보냅니다.
    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    // ArrayBuffer를 Base64 문자열로 변환
    const publicKeyB64 = arrayBufferToBase64(exportedPublicKey);
    const privateKeyB64 = arrayBufferToBase64(exportedPrivateKey);

    // 로컬 스토리지에 저장 (예: memberPublicKey_123, memberPrivateKey_123)
    localStorage.setItem(publicKeyStorageKey, publicKeyB64);
    localStorage.setItem(privateKeyStorageKey, privateKeyB64);

    console.log("키 페어가 성공적으로 생성되어 저장되었습니다.");
    // 필요하다면, 여기서 생성된 공개키를 서버에 전송하는 API 호출도 추가할 수 있습니다.
  } catch (error) {
    console.error("키 페어 생성에 실패했습니다:", error);
    throw error;
  }
}

/**
 * 로컬에 저장된 memberId 기반 공개키를 가져옵니다.
 *
 * @param memberId - 사용자의 memberId
 * @returns 해당 공개키 (CryptoKey) 또는 키가 없으면 null
 */
export async function getMemberPublicKey(memberId: string): Promise<CryptoKey | null> {
  const publicKeyStorageKey = `memberPublicKey_${memberId}`;
  const publicKeyB64 = localStorage.getItem(publicKeyStorageKey);
  if (!publicKeyB64) {
    console.warn("저장된 공개키가 없습니다.");
    return null;
  }
  const publicKeyBuffer = base64ToArrayBuffer(publicKeyB64);
  return window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

/**
 * 로컬에 저장된 memberId 기반 개인키를 가져옵니다.
 *
 * @param memberId - 사용자의 memberId
 * @returns 해당 개인키 (CryptoKey) 또는 키가 없으면 null
 */
export async function getMemberPrivateKey(memberId: string): Promise<CryptoKey | null> {
  const privateKeyStorageKey = `memberPrivateKey_${memberId}`;
  const privateKeyB64 = localStorage.getItem(privateKeyStorageKey);
  if (!privateKeyB64) {
    console.warn("저장된 개인키가 없습니다.");
    return null;
  }
  const privateKeyBuffer = base64ToArrayBuffer(privateKeyB64);
  return window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}
