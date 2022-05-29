// Deals with cookie message behavior:

let cookieMessage = document.querySelector(".cookie-message")
let cookieMessageButton = document.getElementById("cookie-button");
let wholePage = document.querySelector(".whole-page");
let body = document.querySelector("body");
let cookieMessageAccepted = "No";

if (cookieMessageAccepted === "No") {
    wholePage.style.opacity = 0.5;
    body.style.overflow = "hidden";
}

cookieMessageButton.addEventListener("click", function () {
    cookieMessageAccepted = "Yes";
    cookieMessage.style.visibility = "hidden";
    wholePage.style.opacity = 1;
    body.style.overflow = "visible";
});

// Open and close login form:

let loginIcon = document.querySelector("#login-icon");

loginIcon.addEventListener("click", function () {
    if (sessionStorage.getItem("id") === null) {
        // Allow login:
        document.querySelector("#login-screen").style.display = "flex";
        document.querySelector("#login-screen").style.justifyContent ="space-evenly";
        document.querySelector("#login-screen").style.alignItems = "center";
    } else {
        // Logout:
        console.log("Logging out...");
        window.sessionStorage.removeItem("id");
        loginIcon.classList.replace("fa-solid", "fa-regular");
        loginIcon.classList.replace("fa-arrow-right-from-bracket", "fa-user");
        loginIcon.title="Login";
        document.querySelector(".welcome-message").textContent = "";
        document.querySelector(".welcome-message").style.visibility = "none";
        document.querySelector("#email").value = "";
        document.querySelector("#password").value = "";
        console.log("Logged out successfully.")
    }
});

document.querySelector("#login-span").addEventListener("click", function () {
    document.querySelector("#login-screen").style.display = "none";
});


// Deal with login form errors:
let errors = document.querySelector(".errors");
let emailError = document.querySelector("#email-error");
let passwordError = document.querySelector("#password-error");
let userError = document.querySelector("#userError");

let emailField = document.querySelector("#email");
let passwordField = document.querySelector("#password");

document.querySelector("#login-form").addEventListener("submit", function (event) {
    submitLoginForm(event);
});

emailField.addEventListener("keyup", function (event) {
    submitLoginFormWithEnterKey(event)
});

passwordField.addEventListener("keyup", function (event) {
    submitLoginFormWithEnterKey(event)
});

function submitLoginFormWithEnterKey(event) {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        submitLoginForm(event);
    }
}

function submitLoginForm(event) {
    event.preventDefault();
    let emailValue = emailField.value;
    let passwordValue = passwordField.value;

    if (emailValue === "" || passwordValue === "") {
        errors.innerHTML = "<p>Os dois campos são de preenchimento obrigatório!</p>"
    } else {

// The regex pattern below is meant to cover email addresses containing at least one character and no more than 64 before the @ symbol; at least one character and no more than 255 between the @ and the dot; at least two characters after the dot.
        let emailPattern = /^\S{1,64}[@]\S{1,255}[.]\S{2,}$/

        if (!emailPattern.test(emailValue)) {
            emailError.textContent = "O formato do endereço de e-mail não está correto.";
            emailError.style.display = "block";
        } else {
            emailError.style.display = "none";

            // It enables us to fetch the user from the database and continue the validation.
            fetch(`http://localhost:3000/utilizadores?email=${emailValue}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response.status);
                        throw Error(response.statusText);
                    }
                })
                .then(utilizador => {
                    if (utilizador.length > 0) {
                        if (utilizador[0].senha === passwordValue) {
                            console.log("Login OK");
                            document.querySelector("#login-screen").style.display = "none";
                            document.getElementById("login-icon").classList.replace("fa-regular", "fa-solid");
                            document.getElementById("login-icon").classList.replace("fa-user", "fa-arrow-right-from-bracket");
                            document.getElementById("login-icon").title = "Logout";
                            document.querySelector(".welcome-message").textContent = `Bem-vindo(a), ${utilizador[0].nome}`;
                            document.querySelector(".welcome-message").style.visibility = "visible";
                            let utilizadorId = utilizador[0].id;
                            sessionStorage.setItem("id", utilizadorId);
                        } else {
                            passwordError.textContent = "A senha que introduziu está incorreta.";
                            passwordError.style.display = "block";
                        }
                    } else {
                        errors.innerHTML = `<p>O e-mail que inseriu não foi encontrado.</p>`;
                        passwordError.textContent = "";
                    }
                })
                .catch(erro => {
                    alert("Ocorreu um erro. Por favor, volte a tentar mais tarde. Caso o erro persista, contacte-nos através do e-mail erro@primaverabss.com");
                    console.log(erro);
                });
        }
    }
    console.log("Rodou");
}

