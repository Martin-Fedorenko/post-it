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
public class MainController {

    @Autowired
    private PersonaRepository personaRepository;


    @GetMapping("/home")
    public String home() {return "home";}



}
