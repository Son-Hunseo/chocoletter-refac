package chocolate.chocoletter.api.chatroom.controller;

import chocolate.chocoletter.api.chatroom.dto.response.ChatLetterResponseDto;
import chocolate.chocoletter.api.chatroom.dto.response.ChatRoomsResponseDto;
import chocolate.chocoletter.api.chatroom.service.ChatRoomService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat-room")
@RequiredArgsConstructor
public class ChatRoomController implements ChatRoomSwagger {
    private final ChatRoomService chatRoomService;

    @GetMapping("/all")
    public ResponseEntity<?> findMyChatRooms(Principal principal) {
        // 로그인 한 멤버 찾아오기
        Long memberId = Long.parseLong(principal.getName());
        ChatRoomsResponseDto myChatRooms = chatRoomService.findMyChatRooms(memberId);
        return ResponseEntity.ok(myChatRooms);
    }

    @GetMapping("/{roomId}/letter")
    public ResponseEntity<?> findReceiveLetter(@PathVariable @DecryptedId Long roomId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        ChatLetterResponseDto receiveLetter = chatRoomService.findReceiveLetter(roomId, memberId);
        return ResponseEntity.ok(receiveLetter);
    }

}
