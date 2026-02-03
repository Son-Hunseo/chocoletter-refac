import axios from "axios";
import { deleteUserInfo, getUserInfo } from "./userInfo";
import { toast } from "react-toastify";
import { reissueTokenApi } from "./userApi";

// 인증이 필요한 Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const userInfo = getUserInfo();
    if (userInfo && userInfo.accessToken) {
      config.headers["Authorization"] = `Bearer ${userInfo.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 처리 및 토큰 재발급 시도
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 네트워크 에러 (CORS 에러, 서버 다운 등) - error.response가 없음
    if (!error.response) {
      console.error("네트워크 에러:", error.message);
      deleteUserInfo();
      toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.replace("/");
      return new Promise(() => {});
    }

    if (error.response.status === 401) {
      if (error.response.data?.message === "reissue") {
        try {
          const data = await reissueTokenApi();
          if (data.status === "success") {
            window.localStorage.setItem("accessToken", data.data.accessToken);
            const originalRequest = error.config;
            originalRequest.headers["Authorization"] = `Bearer ${data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch (reissueError) {
          console.error("토큰 재발급 중 오류 발생:", reissueError);
        }
      }
      deleteUserInfo();
      toast.error("다시 로그인이 필요합니다.");
      window.location.replace("/");
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

// 인증이 필요 없는 Axios 인스턴스 생성
export const nonAuthAxios = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
