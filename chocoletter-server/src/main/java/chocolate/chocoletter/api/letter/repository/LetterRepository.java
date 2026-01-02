package chocolate.chocoletter.api.letter.repository;

import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LetterRepository extends JpaRepository<Letter, Long> {

    @Query("select l from Letter l where l.gift.id = :giftId")
    Letter findLetterByGiftId(@Param("giftId") Long giftId);

    @Query("select q from Question q where q.id = :questionId")
    Question findQuestion(@Param("questionId") Long questionId);

    @Query("select l.nickname from Letter l where l.gift.id = :giftId")
    String findNickNameByGiftId(@Param("giftId") Long giftId);
}
