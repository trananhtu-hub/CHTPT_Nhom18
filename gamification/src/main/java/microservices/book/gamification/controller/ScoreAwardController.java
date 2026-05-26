package microservices.book.gamification.controller;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import microservices.book.gamification.domain.GameStats;
import microservices.book.gamification.service.GameService;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to handle manual point awarding from other microservices (like quest-service).
 */
@RestController
@RequestMapping("/stats")
class ScoreAwardController {

    private final GameService gameService;

    public ScoreAwardController(final GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/award")
    public GameStats awardPoints(@RequestBody final AwardPointsDto dto) {
        return gameService.awardPointsToUser(dto.getUserId(), dto.getPoints());
    }

    @NoArgsConstructor
    @Getter
    @ToString
    public static final class AwardPointsDto {
        private Long userId;
        private int points;

        public AwardPointsDto(Long userId, int points) {
            this.userId = userId;
            this.points = points;
        }
    }
}
