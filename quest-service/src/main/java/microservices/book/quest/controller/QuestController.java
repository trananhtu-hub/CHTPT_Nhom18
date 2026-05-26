package microservices.book.quest.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import microservices.book.quest.domain.Quest;
import microservices.book.quest.domain.UserQuestProgress;
import microservices.book.quest.repository.QuestRepository;
import microservices.book.quest.service.QuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/quests")
public class QuestController {

    private final QuestService questService;
    private final QuestRepository questRepository;

    public QuestController(final QuestService questService,
            final QuestRepository questRepository) {
        this.questService = questService;
        this.questRepository = questRepository;
    }

    @GetMapping
    public ResponseEntity<List<QuestProgressDto>> getQuests(@RequestParam("alias") final String alias) {
        List<UserQuestProgress> progressList = questService.getQuestsForUser(alias);
        List<QuestProgressDto> dtoList = new ArrayList<>();

        for (UserQuestProgress p : progressList) {
            Quest q = questRepository.findById(p.getQuestId()).orElse(null);
            if (q != null) {
                dtoList.add(new QuestProgressDto(
                        q.getId(),
                        q.getTitle(),
                        q.getDescription(),
                        q.getTargetCount(),
                        q.getType(),
                        q.getRewardPoints(),
                        p.getCurrentCount(),
                        p.isCompleted(),
                        p.isClaimed()));
            }
        }
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/claim")
    public ResponseEntity<ClaimResultDto> claimReward(@RequestParam("alias") final String alias,
            @RequestParam("questId") final Long questId) {
        boolean success = questService.claimQuestReward(alias, questId);
        return ResponseEntity.ok(new ClaimResultDto(success));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static final class QuestProgressDto {
        private Long questId;
        private String title;
        private String description;
        private int targetCount;
        private String type;
        private int rewardPoints;
        private int currentCount;
        private boolean completed;
        private boolean claimed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static final class ClaimResultDto {
        private boolean success;
    }
}
