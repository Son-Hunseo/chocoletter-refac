package chocolate.chocoletter.api.unboxingRoom.domain;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UnboxingRoom extends BaseTimeEntity {

    @Id
    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gift_id")
    private Gift gift;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long receiverId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private Boolean isEnd;

    @Builder
    public UnboxingRoom(Gift gift, Long senderId, Long receiverId, LocalDateTime startTime) {
        this.gift = gift;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.startTime = startTime;
        this.isEnd = false;
    }

    public void endRoom() {
        this.isEnd = true;
    }
}
