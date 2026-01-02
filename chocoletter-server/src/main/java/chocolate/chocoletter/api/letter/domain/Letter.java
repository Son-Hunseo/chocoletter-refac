package chocolate.chocoletter.api.letter.domain;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Letter extends BaseTimeEntity {
    @Id
    @Column(unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "gift_id", nullable = false, unique = true)
    private Gift gift;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LetterType type;

    @Column(nullable = false, length = 25)
    private String nickname;

    private String content;

    private String question;

    private String answer;

    public Letter(Gift gift, LetterType type, String nickname, String content, String question, String answer) {
        this.gift = gift;
        this.type = type;
        this.nickname = nickname;
        this.content = content;
        this.question = question;
        this.answer = answer;
    }

    @Builder(builderClassName = "createGeneralLetter", builderMethodName = "createGeneralLetter")
    public static Letter createGeneralLetter(Gift gift, String nickname, String content) {
        return new Letter(gift, LetterType.FREE, nickname, content, null, null);
    }

    @Builder(builderClassName = "createQuestionLetter", builderMethodName = "createQuestionLetter")
    public static Letter createQuestionLetter(Gift gift, String nickname, String question, String answer) {
        return new Letter(gift, LetterType.QUESTION, nickname, null, question, answer);
    }

    public void modify(String nickname, String question, String answer, String content) {
        this.nickname = nickname;
        this.question = question;
        this.answer = answer;
        this.content = content;
    }
}
