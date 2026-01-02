package chocolate.chocoletter.api.chatroom.repository;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Long> {
    @Query("select cr from ChatRoom cr where cr.hostId = :memberId or cr.guestId = :memberId")
    List<ChatRoom> findMyChatRooms(@Param("memberId") Long memberId);

    @Query("select cr from ChatRoom cr where cr.id = :roomId")
    ChatRoom findChatRoom(@Param("roomId") Long roomId);
}
