package microservices.book.quest.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@ToString
@EqualsAndHashCode
@JsonIgnoreProperties(ignoreUnknown = true)
public class MultiplicationSolvedEvent implements Serializable {

    private Long multiplicationResultAttemptId;
    private Long userId;
    private boolean correct;

    public MultiplicationSolvedEvent() {
    }

    public MultiplicationSolvedEvent(Long multiplicationResultAttemptId, Long userId, boolean correct) {
        this.multiplicationResultAttemptId = multiplicationResultAttemptId;
        this.userId = userId;
        this.correct = correct;
    }
}
