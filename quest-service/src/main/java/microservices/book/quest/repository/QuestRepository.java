package microservices.book.quest.repository;

import microservices.book.quest.domain.Quest;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface QuestRepository extends CrudRepository<Quest, Long> {
    Optional<Quest> findByType(String type);
}
