package postit.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import java.io.Serializable;
import java.util.UUID;

@PrimaryKeyClass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaveUsuarioPublicacion implements Serializable {
    @PrimaryKeyColumn(name = "idusuariopublicador", ordinal = 0, type = PrimaryKeyType.PARTITIONED)
    private String idUsuarioPublicador;

    @PrimaryKeyColumn(name = "idpublicacion", ordinal = 1, type = PrimaryKeyType.CLUSTERED)
    private UUID idPublicacion;
}
