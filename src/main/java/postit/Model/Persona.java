package postit.Model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.*;


@Node
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Persona {

    @Id @GeneratedValue
    private String idPersona;

    private String idUsuario;

    private String nombreCuenta;

    private String nombrePersona;

    private String descripcion;

    public Persona(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Persona(String idUsuario, String nombreCuenta, String nombrePersona, String descripcion) {
        this.idUsuario = idUsuario;
        this.nombreCuenta = nombreCuenta;
        this.nombrePersona = nombrePersona;
        this.descripcion = descripcion;
    }
}
