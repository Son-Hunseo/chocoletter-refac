package chocolate.chocoletter.migration;

import chocolate.chocoletter.api.chatroom.domain.ChatRoom;
import chocolate.chocoletter.api.chatroom.repository.ChatRoomRepository;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@ActiveProfiles("prod")
@Transactional
@Rollback(false)
public class ChatRoomGiftLetterMigrationTest {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private GiftRepository giftRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void migrateChatRoomGiftIdsToGiftLetterIds() {
        List<ChatRoom> chatRooms = (List<ChatRoom>) chatRoomRepository.findAll();

        List<MigrationResult> results = new ArrayList<>();
        List<MigrationError> errors = new ArrayList<>();

        for (ChatRoom chatRoom : chatRooms) {
            try {
                // hostGiftId 마이그레이션
                Long hostGiftId = chatRoom.getHostGiftId();
                Gift hostGift = giftRepository.findGiftByIdOrThrow(hostGiftId);
                Long hostSenderId = hostGift.getSenderId();
                Long hostGiftBoxId = hostGift.getGiftBox().getId();

                Long hostGiftLetterId = findGiftLetterIdBySenderIdAndGiftBoxId(hostSenderId, hostGiftBoxId);

                // guestGiftId 마이그레이션
                Long guestGiftId = chatRoom.getGuestGiftId();
                Gift guestGift = giftRepository.findGiftByIdOrThrow(guestGiftId);
                Long guestSenderId = guestGift.getSenderId();
                Long guestGiftBoxId = guestGift.getGiftBox().getId();

                Long guestGiftLetterId = findGiftLetterIdBySenderIdAndGiftBoxId(guestSenderId, guestGiftBoxId);

                MigrationResult result = new MigrationResult(
                        chatRoom.getId(),
                        hostGiftId,
                        hostGiftLetterId,
                        guestGiftId,
                        guestGiftLetterId
                );
                results.add(result);

                if (hostGiftLetterId == null) {
                    errors.add(new MigrationError(chatRoom.getId(), "HOST", hostGiftId,
                            "GiftLetter not found for senderId=" + hostSenderId + ", giftBoxId=" + hostGiftBoxId));
                }
                if (guestGiftLetterId == null) {
                    errors.add(new MigrationError(chatRoom.getId(), "GUEST", guestGiftId,
                            "GiftLetter not found for senderId=" + guestSenderId + ", giftBoxId=" + guestGiftBoxId));
                }

            } catch (Exception e) {
                errors.add(new MigrationError(chatRoom.getId(), "UNKNOWN", null, e.getMessage()));
            }
        }

        // 결과 출력
        System.out.println("\n========== Migration Results ==========");
        System.out.println("Total ChatRooms: " + chatRooms.size());
        System.out.println("Successful mappings: " + results.size());
        System.out.println("Errors: " + errors.size());

        System.out.println("\n---------- Mapping Details ----------");
        for (MigrationResult result : results) {
            System.out.println(result);
        }

        if (!errors.isEmpty()) {
            System.out.println("\n---------- Errors ----------");
            for (MigrationError error : errors) {
                System.out.println(error);
            }
        }

        // UPDATE 실행
        System.out.println("\n========== Executing UPDATE ==========");
        int updateCount = 0;
        for (MigrationResult result : results) {
            if (result.newHostGiftLetterId != null && result.newGuestGiftLetterId != null) {
                int updated = entityManager.createNativeQuery(
                                "UPDATE chat_room SET host_gift_id = :hostGiftLetterId, guest_gift_id = :guestGiftLetterId WHERE id = :chatRoomId")
                        .setParameter("hostGiftLetterId", result.newHostGiftLetterId)
                        .setParameter("guestGiftLetterId", result.newGuestGiftLetterId)
                        .setParameter("chatRoomId", result.chatRoomId)
                        .executeUpdate();
                if (updated > 0) {
                    updateCount++;
                    System.out.println("Updated ChatRoom[" + result.chatRoomId + "]");
                }
            }
        }
        System.out.println("\n========== Migration Complete ==========");
        System.out.println("Total updated: " + updateCount);
    }

    record MigrationResult(
            Long chatRoomId,
            Long oldHostGiftId,
            Long newHostGiftLetterId,
            Long oldGuestGiftId,
            Long newGuestGiftLetterId
    ) {
        @Override
        public String toString() {
            return String.format(
                    "ChatRoom[%d]: hostGiftId %d -> GiftLetter %d, guestGiftId %d -> GiftLetter %d",
                    chatRoomId, oldHostGiftId, newHostGiftLetterId, oldGuestGiftId, newGuestGiftLetterId
            );
        }
    }

    record MigrationError(
            Long chatRoomId,
            String type,
            Long giftId,
            String message
    ) {
        @Override
        public String toString() {
            return String.format("ERROR ChatRoom[%d] %s (giftId=%d): %s", chatRoomId, type, giftId, message);
        }
    }

    private Long findGiftLetterIdBySenderIdAndGiftBoxId(Long senderId, Long giftBoxId) {
        List<?> result = entityManager.createNativeQuery(
                        "SELECT id FROM gift_letter WHERE sender_id = :senderId AND gift_box_id = :giftBoxId")
                .setParameter("senderId", senderId)
                .setParameter("giftBoxId", giftBoxId)
                .getResultList();
        if (result.isEmpty()) {
            return null;
        }
        return ((Number) result.get(0)).longValue();
    }
}
