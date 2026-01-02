package chocolate.chocoletter.api.letter.dto.response;

import chocolate.chocoletter.api.letter.domain.Question;
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
