package chocolate.chocoletter.api.member.controller;

import chocolate.chocoletter.api.member.dto.response.MyPageResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;

public interface MemberSwagger {

    @Operation(
            summary = "마이페이지 조회",
            description = "내가 받은 선물 갯수와 보낸 선물 갯수를 조회합니다.",
            tags = {"member"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MyPageResponseDto.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content)
    })
    ResponseEntity<?> findMyPage(Principal principal);
}
