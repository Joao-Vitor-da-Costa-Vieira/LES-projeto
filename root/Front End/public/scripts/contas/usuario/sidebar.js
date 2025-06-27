import {
    getSenha,
    getAtualizarCadastro,
    getCartoes,
    getEndEntrega,
    getEndCobranca,
    getCadastro,
    getCadastroPrimeiro
} from "/scripts/service/usuario/sidebarService.js";

import { getUserId } from "/scripts/service/usuario/usuarioService.js";

document.addEventListener('DOMContentLoaded', async () => {

    const usuarioId = await getUserId();

    document.querySelectorAll('#cadastro-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                if(usuarioId){
                    getCadastro(usuarioId);
                } else {
                    getCadastroPrimeiro();
                }
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#senha-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getSenha(usuarioId);
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#atualizar-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getAtualizarCadastro(usuarioId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });

    document.querySelectorAll('#cartao-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getCartoes(usuarioId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });

    document.querySelectorAll('#end-entrega-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getEndEntrega(usuarioId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }           
        });
    });

    document.querySelectorAll('#end-cobranca-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                getEndCobranca(usuarioId);    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });
});