package chocolate.chocoletter.api.member.controller;

import chocolate.chocoletter.api.member.dto.request.PublicKeyRequestDto;
import chocolate.chocoletter.api.member.dto.response.MyPageResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

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

    @Operation(
            summary = "퍼블릭 키 생성",
            description = "나의 퍼블릭 키를 등록합니다.",
            tags = {"member"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "등록 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MyPageResponseDto.class)
                    )
            ),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content)
    })
    ResponseEntity<?> initPublicKey(@io.swagger.v3.oas.annotations.parameters.RequestBody(
                                            description = "로그인 한 사람의 퍼블릭 키",
                                            required = true,
                                            content = @Content(
                                                    mediaType = "application/json",
                                                    schema = @Schema(implementation = PublicKeyRequestDto.class)
                                            )
                                    ) @RequestBody PublicKeyRequestDto requestDto,
                                    Principal principal);
}
