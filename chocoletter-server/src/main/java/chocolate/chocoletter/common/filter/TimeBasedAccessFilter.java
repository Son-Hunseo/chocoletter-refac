package chocolate.chocoletter.common.filter;

import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.FailResponse;
import chocolate.chocoletter.common.util.DateTimeUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TimeBasedAccessFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final DateTimeUtil dateTimeUtil;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 차단 대상으로 처리할 엔드포인트 정보를 담는 내부 클래스
    @Getter
    private static class BlockedEndpoint {
        private final String pattern;
        private final String method; // 차단할 HTTP 메서드 목록

        public BlockedEndpoint(String pattern, String method) {
            this.pattern = pattern;
            this.method = method;
        }
    }

    // 차단 대상 엔드포인트 목록
    private static final List<BlockedEndpoint> BLOCKED_ENDPOINTS = List.of(
            new BlockedEndpoint("/api/v1/gift/*/unboxing/invitation", "POST"),
            new BlockedEndpoint("/api/v1/gift/*/letter", "PATCH"),
            new BlockedEndpoint("/api/v1/gift-box/*/gift/special/question", "POST"),
            new BlockedEndpoint("/api/v1/gift-box/*/gift/special/free", "POST"),
            new BlockedEndpoint("/api/v1/gift-box/*/gift/general/question", "POST"),
            new BlockedEndpoint("/api/v1/gift-box/*/gift/general/free", "POST"),
            new BlockedEndpoint("/api/v1/gift-box/*/verify", "GET")
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        LocalDateTime openDayTime = dateTimeUtil.getOpenDay().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        String requestURI = request.getRequestURI();
        String requestMethod = request.getMethod();

        // 대상 엔드포인트에 대하여 URI와 HTTP 메서드 모두 매칭하는지 확인
        for (BlockedEndpoint endpoint : BLOCKED_ENDPOINTS) {
            if (pathMatcher.match(endpoint.getPattern(), requestURI)
                    && endpoint.getMethod().equals(requestMethod)) {

                // 예시 조건: 현재 시간이 오픈일 이후이면 차단 (GET/POST 등 메서드 상관없이 차단)
                if (now.isAfter(openDayTime)) {
                    FailResponse failResponse = FailResponse.builder()
                            .status(HttpServletResponse.SC_FORBIDDEN)
                            .errorMessage(ErrorMessage.ERR_FORBIDDEN_SPECIAL_AFTER_DATE.toString())
                            .build();

                    response.setCharacterEncoding("UTF-8");
                    response.setContentType("application/json; charset=utf-8");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);

                    objectMapper.writeValue(response.getWriter(), failResponse);
                    return;
                }
            }
        }

        // 그 외의 요청은 계속해서 필터 체인 진행
        filterChain.doFilter(request, response);
    }

}
