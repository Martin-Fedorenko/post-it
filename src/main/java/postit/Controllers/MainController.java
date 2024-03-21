package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import postit.Model.Persona;
import postit.Repositories.PersonaRepository;
import postit.Requests.BuscarRequest;
import postit.Requests.PersonaRequest;
import postit.Requests.RegisterRequest;
import postit.Responses.PerfilResponse;
import postit.Responses.PersonasResponse;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    private PersonaRepository personaRepository;

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/tieneQueRegistrar")
    public ResponseEntity<Boolean> tieneQueRegistrar(@RequestBody PersonaRequest personaRequest) {
        Boolean tieneQueRegistrarse = !personaRepository.existsByIdUsuario(personaRequest.getIdUsuario());
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(tieneQueRegistrarse);
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody RegisterRequest registerRequest) {
        Persona nuevaPersona = new Persona(registerRequest.getIdUsuario(), "@" + registerRequest.getNombreCuenta(), registerRequest.getNombrePersona(), registerRequest.getDescripcion());
        personaRepository.save(nuevaPersona);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body("Todo bien!");
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> perfil(@RequestParam("idUsuario") String idUsuario) {
        Persona persona = personaRepository.findByIdUsuario(idUsuario);
        PerfilResponse perfilResponse = new PerfilResponse(persona.getIdPersona(),persona.getNombreCuenta(),persona.getNombrePersona(), 259, 399, persona.getDescripcion());
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(perfilResponse);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/buscar") //aca en vez de personas tienen que ser personas response
    public ResponseEntity<PersonasResponse> buscar(@RequestParam("nombrePersona") String nombrePersona) {
        List<Persona> personas = personaRepository.findAllByNombrePersona(nombrePersona);
        PersonasResponse personasResponse = new PersonasResponse(personas);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personasResponse);
    }

}
