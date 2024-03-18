package postit.Repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import postit.Model.Persona;

import java.util.List;
public interface PersonaRepository extends Neo4jRepository<Persona, Long> {
    Boolean existsByIdUsuario(String idUsuario);
    Persona findByIdUsuario(String idUsuario);

}
