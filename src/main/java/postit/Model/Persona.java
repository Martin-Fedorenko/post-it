package postit.Model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


@Node
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Persona {

    @Id @GeneratedValue
    private Long idPersona;

    private String idUsuario;

    private String nombreCuenta;

    private String nombrePersona;

    @Relationship(type = "AMIGOS")
    public Set<Persona> amigos;

    public void agregarAmigo(Persona persona) {
        if (amigos == null) {
            amigos = new HashSet<>();
        }
        amigos.add(persona);
    }

    public Persona(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Persona(String idUsuario, String nombreCuenta, String nombrePersona) {
        this.idUsuario = idUsuario;
        this.nombreCuenta = nombreCuenta;
        this.nombrePersona = nombrePersona;
    }
}