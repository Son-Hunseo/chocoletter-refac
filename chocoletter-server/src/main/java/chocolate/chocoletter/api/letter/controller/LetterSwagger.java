package chocolate.chocoletter.api.letter.controller;

import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

public interface LetterSwagger {
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

