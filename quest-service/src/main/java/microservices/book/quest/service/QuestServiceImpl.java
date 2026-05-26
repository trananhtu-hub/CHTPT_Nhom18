package microservices.book.quest.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import microservices.book.quest.domain.Quest;
import microservices.book.quest.domain.UserQuestProgress;
import microservices.book.quest.event.MultiplicationSolvedEvent;
import microservices.book.quest.repository.QuestRepository;
import microservices.book.quest.repository.UserQuestProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class QuestServiceImpl implements QuestService {

    private final QuestRepository questRepository;
    private final UserQuestProgressRepository progressRepository;
    private final RestTemplate restTemplate;
    private final String multiplicationHost;
    private final String gamificationHost;

    @Autowired
    public QuestServiceImpl(final QuestRepository questRepository,
            final UserQuestProgressRepository progressRepository,
            final RestTemplate restTemplate,
            @Value("${multiplicationHost:http://localhost:8000/api}") final String multiplicationHost,
            @Value("${gamificationHost:http://localhost:8000/api}") final String gamificationHost) {
        this.questRepository = questRepository;
        this.progressRepository = progressRepository;
        this.restTemplate = restTemplate;
        this.multiplicationHost = multiplicationHost;
        this.gamificationHost = gamificationHost;
    }

    @PostConstruct
    public void initQuests() {
        log.info("Resetting and initializing 30 rotating quests...");
        questRepository.deleteAll();

        // --- Nhóm 1: Cấp độ Dễ (+20 điểm) - Tân Binh Nhẩm Thuật ---
        questRepository.save(new Quest("Khởi đầu nhẹ nhàng", "Giải đúng 3 phép tính phép nhân bất kỳ", 3, "TOTAL_CORRECT", 20));
        questRepository.save(new Quest("Chuỗi khởi động", "Đạt chuỗi 3 câu trả lời đúng liên tiếp", 3, "STREAK", 20));
        questRepository.save(new Quest("Chăm chỉ học tập", "Hoàn thành 5 lượt làm bài (đúng hoặc sai)", 5, "TOTAL_ATTEMPTS", 20));
        questRepository.save(new Quest("Tập trung cao độ", "Giải đúng 4 phép tính phép nhân bất kỳ", 4, "TOTAL_CORRECT", 20));
        questRepository.save(new Quest("Nhịp điệu tự tin", "Đạt chuỗi 4 câu trả lời đúng liên tiếp", 4, "STREAK", 20));
        questRepository.save(new Quest("Kiên trì thử thách", "Hoàn thành 7 lượt làm bài (đúng hoặc sai)", 7, "TOTAL_ATTEMPTS", 20));
        questRepository.save(new Quest("Tăng tốc nhẹ", "Giải đúng 5 phép tính phép nhân bất kỳ", 5, "TOTAL_CORRECT", 20));
        questRepository.save(new Quest("Chuỗi vững vàng", "Đạt chuỗi 5 câu trả lời đúng liên tiếp", 5, "STREAK", 20));
        questRepository.save(new Quest("Rèn luyện bền bỉ", "Hoàn thành 8 lượt làm bài (đúng hoặc sai)", 8, "TOTAL_ATTEMPTS", 20));
        questRepository.save(new Quest("Tốt nghiệp tân binh", "Giải đúng 6 phép tính phép nhân bất kỳ", 6, "TOTAL_CORRECT", 20));

        // --- Nhóm 2: Cấp độ Trung Bình (+50 điểm) - Chiến Thần Tốc Độ ---
        questRepository.save(new Quest("Bản lĩnh trung cấp", "Giải đúng 8 phép tính phép nhân bất kỳ", 8, "TOTAL_CORRECT", 50));
        questRepository.save(new Quest("Chuỗi bứt phá", "Đạt chuỗi 6 câu trả lời đúng liên tiếp", 6, "STREAK", 50));
        questRepository.save(new Quest("Chuyên cần chăm chỉ", "Hoàn thành 12 lượt làm bài (đúng hoặc sai)", 12, "TOTAL_ATTEMPTS", 50));
        questRepository.save(new Quest("Tư duy nhanh nhẹn", "Giải đúng 10 phép tính phép nhân bất kỳ", 10, "TOTAL_CORRECT", 50));
        questRepository.save(new Quest("Chuỗi kiên cường", "Đạt chuỗi 7 câu trả lời đúng liên tiếp", 7, "STREAK", 50));
        questRepository.save(new Quest("Bền bỉ học hỏi", "Hoàn thành 15 lượt làm bài (đúng hoặc sai)", 15, "TOTAL_ATTEMPTS", 50));
        questRepository.save(new Quest("Khẳng định tài năng", "Giải đúng 12 phép tính phép nhân bất kỳ", 12, "TOTAL_CORRECT", 50));
        questRepository.save(new Quest("Chuỗi xuất sắc", "Đạt chuỗi 8 câu trả lời đúng liên tiếp", 8, "STREAK", 50));
        questRepository.save(new Quest("Chuyên cần tối đa", "Hoàn thành 18 lượt làm bài (đúng hoặc sai)", 18, "TOTAL_ATTEMPTS", 50));
        questRepository.save(new Quest("Vượt qua giới hạn", "Giải đúng 14 phép tính phép nhân bất kỳ", 14, "TOTAL_CORRECT", 50));

        // --- Nhóm 3: Cấp độ Khó (+100 điểm) - Huyền Thoại Toán Học ---
        questRepository.save(new Quest("Đỉnh cao thử thách", "Giải đúng 18 phép tính phép nhân bất kỳ", 18, "TOTAL_CORRECT", 100));
        questRepository.save(new Quest("Chuỗi siêu đẳng", "Đạt chuỗi 10 câu trả lời đúng liên tiếp", 10, "STREAK", 100));
        questRepository.save(new Quest("Đại sư kiên nhẫn", "Hoàn thành 25 lượt làm bài (đúng hoặc sai)", 25, "TOTAL_ATTEMPTS", 100));
        questRepository.save(new Quest("Trí tuệ siêu phàm", "Giải đúng 20 phép tính phép nhân bất kỳ", 20, "TOTAL_CORRECT", 100));
        questRepository.save(new Quest("Chuỗi bất bại", "Đạt chuỗi 12 câu trả lời đúng liên tiếp", 12, "STREAK", 100));
        questRepository.save(new Quest("Khát vọng vươn xa", "Hoàn thành 30 lượt làm bài (đúng hoặc sai)", 30, "TOTAL_ATTEMPTS", 100));
        questRepository.save(new Quest("Chinh phục đỉnh cao", "Giải đúng 22 phép tính phép nhân bất kỳ", 22, "TOTAL_CORRECT", 100));
        questRepository.save(new Quest("Chuỗi huyền thoại", "Đạt chuỗi 15 câu trả lời đúng liên tiếp", 15, "STREAK", 100));
        questRepository.save(new Quest("Cố gắng không ngừng", "Hoàn thành 35 lượt làm bài (đúng hoặc sai)", 35, "TOTAL_ATTEMPTS", 100));
        questRepository.save(new Quest("Vua phép nhân", "Giải đúng 25 phép tính phép nhân bất kỳ", 25, "TOTAL_CORRECT", 100));
        log.info("Initialized 30 quests successfully.");
    }

    @Override
    public void processAttempt(final MultiplicationSolvedEvent event) {
        log.info("Processing attempt event: {}", event);

        // 1. Resolve user alias from multiplication service
        String alias = null;
        try {
            String url = multiplicationHost + "/users/" + event.getUserId();
            UserDto userDto = restTemplate.getForObject(url, UserDto.class);
            if (userDto != null) {
                alias = userDto.getAlias();
            }
        } catch (Exception e) {
            log.error("Could not resolve alias for userId: {}", event.getUserId(), e);
        }

        if (alias == null) {
            log.warn("Alias is null, skipping quest progress update");
            return;
        }

        // 2. Fetch active quests for this user
        List<UserQuestProgress> activeProgressList = getQuestsForUser(alias);
        for (UserQuestProgress progress : activeProgressList) {
            Quest quest = questRepository.findById(progress.getQuestId()).orElse(null);
            if (quest == null) {
                continue;
            }

            // Keep userId updated in case it was null
            if (progress.getUserId() == null) {
                progress.setUserId(event.getUserId());
            }

            if (progress.isCompleted()) {
                continue; // Already completed, no need to update
            }

            if ("TOTAL_CORRECT".equals(quest.getType())) {
                if (event.isCorrect()) {
                    progress.setCurrentCount(progress.getCurrentCount() + 1);
                    if (progress.getCurrentCount() >= quest.getTargetCount()) {
                        progress.setCompleted(true);
                    }
                }
            } else if ("STREAK".equals(quest.getType())) {
                if (event.isCorrect()) {
                    progress.setStreak(progress.getStreak() + 1);
                    progress.setCurrentCount(progress.getStreak());
                    if (progress.getStreak() >= quest.getTargetCount()) {
                        progress.setCompleted(true);
                    }
                } else {
                    progress.setStreak(0);
                    progress.setCurrentCount(0);
                }
            } else if ("TOTAL_ATTEMPTS".equals(quest.getType())) {
                progress.setCurrentCount(progress.getCurrentCount() + 1);
                if (progress.getCurrentCount() >= quest.getTargetCount()) {
                    progress.setCompleted(true);
                }
            }

            progressRepository.save(progress);
            log.info("Updated progress for user {}, quest {}: currentCount={}, completed={}",
                    alias, quest.getTitle(), progress.getCurrentCount(), progress.isCompleted());
        }
    }

    private UserQuestProgress getActiveQuestProgressForGroup(final String alias, final List<Quest> groupQuests) {
        if (groupQuests.isEmpty()) {
            return null;
        }

        // Fetch/create progress for all quests in this group
        List<UserQuestProgress> progressList = new ArrayList<>();
        boolean allClaimed = true;

        for (Quest q : groupQuests) {
            UserQuestProgress progress = progressRepository.findByAliasAndQuestId(alias, q.getId())
                    .orElseGet(() -> {
                        UserQuestProgress p = new UserQuestProgress(alias, q.getId());
                        try {
                            String url = multiplicationHost + "/results?alias=" + alias;
                            AttemptDto[] attempts = restTemplate.getForObject(url, AttemptDto[].class);
                            if (attempts != null && attempts.length > 0) {
                                p.setUserId(attempts[0].getUser().getId());
                            }
                        } catch (Exception e) {
                            log.error("Could not resolve userId from stats for alias: {}", alias, e);
                        }
                        return progressRepository.save(p);
                    });
            progressList.add(progress);
            if (!progress.isClaimed()) {
                allClaimed = false;
            }
        }

        // Reset loop if all are claimed
        if (allClaimed) {
            log.info("User {} has claimed all quests in this level group. Looping back!", alias);
            for (UserQuestProgress p : progressList) {
                p.setCompleted(false);
                p.setClaimed(false);
                p.setCurrentCount(0);
                p.setStreak(0);
                progressRepository.save(p);
            }
        }

        // Return first unclaimed
        for (UserQuestProgress p : progressList) {
            if (!p.isClaimed()) {
                return p;
            }
        }

        return progressList.get(0);
    }

    @Override
    public List<UserQuestProgress> getQuestsForUser(final String alias) {
        List<Quest> allQuests = new ArrayList<>();
        questRepository.findAll().forEach(allQuests::add);

        // Sort by ID to ensure order matches creation order
        allQuests.sort((q1, q2) -> q1.getId().compareTo(q2.getId()));

        List<Quest> level20Quests = new ArrayList<>();
        List<Quest> level50Quests = new ArrayList<>();
        List<Quest> level100Quests = new ArrayList<>();

        for (Quest q : allQuests) {
            if (q.getRewardPoints() == 20) {
                level20Quests.add(q);
            } else if (q.getRewardPoints() == 50) {
                level50Quests.add(q);
            } else if (q.getRewardPoints() == 100) {
                level100Quests.add(q);
            }
        }

        List<UserQuestProgress> activeProgressList = new ArrayList<>();
        UserQuestProgress p20 = getActiveQuestProgressForGroup(alias, level20Quests);
        if (p20 != null) {
            activeProgressList.add(p20);
        }
        UserQuestProgress p50 = getActiveQuestProgressForGroup(alias, level50Quests);
        if (p50 != null) {
            activeProgressList.add(p50);
        }
        UserQuestProgress p100 = getActiveQuestProgressForGroup(alias, level100Quests);
        if (p100 != null) {
            activeProgressList.add(p100);
        }

        return activeProgressList;
    }

    @Override
    public boolean claimQuestReward(final String alias, final Long questId) {
        log.info("User {} claiming reward for questId {}", alias, questId);
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("Quest not found: " + questId));

        UserQuestProgress progress = progressRepository.findByAliasAndQuestId(alias, questId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Progress not found for " + alias + " and quest " + questId));

        if (!progress.isCompleted()) {
            log.warn("Quest is not completed yet");
            return false;
        }

        if (progress.isClaimed()) {
            log.warn("Quest reward has already been claimed");
            return false;
        }

        if (progress.getUserId() == null) {
            log.error("UserId is null, cannot award points");
            return false;
        }

        // Call gamification service via API Gateway to award points
        try {
            String url = gamificationHost + "/stats/award";
            AwardPointsDto awardDto = new AwardPointsDto(progress.getUserId(), quest.getRewardPoints());
            restTemplate.postForObject(url, awardDto, Object.class);
            log.info("Points awarded successfully to userId {}", progress.getUserId());
        } catch (Exception e) {
            log.error("Error calling gamification service to award points", e);
            return false;
        }

        progress.setClaimed(true);
        progressRepository.save(progress);
        return true;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class UserDto {
        private Long id;
        private String alias;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class AttemptDto {
        private Long id;
        private UserDto user;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AwardPointsDto {
        private Long userId;
        private int points;
    }
}
