verificaAutenticado()
document.getElementById("btn_voltar_cvn").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html'
})

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })


const name_cvninp = document.getElementById("name_cvn")
const cnpjinp = document.getElementById("cnpj")
const valoresinp = document.getElementById("valores")
const data_contratacaoinp = document.getElementById("data_contratacao")


function cadastro_convenio(event) {
    event.preventDefault()
    fetch("/cadastro_convenio", {
        method: "POST",
        body: JSON.stringify({

            Nome_do_Convenio: name_cvninp.value,
            CNPJ: cnpjinp.value,
            Valores: valoresinp.value,
            Data_de_Contratacao: data_contratacaoinp.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Convênio cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}

