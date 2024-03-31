package postit.Repositories;
import postit.Model.Publicacion;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface PublicacionRepository extends CrudRepository<Publicacion, UUID> {

}