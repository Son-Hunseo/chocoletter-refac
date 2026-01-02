package chocolate.chocoletter.api.unboxingRoom.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface UnboxingRoomSwagger {

    @Operation(
            summary = "언박싱 룸 접근 권한 체크",
            description = "언박싱 룸 주소로 접근 할 때, 선물을 보낸 사람이거나 받은 사람인지 확인해서 접근 권한을 체크합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "접근 권한 있음",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "언박싱 룸에 접근 할 수 있느 권한이 없습니다."),
                    @ApiResponse(responseCode = "403", description = "언박싱 룸이 이미 종료되었습니다."),
                    @ApiResponse(responseCode = "404", description = "올바르지 않은 언박싱 룸 ID 입니다.")
            }
    )
    ResponseEntity<?> hasAccessToUnboxingRoom(Long unboxingRoomId, Principal principal);

    @Operation(
            summary = "언박싱 종료",
            description = "언박싱이 끝났을 때, 언박싱 룸을 종료합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "접근 권한 있음",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "인증 실패"),
                    @ApiResponse(responseCode = "403", description = "언박싱 룸에 접근 할 수 있느 권한이 없습니다."),
                    @ApiResponse(responseCode = "404", description = "올바르지 않은 언박싱 룸 ID 입니다.")
            }
    )
    ResponseEntity<?> endUnBoxingRoom(Long roomId, Principal principal);
}
