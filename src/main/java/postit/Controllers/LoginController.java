package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import postit.Model.Persona;
import postit.Repositories.PersonaRepository;
import postit.Requests.LoginRequest;
import postit.Requests.RegisterRequest;

@Controller
public class LoginController {

    @Autowired
    private PersonaRepository personaRepository;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {return "register";}

    @GetMapping("/configuration")
    public String configuration() {return "configuration";}

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String idUsuario = loginRequest.getIdUsuario();
        if(!personaRepository.existsByIdUsuario(idUsuario)){
            Persona nuevaPersona = new Persona(idUsuario);
            personaRepository.save(nuevaPersona);
        }
        return ResponseEntity.ok("/home");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest loginRequest) {
        String idUsuario = loginRequest.getIdUsuario();
        if(!personaRepository.existsByIdUsuario(idUsuario)){
            Persona nuevaPersona = new Persona(idUsuario);
            personaRepository.save(nuevaPersona);
        }
        return ResponseEntity.ok("/configuration");
    }

    @PostMapping("/configuration")
    public String configuration(@ModelAttribute RegisterRequest registerRequest) {
        String idUsuario = registerRequest.getIdUsuario();
        String nombrePersona = registerRequest.getNombrePersona();
        String nombreCuenta = "@" + registerRequest.getNombreCuenta();

        System.out.println(idUsuario + " " + nombrePersona + " " + nombreCuenta);

        Persona persona = personaRepository.findByIdUsuario(idUsuario);
        persona.setNombrePersona(nombrePersona);
        persona.setNombreCuenta(nombreCuenta);

        personaRepository.save(persona);

        return "redirect:/home";
    }

}
