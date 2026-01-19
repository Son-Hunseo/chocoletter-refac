import api from "./api";

// 선물 정보 가져오기
export async function getGiftDetail(giftId: string) {
  try {
    const res = await api.get(`/api/v1/gift/${giftId}/receive`);
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
    const res = await api.get(`/api/v1/gift/all`);
    const data = res.data;
    console.log("Gift List:", data);
    return data;
  } catch (err) {
    console.error("getGiftList API 호출 중 에러 발생:", err);
    return null;
  }
}

// 일반 자유 선물 보내기
export async function sendGeneralFreeGift(giftBoxId: string, nickName: string, content: string) {
  try {
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/free`, {
      nickName: nickName,
      content: content,
    });
    const data = res.data;
    console.log("GeneralFreeGift :", data);
    return data;
  } catch (err) {
    console.error("sendGeneralFreeGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

// 일반 질문 선물 보내기
export async function sendGeneralQuestionGift(
  giftBoxId: string,
  nickName: string,
  question: string,
  answer: string
) {
  try {
    const res = await api.post(`/api/v1/gift-box/${giftBoxId}/gift/general/question`, {
      nickName: nickName,
      question: question,
      answer: answer,
    });
    const data = res.data;
    console.log("GeneralQuestionGift :", data);
    return data;
  } catch (err) {
    console.error("sendGeneralQuestionGift API 호출 중 에러 발생:", err);
    throw err;
  }
}

// 내 마이페이지 관련 통계 가져오기 (받은 초콜릿 수, 보낸 초콜릿 수)
export async function getMyPageStats() {
    const res = await api.get(`/api/v1/member/mypage`);
    const data = res.data;
    console.log("MyPage stats:", data);
    return data;
}
