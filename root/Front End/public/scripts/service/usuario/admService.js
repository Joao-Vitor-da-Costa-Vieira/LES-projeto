export function admNameDisplay() {
    const admName = localStorage.getItem('currentAdmName');
    const admNameDisplay = document.querySelector('.usuario-nome');

    admNameDisplay.textContent = admName || 'Visitante';
}

export async function getAdmId(){
    
    const admId = localStorage.getItem('currentAdmId');

    return admId;
}