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

 let Usuario = ''

 ;(async () => {
   const token = localStorage.getItem(CHAVE)

   const response = await fetch('/verify', {
       body: JSON.stringify({ token }),
       method: 'POST',
       headers: {
           "Content-Type": "application/json"
       }
   })

   const data = await response.json()
   Usuario = data.Usuario;

   if (data.Secretaria) {
      const btnFluxo = document.getElementById("btn_fluxo");
      btnFluxo.parentNode.removeChild(btnFluxo);
      
   } else {
      // COISAS Q EU QUERO FAZER SE N FOR SECRETARIA
   }

   if (data.Profissional) {
       // COISAS Q EU QUERO FAZER SE FOR PROFISSIONAL
   } else {
      // COISAS Q EU QUERO FAZER SE N FOR PROFISSIONAL
   }
})().catch(console.error)



 function redirecionaCadUser() {
    if (Usuario === 'Adm'){
       location.href = '../cadastro_user/cadastro_user.html'
    } else {
       alert('Entrar em contato com Administrativo')
    }
 }