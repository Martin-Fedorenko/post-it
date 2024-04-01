package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import postit.Model.ClaveUsuarioPublicacion;
import postit.Model.Comentario;
import postit.Model.Persona;
import postit.Model.Publicacion;
import postit.Repositories.PersonaRepository;
import postit.Repositories.PublicacionRepository;
import postit.Requests.AmigoRequest;
import postit.Requests.ComentarRequest;
import postit.Requests.PublicarRequest;
import postit.Requests.RegistrarRequest;
import postit.Responses.PerfilResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class MainController {

    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private PublicacionRepository publicacionRepository;

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
    public ResponseEntity<String> registrar(@RequestBody RegistrarRequest registrarRequest) {
        Persona nuevaPersona = new Persona(registrarRequest.getIdUsuario(), "@" + registrarRequest.getNombreCuenta(), registrarRequest.getNombrePersona(), registrarRequest.getDescripcion());
        personaRepository.save(nuevaPersona);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body("Usuario registrado!");
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
    public ResponseEntity<List<Persona>> buscar(@RequestParam("nombrePersona") String nombrePersona) {
        List<Persona> personas = personaRepository.findAllByNombrePersona(nombrePersona);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personas);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/agregarAmigo")
    public ResponseEntity<String> agregarAmigo(@RequestBody AmigoRequest amigoRequest) {
        String mensaje;
        if(personaRepository.sonAmigos(amigoRequest.getIdUsuario(), amigoRequest.getIdAmigo())){
            mensaje = "Ya sos amigo de esa persona!";
        }else if(amigoRequest.getIdUsuario().equals(amigoRequest.getIdAmigo())){
            mensaje = "No podes ser tu propio amigo!";
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
    public ResponseEntity<List<Persona>> amigos(@RequestParam("idUsuario") String idUsuario) {
        List<Persona> personas = personaRepository.amigos(idUsuario);


        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personas);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/sugerir")
    public ResponseEntity<List<Persona>> sugerir(@RequestParam("idUsuario") String idUsuario) {
        List<Persona> personas = personaRepository.sugerirAmigos(idUsuario);


        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(personas);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/publicar")
    public ResponseEntity<String> publicar(@RequestBody PublicarRequest publicarRequest) {
        Persona persona = personaRepository.findByIdUsuario(publicarRequest.getIdUsuario());
        Publicacion nuevaPublicacion = new Publicacion(new ClaveUsuarioPublicacion(persona.getIdUsuario(), UUID.randomUUID()), persona.getNombreCuenta(), persona.getNombrePersona(), publicarRequest.getContenido(), LocalDateTime.now());

        Comentario comentario1 = new Comentario("MO06LUcGzRc3OUWWExk1AtGdeWo2", "ika", persona.getNombrePersona(), "comentarium1", LocalDateTime.now());
        Comentario comentario2 = new Comentario("1s6Jtl2teOdxiU861kJX6jWQqYq1", "ike", persona.getNombrePersona(), "comentarium2", LocalDateTime.now());
        nuevaPublicacion.getComentarios().add(comentario1);
        nuevaPublicacion.getComentarios().add(comentario2);
        publicacionRepository.save(nuevaPublicacion);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body("Publicacion publicada!");
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @GetMapping("/sugerirPublicaciones")
    public ResponseEntity<List<Publicacion>> sugerirPublicaciones(@RequestParam("idUsuario") String idUsuario) {
        List<String> idAmigos= personaRepository.idAmigos(idUsuario);
        System.out.println("List of amigos: " + idAmigos);
        List<Publicacion> publicaciones = publicacionRepository.sugerirPublicaciones(idAmigos);
        //List<Publicacion> publicaciones = new ArrayList<>();
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(publicaciones);
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/comentar")
    public ResponseEntity<String> comentar(@RequestBody ComentarRequest comentarRequest) {
        ClaveUsuarioPublicacion clave = new ClaveUsuarioPublicacion(comentarRequest.getIdUsuarioPublicador(), UUID.fromString(comentarRequest.getIdPublicacion()));
        Optional<Publicacion> publicacionOptional = publicacionRepository.findById(clave);
        String mensaje;
        if(publicacionOptional.isPresent()) {
            Publicacion publicacion = publicacionOptional.get(); // Extract Publicacion from Optional
            Comentario nuevoComentario = new Comentario(comentarRequest);
            publicacion.getComentarios().add(nuevoComentario);
            publicacionRepository.save(publicacion); // Now passing the extracted Publicacion
            mensaje = "Publicación comentada!";
        } else {
            mensaje = "Publicación inexistente";
        }


        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(mensaje);
    }

}
