// Abrir e fechar formulário de login:

let iconeLogin = document.querySelector("#iconeLogin");

iconeLogin.addEventListener("click", function () {
    document.querySelector("#telaLogin").style.visibility = "visible";
});

document.querySelector("#telaLogin span").addEventListener("click", function () {
    document.querySelector("#telaLogin").style.visibility = "hidden";
});

// Lidar com os erros do formulário de login:
function submeterFormularioLogin(){
    let erros = document.querySelector("#erros");
    let erroEmail = document.querySelector("#erroEmail");
    let erroUtilizador = document.querySelector("#erroUtilizador");
    
    document.querySelector("#formularioLogin").addEventListener("submit", function (evento) {
        evento.preventDefault();
        let campoEmail = document.querySelector("#email").value;
        let campoSenha = document.querySelector("#senha").value;
    
        if (campoEmail === "" || campoSenha === "") {
            erros.innerHTML = "<p>Os dois campos são de preenchimento obrigatório!</p>"
        } else {
    
            // O padrão regex abaixo pretende abarcar os endereços de email que contenham pelo menos um caractere e no máximo 64 antes do símbolo do @; pelo menos um caractere e no máximo 255 entre o @ e o ponto; pelo menos dois caracteres depois do ponto.
            let padraoEmail = /^\S{1,64}[@]\S{1,255}[.]\S{2,}$/
    
            if (!padraoEmail.test(campoEmail)) {
                erroEmail.textContent = "O formato do endereço de e-mail não está correto.";
                erroEmail.style.display = "block";
            } else {
                erroEmail.style.display = "none";
            }
        }
    });
    console.log("rodou");
}

// Permitir submeter o formulário ao clicar na tecla Enter em qualquer um dos dois campos do formulário:
document.getElementById("email").addEventListener("keyup", function(evento){
    if (evento.code === "Enter"){
        evento.preventDefault();
        submeterFormularioLogin();
    }
});

document.getElementById("senha").addEventListener("keyup", function(evento){
    if (evento.code === "NumpadEnter"){
        evento.preventDefault();
        submeterFormularioLogin();
    }
});
