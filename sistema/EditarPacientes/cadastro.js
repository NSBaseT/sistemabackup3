//verificaAutenticado()
document.getElementById("btn_voltar_c").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html'
})


const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const emailinp = document.getElementById("email")
const cpf_cnpjinp = document.getElementById("cpf_cnpj")
const addressinp = document.getElementById("address")
const numberinp = document.getElementById("number")
const cepinp = document.getElementById("cep");

(async () => {
    const params = new URLSearchParams(window.location.search)
   const response = await fetch(`/pacientes/${params.get('id')}`)
   const data = await  response.json()

     nameinp.value =  data.Nome
     phoneinp.value = data.Telefone
     emailinp.value = data.Email
     cpf_cnpjinp.value = data.CPF_CNPJ
     addressinp.value = data.Endereco
     numberinp.value = data.Numero
     cepinp.value = data.CEP
})();

function cadastrar_paciente(event) {
    event.preventDefault()
    const params = new URLSearchParams(window.location.search)
    fetch(`/cadastrar_paciente/${params.get('id')}`, {
        method: "PUT",
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Email: emailinp.value,
            CPF_CNPJ: cpf_cnpjinp.value,
            Endereco: addressinp.value,
            Numero: numberinp.value,
            CEP: cepinp.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Paciente atualizado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao atualizar"))
}

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })