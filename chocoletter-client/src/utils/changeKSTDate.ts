interface changeDateProps {
    givenDate: string,
    format: string,
}

export const changeKSTDate = ({givenDate, format}: changeDateProps) => {
    // givenDate 형식은 "2025-01-25T02:00:00.000Z" 이여야 함.

    const date = new Date(givenDate);

    // UTC 시간 추출
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth(); // 0부터 시작 (0 = 1월)
    const utcDate = date.getUTCDate();
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const utcSeconds = date.getUTCSeconds();

    // KST로 변환 (UTC + 9시간)
    const kstDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHours + 9, utcMinutes, utcSeconds));

    // KST 구성 요소 추출
    const fullYear = kstDate.getUTCFullYear();
    const year = String(fullYear).substring(2); // 두 자리 연도
    const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0'); // 월 (1월은 0부터 시작하므로 +1 필요)
    const day = String(kstDate.getUTCDate()).padStart(2, '0'); // 일
    const hour = String(kstDate.getUTCHours()).padStart(2, '0'); // 시
    const minute = String(kstDate.getUTCMinutes()).padStart(2, '0'); // 분
    const second = String(kstDate.getUTCSeconds()).padStart(2, '0'); // 초

    return format
        .replace('YYYY', String(fullYear))
        .replace('yy', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hour)
        .replace('mm', minute)
        .replace('ss', second)
}