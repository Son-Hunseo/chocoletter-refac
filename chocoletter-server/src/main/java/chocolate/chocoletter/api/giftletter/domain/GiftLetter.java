package chocolate.chocoletter.api.giftletter.domain;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftletter.domain.LetterType;
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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"sender_id", "gift_box_id"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GiftLetter extends BaseTimeEntity {

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LetterType type;

    @Column(nullable = false, length = 25)
    private String nickname;

    private String content;

    private String question;

    private String answer;

    private GiftLetter(GiftBox giftBox, Long senderId, Long receiverId, LetterType type, String nickname,
                       String content, String question, String answer) {
        this.giftBox = giftBox;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.type = type;
        this.nickname = nickname;
        this.content = content;
        this.question = question;
        this.answer = answer;
        this.isOpened = false;
    }

    @Builder(builderClassName = "createFreeGiftLetter", builderMethodName = "createFreeGiftLetter")
    public static GiftLetter createFreeGiftLetter(GiftBox giftBox, Long senderId, Long receiverId,
                                                     String nickname, String content) {
        return new GiftLetter(giftBox, senderId, receiverId, LetterType.FREE, nickname, content, null, null);
    }

    @Builder(builderClassName = "createQuestionGiftLetter", builderMethodName = "createQuestionGiftLetter")
    public static GiftLetter createQuestionGiftLetter(GiftBox giftBox, Long senderId, Long receiverId,
                                                      String nickname, String question, String answer) {
        return new GiftLetter(giftBox, senderId, receiverId, LetterType.QUESTION, nickname, null, question, answer);
    }

    public void openGift() {
        this.isOpened = true;
    }

    public void modify(String nickname, String question, String answer, String content) {
        this.nickname = nickname;
        this.question = question;
        this.answer = answer;
        this.content = content;
    }
}
