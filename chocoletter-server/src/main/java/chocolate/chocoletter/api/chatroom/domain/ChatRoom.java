package chocolate.chocoletter.api.chatroom.domain;

import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom extends BaseTimeEntity {
    @Id
    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long hostId;

    @Column(nullable = false)
    private Long guestId;

    @Column(nullable = false)
    private Long hostGiftId;

    @Column(nullable = false)
    private Long guestGiftId;

    @Builder
    public ChatRoom(Long hostId, Long guestId, Long hostGiftId, Long guestGiftId) {
        this.hostId = hostId;
        this.guestId = guestId;
        this.hostGiftId = hostGiftId;
        this.guestGiftId = guestGiftId;
    }
}
