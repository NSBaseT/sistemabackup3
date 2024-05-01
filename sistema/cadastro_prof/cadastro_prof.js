verificaAutenticado()

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })

  document.getElementById("btn_voltar_pr").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html';
});


const nameprofinp = document.getElementById("nameprof")
const faixa_etariainp = document.getElementById("faixa_etaria")
const data_atendinp = document.getElementById("data_atend")
const horario_atendinp = document.getElementById("horario_atend")
const especialidadeinp = document.getElementById("especialidade")
const reg_profissionalinp = document.getElementById("reg_profissional")


function cadastro_prof(event) {
    event.preventDefault()

    fetch("/cadastro_prof", {
        method: "POST",
        body: JSON.stringify({

            Nome: nameprofinp.value,
            Faixa_Etaria_de_Atendimento: faixa_etariainp.value,
            Dias_de_Atendimento: data_atendinp.value,
            Horarios_de_Atendimento: horario_atendinp.value,
            Especialidade: especialidadeinp.value,
            Registro_do_Profissional: reg_profissionalinp.value, 
      
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Profissional cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}