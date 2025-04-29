document.addEventListener('DOMContentLoaded', () => {
    const botaoTroca = document.getElementById('troca');
    
    if (botaoTroca) {
        botaoTroca.addEventListener('click', (e) => {
            e.preventDefault();
            
            const traId = botaoTroca.dataset.traId;
            const status = botaoTroca.dataset.traStatus;

            if (status === 'ENTREGUE') {
                window.location.href = `/trocas?tra_id=${traId}`;
            } else {
                alert('Troca só pode ser solicitada para pedidos com status "ENTREGUE"');
            }
        });
    }
});