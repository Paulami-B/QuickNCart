const apiUrl = 'http://127.0.0.1:5000/';

let orders = []
function updateRowUI(row, value) {
  const qtyEl = row.querySelector('.qty');
  const removeBtn = row.querySelector('.remove-btn');

  qtyEl.textContent = value;
  if (removeBtn) {
    removeBtn.disabled = value <= 0;
  }
}

function addOrUpdateProduct(p_name, qtyToAdd) {
  const existing = orders.find(item => item.p_name === p_name);
  
  if (existing) {
    existing.qty += qtyToAdd;
  } else {
    orders.push({ p_name, qty: qtyToAdd });
  }
}

function updateAmount(row, qtyChange) {
    const orderBtn = document.getElementById('order-btn');
    const priceEl = row.querySelector('.price');
    const priceText = priceEl.textContent;
    const price = Number(priceText.split(" ")[1].split("/")[0]);
    const amtEl = document.querySelector('.amt');
    const amtStr = amtEl.textContent;
    let currentAmt = Number(amtStr.split(" ")[1]);

    const newAmt = currentAmt + qtyChange * price;
    orderBtn.disabled = newAmt<=0;
    amtEl.textContent = `₹ ${newAmt.toFixed(2)}`;

    const nameEl = row.querySelector('.p-name');
    const nameText = nameEl.textContent;
    addOrUpdateProduct(nameText, qtyChange);
}

function remove(button) {
  const row = button.closest('tr');
  const qtyEl = row.querySelector('.qty');
  let value = Number(qtyEl.textContent);

  if (value > 0) {
    value--;
    updateRowUI(row, value);
    updateAmount(row, -1);
  }
}

function add(button) {
  const row = button.closest('tr');
  const qtyEl = row.querySelector('.qty');
  let value = Number(qtyEl.textContent);

  value++;
  updateRowUI(row, value);
  updateAmount(row, 1);
}

async function getProducts(){
  try {
    const response = await fetch(`${apiUrl}/getProducts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = "";

    result.forEach(product => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${product.id}</td>
        <td class="p-name">${product.name}</td>
        <td class="price">₹ ${product.price}/${product.unit}</td>
        <td class="last-col">
          <p class="qty">0</p>
          <button class="remove-btn" onclick="remove(this)" disabled>
            <i class="fa fa-minus-circle"></i>
          </button>
          <button class="add-btn" onclick="add(this)">
            <i class="fa fa-plus-circle"></i>
          </button>
        </td>
      `

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
  }
}

function getDate(date = new Date()) {
  const pad = num => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);     // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function showNameModal() {
  const amtEl = document.querySelector('.amt');
  const amtStr = amtEl.textContent;
  const message = `Total Cost: ${amtStr}`;
  document.querySelector('.modal-header').innerHTML = message;
  document.getElementById('nameModal').style.display = 'block';
}

function hideNameModal() {
  const modal = document.getElementById("nameModal");
  setTimeout(() => {
    modal.style.display = "none"
  }, 1000);
}

async function placeOrder(){
  try {
    inputEl = document.getElementById('c-name');
    inputText = inputEl.value;
    data = {
      c_name : inputText,
      date : getDate(),
      items: orders
    }
    const response = await fetch(`${apiUrl}/insertOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if(response.ok){
      const modalDiv = document.querySelector('.modal-content');
      modalDiv.innerHTML = "";
      const p = document.createElement('p');
      p.classList.add('modal-header');
      p.innerHTML = "Order placed successfully";
      modalDiv.appendChild(p);
      hideNameModal();
      getProducts();
    }
  } catch (error) {
    console.log(error);
  }
}


window.addEventListener('DOMContentLoaded', getProducts);