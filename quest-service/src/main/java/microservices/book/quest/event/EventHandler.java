package microservices.book.quest.event;

import lombok.extern.slf4j.Slf4j;
import microservices.book.quest.service.QuestService;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Listens to RabbitMQ queue for MultiplicationSolvedEvents to update quest progress.
 */
@Slf4j
@Component
public class EventHandler {

    private final QuestService questService;

    public EventHandler(final QuestService questService) {
        this.questService = questService;
    }

    @RabbitListener(queues = "${multiplication.queue}")
    void handleMultiplicationSolved(final MultiplicationSolvedEvent event) {
        log.info("Multiplication Solved Event received in quest-service: {}", event.getMultiplicationResultAttemptId());
        try {
            questService.processAttempt(event);
        } catch (final Exception e) {
            log.error("Error when trying to process MultiplicationSolvedEvent in quest-service", e);
            throw new AmqpRejectAndDontRequeueException(e);
        }
    }
}
