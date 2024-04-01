package postit.Requests;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class ComentarRequest {
    private String idPublicacion;
    private String idUsuarioPublicador;
    private String idUsuarioComentador;
    private String nombreCuenta;
    private String nombrePersona;
    private String contenido;
}
