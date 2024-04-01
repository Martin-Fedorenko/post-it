package postit.Repositories;
import org.springframework.data.cassandra.repository.Query;
import postit.Model.ClaveUsuarioPublicacion;
import postit.Model.Publicacion;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PublicacionRepository extends CrudRepository<Publicacion, ClaveUsuarioPublicacion> {
    @Query("SELECT * FROM publicacion WHERE idusuariopublicador IN :idAmigos ALLOW FILTERING")
    List<Publicacion> sugerirPublicaciones(List<String> idAmigos);

}