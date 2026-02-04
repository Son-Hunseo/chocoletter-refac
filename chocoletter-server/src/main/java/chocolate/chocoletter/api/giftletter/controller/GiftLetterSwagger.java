package chocolate.chocoletter.api.giftletter.controller;

import chocolate.chocoletter.api.giftletter.dto.request.FreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.QuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.VerifyIsSendResponseDto;
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
            summary = "자유 선물 전송",
            description = "특정 GiftBox에 자유 선물을 전송합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "400", description = "이미 선물을 보냈습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendFreeGiftLetter(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @RequestParam("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "자유 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = FreeGiftLetterRequestDto.class)
                    )
            )
            @RequestBody FreeGiftLetterRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "질문 선물 전송",
            description = "특정 GiftBox에 질문 선물을 전송합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "400", description = "이미 선물을 보냈습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendQuestionGiftLetter(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @RequestParam("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "질문 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = QuestionGiftLetterRequestDto.class)
                    )
            )
            @RequestBody QuestionGiftLetterRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "선물 전송 여부 검증",
            description = "특정 GiftBox에 대해 현재 로그인한 사용자의 선물 전송 여부를 검증합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "검증 결과 반환",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VerifyIsSendResponseDto.class)
                    )
            )
    })
    ResponseEntity<?> verifyIsSend(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @RequestParam("giftBoxId") Long giftBoxId,
            Principal principal
    );

    @Operation(
            summary = "내가 보낸 선물 조회",
            description = "특정 GiftBox에 내가 보낸 편지를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "편지 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftLetterDetailResponseDto.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "상대방이 이미 열어본 편지"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 선물")
    })
    ResponseEntity<?> findMyGiftLetterDetail(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @RequestParam("giftBoxId") Long giftBoxId,
            Principal principal
    );

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
