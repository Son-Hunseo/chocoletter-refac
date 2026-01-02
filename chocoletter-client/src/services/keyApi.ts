import api from "./api";

/**
 * 회원의 공개키를 서버에 등록합니다.
 * 로그인 후 KakaoLoginCallback.tsx에서 호출하여,
 * member의 공개키를 POST 요청으로 전송합니다.
 *
 * @param publicKey - Base64 인코딩된 회원의 공개키
 * @returns 서버 응답 데이터
 */
export async function postMemberPublicKey(publicKey: string): Promise<any> {
  try {
    const response = await api.post("/api/v1/member/key", { publicKey });
    return response.data;
  } catch (error) {
    console.error("회원 공개키 전송 오류:", error);
    throw error;
  }
}

/**
 * 특정 giftBoxId에 해당하는 상대방의 공개키를 서버에서 가져옵니다.
 * 이 함수는 GET 요청을 사용하며, 엔드포인트는 `/api/v1/gift-box/{giftBoxId}/key` 입니다.
 *
 * @param giftBoxId - 상대방의 giftBoxId (저장되어 있는 값)
 * @returns 상대방의 공개키 (Base64 인코딩된 문자열)
 */
export async function getGiftBoxPublicKey(giftBoxId: string): Promise<string> {
  try {
    const response = await api.get(`/api/v1/gift-box/${giftBoxId}/key`);
    // 서버가 { publicKey: string } 형태로 응답한다고 가정합니다.
    return response.data.publicKey;
  } catch (error) {
    console.error("giftBox 공개키 조회 오류:", error);
    throw error;
  }
}
