package chocolate.chocoletter.api.giftletter.dto.response;

import chocolate.chocoletter.api.giftletter.domain.Question;
import lombok.Builder;

@Builder
public record RandomQuestionResponseDto(Long id, String question) {
    public static RandomQuestionResponseDto of(Question question) {
        return RandomQuestionResponseDto.builder()
                .id(question.getId())
                .question(question.getContent())
                .build();
    }
}
