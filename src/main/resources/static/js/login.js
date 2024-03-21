import { signInWithEmailAndPassword,createUserWithEmailAndPassword,GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { auth } from "./firebase.js";

let loginInfo = {
  idUsuario: null,
};

let registerInfo = {
  idUsuario: null,
  nombreCuenta: null,
  nombrePersona: null
};

window.sessionStorage.clear();

const googleButton = document.querySelector("#google-login");
const signInForm = document.querySelector("#login-form");
const signUpForm = document.querySelector("#register-form");
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
const logout = document.querySelector("#logout");

document.addEventListener("DOMContentLoaded", function() {
    volverAlLogin();
});

buscarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const nombreBuscado = buscarForm.querySelector("#input-buscar").value;
        console.log(nombreBuscado);
        buscar(nombreBuscado);

    }catch(error){
        console.log(error);
    }
});

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
        console.log(data.personas[0]);
        //return response.json();

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


function volverAlLogin(){
    filaRegister.style.display = "none";
    filaConfig.style.display = "none";
    filaHome.style.display = "none";
    filaIzq.style.display = "none";
    filaDer.style.display = "none";
    logout.style.display = "none";
    navLoguearse.style.display = "block";
    navRegistrarse.style.display = "block";
    filaLogin.style.display = "block";
}

async function desbloquearHome() {
    try {
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

        navLoguearse.style.display = "none";
        navRegistrarse.style.display = "none";
        logout.style.display = "block";
        filaIzq.style.display = "block";
        filaHome.style.display = 'block';
        filaDer.style.display = "block";
    } catch (error) {
        console.error(error);
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
      loginInfo.idUsuario = window.sessionStorage.getItem('idUsuario');

      if (await tieneQueRegistrar(loginInfo)){
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


  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signInForm["login-email"].value;
    const password = signInForm["login-password"].value;

    signInForm.reset();

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


  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signUpForm["register-email"].value;
    const password = signUpForm["register-password"].value;

    signUpForm.reset();

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



    logout.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        // Clear session storage
        //window.sessionStorage.removeItem('idUsuario');
        window.sessionStorage.clear();
        volverAlLogin();
        // Send logout event to the backend
        console.log("signed out");

      } catch (error) {
        console.log(error);
      }
    });


async function tieneQueRegistrar(loginInfo) {
    try {
        const response = await fetch(" http://localhost:8080/tieneQueRegistrar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
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
        const response = await fetch(" http://localhost:8080/registrar", {
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
}




