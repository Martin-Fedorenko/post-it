package postit.Repositories;
import org.springframework.data.cassandra.repository.Query;
import postit.Model.ClaveUsuarioPublicacion;
import postit.Model.Publicacion;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PublicacionRepository extends CrudRepository<Publicacion, ClaveUsuarioPublicacion> {
    @Query("SELECT * FROM publicacion WHERE idusuariopublicador IN :idAmigos")
    List<Publicacion> sugerirPublicaciones(List<String> idAmigos);

    @Query("SELECT COUNT(*) FROM publicacion WHERE idusuariopublicador = :idUsuario")
    int cantidadPublicaciones(@Param("idUsuario") String idUsuario);

}