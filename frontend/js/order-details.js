import { apiUrl } from "./common.js";

async function getOrderDetails(){
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const c_name = params.get('buyer');
    const hDetails = document.getElementById("header-details");
    hDetails.innerHTML = `Customer Name: ${c_name}`;
    try {
        const res = await fetch(`${apiUrl}/getOrder?order_id=${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();
        let sum = 0;
        const tbody = document.getElementById("orders-body");
        tbody.innerHTML = "";
        result.forEach(product => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${product.p_id}</td>
                <td>${product.p_name}</td>
                <td>${product.qty} ${product.unit}</td>
                <td>₹ ${product.amount}</td>
            `
            sum = sum+product.amount;
            tbody.appendChild(tr);

        });

        document.querySelector(".total").innerHTML = `₹ ${sum.toFixed(2)}`;
    } catch (error) {
        const box = document.querySelector(".blurred-box");
        if(!box){
            console.log("ERROR: Box is missing");
            return;
        }
        const div = document.createElement('div');
        div.classList.add("error");
        div.innerHTML = `
            <p class='error-inner'>Error fetching data</p>
        `;
        box.appendChild(div);
        console.log("ERROR: ", error);
    }
}


window.addEventListener('DOMContentLoaded', getOrderDetails);