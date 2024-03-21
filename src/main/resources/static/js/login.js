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
const configButton = document.querySelector("#boton-config");
const signInForm = document.querySelector("#login-form");
const signUpForm = document.querySelector("#register-form");
const logout = document.querySelector("#logout");

const filaLogin = document.querySelector(".fila-login");
const filaRegister = document.querySelector(".fila-register");
const filaConfig = document.querySelector(".fila-config");
const filaHome = document.querySelector(".fila-home");
const filaIzq = document.querySelector(".fila-izquierda");
const filaDer = document.querySelector(".fila-derecha");

const navRegistrarse = document.querySelector("#nav-link-registrarse");
const navLoguearse = document.querySelector("#nav-link-loguearse");

document.addEventListener("DOMContentLoaded", function() {
    filaRegister.style.display = "none";
    filaConfig.style.display = "none";
    filaHome.style.display = "none";
    filaIzq.style.display = "none";
    filaDer.style.display = "none";
});

navRegistrarse.addEventListener("click", function() {
    filaRegister.style.display = "block";
    filaLogin.style.display = "none";
});

navLoguearse.addEventListener("click", function() {
    filaRegister.style.display = "none";
    filaLogin.style.display = "block";
});

if(googleButton) {
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
        filaHome.style.display = 'block';
      }
      console.log("Se paso por google");
    } catch (error) {
      console.log(error);
    }
  });
}

if(configButton) {
  configButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {

      console.log("config button clicked");

      registerInfo.idUsuario = window.sessionStorage.getItem('idUsuario');
      registerInfo.nombreCuenta = document.querySelector('input[name="nombreCuenta"]').value;
      registerInfo.nombrePersona = document.querySelector('input[name="nombrePersona"]').value;
      console.log(registerInfo);
      if(await registrar(registerInfo)){
        filaConfig.style.display = 'none';
        filaHome.style.display = 'block';
      }

      console.log("Y estamos en home");
    } catch (error) {
      console.log(error);
    }
  });
}

// Manejador de eventos para el formulario de inicio de sesión

if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signInForm["login-email"].value;
    const password = signInForm["login-password"].value;

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredentials);

      // Actualizar información de inicio de sesión
      window.sessionStorage.clear();
      window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);

      filaLogin.style.display = "none";
      filaHome.style.display = "block";

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
}

// Manejador de eventos para el formulario de registro

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signUpForm["register-email"].value;
    const password = signUpForm["register-password"].value;

    try {
        console.log("email button clicked");
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredentials);

      // Actualizar información de inicio de sesión
      window.sessionStorage.clear();
            window.sessionStorage.setItem('idUsuario', userCredentials.user.uid);


      filaRegister.style.display = "none";
      filaConfig.style.display = "block";
      console.log("que pasa");


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
}

if(logout){
    logout.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        // Clear session storage
        //window.sessionStorage.removeItem('idUsuario');
        window.sessionStorage.clear();
        // Send logout event to the backend
        console.log("signed out");

        //window.location.href = '/login';
      } catch (error) {
        console.log(error);
      }
    });
}

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




