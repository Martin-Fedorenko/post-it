package postit.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PublicarRequest {
    private String idUsuario;
    private String contenido;
}
