export const copyToClipboard = async (text : string) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        throw new Error("클립보드 복사에 실패했습니다.");
    }
};