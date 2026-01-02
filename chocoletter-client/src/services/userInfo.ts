import { MyUserInfo } from "../types/user";

/**
 * 사용자 정보를 로컬 스토리지에 저장하는 함수
 * @param userInfo - 저장할 사용자 정보
 */
export const savingUserInfo = (userInfo: MyUserInfo): void => {
  window.localStorage.setItem("userName", userInfo.userName);
  window.localStorage.setItem("accessToken", userInfo.accessToken);
  window.localStorage.setItem("giftBoxId", userInfo.giftBoxId);
};

/**
 * 로컬 스토리지에서 사용자 정보를 가져오는 함수
 * @returns 사용자 정보 객체
 */
export const getUserInfo = (): MyUserInfo | null => {
  const userName = window.localStorage.getItem("userName");
  const accessToken = window.localStorage.getItem("accessToken");
  const giftBoxId = window.localStorage.getItem("giftBoxId");

  if (userName && accessToken && giftBoxId) {
    return { userName, accessToken, giftBoxId };
  }

  return null;
};

/**
 * 로컬 스토리지에서 사용자 정보를 삭제하는 함수
 */
export const deleteUserInfo = (): void => {
  window.localStorage.removeItem("userName");
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("giftBoxId");
  window.localStorage.removeItem("recoil-persist"); // Recoil 상태 관리 관련 키 삭제
};
