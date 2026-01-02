package chocolate.chocoletter.api.gift.domain;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Gift extends BaseTimeEntity {

    @Id
    @Column(unique = true, nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gift_box_id", nullable = false)
    private GiftBox giftBox;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GiftType type;

    private LocalDateTime unBoxingTime;

    private Boolean isAccept;

    private Boolean isOpened;

    private Gift(GiftBox giftBox, Long senderId, Long receiverId, GiftType type, LocalDateTime unBoxingTime,
                 Boolean isAccept) {
        this.giftBox = giftBox;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.type = type;
        this.unBoxingTime = unBoxingTime;
        this.isAccept = isAccept;
        this.isOpened = false;
    }

    @Builder(builderClassName = "createGeneralGiftBuilder", builderMethodName = "createGeneralGift")
    public static Gift createGeneralGift(GiftBox giftBox, Long senderId, Long receiverId) {
        return new Gift(giftBox, senderId, receiverId, GiftType.GENERAL, null, null);
    }

    @Builder(builderClassName = "createSpecialGiftBuilder", builderMethodName = "createSpecialGift")
    public static Gift createSpecialGift(GiftBox giftBox, Long senderId, Long receiverId, LocalDateTime unBoxingTime) {
        return new Gift(giftBox, senderId, receiverId, GiftType.SPECIAL, unBoxingTime, false);
    }

    public void acceptUnboxing() {
        this.isAccept = true;
    }

    public void changeToGeneralGift() {
        this.type = GiftType.GENERAL;
        this.isAccept = null;
        this.unBoxingTime = null;
    }

    public void updateUnBoxingTime(LocalDateTime unBoxingTime) {
        this.unBoxingTime = unBoxingTime;
    }

    public void openGift() {
        this.isOpened = true;
    }
}
