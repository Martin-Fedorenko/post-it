import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { agregarAmigo, eliminarAmigo, sugerir, amigos, perfil, buscar, registrar, tieneQueRegistrar } from "./solicitudes.js";

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
    cargarLogin();
});

function cargarLogin() {
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

async function cargarHome() {
    try {
        const idUsuario = window.sessionStorage.getItem('idUsuario');


        const persona = await perfil(idUsuario);
        cargarPerfil(persona);


        const amistades = await amigos(idUsuario);
        cargarAmigos(amistades);


        const sugeridos = await sugerir(idUsuario);
        cargarSugeridos(sugeridos);

        cambiarVisualizacionElementos(
            [navLoguearse, navRegistrarse],
            "none"
        );
        cambiarVisualizacionElementos(
            [navLogout, filaIzq, filaHome, filaDer],
            "block"
        );

        buscarForm.querySelector("#input-buscar").value = '';

        visibilidadLista(listaSugerencias, divSugerencias);
        visibilidadLista(listaAmigos, divAmigos);
    } catch (error) {
        console.error(error);
    }
}

function cargarPerfil(persona){

    for (const clave in persona) {
        console.log(clave);
        const elemento = document.getElementById(clave + "Perfil");
        if (elemento) {
            console.log(persona[clave]);
            elemento.textContent = persona[clave];
        }
    }
}

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

        eliminarAmigoForms.forEach(form => {
            form.addEventListener("submit", (e) => administrarAmigoFormEventListener(e, form, eliminarAmigo));
        });
    }
}

function cargarBuscados(personas) {
    cargarPersonas(personas, listaResultados);
}

function cargarSugeridos(personas) {
    cargarPersonas(personas, listaSugerencias);
}

function cargarPersonas(personas, lista) {
    lista.innerHTML = '';
    for (const persona of personas) {
        const elementoResultado = `
            <li class="list-group-item">
                <form class="d-flex justify-content-between align-items-center agregar-amigo-form">
                    <div>
                        <div>${persona.nombrePersona}</div>
                        <div class="text-muted">${persona.nombrePersona}</div>
                        <input type="hidden" name="id-amigo" value="${persona.idUsuario}">
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
            </li>
        `;
        lista.innerHTML += elementoResultado;
    }

    const agregarAmigoForms = lista.querySelectorAll('.agregar-amigo-form');

    agregarAmigoForms.forEach(form => {
        form.addEventListener("submit", (e) => administrarAmigoFormEventListener(e, form, agregarAmigo));
    });
}

const administrarAmigoFormEventListener = async (e, form, funcion) => {
    e.preventDefault();
    try {
        const idAmigo = form.querySelector('input[type="hidden"]').value;
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        console.log("Amigo: " + idAmigo + " Usuario: " + idUsuario);
        await funcion({"idAmigo": idAmigo, "idUsuario": idUsuario});

        const listItem = form.closest('li');
        if (listItem) {
            listItem.remove();
        }

        const amistades = await amigos(idUsuario);
        cargarAmigos(amistades);

        const sugeridos = await sugerir(idUsuario);
        cargarSugeridos(sugeridos);

        const persona = await perfil(idUsuario);
        cargarPerfil(persona);

        visibilidadLista(listaResultados, divResultados);
        visibilidadLista(listaAmigos, divAmigos);
        visibilidadLista(listaSugerencias, divSugerencias);
    } catch(error) {
        console.log(error);
    }
};

buscarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        let nombreBuscado = buscarForm.querySelector("#input-buscar").value;
        console.log(nombreBuscado);
        const personas = await buscar(nombreBuscado);
        cargarBuscados(personas);

        buscarForm.querySelector("#input-buscar").value = '';
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
    if (event.target.classList.contains("agregarPersona")) {
        const liPadre = event.target.closest("li");
        console.log(liPadre);
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaSugerencias, divSugerencias);
});


function visibilidadLista(listElement, lista) {
    if (!listElement.querySelector('li')) {
        lista.style.display = "none";
    } else {
        lista.style.display = "block";
    }
}

function cambiarVisualizacionElementos(elementos, estilo) {
    elementos.forEach(elemento => {
        elemento.style.display = estilo;
    });
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
            cargarHome();
        }
        console.log("Se paso por google");
    } catch (error) {
        console.log(error);
    }
});

configForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        let datos = {
            idUsuario: null,
            nombreCuenta: null,
            nombrePersona: null
        };

        datos.idUsuario = window.sessionStorage.getItem('idUsuario');
        datos.nombreCuenta = configForm.querySelector('input[name="nombreCuenta"]').value;
        datos.nombrePersona = configForm.querySelector('input[name="nombrePersona"]').value;
        datos.descripcion = configForm.querySelector('input[name="descripcion"]').value;
        configForm.reset();
        console.log(datos);
        if(await registrar(datos)){
            filaConfig.style.display = 'none';
            cargarHome();
        }
    } catch (error) {
        console.log(error);
    }
});

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
        cargarHome()

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

        window.sessionStorage.clear();
        cargarLogin();
        console.log("Sesión cerrada");

    } catch (error) {
        console.log(error);
    }
});

visibilidadLista(listaResultados, divResultados);
visibilidadLista(listaSugerencias, divSugerencias);
visibilidadLista(listaAmigos, divAmigos);
