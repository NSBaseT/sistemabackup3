//verificaAutenticado()

document.getElementById("btn_voltar_b").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
 })

const nameinp = document.getElementById("name")
const emailinp = document.getElementById("email")
const userinp = document.getElementById("user")
const senhainp = document.getElementById("senha")
const c_senhainp = document.getElementById("c_senha")

function cadastro_user(event) {
    event.preventDefault()

if (senhainp.value!==c_senhainp.value){
    alert("Senha Incorreta")
    return
}

    fetch("/cadastro_user", {
        method: "POST",
        body: JSON.stringify({

            Nome: nameinp.value,
            Email: emailinp.value,
            Usuario: userinp.value,
            Senha: senhainp.value,
            
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Usuário cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}
