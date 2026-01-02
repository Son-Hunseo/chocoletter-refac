import { MyUserInfo, ReissueTokenResponse } from "../types/user";
import api from "./api";
import nonAuthAxios from "./api";
import { deleteUserInfo, getUserInfo, savingUserInfo } from "./userInfo";

/**
 * 사용자 정보 확인(로그인) 함수
 * @returns 로그인 응답 데이터
 */
// export async function login(): Promise<string> {
//   try {
//     const res = await nonAuthAxios.get(`/api/v1/auth/login`);
//     fetchUserInfo();
//     return res.data;
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

/**
 * 로그아웃 API 호출
 * @returns 로그아웃 상태
 */
export async function logout(): Promise<string> {
  try {
    const res = await api.post(`/api/v1/auth/logout`);
    // 로그아웃 성공 시, 사용자 정보 삭제
    removeUserInfo();
    return res.data.status;
  } catch (err) {
    throw new Error("로그아웃에 실패했습니다.");
  }
}

/**
 * 토큰을 재발급하는 함수
 * @returns 재발급된 토큰 데이터
 */
export const reissueTokenApi = async (): Promise<ReissueTokenResponse> => {
  try {
    const res = await api.get<ReissueTokenResponse>(`/api/v1/auth/retoken`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * 사용자 정보를 저장하는 함수
 * @param userInfo - 사용자 정보
 */
export function saveUserInfo(userInfo: MyUserInfo): void {
  savingUserInfo(userInfo);
}

/**
 * 사용자 정보를 가져오는 함수
 * @returns 사용자 정보 또는 null
 */
export function fetchUserInfo(): MyUserInfo | null {
  return getUserInfo();
}

/**
 * 사용자 정보를 삭제하는 함수
 */
export function removeUserInfo(): void {
  deleteUserInfo();
}

/**
 * 2) /api/v1/gift-box/id 에서 giftBoxId 받아오는 함수
 * @returns giftBoxId (문자열)
 *
 * 해당 API는 서버에서 { giftBoxId: string } 형태로 반환된다고 가정
 */
export async function getGiftBoxId(): Promise<string> {
  try {
    // GET /api/v1/gift-box/id
    const res = await api.get<{ giftBoxId: string }>(`/api/v1/gift-box/id`);
    return res.data.giftBoxId;
  } catch (err) {
    console.error("Error retrieving share code from /api/v1/gift-box/id:", err);
    throw err;
  }
}
