const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const form = document.getElementById("transaction-form");
const list = document.getElementById("transactions-list");
const resetBtn = document.getElementById("reset-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let selectedType = "";

/* Chart */
const chart = new Chart(document.getElementById("chart"), {
    type: "doughnut",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [0, 0],
            backgroundColor: ["#2ecc71", "#e74c3c"]
        }]
    }
});

/* Select income / expense */
document.querySelectorAll(".radio-option").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".radio-option").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedType = btn.dataset.type;
    });
});

/* Add Transaction */
form.addEventListener("submit", e => {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        title: title.value,
        amount: +amount.value,
        type: selectedType,
        category: category.value,
        date: date.value
    };

    if (!selectedType) return alert("Select income or expense");

    transactions.push(transaction);
    saveAndRender();
    form.reset();
});

/* Render Transactions */
function render() {
    list.innerHTML = "";

    let income = 0, expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;

        const div = document.createElement("div");
        div.className = `transaction ${t.type}`;
        div.innerHTML = `
            <span>${t.title}</span>
            <span>${t.type === "income" ? "+" : "-"}₹${t.amount}</span>
            <button onclick="remove(${t.id})">❌</button>
        `;
        list.appendChild(div);
    });

    balanceEl.textContent = `₹${income - expense}`;
    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;

    chart.data.datasets[0].data = [income, expense];
    chart.update();
}

/* Remove */
function remove(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveAndRender();
}

/* Save */
function saveAndRender() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    render();
}

/* Reset */
resetBtn.addEventListener("click", () => {
    if (confirm("Reset all data?")) {
        transactions = [];
        saveAndRender();
    }
});

/* Init */
render();
