package postit.Repositories;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import postit.Model.Persona;

import java.util.List;

public interface PersonaRepository extends Neo4jRepository<Persona, String> {
    Boolean existsByIdUsuario(String idUsuario);

    Persona findByIdUsuario(String idUsuario);

    List<Persona> findAllByNombrePersona(String nombrePersona);

    @Query("MATCH (n1:Persona {idUsuario: $idUsuario})-[r1:AMIGOS]-(n2:Persona) RETURN n2")
    List<Persona> amigos(@Param("idUsuario") String idUsuario);

    @Query("MATCH (n1:Persona {idUsuario: $idUsuario1}) RETURN EXISTS {(n1)-[:AMIGOS]-(n2:Persona {idUsuario: $idUsuario2})}")
    Boolean sonAmigos(@Param("idUsuario1") String idUsuario1, @Param("idUsuario2") String idUsuario2);

    @Query("MATCH (n:Persona {idUsuario: $idUsuario})-[r]->() RETURN count(r) AS cantidadAmigos")
    int cantidadAmigos(@Param("idUsuario") String idUsuario);

    @Query("MATCH (n1:Persona {idUsuario: $idUsuario1})-[r1:AMIGOS]-(n2:Persona {idUsuario: $idUsuario2}) DELETE r1")
    void eliminarAmistad(@Param("idUsuario1") String idUsuario1, @Param("idUsuario2") String idUsuario2);

    @Query("MATCH (n1:Persona {idUsuario: $idUsuario})-[:AMIGOS]-(n2:Persona)-[:AMIGOS]-(n3:Persona) WHERE n3.idUsuario <> $idUsuario AND NOT (n1)-[:AMIGOS]->(n3) RETURN n3")
    List<Persona> sugerirAmigos(@Param("idUsuario") String idUsuario);

    @Query("MATCH (n1:Persona {idUsuario: $idUsuario1}), (n2:Persona {idUsuario: $idUsuario2}) CREATE (n1)-[:AMIGOS]->(n2)")
    void crearAmistad(@Param("idUsuario1") String idUsuario1, @Param("idUsuario2") String idUsuario2);
}
