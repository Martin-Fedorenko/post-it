import { signInWithEmailAndPassword,createUserWithEmailAndPassword,GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"
import { auth } from "./firebase.js";


let loginInfo = {
  idUsuario: null,
};

const googleButton = document.querySelector("#google-login");
const signInForm = document.querySelector("#login-form");
const signUpForm = document.querySelector("#register-form");
const logout = document.querySelector("#logout");

if(googleButton) {
  googleButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    try {
      console.log("google sign in");
      const userCredentials = await signInWithPopup(auth, provider)
      console.log(userCredentials);
      console.log("google sign in");

      window.sessionStorage.clear();
      loginInfo.idUsuario = userCredentials.user.uid;
      window.sessionStorage.setItem('idUsuario', loginInfo.idUsuario);

       console.log("1");
      await sendLogin(loginInfo);
        console.log("4");
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
      loginInfo.idUsuario = userCredentials.user.uid;
      window.sessionStorage.setItem('idUsuario', loginInfo.idUsuario);

      // Enviar evento de inicio de sesión
      await sendLogin(loginInfo);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);

      // Actualizar información de inicio de sesión
      window.sessionStorage.clear();
      loginInfo.idUsuario = userCredential.user.uid;
      window.sessionStorage.setItem('idUsuario', loginInfo.idUsuario);

      // Enviar evento de inicio de sesión después del registro
      await sendRegister(loginInfo);

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

        window.location.href = '/login';
      } catch (error) {
        console.log(error);
      }
    });
}

function sendLogin(loginInfo) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginInfo),
  })
    .then((response) => {
      if (response.ok) {
        // Receive the string from the response body
        return response.text();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then((redirectUrl) => {
      // Redirect to the received URL
      window.location.href = redirectUrl;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function sendRegister(loginInfo) {
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginInfo),
  })
    .then((response) => {
      if (response.ok) {
        // Receive the string from the response body
        return response.text();
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then((redirectUrl) => {
      // Redirect to the received URL
      window.location.href = redirectUrl;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
