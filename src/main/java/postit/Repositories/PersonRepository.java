package postit.Repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;
import postit.Model.Person;

import java.util.List;
public interface PersonRepository extends Neo4jRepository<Person, Long> {

    Person findByName(String name);
    List<Person> findByTeammatesName(String name);
}
