package postit.Requests;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrarRequest {
    private String idUsuario;
    private String nombreCuenta;
    private String nombrePersona;
    private String descripcion;
}
