verificaAutenticado()


const tbody = document.querySelector("tbody");
const type = document.querySelector("#type");
let items = []

function editarItem(index) {
  const url = new URL(window.location.href)
  url.pathname = `/sistema/EditarPacientes/editar.html`
  url.searchParams.set("id", items[index].id);
  window.location.href = url.toString()
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Nome}</td>
  </td>
    <td class="columnAction">
      <button onclick="editarItem(${index})"><i class='bx bx-pencil'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
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