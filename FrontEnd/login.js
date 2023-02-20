// Enregistrement de l'URL de l'API et le formulaire de login
const urlApi = "http://localhost:5678/api";
const loginForm = document.querySelector("#login > form");

// Focus du champ e-mail
loginForm.email.focus();

// Gestion de l'authentification
function checkToken () {
    if (window.localStorage.getItem("token") === null || window.localStorage.getItem("token") === "undefined") {
        window.localStorage.removeItem("token");
        alert("Erreur dans l'identifiant ou le mot de passe");
    } else {
        document.location.href=("index.html");
    }
    }

// Gestion du login
function login () {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const userLogin = {
            email: (loginForm.email).value,
            password: (loginForm.password).value,
        };
        const chargeUtile = JSON.stringify(userLogin);
        fetch(urlApi + "/users/login", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        })
        .then(res => res.json())
        .then(data => {
            window.localStorage.setItem("token", data.token);
            console.log(window.localStorage);
        })
        window.setTimeout(checkToken, 100)
    });
}

login();
