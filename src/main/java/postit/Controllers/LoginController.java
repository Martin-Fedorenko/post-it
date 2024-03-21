package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import postit.Model.Persona;
import postit.Repositories.PersonaRepository;
import postit.Requests.LoginRequest;
import postit.Requests.RegisterRequest;

@RestController
public class LoginController {

    @Autowired
    private PersonaRepository personaRepository;

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/tieneQueRegistrar")
    public ResponseEntity<Boolean> tieneQueRegistrar(@RequestBody LoginRequest loginRequest) {
        Boolean tieneQueRegistrarse = !personaRepository.existsByIdUsuario(loginRequest.getIdUsuario());
        System.out.println("ACA: " + tieneQueRegistrarse);
        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body(tieneQueRegistrarse);
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody RegisterRequest registerRequest) {
        System.out.println("ACA TAMBIEN: " + registerRequest.getIdUsuario() + " " + registerRequest.getNombreCuenta());
        Persona nuevaPersona = new Persona(registerRequest.getIdUsuario(), registerRequest.getNombreCuenta(), registerRequest.getNombrePersona());
        personaRepository.save(nuevaPersona);

        return ResponseEntity
                .status(HttpStatus.OK)
                .header("Content-Type", "application/json")
                .body("Todo bien!");
    }
}
