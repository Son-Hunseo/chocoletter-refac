package chocolate.chocoletter.api.gift.domain;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    private Boolean isOpened;

    private Gift(GiftBox giftBox, Long senderId, Long receiverId) {
        this.giftBox = giftBox;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.isOpened = false;
    }

    @Builder(builderClassName = "createGiftBuilder", builderMethodName = "createGift")
    public static Gift createGift(GiftBox giftBox, Long senderId, Long receiverId) {
        return new Gift(giftBox, senderId, receiverId);
    }

    public void openGift() {
        this.isOpened = true;
    }
}
