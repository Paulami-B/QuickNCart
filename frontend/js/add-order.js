import { apiUrl, openModal } from "./common.js";

let orders = [];
function updateRowUI(row, value) {
  const qtyEl = row.querySelector(".qty");
  const removeBtn = row.querySelector(".remove-btn");

  qtyEl.textContent = value;
  if (removeBtn) {
    removeBtn.disabled = value <= 0;
  }
}

function addOrUpdateProduct(p_name, qtyToAdd) {
  const existing = orders.find((item) => item.p_name === p_name);

  if (existing) {
    existing.qty += qtyToAdd;
  } else {
    orders.push({ p_name, qty: qtyToAdd });
  }
}

function updateAmount(row, qtyChange) {
  const orderBtn = document.getElementById("order-btn");
  const priceEl = row.querySelector(".price");
  const priceText = priceEl.textContent;
  const price = Number(priceText.split(" ")[1].split("/")[0]);
  const amtEl = document.getElementById("order-amt");
  const amtStr = amtEl.textContent;
  let currentAmt = Number(amtStr.split(" ")[1]);

  const newAmt = currentAmt + qtyChange * price;
  orderBtn.disabled = newAmt <= 0;
  amtEl.textContent = `₹ ${newAmt.toFixed(2)}`;

  const nameEl = row.querySelector(".p-name");
  const nameText = nameEl.textContent;
  addOrUpdateProduct(nameText, qtyChange);
}

function remove(button) {
  const row = button.closest("tr");
  const qtyEl = row.querySelector(".qty");
  let value = Number(qtyEl.textContent);

  if (value > 0) {
    value--;
    updateRowUI(row, value);
    updateAmount(row, -1);
  }
}

function add(button) {
  const row = button.closest("tr");
  const qtyEl = row.querySelector(".qty");
  let value = Number(qtyEl.textContent);

  value++;
  updateRowUI(row, value);
  updateAmount(row, 1);
}

async function getProducts() {
  try {
    const response = await fetch(`${apiUrl}/getProducts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    const tbody = document.getElementById("products-body");
    tbody.innerHTML = "";

    result.forEach((product) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${product.id}</td>
        <td class="p-name">${product.name}</td>
        <td class="price">₹ ${product.price.toFixed(2)}/${product.unit}</td>
        <td class="last-col">
          <p class="qty">0</p>
          <button class="remove-btn" disabled>
            <i class="fa fa-minus-circle"></i>
          </button>
          <button class="add-btn">
            <i class="fa fa-plus-circle"></i>
          </button>
        </td>
      `;

      const removeBtn = tr.querySelector(".remove-btn");
      removeBtn.addEventListener("click", remove(removeBtn));
      const addBtn = tr.querySelector(".add-btn");
      addBtn.addEventListener("click", () => add(addBtn));

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
  }
}

function getDate(date = new Date()) {
  const pad = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function showNameModal() {
  const amtEl = document.getElementById("order-amt");
  const amtStr = amtEl.textContent;
  const message = `Total Cost: ${amtStr}`;
  document.querySelector(".modal-header").innerHTML = message;
  document.getElementById("nameModal").style.display = "block";
}

function hideNameModal() {
  document.getElementById("nameModal").style.display = "none";
}

async function placeOrder() {
  try {
    const inputEl = document.getElementById("c-name");
    const inputText = inputEl.value;
    const data = {
      c_name: inputText,
      date: getDate(),
      items: orders,
    };
    const response = await fetch(`${apiUrl}/insertOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      openModal("msgModal-2", "Order placed successfully");
      getProducts();
    }
  } catch (error) {
    openModal("msgModal-2", "Error while placing order");
    console.log(error);
  }
}

document.getElementById("order-btn").addEventListener("click", showNameModal);
document.getElementById("confirm-2").addEventListener("click", () => {
  hideNameModal();
  placeOrder();
});
document.getElementById("cancel-2").addEventListener("click", hideNameModal);

window.addEventListener("DOMContentLoaded", getProducts);
