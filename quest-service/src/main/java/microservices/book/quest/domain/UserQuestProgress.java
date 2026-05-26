package microservices.book.quest.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
public final class UserQuestProgress {

    @Id
    @GeneratedValue
    @Column(name = "PROGRESS_ID")
    private Long id;

    private String alias;
    private Long userId;
    private Long questId;
    private int currentCount;
    private int streak;
    private boolean completed;
    private boolean claimed;

    public UserQuestProgress() {
        this.currentCount = 0;
        this.streak = 0;
        this.completed = false;
        this.claimed = false;
    }

    public UserQuestProgress(String alias, Long questId) {
        this();
        this.alias = alias;
        this.questId = questId;
    }
}
