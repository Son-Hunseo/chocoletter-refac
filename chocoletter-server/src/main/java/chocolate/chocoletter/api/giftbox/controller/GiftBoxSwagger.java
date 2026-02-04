package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface GiftBoxSwagger {

    @Operation(
            summary = "내 선물 갯수 조회",
            description = "로그인한 사용자의 선물 개수를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftCountResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패", content = @Content)
    })
    ResponseEntity<?> findGiftCount(Principal principal);

    @Operation(
            summary = "친구 선물함 조회",
            description = "특정 GiftBox를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftBoxResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "없는 초콜릿 박스 입니다.")
    })
    ResponseEntity<?> findGiftBox(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId);

    @Operation(
            summary = "열어볼 수 있는 선물 카운트 사용",
            description = "열어볼 수 있는 선물 카운트를 사용합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "사용 성공",
                    content = @Content(
                            mediaType = "application/json"
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    ResponseEntity<?> usePreviewCount(Principal principal);

    @Operation(
            summary = "내 선물함 ID 조회",
            description = "로그인한 사용자의 멤버 ID를 기반으로 선물함 ID를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "선물함 ID가 성공적으로 조회되었습니다.",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증 실패",
                    content = @Content
            )
    })
    ResponseEntity<?> getGiftBoxId(Principal principal);

    @Operation(
            summary = "선물함 타입 선택",
            description = "로그인한 사용자가 선물함의 타입을 선택합니다. 요청 본문에 선택할 타입 정보를 포함해야 합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "타입 선택 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 선물함")
    })
    ResponseEntity<?> chooseGiftBoxType(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "선택할 선물함 타입 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftBoxTypeRequestDto.class)
                    )
            )
            @Valid @RequestBody GiftBoxTypeRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "선물함 타입 조회",
            description = "로그인한 사용자의 선물함 타입을 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "선물함 타입 조회 성공",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 선물함")
    })
    ResponseEntity<?> findGiftBoxType(Principal principal);
}
