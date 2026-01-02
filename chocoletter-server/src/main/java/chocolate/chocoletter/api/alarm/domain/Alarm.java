package chocolate.chocoletter.api.alarm.domain;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Alarm extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AlarmType type;

    @Column(nullable = false)
    private Long giftId;

    @Column(nullable = false)
    private String partnerName;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Column(nullable = false)
    private Boolean isRead;

    @Builder
    public Alarm(AlarmType type, Long giftId, Member member, String partnerName) {
        this.type = type;
        this.giftId = giftId;
        this.member = member;
        this.isRead = false;
        this.partnerName = partnerName;
    }

    public void readAlarm() {
        this.isRead = true;
    }
}
