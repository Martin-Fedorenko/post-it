package postit.Responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import postit.Model.Persona;

@Getter
@Setter
public class PerfilResponse {
    private Long idPersona;
    private String nombreCuenta;
    private String nombrePersona;
    private String descripcion;
    private int cantidadAmigos;
    private int cantidadPublicaciones;

    public PerfilResponse(Persona persona, int cantidadAmigos, int cantidadPublicaciones){
        this.idPersona = persona.getIdPersona();
        this.descripcion = persona.getDescripcion();
        this.nombrePersona = persona.getNombrePersona();
        this.nombreCuenta = persona.getNombreCuenta();
        this.cantidadAmigos = cantidadAmigos;
        this.cantidadPublicaciones = cantidadPublicaciones;
    }

}
