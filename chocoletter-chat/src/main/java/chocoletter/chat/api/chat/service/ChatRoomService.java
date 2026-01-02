package chocoletter.chat.api.chat.service;

import chocoletter.chat.api.chat.repository.InMemoryChatRoomRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatRoomService {

    private final InMemoryChatRoomRepository inMemoryChatRoomRepository;

    @Transactional
    public void connectChatRoom(String roomId, String memberId) {
        inMemoryChatRoomRepository.save(roomId, memberId);
    }

    @Transactional
    public void disconnectChatRoom(String roomId, String memberId) {
        inMemoryChatRoomRepository.remove(roomId, memberId);
    }

    public boolean isAllConnected(String roomId) {
        List<String> connectedMemberList = inMemoryChatRoomRepository.findOnlineMembers(roomId);
        return connectedMemberList.size() == 2;
    }

}
