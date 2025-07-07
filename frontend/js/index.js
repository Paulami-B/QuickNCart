import { apiUrl, openModal } from "./common.js";

const getOrders = async () => {
  try {
    const response = await fetch(`${apiUrl}/getAllOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let total = 0;

    const result = await response.json();

    const tbody = document.getElementById("orders-body");
    tbody.innerHTML = "";

    result.forEach((order) => {
      const tr = document.createElement("tr");
      tr.classList.add("order-row");

      tr.addEventListener("click", () => {
        location.href = `order-details.html?order_id=${order.o_id}&buyer=${order.o_name}`;
      });

      tr.innerHTML = `
                <td>${order.o_id}</td>
                <td>${order.o_date}</td>
                <td>${order.o_name}</td>
                <td class="last-col">
                    <p>₹ ${parseFloat(order.total).toFixed(2)}</p>
                    <button class="delete">
                    <i class="fa fa-minus-circle"></i>
                    </button>
                </td>
            `;

      total = total + order.total;
      const deleteBtn = tr.querySelector(".delete");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteModal(order.o_id);
      });

      tbody.appendChild(tr);
    });
    document.querySelector(".total").innerHTML = `₹ ${total.toFixed(2)}`;
  } catch (error) {
    console.error(error);
  }
};

function showDeleteModal(o_id) {
  const message = `You’re about to delete Order #${o_id}.`;
  document.querySelector(".modal-header").innerHTML = message;
  const deleteBtn = document.getElementById("confirm-1");
  deleteBtn.dataset.orderId = o_id;
  document.getElementById("deleteModal").style.display = "block";
}

function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

async function deleteOrder(orderId) {
  console.log("Order ID: ", orderId);
  try {
    await fetch(`${apiUrl}/deleteOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    openModal("msgModal-1", `Order #${orderId} deleted successfully`);
    getOrders();
  } catch (err) {
    console.error("Delete error:", err);
    openModal("msgModal-1", `Error while deleting Order #${orderId}`);
  }
}

const confirmDelete = document.getElementById("confirm-1");

confirmDelete.addEventListener("click", () => {
  hideDeleteModal();
  deleteOrder(confirmDelete.dataset.orderId);
});

document.getElementById("cancel-1").addEventListener("click", hideDeleteModal);

window.addEventListener("DOMContentLoaded", getOrders);
