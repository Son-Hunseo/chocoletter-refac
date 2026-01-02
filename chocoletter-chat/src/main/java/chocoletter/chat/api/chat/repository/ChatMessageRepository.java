package chocoletter.chat.api.chat.repository;

import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.dto.response.LastChatMessageResponseDto;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    @Query(value = "{ 'roomId' : ?0 }", sort = "{ 'createdAt' : -1 }")
    List<ChatMessage> findChatMessages(String roomId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ $match: { roomId: ?0 } }",
            "{ $group: { _id: null, " +
                    "count: { $sum: { $cond: [{ $and: [ { $ne: ['$senderId', ?1] }, { $eq: ['$isRead', false] } ] }, 1, 0] } }, " +
                    "message: { $last: '$content' } } }"
    })
    LastChatMessageResponseDto findUnReadCountAndLastMessage(String roomId, String memberId);

    @Query("{ 'roomId': ?0, 'senderId':  {$ne: ?1}}")
    @Update("{ '$set': { 'isRead': true } }")
    void readAllUnreadMessages(String roomId, String memberId);
}
