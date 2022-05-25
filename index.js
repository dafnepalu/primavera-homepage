// Abrir e fechar formulário de login:

let iconeLogin = document.querySelector("#iconeLogin");

iconeLogin.addEventListener("click", function () {
    if (sessionStorage.getItem("id") === null) {
        // Permitir o login:
        document.querySelector("#telaLogin").style.visibility = "visible";
    } else {
        // Fazer o logout:
        console.log("Logging out...");
        window.sessionStorage.removeItem("id");
        iconeLogin.classList.replace("fa-solid","fa-regular");
        iconeLogin.classList.replace("fa-arrow-right-from-bracket","fa-user");
        document.querySelector("#mensagemBoasVindas").textContent = "";
        document.querySelector("#mensagemBoasVindas").style.visibility = "hidden";
        console.log("Logged out successfully.")
    }
});

document.querySelector("#telaLogin span").addEventListener("click", function () {
    document.querySelector("#telaLogin").style.visibility = "hidden";
});

// Lidar com os erros do formulário de login:
let erros = document.querySelector("#erros");
let erroEmail = document.querySelector("#erroEmail");
let erroSenha = document.querySelector("#erroSenha");
let erroUtilizador = document.querySelector("#erroUtilizador");

let campoEmail = document.querySelector("#email");
let campoSenha = document.querySelector("#senha");

document.querySelector("#formularioLogin").addEventListener("submit", function (evento) {
    submeterFormularioLogin(evento);
});

campoEmail.addEventListener("keyup", function (evento) {
    submeterFormularioLoginComEnter(evento)
});

campoSenha.addEventListener("keyup", function (evento) {
    submeterFormularioLoginComEnter(evento)
});

function submeterFormularioLoginComEnter(evento) {
    if (evento.code === "Enter" || evento.code === "NumpadEnter") {
        evento.preventDefault();
        submeterFormularioLogin(evento);
    }
}

function submeterFormularioLogin(evento) {
    evento.preventDefault();
    let emailValor = campoEmail.value;
    let senhaValor = campoSenha.value;

    if (emailValor === "" || senhaValor === "") {
        erros.innerHTML = "<p>Os dois campos são de preenchimento obrigatório!</p>"
    } else {

        // O padrão regex abaixo pretende abarcar os endereços de email que contenham pelo menos um caractere e no máximo 64 antes do símbolo do @; pelo menos um caractere e no máximo 255 entre o @ e o ponto; pelo menos dois caracteres depois do ponto.
        let padraoEmail = /^\S{1,64}[@]\S{1,255}[.]\S{2,}$/

        if (!padraoEmail.test(emailValor)) {
            erroEmail.textContent = "O formato do endereço de e-mail não está correto.";
            erroEmail.style.display = "block";
        } else {
            erroEmail.style.display = "none";

            // Permite ir buscar o utilizador na base de dados e continuar a validação.
            fetch(`http://localhost:3000/utilizadores?email=${emailValor}`)
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
                        if (utilizador[0].senha === senhaValor) {
                            console.log("Login OK");
                            document.querySelector("#telaLogin").style.visibility = "hidden";
                            document.getElementById("iconeLogin").classList.replace("fa-regular", "fa-solid");
                            document.getElementById("iconeLogin").classList.replace("fa-user", "fa-arrow-right-from-bracket");
                            // Acho que posso excluir a linha abaixo:
                            document.getElementById("iconeLogin").id = "iconeLogout";
                            document.querySelector("#mensagemBoasVindas").textContent = `Bem-vindo(a), ${utilizador[0].nome}`;
                            document.querySelector("#mensagemBoasVindas").style.visibility = "visible";
                            let utilizadorId = utilizador[0].id;
                            sessionStorage.setItem("id", utilizadorId);
                        } else {
                            erroSenha.textContent = "A senha que introduziu está incorreta.";
                            erroSenha.style.display = "block";
                        }
                    } else {
                        erros.innerHTML = `<p>O e-mail que inseriu não foi encontrado.</p>`;
                        erroSenha.textContent = "";
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

// O código abaixo faz com que a seção Contacto permaneça fixa ao fazer scroll:
window.addEventListener("scroll", function(evento){
    let contacto = document.getElementById("contacto");
    contacto.classList.toggle("scrolling", this.window.scrollY>0);
})