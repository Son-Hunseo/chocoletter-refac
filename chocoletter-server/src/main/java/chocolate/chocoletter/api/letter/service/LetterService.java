package chocolate.chocoletter.api.letter.service;

import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.Question;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.repository.LetterRepository;
import jakarta.transaction.Transactional;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterService {
    private final LetterRepository letterRepository;

    public LetterDto findLetter(Long giftId) {
        Letter letter = letterRepository.findLetterByGiftId(giftId);
        return LetterDto.of(letter);
    }

    @Transactional
    public void saveLetter(Letter letter) {
        letterRepository.save(letter);
    }

    public RandomQuestionResponseDto findRandomQuestion(Long questionId) {
        Random random = new Random();
        Long randomId;
        if (questionId == 0) {
            randomId = random.nextLong(1, 41L);
        } else {
            do {
                randomId = random.nextLong(1, 41L);
            } while (randomId.equals(questionId));
        }
        Question question = letterRepository.findQuestion(randomId);
        return RandomQuestionResponseDto.of(question);
    }

    public String findNickNameByGiftId(Long giftId) {
        return letterRepository.findNickNameByGiftId(giftId);
    }

    @Transactional
    public void modifyLetter(Long giftId, ModifyLetterRequestDto requestDto) {
        Letter letter = letterRepository.findLetterByGiftId(giftId);
        letter.modify(requestDto.nickName(), requestDto.question(), requestDto.answer(), requestDto.content());
    }
}
