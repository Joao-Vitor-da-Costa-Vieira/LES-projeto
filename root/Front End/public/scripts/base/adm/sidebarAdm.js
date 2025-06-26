import { 
    getAnalise,
    getEstoque,
    getPedidos 
} from "/scripts/service/sidebarAdmService";

document.addEventListener('DOMContentLoaded', async () => {

    const admDataElement = document.getElementById('adm-data');
    const admId = admDataElement.getAttribute('data-adm-id');

    document.querySelectorAll('#pedidos').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getPedidos(admId);
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#estoque').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getEstoque(admId);
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#analise').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getAnalise(admId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });
});