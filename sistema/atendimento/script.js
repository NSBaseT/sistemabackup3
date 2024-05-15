// Selecionando elementos do DOM
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const formContent = document.getElementById('formContent');
const nomePacienteInput = document.getElementById('nomePaciente');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const limparButton = document.getElementById('limparButton');

let timerInterval;
let timerSeconds = 0;
let timerPaused = false;
let atendimentos = [];

let conteudoAtestado = ""
let conteudoAnaminese = ""
let conteudoProntuario = ""

// Função para atualizar o tempo do timer
function updateTimer() {
    if (!timerPaused) {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Evento de clique no botão de iniciar
startButton.addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Evento de clique no botão de pausar
pauseButton.addEventListener('click', () => {
    timerPaused = !timerPaused;
});

// Evento de clique no botão de finalizar atendimento
stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const nomePaciente = nomePacienteInput.value;
    if (nomePaciente) {
        const now = new Date();
        const dataHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const tempoAtendimento = timerSeconds; // Tempo de atendimento em segundos
        
        // Criando um objeto para representar o paciente
        const paciente = {
            nome: nomePaciente,
            atendimentos: []
        };

        // Criando um objeto para representar o atendimento
        const atendimento = {
            tipo: formTitle.textContent,
            conteudoAtestado,
            conteudoAnaminese,
            conteudoProntuario,
            dataHora: dataHora,
            tempo: tempoAtendimento,
            paciente: paciente // Referência para o paciente
        };
        
        // Adicionando o atendimento à lista de atendimentos do paciente
        paciente.atendimentos.push(atendimento);

        // Adicionando o atendimento à lista geral de atendimentos
        atendimentos.push(atendimento);

        const listItem = document.createElement('li');
        listItem.textContent = `${dataHora} - ${nomePaciente}`;
        listItem.addEventListener('click', () => openAtendimentoDetails(atendimento));
        historyList.appendChild(listItem);
    }
    // Limpa campos
    formTitle.textContent = '';
    nomePacienteInput.value = '';
    formContent.value = '';
    fileInput.value = '';
    timerSeconds = 0; // Zera o contador do timer
    updateTimer(); // Atualiza o timer
});

// Função para exibir os detalhes do atendimento
function openAtendimentoDetails(atendimento) {
    conteudoAnaminese = atendimento.conteudoAnaminese
    conteudoAtestado = atendimento.conteudoAtestado
    conteudoProntuario = atendimento.conteudoProntuario

    nomePacienteInput.value = atendimento.paciente.nome; // Usamos o nome do paciente associado ao atendimento

    const tempoAtendimento = atendimento.tempo;
    const hours = Math.floor(tempoAtendimento / 3600);
    const minutes = Math.floor((tempoAtendimento % 3600) / 60);
    const seconds = tempoAtendimento % 60;
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para abrir o formulário correspondente
function openForm(title) {
    formTitle.textContent = title;

    if (title === "Anamnese") {
        formContent.value = conteudoAnaminese;
    }

    if (title === "Atestado") {
        formContent.value = conteudoAtestado;
    }

    if (title === "Prontuário") {
        formContent.value = conteudoProntuario;
    }
}

// Evento de limpar o formulário
limparButton.addEventListener('click', () => {
    formTitle.textContent = '';
    nomePacienteInput.value = '';
    formContent.value = '';
    fileInput.value = '';
});


formContent.addEventListener("change", e => {
    const title = formTitle.textContent;
    const content = e.target.value

    if (title === "Anamnese") {
        conteudoAnaminese = content;
    }

    if (title === "Atestado") {
        conteudoAtestado = content;
    }

    if (title === "Prontuário") {
         conteudoProntuario = content;
    }
})
