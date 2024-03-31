import { signInWithEmailAndPassword,createUserWithEmailAndPassword,GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { auth } from "./firebase.js";



window.sessionStorage.clear();

const googleButton = document.querySelector("#google-login");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const configForm = document.querySelector("#configuration-form");
const buscarForm = document.querySelector("#buscar-form");

const filaLogin = document.querySelector(".fila-login");
const filaRegister = document.querySelector(".fila-register");
const filaConfig = document.querySelector(".fila-config");
const filaHome = document.querySelector(".fila-home");
const filaIzq = document.querySelector(".fila-izquierda");
const filaDer = document.querySelector(".fila-derecha");

const divPerfil = document.querySelector("#perfil");
const divAmigos = document.querySelector("#amigos");
const divResultados = document.querySelector("#resultados");
const divSugerencias = document.querySelector("#sugerencias");
const divPublicaciones = document.querySelector("#publicaciones");

const navRegistrarse = document.querySelector("#nav-link-registrarse");
const navLoguearse = document.querySelector("#nav-link-loguearse");
const navLogout = document.querySelector("#logout");

const listaResultados = document.querySelector("#lista-resultados");
const listaAmigos = document.querySelector("#lista-amigos");
const listaSugerencias = document.querySelector("#lista-sugerencias");

document.addEventListener("DOMContentLoaded", function() {
    volverAlLogin();
});

function cambiarVisualizacionElementos(elementos, estilo) {
    elementos.forEach(elemento => {
        elemento.style.display = estilo;
    });
}

function volverAlLogin() {
    cambiarVisualizacionElementos(
        [filaRegister, filaConfig, filaHome, filaIzq, filaDer],
        "none"
    );
    cambiarVisualizacionElementos(
        [navLogout, navLoguearse, navRegistrarse],
        "block"
    );
    filaLogin.style.display = "block";
}

async function desbloquearHome() {
    try {
        cargarPerfil();
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        const nuevosAmigos = await amigos(idUsuario);
        cargarAmigos(nuevosAmigos);
        visibilidadLista(listaAmigos, divAmigos);

        const sugerencias = await sugerir(idUsuario);
        cargarSugeridos(sugerencias);
        visibilidadLista(listaSugerencias, divSugerencias);

        buscarForm.querySelector("#input-buscar").value = '';
        cambiarVisualizacionElementos(
            [navLoguearse, navRegistrarse],
            "none"
        );
        cambiarVisualizacionElementos(
            [navLogout, filaIzq, filaHome, filaDer],
            "block"
        );
    } catch (error) {
        console.error(error);
    }
}

    // Seleccionamos todos los formularios dentro de la lista de amigos


// Agregamos un event listener a cada formulario


const agregarAmigoFormEventListener = async (e, form) => {
    e.preventDefault(); // Evita el comportamiento de envío del formulario por defecto
    try {
        const idAmigo = form.querySelector('input[type="hidden"]').value;
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        console.log(idAmigo + " " + idUsuario);
        const amigoAgregado = await agregarAmigo({"idAmigo": idAmigo, "idUsuario": idUsuario});


            const listItem = form.closest('li');
            if (listItem) {
                listItem.remove();
            }
            const nuevosAmigos = await amigos(idUsuario);
            cargarAmigos(nuevosAmigos);

            const sugerencias = await sugerir(idUsuario);
                    cargarSugeridos(sugerencias);

                    cargarPerfil();



            console.log("agregue amigos");

        visibilidadLista(listaResultados, divResultados);
        visibilidadLista(listaAmigos, divAmigos);
        visibilidadLista(listaSugerencias, divSugerencias);

    } catch(error) {
        console.log(error);
    }
};

const eliminarAmigoFormEventListener = async (e, form) => {
    e.preventDefault();
    try {
        const idAmigo = form.querySelector('input[type="hidden"]').value;
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        console.log(idAmigo + " " + idUsuario);
        const amigoAgregado = await eliminarAmigo({"idAmigo": idAmigo, "idUsuario": idUsuario});


            const listItem = form.closest('li');
            if (listItem) {
                listItem.remove();
            }
            const nuevosAmigos = await amigos(idUsuario);
            cargarAmigos(nuevosAmigos);

            const sugerencias = await sugerir(idUsuario);
                    cargarSugeridos(sugerencias);

                    visibilidadLista(listaSugerencias, divSugerencias);

                    cargarPerfil();

            console.log("elimine amigos");

        visibilidadLista(listaResultados, divResultados);
        visibilidadLista(listaAmigos, divAmigos);

    } catch(error) {
        console.log(error);
    }
};

async function eliminarAmigo(amigoInfo) {
    try {
        const url = new URL('http://localhost:8080/eliminarAmigo');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(amigoInfo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        return true;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};





function cargarAmigos(personas){
    listaAmigos.innerHTML = '';

    for (var persona of personas) {
        console.log(persona);

        var elementoResultado = `<li class="list-group-item">
                                    <form class="d-flex justify-content-between align-items-center eliminar-amigo-form">
                                    <div>
                                        <div>${persona.nombrePersona}</div>
                                        <div class="text-muted">${persona.nombrePersona}</div>
                                        <input type="hidden" name="id-amigo" value=${persona.idUsuario}>
                                    </div>
                                    <div class="iconos">
                                        <button class="btn btn-link boton-icono-secondary" type="submit">
                                            <i class="fa fa-1 fa-circle-xmark eliminarAmigo"></i>
                                        </button>
                                    </div>
                                    </form>
                                </li> `;

        listaAmigos.innerHTML += elementoResultado;

        const eliminarAmigoForms = document.querySelectorAll('.eliminar-amigo-form');

                        // Add event listener to each form
                        eliminarAmigoForms.forEach(form => {
                                form.addEventListener("submit", (e) => eliminarAmigoFormEventListener(e, form));
                            });
    }
};

async function agregarAmigo(amigoInfo) {
    try {
        const url = new URL('http://localhost:8080/agregarAmigo');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(amigoInfo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        return true;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};


buscarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {

        let nombreBuscado = buscarForm.querySelector("#input-buscar").value;
        console.log(nombreBuscado);
        const personas = await buscar(nombreBuscado);
        buscarForm.querySelector("#input-buscar").value = '';
        cargarBuscados(personas);
        visibilidadLista(listaResultados, divResultados);
    } catch(error){
        console.log(error);
    }
});

listaResultados.addEventListener("click", function(event) {
    if (event.target.classList.contains("quitarPersona")) {
        const liPadre = event.target.closest("li");
        console.log(liPadre);
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaResultados, divResultados);
});

listaResultados.addEventListener("click", function(event) {
    if (event.target.classList.contains("agregarPersona")) {
        const liPadre = event.target.closest("li");
        console.log(liPadre);
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaResultados, divResultados);
});

listaSugerencias.addEventListener("click", function(event) {
    if (event.target.classList.contains("quitarPersona")) {
        const liPadre = event.target.closest("li");
        console.log(liPadre);
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaResultados, divResultados);
});

listaSugerencias.addEventListener("click", function(event) {
    if (event.target.classList.contains("agregarPersona")) {
        const liPadre = event.target.closest("li");
        console.log(liPadre);
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaSugerencias, divSugerencias);
});

function cargarBuscados(personas){
     listaResultados.innerHTML = '';
    for (var persona of personas) {
        console.log(persona);

        var elementoResultado = `<li class="list-group-item">
                                    <form class="d-flex justify-content-between align-items-center agregar-amigo-form">
                                    <div>
                                        <div>${persona.nombrePersona}</div>
                                        <div class="text-muted">${persona.nombrePersona}</div>
                                        <input type="hidden" name="id-amigo" value=${persona.idUsuario}>
                                    </div>
                                    <div class="iconos">
                                        <button class="btn btn-link boton-icono-success" type="submit">
                                            <i class="fa fa-1 fa-check-circle agregarAmigo"></i>
                                        </button>
                                        <button class="btn btn-link boton-icono-secondary" type="button">
                                            <i class="fa fa-1 fa-circle-xmark quitarPersona"></i>
                                        </button>
                                    </div>
                                    </form>
                                </li> `;

        listaResultados.innerHTML += elementoResultado;

    }
    const agregarAmigoForms = document.querySelectorAll('.agregar-amigo-form');

                // Add event listener to each form
                agregarAmigoForms.forEach(form => {
                        form.addEventListener("submit", (e) => agregarAmigoFormEventListener(e, form));
                    });
};

function cargarSugeridos(personas){
     listaSugerencias.innerHTML = '';
    for (var persona of personas) {
        console.log(persona);

        var elementoResultado = `<li class="list-group-item">
                                    <form class="d-flex justify-content-between align-items-center agregar-amigo-form">
                                    <div>
                                        <div>${persona.nombrePersona}</div>
                                        <div class="text-muted">${persona.nombrePersona}</div>
                                        <input type="hidden" name="id-amigo" value=${persona.idUsuario}>
                                    </div>
                                    <div class="iconos">
                                        <button class="btn btn-link boton-icono-success" type="submit">
                                            <i class="fa fa-1 fa-check-circle agregarAmigo"></i>
                                        </button>
                                        <button class="btn btn-link boton-icono-secondary" type="button">
                                            <i class="fa fa-1 fa-circle-xmark quitarPersona"></i>
                                        </button>
                                    </div>
                                    </form>
                                </li> `;

        listaSugerencias.innerHTML += elementoResultado;

    }
    const agregarAmigoForms = document.querySelectorAll('.agregar-amigo-form');

                // Add event listener to each form
                agregarAmigoForms.forEach(form => {
                        form.addEventListener("submit", (e) => agregarAmigoFormEventListener(e, form));
                    });
};

async function buscar(nombreBuscado) {
    try {
        const url = new URL('http://localhost:8080/buscar');
        url.searchParams.append('nombrePersona', nombreBuscado);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.personas);
        return data.personas;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function perfil(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/perfil');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function amigos(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/amigos');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.personas);
        return data.personas;

    } catch (error) {
        console.error('Error:', error);
    }
}

async function sugerir(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/sugerir');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.personas);
        return data.personas;

    } catch (error) {
        console.error('Error:', error);
    }
}




function visibilidadLista(listElement, containerElement) {
    if (!listElement.querySelector('li')) {
        containerElement.style.display = "none";
    } else {
        containerElement.style.display = "block";
    }
}



async function cargarPerfil(){
    const idUsuario = window.sessionStorage.getItem('idUsuario');
    const persona = await perfil(idUsuario);

    for (const clave in persona) {
        console.log(clave);
        const elemento = document.getElementById(clave + "Perfil");
        if (elemento) {
            console.log(persona[clave]);
            elemento.textContent = persona[clave];
        }
    }
}


navRegistrarse.addEventListener("click", function() {
    filaRegister.style.display = "block";
    filaLogin.style.display = "none";
});

navLoguearse.addEventListener("click", function() {
    filaRegister.style.display = "none";
    filaLogin.style.display = "block";
});

  googleButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {

      console.log("google button clicked");
      const userCredentials = await signInWithPopup(auth, provider)
      console.log(userCredentials);

      window.sessionStorage.clear();

      window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);
      const idUsuario = window.sessionStorage.getItem('idUsuario');

      if (await tieneQueRegistrar(idUsuario)){
        filaLogin.style.display = 'none';
        filaConfig.style.display = 'block';
      }else{
        filaLogin.style.display = 'none';
        desbloquearHome();
      }
      console.log("Se paso por google");
    } catch (error) {
      console.log(error);
    }
  });



  configForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      let registerInfo = {
        idUsuario: null,
        nombreCuenta: null,
        nombrePersona: null
      };

      registerInfo.idUsuario = window.sessionStorage.getItem('idUsuario');
      registerInfo.nombreCuenta = configForm.querySelector('input[name="nombreCuenta"]').value;
      registerInfo.nombrePersona = configForm.querySelector('input[name="nombrePersona"]').value;
      registerInfo.descripcion = configForm.querySelector('input[name="descripcion"]').value;
      configForm.reset();
      console.log(registerInfo);
      if(await registrar(registerInfo)){
        filaConfig.style.display = 'none';
        desbloquearHome();
      }
    } catch (error) {
      console.log(error);
    }
  });


// Manejador de eventos para el formulario de inicio de sesión


  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    loginForm.reset();

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredentials);

      // Actualizar información de inicio de sesión
      window.sessionStorage.clear();
      window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);

      filaLogin.style.display = "none";
      desbloquearHome()

    } catch (error) {
      console.log(error)
      if (error.code === 'auth/wrong-password') {
        console.log("Wrong password")
      } else if (error.code === 'auth/user-not-found') {
        console.log("User not found")
      } else if (error.code === 'auth/invalid-email') {
        console.log("Proporcione un email valido", "error")
      } else if (error.code === 'auth/missing-password') {
        console.log("Proporcione una contraseña valida")
      } else {
        console.log("Something went wrong")
      }
    }
  });


// Manejador de eventos para el formulario de registro


  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = registerForm["register-email"].value;
    const password = registerForm["register-password"].value;

    registerForm.reset();

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredentials);

      // Actualizar información de inicio de sesión
      window.sessionStorage.clear();
      window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);

      filaRegister.style.display = "none";
      filaConfig.style.display = "block";

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log("Email already in use", "error")
      } else if (error.code === 'auth/invalid-email') {
        console.log("Proporcione un email valido", "error")
      } else if (error.code === 'auth/missing-password') {
        console.log("Proporcione una contraseña valida", "error")
      } else if (error.code === 'auth/weak-password') {
        console.log("Weak password", "error")
      } else if (error.code) {
        console.log("Something went wrong", "error")
      }
    }
  });



    navLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        // Clear session storage
        //window.sessionStorage.removeItem('idUsuario');
        window.sessionStorage.clear();
        volverAlLogin();
        // Send navLogout event to the backend
        console.log("signed out");

      } catch (error) {
        console.log(error);
      }
    });


async function tieneQueRegistrar(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/tieneQueRegistrar');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return !!data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function registrar(registerInfo) {
    try {
        const url = new URL('http://localhost:8080/registrar');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerInfo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

visibilidadLista(listaResultados, divResultados);
visibilidadLista(listaSugerencias, divSugerencias);
visibilidadLista(listaAmigos, divAmigos);




