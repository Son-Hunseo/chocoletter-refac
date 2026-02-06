import api from "./api";

// 선물 정보 가져오기
export async function getGiftDetail(giftLetterId: string) {
  try {
    const res = await api.get(`/api/v1/giftletter/${giftLetterId}/receive`);
    const data = res.data;
    console.log("Gift 데이터:", data);
    return data;
  } catch (err) {
    console.error("getGiftDetail API 호출 중 에러 발생:", err);
    throw err;
  }
}

// 선물 리스트 가져오기
export async function getGiftList() {
  try {
    const res = await api.get(`/api/v1/giftletter/all`);
    const data = res.data;
    console.log("Gift List:", data);
    return data;
  } catch (err) {
    console.error("getGiftList API 호출 중 에러 발생:", err);
    return null;
  }
}

// 내 마이페이지 관련 통계 가져오기 (받은 초콜릿 수, 보낸 초콜릿 수)
export async function getMyPageStats() {
    const res = await api.get(`/api/v1/member/mypage`);
    const data = res.data;
    console.log("MyPage stats:", data);
    return data;
}

// 특정 선물함의 선물 개수 조회
export async function getGiftLetterCount(giftBoxId: string): Promise<number> {
  const res = await api.get<number>(`/api/v1/giftletter/count`, {
    params: { giftBoxId }
  });
  console.log("선물 개수 조회 성공:", res.data);
  return res.data;
}
