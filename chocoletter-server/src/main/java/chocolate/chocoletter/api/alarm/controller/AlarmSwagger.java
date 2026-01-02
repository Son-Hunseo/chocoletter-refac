package chocolate.chocoletter.api.alarm.controller;

import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.NewAlarmResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;

public interface AlarmSwagger {

    @Operation(
            summary = "내 알람 전체 조회",
            description = "로그인한 회원의 전체 알람 목록을 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AlarmsResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> findMyAlarms(Principal principal);

    @Operation(
            summary = "새 알람 개수 전체 조회",
            description = "로그인한 회원의 새 알람 개수를 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "성공적으로 조회",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = NewAlarmResponseDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패")
            }
    )
    ResponseEntity<?> countMyAlarms(Principal principal);
}
