package chocolate.chocoletter.api.giftletter.controller;

import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public interface GiftLetterSwagger {

    @Operation(
            summary = "전체 선물 목록 조회",
            description = "로그인한 회원의 전체 선물 목록을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftLettersResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findAllGiftLetters(Principal principal);

    @Operation(
            summary = "내가 받은 개별 선물 조회",
            description = "로그인한 회원이 자신이 받은 개별 선물 내용을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftLetterDetailResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findReceiveGiftLetterDetail(
            @Parameter(
                    description = "암호화된 형태의 giftLetterId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftLetterId, Principal principal);

    @Operation(
            summary = "내가 보낸 개별 선물 조회",
            description = "로그인한 회원이 자신이 보낸 개별 선물 내용을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GiftLetterDetailResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findSendGiftLetterDetail(Long giftLetterId, Principal principal);

    @Operation(
            summary = "편지 수정",
            description = "상대방에게 이미 편지를 보냈고, 상대가 읽지 않았을 경우 수정합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "성공적으로 변경",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "404", description = "해당하는 선물이 없습니다.")
            }
    )
    ResponseEntity<?> modifyGiftLetter(
            @Parameter(
                    description = "암호화된 형태의 giftLetterId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long giftLetterId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "변경할 편지 내용",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ModifyGiftLetterRequestDto.class)
                    )
            )
            @RequestBody ModifyGiftLetterRequestDto requestDto, Principal principal);

    @Operation(
            summary = "랜덤 질문 조회",
            description = "랜덤 편지를 골랐을 때나 질문이 마음에 들지 않을 때, 질문을 조회합니다.")
    @ApiResponses(
            value = {@ApiResponse(
                    responseCode = "200",
                    description = "성공적으로 조회",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RandomQuestionResponseDto.class))),
                    @ApiResponse(
                            responseCode = "401",
                            description = "인증 실패")
            })
    ResponseEntity<?> findRandomQuestion(
            @Parameter(
                    description = "이전 질문 id, 처음 조회 시에는 해당 파라미터를 0으로 주고, 새로고침 시에는 이전 id를 주면 됩니다.",
                    required = true,
                    example = "1"
            ) @RequestParam @Min(0) @Max(40) Long previousQuestionId);
}
