import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { agregarAmigo, eliminarAmigo, sugerir, amigos, perfil, buscar, registrar, tieneQueRegistrar, sugerirPublicaciones, publicar, comentar } from "./solicitudes.js";

window.sessionStorage.clear();

const googleButton = document.querySelector("#google-login");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const configForm = document.querySelector("#configuration-form");
const buscarForm = document.querySelector("#buscar-form");
const entradaPublicacionForm = document.querySelector("#form-entrada-publicacion");

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
        [filaRegister, filaConfig, filaHome, filaIzq, filaDer, navLogout],
        "none"
    );
    cambiarVisualizacionElementos(
        [navLoguearse, navRegistrarse],
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

        const publicaciones = await sugerirPublicaciones(idUsuario);
        cargarPublicaciones(publicaciones);

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
        const elemento = document.getElementById(clave + "Perfil");
        if (elemento) {
            elemento.textContent = persona[clave];
        }
    }
}

function cargarAmigos(personas){
    listaAmigos.innerHTML = '';

    for (var persona of personas) {

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


function cargarPublicaciones(publicaciones){
    divPublicaciones.innerHTML = '';

    if(publicaciones.length !== 0){

        publicaciones = publicaciones.sort((publicacion1, publicacion2) => new Date(publicacion2.horarioPublicacion).getTime() - new Date(publicacion1.horarioPublicacion).getTime());

        for (var publicacion of publicaciones) {
            var elementoResultado = `<div class="card mb-3 publicacion">
                                                   <div class="card-header">
                                                     <div class="row">
                                                       <div class="col">
                                                         <div class="d-flex justify-content-between align-items-center">
                                                           <input type="hidden" name="idPublicacion" value="${publicacion.claveUsuarioPublicacion.idPublicacion}">
                                                           <div>
                                                             <div class="me-2">${publicacion.nombrePersona}  •  ${publicacion.nombreCuenta}</div>
                                                           </div>
                                                           <div>
                                                             <div class="me-2">${new Date(publicacion.horarioPublicacion).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                                                           </div>
                                                         </div>
                                                       </div>
                                                     </div>
                                                   </div>
                                                   <div class="card-body contenido">
                                                     <p class="card-text text-break">${publicacion.contenido}</p>
                                                   </div>
                                                   <div class="card-footer comentarios">
                                                     <div class="entrada-comentario">
                                                       <form class="form-comentar-publicacion">
                                                           <input type="hidden" name="idPublicacion" value="${publicacion.claveUsuarioPublicacion.idPublicacion}">
                                                           <input type="hidden" name="idUsuarioPublicador" value="${publicacion.claveUsuarioPublicacion.idUsuarioPublicador}">
                                                         <div class="input-group">
                                                           <input type="text" class="form-control" name="input-comentar-publicacion" placeholder="Comment it!">
                                                           <button class="btn btn-success" type="submit">Publicar</button>
                                                         </div>
                                                       </form>
                                                     </div>
                                                     <hr>
                                                     <ul class="list-group lista-comentarios">
                                                       ${cargarComentarios(publicacion.comentarios)}
                                                     </ul>
                                                   </div>
                                                 </div>`;

            divPublicaciones.innerHTML += elementoResultado;
        }

        const comentarForms = divPublicaciones.querySelectorAll('.form-comentar-publicacion');

        comentarForms.forEach(form => {
            form.addEventListener("submit", (e) => comentarPublicacionEventListener(e, form));
        });

    }else{
             divPublicaciones.innerHTML += `<h3 class="card-header text-center mt-5">No hay publicaciones disponibles...</h3>`;
    }
}

function cargarComentarios(comentarios) {
    let listaComentarios = '';
    if(comentarios != null){

        comentarios = comentarios.sort((comentario1, comentario2) => new Date(comentario2.horarioComentario).getTime() - new Date(comentario1.horarioComentario).getTime());

        for (let comentario of comentarios) {
            listaComentarios += `<li class="list-group-item comentario">
                                    <div class="d-flex justify-content-between align-items-center">
                                            <div class="col-9">
                                                <div class="text-break text-muted">${comentario.nombrePersona} dijo: ${comentario.contenido}</div>
                                            </div>
                                            <div>
                                                <div class="text-muted">${new Date(comentario.horarioComentario).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</div>
                                            </div>
                                        </div>
                                  </li>`;
        }
    }
    return listaComentarios;
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

        const publicaciones = await sugerirPublicaciones(idUsuario);
        cargarPublicaciones(publicaciones);


        visibilidadLista(listaResultados, divResultados);
        visibilidadLista(listaAmigos, divAmigos);
        visibilidadLista(listaSugerencias, divSugerencias);
    } catch(error) {
        console.log(error);
    }
};

const comentarPublicacionEventListener = async (e, form) => {
    e.preventDefault();
    try {
        const idPublicacion = form.querySelector('input[name="idPublicacion"]').value;
        const idUsuarioPublicador = form.querySelector('input[name="idUsuarioPublicador"]').value;
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        const contenido = form.querySelector('input[name="input-comentar-publicacion"]').value;

        const datos = {
            idPublicacion: idPublicacion,
            idUsuarioPublicador: idUsuarioPublicador,
            idUsuarioComentador: idUsuario,
            contenido: contenido
        };

        await comentar(datos);

        const publicaciones = await sugerirPublicaciones(idUsuario);
        cargarPublicaciones(publicaciones);

    } catch(error) {
        console.log(error);
    }
};

buscarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const nombreBuscado = buscarForm.querySelector("#input-buscar").value;
        const personas = await buscar(nombreBuscado);
        cargarBuscados(personas);

        buscarForm.querySelector("#input-buscar").value = '';
        visibilidadLista(listaResultados, divResultados);
    } catch(error){
        console.log(error);
    }
});

entradaPublicacionForm.addEventListener("submit", async (e) =>{
    e.preventDefault();
    try{
        const contenido = entradaPublicacionForm.querySelector("#input-entrada-publicacion").value;
        const idUsuario = window.sessionStorage.getItem('idUsuario');
        await publicar({idUsuario, contenido});

        const persona = await perfil(idUsuario);
        cargarPerfil(persona);

        const publicaciones = await sugerirPublicaciones(idUsuario);
        cargarPublicaciones(publicaciones);

        entradaPublicacionForm.querySelector("#input-entrada-publicacion").value = '';

    }catch(error){
        console.log(error);
    }
});

listaResultados.addEventListener("click", function(event) {
    if (event.target.classList.contains("quitarPersona")) {
        const liPadre = event.target.closest("li");
        if (liPadre) {
            liPadre.remove();
        }
    }
    if (event.target.classList.contains("agregarPersona")) {
        const liPadre = event.target.closest("li");
        if (liPadre) {
            liPadre.remove();
        }
    }
    visibilidadLista(listaResultados, divResultados);
});

listaSugerencias.addEventListener("click", function(event) {
    if (event.target.classList.contains("quitarPersona")) {
            const liPadre = event.target.closest("li");
            if (liPadre) {
                liPadre.remove();
            }
    }
    if (event.target.classList.contains("agregarPersona")) {
        const liPadre = event.target.closest("li");
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
        const userCredentials = await signInWithPopup(auth, provider)

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
        console.log("Sesión iniciada con google!");
    } catch (error) {
        console.log(error);
    }
});

configForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const datos = {
            idUsuario: null,
            nombreCuenta: null,
            nombrePersona: null,
            descripcion: null
        };

        datos.idUsuario = window.sessionStorage.getItem('idUsuario');
        datos.nombreCuenta = configForm.querySelector('input[name="nombreCuenta"]').value;
        datos.nombrePersona = configForm.querySelector('input[name="nombrePersona"]').value;
        datos.descripcion = configForm.querySelector('input[name="descripcion"]').value;
        configForm.reset();
        if(await registrar(datos)){
            filaConfig.style.display = 'none';
            cargarHome();
            console.log("Cuenta registrada!");
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

        window.sessionStorage.clear();
        window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);

        filaLogin.style.display = "none";
        cargarHome()
        console.log("Sesión iniciada!");

    } catch (error) {
        console.log(error)
        if (error.code === 'auth/wrong-password') {
            console.log("Contraseña incorrecta")
        } else if (error.code === 'auth/user-not-found') {
            console.log("Usuario no encontrado")
        } else if (error.code === 'auth/invalid-email') {
            console.log("Proporcione un email valido", "error")
        } else if (error.code === 'auth/missing-password') {
            console.log("Proporcione una contraseña valida")
        } else {
            console.log("Algo anda mal...")
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

        window.sessionStorage.clear();
        window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);

        filaRegister.style.display = "none";
        filaConfig.style.display = "block";

    } catch (error) {
        console.log(error);

        if (error.code === 'auth/wrong-password') {
            console.log("Contraseña incorrecta");
        } else if (error.code === 'auth/user-not-found') {
            console.log("Usuario no encontrado");
        } else if (error.code === 'auth/invalid-email') {
            console.log("Proporcione un email valido", "error");
        } else if (error.code === 'auth/missing-password') {
            console.log("Proporcione una contraseña valida");
        } else if (error.code === 'auth/email-already-in-use') {
            console.log("Email proporcionado ya en uso")
        }else {
            console.log("Algo anda mal...")
        }
    }
});


navLogout.addEventListener("click", async (e) => {
    e.preventDefault();
    try {

        window.sessionStorage.clear();
        cargarLogin();
        console.log("Sesión cerrada!");

    } catch (error) {
        console.log(error);
    }
});

visibilidadLista(listaResultados, divResultados);
visibilidadLista(listaSugerencias, divSugerencias);
visibilidadLista(listaAmigos, divAmigos);
