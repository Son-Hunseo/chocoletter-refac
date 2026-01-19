import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

/**
 * 개봉 가능한(열 수 있는) 초콜릿 수
 */
export const availableGiftsAtom = atom<number>({
  key: "availableGifts",
  default: 0,
});

/**
 * 받은(전체) 초콜릿 수
 */
export const receivedGiftsAtom = atom<number>({
  key: "receivedGifts",
  default: 0,
});

/**
 * 보낸(전체) 초콜릿 수
 * - 새로 추가
 */
export const sentGiftsAtom = atom<number>({
  key: "sentGifts",
  default: 0,
});

export const selectedGiftIdAtom = atom<string | null>({
  key: "selectedGiftId",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const giftListRefreshAtom = atom<boolean>({
  key: 'giftListRefreshAtom',
  default: false,
  effects_UNSTABLE: [persistAtom],
});