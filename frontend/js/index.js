const apiUrl = 'http://127.0.0.1:5000/';

const getOrders = async() => {
    console.log("Started");
    try {
        const response = await fetch(`${apiUrl}/getAllOrders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        const tbody = document.getElementById("orders-body");
        tbody.innerHTML = "";

        result.forEach(order => {
            const tr = document.createElement("tr");
            tr.classList.add("order-row");

            tr.addEventListener("click", () => {
                location.href = `order-details.html?order_id=${order.o_id}`;
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
            
            const deleteBtn = tr.querySelector('.delete');
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                orderToDelete = order.o_id;
                showDeleteModal(order.o_id);
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
    }
}

function showDeleteModal(o_id) {
  const message = `You’re about to delete Order #${o_id}.`;
  document.querySelector('.modal-header').innerHTML = message;
  document.getElementById('deleteModal').dataset.orderId = o_id;
  document.getElementById('deleteModal').style.display = 'block';
}


function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}


async function deleteOrder(orderId) {
  try {
    const res = await fetch(`${apiUrl}/deleteOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_id: orderId })
    });

    if (res.ok) {
      alert("Order deleted!");
      getOrders();
    } else {
      alert("Delete failed.");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
}


document.getElementById("confirmDelete").addEventListener("click", () => {
  hideDeleteModal();
  if (orderToDelete) deleteOrder(orderToDelete);
});

document.getElementById("cancelDelete").addEventListener("click", hideDeleteModal);

window.addEventListener('DOMContentLoaded', getOrders);