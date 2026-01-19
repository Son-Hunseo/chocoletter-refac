package chocolate.chocoletter.api.letter.service;

import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.Question;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.repository.LetterRepository;
import chocolate.chocoletter.common.util.LetterEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterService {
    private final LetterRepository letterRepository;
    private final LetterEncryptionUtil letterEncryptionUtil;

    public LetterDto findLetter(Long giftId) {
        Letter letter = letterRepository.findLetterByGiftId(giftId);
        // Decrypt content and answer before returning
        String decryptedContent = letterEncryptionUtil.decrypt(letter.getContent());
        String decryptedAnswer = letterEncryptionUtil.decrypt(letter.getAnswer());
        return LetterDto.ofDecrypted(letter, decryptedContent, decryptedAnswer);
    }

    @Transactional
    public void saveLetter(Letter letter) {
        // Encrypt content and answer before saving
        String encryptedContent = letterEncryptionUtil.encrypt(letter.getContent());
        String encryptedAnswer = letterEncryptionUtil.encrypt(letter.getAnswer());
        letter.modify(letter.getNickname(), letter.getQuestion(), encryptedAnswer, encryptedContent);
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
        // Encrypt content and answer before saving
        String encryptedContent = letterEncryptionUtil.encrypt(requestDto.content());
        String encryptedAnswer = letterEncryptionUtil.encrypt(requestDto.answer());
        letter.modify(requestDto.nickName(), requestDto.question(), encryptedAnswer, encryptedContent);
    }
}
