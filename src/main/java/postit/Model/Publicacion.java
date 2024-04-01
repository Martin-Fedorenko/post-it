package postit.Model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;

@Table("publicacion")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Publicacion {

    @PrimaryKey
    private ClaveUsuarioPublicacion claveUsuarioPublicacion;

    private String nombreCuenta;
    private String nombrePersona;
    private String contenido;
    private LocalDateTime horarioPublicacion;

    @Column("comentarios")
    @CassandraType(type = CassandraType.Name.LIST, typeArguments = CassandraType.Name.UDT, userTypeName = "comentario")
    private List<Comentario> comentarios;

    public Publicacion(ClaveUsuarioPublicacion claveUsuarioPublicacion, String nombreCuenta, String nombrePersona, String contenido, LocalDateTime horarioPublicacion) {
        this.claveUsuarioPublicacion = claveUsuarioPublicacion;
        this.nombreCuenta = nombreCuenta;
        this.nombrePersona = nombrePersona;
        this.contenido = contenido;
        this.horarioPublicacion = horarioPublicacion;
        this.comentarios = new ArrayList<>();
    }


}