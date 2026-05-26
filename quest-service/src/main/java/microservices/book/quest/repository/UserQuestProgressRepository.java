package microservices.book.quest.repository;

import microservices.book.quest.domain.UserQuestProgress;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserQuestProgressRepository extends CrudRepository<UserQuestProgress, Long> {
    List<UserQuestProgress> findByAlias(String alias);
    Optional<UserQuestProgress> findByAliasAndQuestId(String alias, Long questId);
}
