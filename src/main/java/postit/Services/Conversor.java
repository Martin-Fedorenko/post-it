package postit.Services;

import org.springframework.stereotype.Service;
import postit.Model.Persona;
import postit.Responses.PersonaResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Conversor {
    public List<PersonaResponse> convertirPersonasAResponsePersonas(List<Persona> personas) {
        return personas.stream()
                .map(PersonaResponse::new)
                .collect(Collectors.toList());
    }
}
