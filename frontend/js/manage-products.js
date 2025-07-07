const apiUrl = 'http://127.0.0.1:5000/';


function showDeleteModal(p_id) {
    const message = `You’re about to delete Product #${p_id}.`;
    const header = document.querySelector('.modal-header');
    header.innerHTML = message;
    console.log("HEADER ELEMENT: ", header);
    const modal = document.getElementById('deleteProductModal');
    modal.style.display = 'block';
}

function hideDeleteModal() {
  const modal = document.getElementById("deleteProductModal");
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
}

function updateModal(p_id){
    const div = document.querySelector('.modal-content');
    div.innerHTML = `
        <p class='modal-header'>Product with ID #${p_id} deleted</p>
    `;
}

document.getElementById("cancelDeletion").addEventListener("click", hideDeleteModal);

function showAddModal(){
    const modal = document.getElementById('addModal');
    modal.style.display = 'block';
}

function updateAddModal(msg){
    const div = document.querySelector('.modal-content');
    div.innerHTML = `
        <p class='modal-header'>${msg}</p>
    `;
}

async function addProduct(){
    const p_name = document.getElementById("product-name").value.trim();
    const unit = document.getElementById("units").value.trim();
    const price = parseFloat(document.getElementById("amount").value);

    if (!p_name) {
        updateAddModal("Product name is required");
        hideAddModal();
        getProducts();
        return;
    }
    if (isNaN(price) || price <= 0) {
        updateAddModal("Invalid Price");
        hideAddModal();
        getProducts();
        return;
    }

    const data = {
        product_name: p_name,
        unit: unit,
        price_per_unit: price
    };
    try {
        const res = await fetch(`${apiUrl}/insertProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Server Error Response:", errText);
            throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();
        updateAddModal(`Product with ID ${result.product_id} added!!`);
        hideAddModal();
        getProducts();
    } catch (error) {
        console.log(error);
        updateAddModal("Error while adding product");
        hideAddModal();
    }
}

function hideAddModal() {
  const modal = document.getElementById("addModal");
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
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
        tbody.innerHTML = '';

        result.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td class="last-col">
                    <p>₹ ${parseFloat(product.price).toFixed(2)}/${product.unit}</p>
                    <button class="delete">
                        <i class="fa fa-minus-circle"></i>
                    </button>
                </td>
            `

            const deleteBtn = tr.querySelector('.delete');
            deleteBtn.addEventListener("click", (e) => {
                productToDelete = product.id;
                showDeleteModal(product.id);
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.log(error)
    }
}

async function deleteProduct(productId) {
    try {
        const res = await fetch(`${apiUrl}/deleteProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error: ${res.status} - ${text}`);
        }

        const result = await res.json();
        updateModal(result.product_id);
        hideDeleteModal();
        getProducts();
    } catch (error) {
        console.log(error);
    }
}

document.getElementById("confirmDeletion").addEventListener("click", () => {
    if(productToDelete){
        deleteProduct(productToDelete);
    }
});
document.getElementById("confirmAdd").addEventListener("click", addProduct);
document.getElementById("cancelAdd").addEventListener("click", hideAddModal);

window.addEventListener('DOMContentLoaded', getProducts);