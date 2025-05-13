document.addEventListener('DOMContentLoaded', () => {
    const botaoTroca = document.getElementById('troca');
    const botaoDevolucao = document.getElementById('devolucao');

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

    if (botaoDevolucao) {
        botaoDevolucao.addEventListener('click', (e) => {
            e.preventDefault();
            
            const traId = botaoDevolucao.dataset.traId;
            const status = botaoDevolucao.dataset.traStatus;

            if (status === 'ENTREGUE') {
                window.location.href = `/devolucoes?tra_id=${traId}`;
            } else {
                alert('Devolução só pode ser solicitada para pedidos com status "ENTREGUE"');
            }
        });
    }
});