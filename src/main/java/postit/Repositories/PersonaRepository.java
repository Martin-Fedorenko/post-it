package postit.Repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import postit.Model.Persona;

import java.util.List;
public interface PersonaRepository extends Neo4jRepository<Persona, Long> {
    Boolean existsByIdUsuario(String idUsuario);
    Persona findByIdUsuario(String idUsuario);
    List<Persona> findAllByNombrePersona(String nombrePersona);
    Persona findByNombrePersona(String nombrePersona);

    @Query("MATCH (p:Persona)-[r:AMIGOS]-(other) WITH r, COUNT(other) AS count WHERE count = 1 RETURN count(r) AS cantidadAmigos")
    int cantidadAmigos();

    @Query("MATCH (n:Persona {idUsuario: $idUsuario1})-[r:AMIGOS]-(m:Persona {idUsuario: $idUsuario2}) DELETE r")
    void eliminarAmistad(@Param("idUsuario1") String idUsuario1, @Param("idUsuario2") String idUsuario2);

}
