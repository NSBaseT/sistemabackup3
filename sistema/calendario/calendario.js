

verificaAutenticado()

const modAgen = document.getElementById('mod-agen')
const modEspera = document.getElementById('mod-espera')

const isLeapYear = (year) => {
    return (
        (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
    );
};
const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};
let calendar = document.querySelector('.calendar');
const month_names = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');

month_picker.onclick = () => {
    month_list.classList.remove('hideonce');
    month_list.classList.remove('hide');
    month_list.classList.add('show');
    dayTextFormate.classList.remove('showtime');
    dayTextFormate.classList.add('hidetime');
    timeFormate.classList.remove('showtime');
    timeFormate.classList.add('hideTime');
    dateFormate.classList.remove('showtime');
    dateFormate.classList.add('hideTime');
};

let newCurrentDay = new Date()
let currentDayLista;

const horas = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
]

function generateNewList() {
    document.getElementById("olcards").innerHTML = horas.reduce((acc, hora) => acc + `
    <li data-message="${String(hora).padStart(2, '0')}:00" style="--cardColor:rgb(18, 211, 195)">
      <div class="content" id="status-${String(hora).padStart(2, '0')}:00">
          <div class="text" id="agendamento-${String(hora).padStart(2, '0')}:00">
            
          </div>
      </div>
    </li>

    <li data-message="${String(hora).padStart(2, '0')}:30" style="--cardColor:rgb(18, 211, 195)">
      <div class="content" id="status-${String(hora).padStart(2, '0')}:30" onclick="">
        <div class="text" id="agendamento-${String(hora).padStart(2, '0')}:30">
          
          </div>
      </div>
    </li>
  `, '')
}


async function carregarLista(force) {
    if (newCurrentDay === currentDayLista && force === undefined) return
    currentDayLista = newCurrentDay

    generateNewList()

    const cD = currentDayLista.getDate().toString().padStart(2, '0')
    const cM = (currentDayLista.getMonth() + 1).toString().padStart(2, '0')
    const cY = currentDayLista.getFullYear().toString().padStart(2, '0')

    const response = await fetch('/agendamentos')
    let data = await response.json()

    console.log(document.getElementById("lista").value.toLowerCase())

    data = data.filter(arg =>
        arg.Data_do_Atendimento === `${cY}-${cM}-${cD}` &&
        arg.Especialista.toLowerCase().includes(document.getElementById("lista").value.toLowerCase())
    )

    data.forEach(arg => {
        const contentId = `agendamento-${arg.Horario_da_consulta}`;
        const contentEl = document.getElementById(contentId);

        if (contentEl) {
            contentEl.innerHTML = `${arg.Nome} - Especialista: ${arg.Especialista}  ${arg.observacao}`

            contentEl.style = 'cursor: pointer; user-select: none;'

            contentEl.onclick = () => {
                modAgen.showModal()

                nameinp.value = arg.Nome
                phoneinp.value = arg.Telefone
                especialistainp.value = arg.Especialista
                data_atendimentoinp.value = arg.Data_do_Atendimento
                horario_consultainp.value = arg.Horario_da_consulta
                valor_consultainpinp.value = arg.Valor_da_Consulta
                status_consultainp.value = arg.Status_da_Consulta
                status_pagamentoinp.value = arg.Status_do_pagamento
                observacaoinp.value = arg.observacao

                document.getElementById("formagendamento").dataset.agendamentoId = arg.id
            }

        }

        const statusId = `status-${arg.Horario_da_consulta}`;
        const statusEl = document.getElementById(statusId);

        if (statusEl) {
            var statusFormated = arg.Status_da_Consulta.toLowerCase().replace(' ', '-')
            if (statusFormated.match("ã")) {
                statusFormated = statusFormated.replace("ã", "a");
            }
            if (statusFormated.match("ç")) {
                statusFormated = statusFormated.replace("ç", "c");
            }
            statusEl.classList.add(`status-${statusFormated}`);
        }
    })

}

const generateCalendar = async (month, year) => {
    let calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = '';
    let calendar_header_year = document.querySelector('#year');
    let days_of_month = [
        31,
        getFebDays(year),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];

    const currentDate = newCurrentDay;

    carregarLista()

    month_picker.innerHTML = month_names[month];

    calendar_header_year.innerHTML = year;

    let first_day = new Date(year, month);


    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {

        let day = document.createElement('div');

        if (i >= first_day.getDay()) {
            const nDay = i - first_day.getDay() + 1;

            day.innerHTML = nDay

            day.onclick = (() => {
                const calendarCurrentDate = new Date(`${year}-${String(month + 1).padStart(2, '0')}-${String(nDay + 1).padStart(2, '0')}`)
                newCurrentDay = calendarCurrentDate;
                generateCalendar(month, year)
            })

            if (i - first_day.getDay() + 1 === currentDate.getDate() &&
                year === currentDate.getFullYear() &&
                month === currentDate.getMonth()
            ) {
                day.classList.add('current-date');
            }
        }
        calendar_days.appendChild(day);
    }
};

let month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`;

    month_list.append(month);
    month.onclick = () => {
        currentMonth.value = index;
        generateCalendar(currentMonth.value, currentYear.value);
        month_list.classList.replace('show', 'hide');
        dayTextFormate.classList.remove('hideTime');
        dayTextFormate.classList.add('showtime');
        timeFormate.classList.remove('hideTime');
        timeFormate.classList.add('showtime');
        dateFormate.classList.remove('hideTime');
        dateFormate.classList.add('showtime');
    };
});

(function () {
    month_list.classList.add('hideonce');
})();
document.querySelector('#pre-year').onclick = () => {
    --currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
    ++currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = {value: currentDate.getMonth()};
let currentYear = {value: currentDate.getFullYear()};
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
};
const currentDateFormate = new Intl.DateTimeFormat(
    'pt-BR',
    showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;
setInterval(() => {
    const timer = new Date();
    const option = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    const formateTimer = new Intl.DateTimeFormat('pt-br', option).format(timer);
    let time = `${`${timer.getHours()}`.padStart(
        2,
        '0'
    )}:${`${timer.getMinutes()}`.padStart(
        2,
        '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
    todayShowTime.textContent = formateTimer;
}, 1000);


const list = document.getElementById("lista");

(async () => {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
        body: JSON.stringify({token}),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()

    // data = USUARIO DO BANCO

    const consultores = []

    // VALIDACAO DE SECRETARIA MELHOR DPS
    if (data.Usuario === 'Sandra') {
        consultores.push(
            "Nayara",
            "Sandra",
            "Viviane"
        )
    } else {
        consultores.push(data.Usuario)
    }



    consultores.forEach(consultor => {
        list.innerHTML += `<option value="${consultor}">${consultor}</option>`
    })
})().catch(console.error)

list.onchange = async function (e) {
    await carregarLista(true)

    document.getElementById('selectedName').innerHTML = `AGENDA DR(a) - ${list.value}`
}

const espec = document.getElementById("especialista");


const nomeDoDoutor1 = "(nenhum)"
const nomeDoDoutor2 = "Nayara"
const nomeDoDoutor3 = "Sandra"
const nomeDoDoutor4 = "Viviane"


espec.innerHTML += `<option>${nomeDoDoutor1}</option>`;
espec.innerHTML += `<option>${nomeDoDoutor2}</option>`;
espec.innerHTML += `<option>${nomeDoDoutor3}</option>`;
espec.innerHTML += `<option>${nomeDoDoutor4}</option>`;

// let retornoDoBanco = funcaoQuePegaDoBanco();

// for (let index = 0; index < retornoDoBanco.length; index++) {
//     espec.innerHTML += `<option>${retornoDoBanco[index]}</option>`;
    
// }


// let retornoDoBanco = funcaoQuePegaDoBancoUSUARIO("parametroMedico");

// for (let index = 0; index < retornoDoBanco.length; index++) {
//     espec.innerHTML += `<option>${retornoDoBanco[index]}</option>`;    
// }



const statusp = document.getElementById("status_pagamento");

const tipoDoStatus1 = "(nenhum)"
const tipoDoStatus2 = "Pago"
const tipoDoStatus3 = "Pendente"

statusp.innerHTML += `<option>${tipoDoStatus1}</option>`;
statusp.innerHTML += `<option>${tipoDoStatus2}</option>`;
statusp.innerHTML += `<option>${tipoDoStatus3}</option>`;

const statusc = document.getElementById("status_c");

const tipoDoStatusc1 = "(nenhum)"
const tipoDoStatusc2 = "Confirmado"
const tipoDoStatusc3 = "Aguardando Confirmação"
const tipoDoStatusc4 = "Cancelado"

statusc.innerHTML += `<option>${tipoDoStatusc1}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc2}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc3}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc4}</option>`;


document.getElementById('agendamento').addEventListener('click', () => {
    document.getElementById("formagendamento").dataset.agendamentoId = "0";
    nameinp.value = "" // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
    phoneinp.value = ""
    especialistainp.value = ""
    data_atendimentoinp.value = ""
    horario_consultainp.value = ""
    valor_consultainpinp.value = ""
    status_consultainp.value = ""
    status_pagamentoinp.value = ""
    observacaoinp.value = ""
    modAgen.showModal()
});

document.getElementById('btn-close').addEventListener('click', () => {
    modAgen.close()
})

document.getElementById("btn_voltar_a").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html' 
})


const nameinp = document.getElementById("name") //O getElementById tem que ser igual o id
const phoneinp = document.getElementById("phone")
const especialistainp = document.getElementById("especialista")
const data_atendimentoinp = document.getElementById("data_atendimento")
const horario_consultainp = document.getElementById("horario_consulta")
const valor_consultainpinp = document.getElementById("valor_consulta")
const status_consultainp = document.getElementById("status_c")
const status_pagamentoinp = document.getElementById("status_pagamento")
const observacaoinp = document.getElementById("observacao")

function calculadata(){

    var repeticoes = parseInt(document.getElementById("repeticoes").value);
    var tipo = document.getElementById("periodo").value;
    var periodo = 0;
    var dataBrasileira = document.getElementById("data_atendimento").value;
    var dataISO = converterDataFormatoBrasileiroParaISO(dataBrasileira);
    
    switch (tipo) {
      case "semanal":
        periodo = 7;
        break;
      case "quinzenal":
        periodo = 15;
        break;
      case "mensal":
        periodo = 30;
        break;
      case "anual":
        periodo = 365;
        break;
      default:
        periodo = 0;
        break;
    }
    var texto = "";
    var arrayData = [];
    
    for (var i = 1; i <= repeticoes; i++) {
      var data = new Date(dataISO);
      data.setDate(data.getDate() + i * periodo);
      arrayData.push(data);
    }
        return arrayData;
    }

    document.getElementById('mostrarSubform').addEventListener('change', function() {
        var subform = document.getElementById('subform');
        subform.style.display = this.checked ? 'block' : 'none';
    });

function converterDataFormatoBrasileiroParaISO(data) {
    var partes = data.split("/");
    return partes[2] + "-" + partes[1] + "-" + partes[0];
}
      
function agendamento(event) {
    event.preventDefault()

    const {agendamentoId} = document.getElementById("formagendamento").dataset

    if (agendamentoId === '0') {

        let datasFuturasProgramadas = calculadata();

        if(datasFuturasProgramadas.length > 0){

            for (let index = 0; index < datasFuturasProgramadas.length; index++) {
                fetch("/agendamento", {
                    method: "POST", body: JSON.stringify({
        
                        Nome: nameinp.value, // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
                        Telefone: phoneinp.value,
                        Especialista: especialistainp.value,
                        Data_do_Atendimento: datasFuturasProgramadas[index],
                        Horario_da_consulta: horario_consultainp.value,
                        Valor_da_Consulta: valor_consultainpinp.value,
                        Status_da_Consulta: status_consultainp.value,
                        Status_do_pagamento: status_pagamentoinp.value,
                        observacao: observacaoinp.value,
        
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(response => response.json()).then(data => {
                    console.log("Agendamento Futuro Agendado com sucesso!")
                }).catch(() => alert("Erro ao Agendar"))
            }

            
        }

        fetch("/agendamento", {
            method: "POST", body: JSON.stringify({

                Nome: nameinp.value, // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
                Telefone: phoneinp.value,
                Especialista: especialistainp.value,
                Data_do_Atendimento: data_atendimentoinp.value,
                Horario_da_consulta: horario_consultainp.value,
                Valor_da_Consulta: valor_consultainpinp.value,
                Status_da_Consulta: status_consultainp.value,
                Status_do_pagamento: status_pagamentoinp.value,
                observacao: observacaoinp.value,

            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            alert("Paciente Agendado com sucesso!")

            nameinp.value = "" // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
            phoneinp.value = ""
            especialistainp.value = ""
            data_atendimentoinp.value = ""
            horario_consultainp.value = ""
            valor_consultainpinp.value = ""
            status_consultainp.value = ""
            status_pagamentoinp.value = ""
            observacaoinp.value = ""

            carregarLista(true).catch(console.error)
        }).catch(() => alert("Erro ao Agendar"))
    } else {

      fetch("/agendamento", {
        method: "PUT", body: JSON.stringify({
          id: agendamentoId,
          Nome: nameinp.value,
          Telefone: phoneinp.value,
          Especialista: especialistainp.value,
          Data_do_Atendimento: data_atendimentoinp.value,
          Horario_da_consulta: horario_consultainp.value,
          Valor_da_Consulta: valor_consultainpinp.value,
          Status_da_Consulta: status_consultainp.value,
          Status_do_pagamento: status_pagamentoinp.value,
          observacao: observacaoinp.value,

        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        alert("Paciente Atualizado com sucesso!")
        carregarLista(true).catch(console.error)
      }).catch(() => {
        alert("Erro ao atualizar")
      })




      

// Lista de espera

const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const convenioinp = document.getElementById("convenio")
const especialistainp = document.getElementById("especialista")
const observacaoinp = document.getElementById("observacao")


function cadastro_espera(event) {
    event.preventDefault()
    fetch("/cadastro_paciente", {
        method: "POST",
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Convenio: convenioinp.value,
            Especialista: especialistainp.value,
            Observacao: observacaoinp.value,
       
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Paciente adicionado a lista de espera com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao adicionar"))
}


    }


    function  espera(event) {
        event.preventDefault()
    
        const {esperaId} = document.getElementById("formespera").dataset
    contentEl.onclick = () => {
        modEspera.showModal()

    }
        nameinp.value = arg.Nome
        phoneinp.value = arg.Telefone
        convenioinp.Value = arg.Convenio
        especialistainp.value = arg.Especialista
        observacaoinp.value = arg.observacao

        document.getElementById("formespera").esperaId = arg.id
    }
}
