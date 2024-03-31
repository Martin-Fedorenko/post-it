package postit.Responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import postit.Model.Persona;

@Getter @Setter @AllArgsConstructor
public class PersonaResponse {
    private String idPersona;

    private String idUsuario;

    private String nombreCuenta;

    private String nombrePersona;

    private String descripcion;

    public PersonaResponse(Persona persona){
        this.idPersona = persona.getIdPersona();
        this.descripcion = persona.getDescripcion();
        this.nombrePersona = persona.getNombrePersona();
        this.nombreCuenta = persona.getNombreCuenta();
        this.idUsuario = persona.getIdUsuario();
    }
}
