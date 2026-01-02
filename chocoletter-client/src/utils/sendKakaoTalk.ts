export const initializeKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoAppKey = import.meta.env.VITE_KAKAOTALK_JAVASCRIPT_KEY;
        if (!kakaoAppKey) {
            // console.error("Kakao JavaScript key is not defined in environment variables.");
            return;
        }
        window.Kakao.init(kakaoAppKey);
        // console.log("Kakao SDK initialized.");
    } else if (window.Kakao && window.Kakao.isInitialized()) {
        // console.log("Kakao SDK already initialized.");
    } else {
        // console.error("Kakao SDK is not available on the window object.");
    }
};

export const sendKakaoShare = (shareContent: Kakao.ShareOptions) => {
    if (window.Kakao && window.Kakao.Share && window.Kakao.isInitialized()) {
        try {
            window.Kakao.Share.sendDefault(shareContent);
            // console.log("Kakao share sent successfully.");
        } catch (error) {
            // console.error("Failed to send Kakao share:", error);
        }
    } else {
        // console.error("Kakao SDK is not initialized or Share module is unavailable.");
    }
};