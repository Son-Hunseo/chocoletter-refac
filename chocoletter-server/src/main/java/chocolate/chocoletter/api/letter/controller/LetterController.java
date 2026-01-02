package chocolate.chocoletter.api.letter.controller;

import chocolate.chocoletter.api.letter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.letter.service.LetterService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/letter")
@RequiredArgsConstructor
public class LetterController implements LetterSwagger {
    private final LetterService letterService;

    @GetMapping("/question")
    public ResponseEntity<?> findRandomQuestion(@RequestParam @Min(0) @Max(40) Long previousQuestionId) {
        RandomQuestionResponseDto randomQuestion = letterService.findRandomQuestion(previousQuestionId);
        return ResponseEntity.ok(randomQuestion);
    }
}
