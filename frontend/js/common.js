export const apiUrl = 'http://127.0.0.1:5000/';

export function openModal(id, msg){
    const div = document.getElementById(id);
    div.innerHTML = `
        <div class="modal-content">
            <p class='modal-header'>${msg}</p>
        </div>
    `
    div.style.display = 'block';
    closeModal(id);
}

export function closeModal(id){
    setTimeout(() => {
        document.getElementById(id).style.display = 'none';
    }, 1000);
}