verificaAutenticado()


const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = []

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Preencha todos os campos!");
  }

  const Descricao = descItem.value
  const Valor = amount.value
  const Tipo = type.value

  descItem.value = "";
  amount.value = "";

  fetch('/Fluxo_de_caixa', {
    method: 'POST',
    body: JSON.stringify({
      Descricao,
      Valor,
      Tipo
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  })

};

function deleteItem(index) {


  fetch('/Fluxo_de_caixa', {
    method: 'DELETE',
    body: JSON.stringify({
    id: items[index].id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  })
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Descricao}</td>
    <td>R$ ${item.Valor}</td>
    <td class="columnType">${
      item.Tipo === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
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

    getTotals();
  }).catch(console.error)
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = async () => {
  const response = await fetch('/Fluxo_de_caixa')
  items = await response.json()
}


loadItens();