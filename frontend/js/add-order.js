function updateRowUI(row, value) {
  const qtyEl = row.querySelector('.qty');
  const removeBtn = row.querySelector('.remove-btn');

  qtyEl.textContent = value;
  if (removeBtn) {
    removeBtn.disabled = value <= 0;
  }
}

function updateAmount(row, qtyChange) {
    const priceEl = row.querySelector('.price');
    const priceText = priceEl.textContent;
    const price = Number(priceText.split(" ")[1].split("/")[0]);
    const amtEl = document.querySelector('.amt');
    const amtStr = amtEl.textContent;
    let currentAmt = Number(amtStr.split(" ")[1]);

    const newAmt = currentAmt + qtyChange * price;
    amtEl.textContent = `₹ ${newAmt.toFixed(2)}`;
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