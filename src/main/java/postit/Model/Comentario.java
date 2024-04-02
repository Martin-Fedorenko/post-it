package postit.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.mapping.UserDefinedType;
import postit.Requests.ComentarRequest;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@UserDefinedType("comentario")
public class Comentario {
    private String idUsuarioComentador;
    private String nombreCuenta;
    private String nombrePersona;
    private String contenido;
    private LocalDateTime horarioComentario;

    public Comentario(ComentarRequest comentarRequest, String nombreCuenta, String nombrePersona) {
        this.idUsuarioComentador = comentarRequest.getIdUsuarioComentador();
        this.nombreCuenta = nombreCuenta;
        this.nombrePersona = nombrePersona;
        this.contenido = comentarRequest.getContenido();
        this.horarioComentario = LocalDateTime.now();
    }
}
