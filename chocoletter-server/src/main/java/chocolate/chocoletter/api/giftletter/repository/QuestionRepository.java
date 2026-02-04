package chocolate.chocoletter.api.giftletter.repository;

import chocolate.chocoletter.api.giftletter.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}
