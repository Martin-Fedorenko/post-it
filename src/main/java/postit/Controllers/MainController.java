package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import postit.Model.Persona;
import postit.Repositories.PersonaRepository;
import postit.Requests.AmigoRequest;
import postit.Requests.RegisterRequest;
import postit.Responses.PerfilResponse;
import postit.Responses.PersonasResponse;
import postit.Services.Conversor;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private Conversor conversor;

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/tieneQueRegistrar")
    public ResponseEntity<Boolean> tieneQueRegistrar(@RequestParam("idUsuario") String idUsuario) {
        Boolean tieneQueRegistrarse = !personaRepository.existsByIdUsuario(idUsuario);
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
        PerfilResponse perfilResponse = new PerfilResponse(persona, personaRepository.cantidadAmigos(idUsuario), 399);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(perfilResponse);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/buscar") //aca en vez de personas tienen que ser personas response
    public ResponseEntity<PersonasResponse> buscar(@RequestParam("nombrePersona") String nombrePersona) {
        List<Persona> personas = personaRepository.findAllByNombrePersona(nombrePersona);
        PersonasResponse personasResponse = new PersonasResponse(conversor.convertirPersonasAResponsePersonas(personas));

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personasResponse);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/agregarAmigo")
    public ResponseEntity<String> agregarAmigo(@RequestBody AmigoRequest amigoRequest) {
        String mensaje;
        if(personaRepository.sonAmigos(amigoRequest.getIdUsuario(), amigoRequest.getIdAmigo())){
            mensaje = "Ya sos amigo de esa persona";
        }else{
            personaRepository.crearAmistad(amigoRequest.getIdUsuario(), amigoRequest.getIdAmigo());
            mensaje = "Amigo agregado!";
        }


        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(mensaje);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/eliminarAmigo")
    public ResponseEntity<String> eliminarAmigo(@RequestBody AmigoRequest amigoRequest) {
        Persona persona = personaRepository.findByIdUsuario(amigoRequest.getIdUsuario());
        Persona amigo = personaRepository.findByIdUsuario(amigoRequest.getIdAmigo());

        personaRepository.eliminarAmistad(persona.getIdUsuario(), amigo.getIdUsuario());

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body("Amigo eliminado!");
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/amigos")
    public ResponseEntity<PersonasResponse> amigos(@RequestParam("idUsuario") String idUsuario) {
        List<Persona> personas = personaRepository.amigos(idUsuario);

        PersonasResponse personasResponse = new PersonasResponse(conversor.convertirPersonasAResponsePersonas(personas));

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personasResponse);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/sugerir")
    public ResponseEntity<PersonasResponse> sugerir(@RequestParam("idUsuario") String idUsuario) {
        List<Persona> personas = personaRepository.sugerirAmigos(idUsuario);

        PersonasResponse personasResponse = new PersonasResponse(conversor.convertirPersonasAResponsePersonas(personas));

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personasResponse);
    }

}
