package postit.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.mapping.UserDefinedType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@UserDefinedType("comentario")
public class Comentario {
    private UUID idComentario;
    private String idUsuario;
    private String nombreCuenta;
    private String nombrePersona;
    private String contenido;
    private LocalDateTime horarioComentario;
}
