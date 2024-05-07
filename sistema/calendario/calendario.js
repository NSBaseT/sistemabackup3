verificaAutenticado()

const modAgen = document.getElementById('mod-agen')
const modEspera = document.getElementById('mod-espera')
const modCancelado = document.getElementById('mod-cancelado')

let todosPacientes = []

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
            contentEl.innerHTML = `${todosPacientes.find(pac => arg.Nome === pac.id).Nome} - Especialista: ${arg.Especialista}  ${arg.observacao}`

            contentEl.style = 'cursor: pointer; user-select: none;'

            contentEl.onclick = () => {
                modAgen.showModal()

                nameinp.value = arg.Nome
                phoneinp.value = arg.Telefone
                list.value = arg.Especialista
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
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
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


const list = document.getElementById("lista")

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

    // data = USUARIO DO BANCO LOGADO

// -----------------------------------

    const response2 = await fetch('/users')
    const consultores = await response2.json()

    if (data.Secretaria) {
        consultores.forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
        })
    } else {
        [data].forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
            console.log(Usuario)
        })
    }
})().catch(console.error)

list.onchange = async function (e) {
    await carregarLista(true)

    document.getElementById('selectedName').innerHTML = `AGENDA DR(a) - ${list.value}`
}

const espec = document.getElementById("especialista");


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

;(async () => {
    const response = await fetch('/pacientes')
    todosPacientes = await response.json()
})()

let pacientesFiltrados = []


document.getElementById('agendamento').addEventListener('click', () => {
    if (list.value === "-") {
        return
    }

    pacientesFiltrados = todosPacientes.filter(({Especialista}) => Especialista === list.value)

    nameinp.innerHTML = ''
    pacientesFiltrados.forEach(item => {
        nameinp.innerHTML += `<option value="${item.id}">${item.Nome}</option>`
    })

    document.getElementById("formagendamento").dataset.agendamentoId = "0";
    nameinp.value = "" // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
    phoneinp.value = ""
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


const nameinp = document.getElementById("age_name") //O getElementById tem que ser igual o id
const phoneinp = document.getElementById("phone")
const data_atendimentoinp = document.getElementById("data_atendimento")
const horario_consultainp = document.getElementById("horario_consulta")
const valor_consultainpinp = document.getElementById("valor_consulta")
const status_consultainp = document.getElementById("status_c")
const status_pagamentoinp = document.getElementById("status_pagamento")
const observacaoinp = document.getElementById("observacao")

function atualizaTelefone() {
    const paciente = pacientesFiltrados.find(paciente => paciente.id = nameinp.value)
    phoneinp.value = paciente.Telefone
}

function calculadata() {

    var repeticoes = parseInt(document.getElementById("repeticoes").value);
    var tipo = document.getElementById("periodo").value;
    var periodo = 0;
    var dataBrasileira = document.getElementById("data_atendimento").value;


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
        var data = new Date(dataBrasileira);
        data.setDate(data.getDate() + i * periodo)
        arrayData.push(data);
    }
    return arrayData;
}

document.getElementById('mostrarSubform').addEventListener('change', function () {
    var subform = document.getElementById('subform');
    subform.style.display = this.checked ? 'block' : 'none';
});

function converterDataFormatoBrasileiroParaISO(data) {
   var partes = data.split("/");
   return partes[2] + "-" + partes[1] + "-" + partes[0];
 }

function agendamento(event) {
    event.preventDefault()

    const { agendamentoId } = document.getElementById("formagendamento").dataset

    if (agendamentoId === '0') {

        let datasFuturasProgramadas = calculadata();

        if (datasFuturasProgramadas.length > 0) {

            for (let index = 0; index < datasFuturasProgramadas.length; index++) {
                fetch("/agendamento", {
                    method: "POST", body: JSON.stringify({

                        Nome: nameinp.value, // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
                        Telefone: phoneinp.value,
                        Especialista: list.value,
                        Data_do_Atendimento: datasFuturasProgramadas[index].toISOString().split('T')[0],
                        Horario_da_consulta: horario_consultainp.value,
                        Valor_da_Consulta: Number(valor_consultainpinp.value),
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
                Especialista: list.value,
                Data_do_Atendimento: data_atendimentoinp.value,
                Horario_da_consulta: horario_consultainp.value,
                Valor_da_Consulta: Number(valor_consultainpinp.value),
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
                Especialista: list.value,
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
    }


    function cadastro_espera(event) {
        event.preventDefault()
        fetch("/cadastro_paciente", {
            method: "POST",
            body: JSON.stringify({
                Nome: nameinp.value,
                Telefone: phoneinp.value,
                Convenio: convenioinp.value,
                Especialista: list.value,
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



function AbrirEspera() {
    // modEspera.showModal()
    if (typeof modEspera.showModal === "function") {
        modEspera.showModal(); // Abre o modal
    } else {
        // Fallback para navegadores que não suportam showModal
        modEspera.style.display = "block";
    }
}

function espera(event) {
    event.preventDefault()



    const nameinp = document.getElementById("esp-name")
    const phoneinp = document.getElementById("phone")
    const convenioinp = document.getElementById("convenio")
    const observacaoinp = document.getElementById("observacao")

   

    fetch('/Lista_espera', {
        method: 'POST',
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Convenio: convenioinp.value,
            Especialista: list.value,
            Observacao: observacaoinp.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        loadItens()
    })

}

// loadintens espera
const getItensBD = async () => {
    const response = await fetch('/Lista_espera')
    items = await response.json()
}

function insertItem(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.Nome}</td>
      <td>${item.Telefone}</td>
      <td>${item.Convenio}</td>
      <td>${item.Observacao}</td>
      <td>${item.Especialista}</td>
      <td class="columnAction">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>
    `;

    tbody.appendChild(tr);
}

const tbody = document.querySelector("tbody");

function loadItens() {
    getItensBD().then(() => {
        tbody.innerHTML = "";
        items.forEach((item, index) => {
            insertItem(item, index);
        });

    }).catch(console.error)
}

document.getElementById('btn-close-espera').addEventListener('click', () => {
    modEspera.close()
})

loadItens()

// CANCELADO

const tbodyCancelado = document.getElementById("tbodyCancelado");

const getConsultasBD = async (valuePacienteFiltrado) => {

    const response = await fetch("/agendamentos_filtrado?id="+valuePacienteFiltrado, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    itemsCancelado = await response.json();
}

function loadConsultas(event) {    
    event.preventDefault()
    let pacienteFiltrado = document.getElementById("age_name_cancelado");
    let valuePacienteFiltrado = pacienteFiltrado.value;
    getConsultasBD(valuePacienteFiltrado).then(() => {
        tbodyCancelado.innerHTML = "";
        itemsCancelado.forEach((item, index) => {
            insertItemCancelado(item, index);
        });

    }).catch(console.error)
}



function insertItemCancelado(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td id="${item.value}">${item.Nome}</td>
      <td>${item.Data_do_Atendimento}</td>
      <td>${item.Horario_da_consulta}</td>
      <td>${item.Status_da_Consulta}</td>
    `;

    tbodyCancelado.appendChild(tr);
}

  

function deleteItemInDB(event,index) {
    fetch("/agendamento_desabilitado", {
      method: "PUT",
      body: JSON.stringify({
        id: index,
        Status_da_Consulta: "Cancelado",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.json()).then(data => {
        loadConsultas(event)
    })
}


function deleteSelectedRows(event) {

    event.preventDefault()
  
    var table = document.getElementById("tableCancelados");
    var checkboxes = table.querySelectorAll("input[type='checkbox']:checked");
  
    checkboxes.forEach(function(checkbox) {
      var row = checkbox.parentNode.parentNode;
  
      var parentTd = checkbox.parentElement;
      var nextTd = parentTd.nextElementSibling;
    var idDoElemento = nextTd.getAttribute('id');
    //   row.parentNode.removeChild(row);
  
      deleteItemInDB(event,idDoElemento);
    });
  }

  var elementos = document.getElementsByClassName('trashCancelado');

  // Itera sobre a lista de elementos
  for (var i = 0; i < elementos.length; i++) {
      // Adiciona um ouvinte de evento de clique a cada elemento
      elementos[i].addEventListener('click', function(event) {
          // Impede o comportamento padrão do evento (neste caso, o clique)
          event.preventDefault();
          
          // Insira aqui o que você deseja fazer quando um elemento com a classe 'trashCancelado' for clicado
      });
  }


document.getElementById('btn-close-cancelado').addEventListener('click', () => {
    modCancelado.close()
})

function AbrirCancelado() {
    // modEspera.showModal()
    if (typeof modCancelado.showModal === "function") {
        modCancelado.showModal(); // Abre o modal
    } else {
        // Fallback para navegadores que não suportam showModal
        modCancelado.style.display = "block";
    }
}

let pacientesFiltradosCancelado = []
const nameinpcancelado = document.getElementById("age_name_cancelado")


document.getElementById('cancelado').addEventListener('click', () => {
    if (list.value === "-") {
        return
    }

    pacientesFiltradosCancelado = todosPacientes.filter(({Especialista}) => Especialista === list.value)

    nameinpcancelado.innerHTML = ''
    pacientesFiltradosCancelado.forEach(item => {
        nameinpcancelado.innerHTML += `<option value="${item.id}">${item.Nome}</option>`
    })

    modCancelado.showModal()
});