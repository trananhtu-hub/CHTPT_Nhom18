package microservices.book.quest.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@RequiredArgsConstructor
@Getter
@ToString
@EqualsAndHashCode
@Entity
public final class Quest {

    @Id
    @GeneratedValue
    @Column(name = "QUEST_ID")
    private final Long id;

    private final String title;
    private final String description;
    private final int targetCount;
    private final String type; // TOTAL_CORRECT, STREAK, TOTAL_ATTEMPTS
    private final int rewardPoints;

    // Empty constructor for JPA
    protected Quest() {
        this(null, null, null, 0, null, 0);
    }

    public Quest(String title, String description, int targetCount, String type, int rewardPoints) {
        this(null, title, description, targetCount, type, rewardPoints);
    }
}
