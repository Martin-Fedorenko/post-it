package postit.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class AgregarAmigoRequest {
    private String idAmigo;
    private String idUsuario;
}
