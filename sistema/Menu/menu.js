verificaAutenticado()


document.getElementById("btn_cadastro").addEventListener("click", () => {
    window.location.href = '../Cadastro_pacientes/Cadastro.html'
 })
 document.getElementById("btn_agendamento").addEventListener("click", () => {
    window.location.href = '../calendario/calendario.html'
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