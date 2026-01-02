package chocolate.chocoletter.api.alarm.repository;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    @Query("select a from Alarm a where a.member.id = :memberId order by a.createdAt desc")
    List<Alarm> findByAlarms(@Param("memberId") Long memberId);

    @Query("select count(*) from Alarm a where a.member.id = :memberId and a.isRead = :isRead")
    Integer countNewAlarm(@Param("memberId") Long memberId, @Param("isRead") Boolean isRead);

    @Query("select a from Alarm a where a.member.id = :memberId and a.type = :type and a.giftId = :giftId")
    List<Alarm> findAlarmsByType(@Param("memberId") Long memberId, @Param("giftId") Long giftId,
                                 @Param("type") AlarmType type);
}
