package microservices.book.gamification.event;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Event received when a multiplication has been solved in the system.
 * Provides some context information about the multiplication.
 */
@Getter
@ToString
@EqualsAndHashCode
class MultiplicationSolvedEvent implements Serializable {

    private Long multiplicationResultAttemptId;
    private Long userId;
    private boolean correct;

    // Empty constructor for deserialization
    MultiplicationSolvedEvent() {
    }

    public MultiplicationSolvedEvent(Long multiplicationResultAttemptId, Long userId, boolean correct) {
        this.multiplicationResultAttemptId = multiplicationResultAttemptId;
        this.userId = userId;
        this.correct = correct;
    }

}
