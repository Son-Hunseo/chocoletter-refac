package chocoletter.chat.api.chat.repository;

import lombok.Getter;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryChatRoomRepository {

    private final Map<String, Set<String>> chatRooms = new ConcurrentHashMap<>(); // key : roomId, value : 멤버 id 리스트

    // 특정 roomId에 접속한 멤버 리스트 가져오기
    public List<String> findOnlineMembers(String roomId) {
        return new ArrayList<>(chatRooms.getOrDefault(roomId, Collections.emptySet()));
    }

    // 채팅방 저장 (입장 내역 추가)
    public void save(String roomId, String memberId) {
        chatRooms.computeIfAbsent(roomId, k -> Collections.newSetFromMap(new ConcurrentHashMap<>())).add(memberId);
    }

    // 채팅방 삭제 (퇴장 시)
    public void remove(String roomId, String memberId) {
        chatRooms.computeIfPresent(roomId, (key, members) -> {
            members.remove(memberId);
            return members;
        });
    }
}


