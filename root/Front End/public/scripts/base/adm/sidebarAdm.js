import { 
    getAnalise,
    getEstoque,
    getPedidos 
} from "/scripts/service/sidebarAdmService.js";

import { getAdmId } from "/scripts/service/usuario/admService.js";

document.addEventListener('DOMContentLoaded', async () => {

    const admId = await getAdmId();

    document.querySelectorAll('#pedidos').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            try {
                await getPedidos(admId);
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#estoque').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            try {
                await getEstoque(admId);
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#analise').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            event.stopPropagation();
            try {
                await getAnalise(admId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });
});