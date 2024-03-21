package postit.Responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PerfilResponse {
    private Long idPersona;
    private String nombreCuenta;
    private String nombrePersona;
    private int cantidadAmigos;
    private int cantidadPublicaciones;
    private String descripcion;
}
