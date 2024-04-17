verificaAutenticado()


const tbody = document.querySelector("tbody");
const type = document.querySelector("#type");
let items;

function editarItem(index) {
  const url = new URL(window.location.href)
  url.pathname = `/sistema/EditarPacientes/editar.html`
  url.searchParams.set("id", items[index].id);
  window.location.href = url.toString()
}

function insertItem(item, index) {
  let nomePaciente = document.getElementById("name").value;
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${name}</td>
    <td class="columnAction">
      <button onclick="editarItem()">Editar</button>
    </td>
  `;
  let table_container = document.getElementById("table_container");
  table_container.appendChild(tr);
}

function loadItens() {
  getItensBD().then(() => {
    tbody.innerHTML = "";
    items.forEach((item, index) => {
      insertItem(item, index);
    });

  }).catch(console.error)
}


const getItensBD = async () => {
  const response = await fetch('/pacientes')
  items = await response.json()
}


loadItens();

document.getElementById("ch-side").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita o envio do formulário padrão
  insertItem(); // Chama a função insertItem para adicionar o item à tabela
});

