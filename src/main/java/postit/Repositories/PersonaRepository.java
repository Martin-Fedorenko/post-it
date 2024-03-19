package postit.Repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import postit.Model.Persona;

import java.util.List;
public interface PersonaRepository extends Neo4jRepository<Persona, Long> {
    Boolean existsByIdUsuario(String idUsuario);
    Persona findByIdUsuario(String idUsuario);
    Persona findByNombrePersona(String nombrePersona);

    @Query("MATCH (p:Persona)-[r:AMIGOS]-(other) WITH r, COUNT(other) AS count WHERE count = 1 RETURN count(r) AS cantidadAmigos")
    int cantidadAmigos();

}
