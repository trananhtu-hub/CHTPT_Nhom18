package microservices.book.quest.service;

import microservices.book.quest.domain.UserQuestProgress;
import microservices.book.quest.event.MultiplicationSolvedEvent;

import java.util.List;

public interface QuestService {

    /**
     * Processes multiplication attempts to update quest progress.
     */
    void processAttempt(MultiplicationSolvedEvent event);

    /**
     * Gets user quest progress list.
     */
    List<UserQuestProgress> getQuestsForUser(String alias);

    /**
     * Claims quest reward and awards points to user.
     */
    boolean claimQuestReward(String alias, Long questId);
}
