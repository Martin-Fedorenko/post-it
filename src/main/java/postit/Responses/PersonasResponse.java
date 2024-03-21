package postit.Responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import postit.Model.Persona;

import java.util.List;

@Getter @Setter @AllArgsConstructor
public class PersonasResponse {
    private List<Persona> personas;
}
