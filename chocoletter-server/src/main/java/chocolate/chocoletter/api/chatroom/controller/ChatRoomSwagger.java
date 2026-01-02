package chocolate.chocoletter.api.chatroom.controller;

import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.security.Principal;
import org.springframework.http.ResponseEntity;

public interface ChatRoomSwagger {

    @Operation(
            summary = "채팅방 조회",
            description = "내가 속한 채팅방리스트를 조회합니다. 로그인한 사용자의 ID가 필요합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatRoomsResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증되지 않았습니다."),
            @ApiResponse(responseCode = "500", description = "Id를 암호화하다 실패했습니다.")
    })
    ResponseEntity<?> findMyChatRooms(Principal principal);

    @Operation(
            summary = "채팅방에서 조회",
            description = "내가 속한 채팅방리스트에서 받은 편지를 조회합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ChatLetterResponseDto.class)
                    )),
            @ApiResponse(responseCode = "401", description = "인증되지 않았습니다.")
    })
    ResponseEntity<?> findReceiveLetter(
            @Parameter(
                    description = "암호화된 형태의 채팅방 id (String 타입으로 전달)",
                    schema = @Schema(type = "string")
            ) Long roomId, Principal principal);
}
