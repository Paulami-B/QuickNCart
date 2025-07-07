import { apiUrl, openModal } from "./common.js";

function showDeleteModal(p_id) {
  const message = `You’re about to delete Product #${p_id}.`;
  const header = document.querySelector(".modal-header");
  header.innerHTML = message;
  const modal = document.getElementById("deleteProductModal");
  const deleteBtn = document.getElementById("confirm-4");
  deleteBtn.dataset.productId = p_id;
  modal.style.display = "block";
}

function showAddModal() {
  const modal = document.getElementById("addModal");
  modal.style.display = "block";
}

async function addProduct() {
  const p_name = document.getElementById("product-name").value.trim();
  const unit = document.getElementById("units").value.trim();
  const price = parseFloat(document.getElementById("amount").value);

  if (!p_name) {
    hideModal("addModal");
    openModal("msgModal-3", "Product name is required");
    return;
  }
  if (isNaN(price) || price <= 0) {
    hideModal("addModal");
    openModal("msgModal-3", "Invalid Price");
    return;
  }

  const data = {
    product_name: p_name,
    unit: unit,
    price_per_unit: price,
  };
  try {
    const res = await fetch(`${apiUrl}/insertProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Server Error Response:", errText);
      throw new Error(`HTTP ${res.status}`);
    }

    const result = await res.json();
    openModal("msgModal-3", `Product with ID ${result.product_id} added!!`);
    getProducts();
  } catch (error) {
    console.log(error);
    openModal("msgModal-3", "Error while adding product");
  }
}

function hideModal(id) {
  document.getElementById(id).style.display = "none";
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
                <td>${product.name}</td>
                <td class="last-col">
                    <p>₹ ${parseFloat(product.price).toFixed(2)}/${
        product.unit
      }</p>
                    <button class="delete">
                        <i class="fa fa-minus-circle"></i>
                    </button>
                </td>
            `;

      const deleteBtn = tr.querySelector(".delete");
      deleteBtn.addEventListener("click", () => {
        showDeleteModal(product.id);
      });

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(productId) {
  try {
    const res = await fetch(`${apiUrl}/deleteProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    const result = await res.json();
    openModal("msgModal-3", `Product with ID #${result.product_id} deleted`);
    getProducts();
  } catch (error) {
    openModal(
      "msgModal-3",
      `Error while deleting product #${result.product_id}`
    );
    console.log(error);
  }
}

const confirmDelete = document.getElementById("confirm-4");
confirmDelete.addEventListener("click", () => {
  hideModal("deleteProductModal");
  deleteProduct(confirmDelete.dataset.productId);
});
document.getElementById("add-product").addEventListener("click", showAddModal);
document.getElementById("confirm-3").addEventListener("click", () => {
  hideModal("addModal");
  addProduct();
});
document.getElementById("cancel-3").addEventListener("click", (e) => {
  hideModal("addModal");
});
document.getElementById("cancel-4").addEventListener("click", (e) => {
  hideModal("deleteProductModal");
});

window.addEventListener("DOMContentLoaded", getProducts);
