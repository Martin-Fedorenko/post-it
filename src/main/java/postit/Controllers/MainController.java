package postit.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
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

    @GetMapping("/profile")
    public ModelAndView profile(@RequestParam("nombrePersona") String nombrePersona){
        System.out.println("nombre original: " + nombrePersona);
        Persona persona = personaRepository.findByNombrePersona(nombrePersona);

        System.out.println("nombre principal: " +persona.getNombrePersona());
        Persona nuevaPersona = new Persona("1234556789", "@Pepe", "pepe");
        personaRepository.save(nuevaPersona);
        persona.agregarAmigo(nuevaPersona);
        personaRepository.save(persona);

        ModelAndView modelAndView = new ModelAndView("profile");
        modelAndView.addObject("persona", persona);
        modelAndView.addObject("cantidadAmigos", personaRepository.cantidadAmigos());

        return modelAndView;
    }

}
