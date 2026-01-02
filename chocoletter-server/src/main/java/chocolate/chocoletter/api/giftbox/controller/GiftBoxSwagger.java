package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftBoxResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.MyUnBoxingTimesResponseDto;
import chocolate.chocoletter.api.giftbox.dto.response.UnboxingTimesResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface GiftBoxSwagger {

    @Operation(
            summary = "일반 자유 선물 전송",
            description = "특정 GiftBox에 일반 자유 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendGeneralFreeGift(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "일반 자유 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GeneralFreeGiftRequestDto.class)
                    )
            )
            @RequestBody GeneralFreeGiftRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "일반 질문 선물 전송",
            description = "특정 GiftBox에 일반 질문 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendGeneralQuestionGift(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "일반 질문 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GeneralQuestionRequestDto.class)
                    )
            )
            @RequestBody
            GeneralQuestionRequestDto requestDto,
            Principal principal);

    @Operation(
            summary = "특별 자유 선물 전송",
            description = "특정 GiftBox에 특별 자유 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendSpecialFreeGift(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "특별 자유 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SpecialFreeGiftRequestDto.class)
                    )
            )
            @RequestBody
            SpecialFreeGiftRequestDto requestDto,
            Principal principal);

    @Operation(
            summary = "특별 질문 선물 전송",
            description = "특정 GiftBox에 특별 질문 선물을 전송합니다. 로그인한 사용자의 ID가 필요합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "선물이 성공적으로 전송되었습니다."),
            @ApiResponse(responseCode = "404", description = "없는 선물함 입니다.")
    })
    ResponseEntity<?> sendSpecialQuestionGift(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "특별 질문 선물의 상세 정보를 포함한 요청 본문",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SpecialQuestionGiftRequestDto.class)
                    )
            ) @RequestBody
            SpecialQuestionGiftRequestDto requestDto,
            Principal principal);

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
            summary = "상대방의 unboxing 스케줄 조회",
            description = "선물을 받을 사람의 RTC 스케줄을 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UnboxingTimesResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "없는 초콜릿 박스 입니다.")
    })
    ResponseEntity<?> findUnboxingTimes(
            @Parameter(
                    description = "암호화된 형태의 giftBox Id (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            )
            @PathVariable("giftBoxId") Long giftBoxId, Principal principal);

    @Operation(
            summary = "열어볼 수 있는 선물 카운트 사용",
            description = "열어볼 수 있는 선물 카운트를 사용합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UnboxingTimesResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<?> usePreviewCount(Principal principal);

    @Operation(
            summary = "내 언박싱 일정 조회",
            description = "로그인 한 사람의 언박싱 일정을 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MyUnBoxingTimesResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    ResponseEntity<?> findMyUnboxingTimes(Principal principal);

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
    public ResponseEntity<?> getGiftBoxId(Principal principal);

    @Operation(
            summary = "선물 전송 여부 검증",
            description = "특정 GiftBox에 대해 현재 로그인한 사용자의 선물 전송 여부를 검증합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "검증 결과 반환",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "존재하지 않는 선물함 입니다.",
                    content = @Content
            )
    })
    public ResponseEntity<?> verifyIsSend(
            @Parameter(
                    description = "암호화된 형태의 giftBoxId (Decrypted 후 사용)",
                    required = true,
                    schema = @Schema(type = "number")
            )
            Long giftBoxId,
            Principal principal
    );

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
            @RequestBody GiftBoxTypeRequestDto requestDto,
            Principal principal
    );

    @Operation(
            summary = "선물함 타입 조회",
            description = "로그인한 사용자의 선물함 타입을 조회합니다. (경로 변수로 전달된 giftBoxId는 복호화되어 처리됩니다.)",
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

    @Operation(
            summary = "내가 보낸 선물 조회",
            description = "내가 보낸 편지를 조회합니다.",
            tags = {"GiftBox"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "편지 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = GiftDetailResponseDto.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "상대방이 이미 열어본 편지"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 선물함")
    })
    ResponseEntity<?> findMyGiftDetail(Long giftBoxId,
                                       Principal principal);
}
