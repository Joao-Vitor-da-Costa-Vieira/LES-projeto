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
                if(usuarioId){
                    getSenha(usuarioId);
                } else {
                    alert("Faça login para acessar essa função!");
                }
                
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });

    document.querySelectorAll('#atualizar-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                if(usuarioId){
                    getAtualizarCadastro(usuarioId); 
                } else {
                    alert("Faça login para acessar essa função!");
                }
                   
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });

    document.querySelectorAll('#cartao-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                if(usuarioId){
                    getCartoes(usuarioId);
                } else {
                    alert("Faça login para acessar essa função!");
                }
                    
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }            
        });
    });

    document.querySelectorAll('#end-entrega-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                if(usuarioId){
                    getEndEntrega(usuarioId);
                } else {
                    alert("Faça login para acessar essa função!");
                }
                   
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }           
        });
    });

    document.querySelectorAll('#end-cobranca-side-btn').forEach(botao => {
        botao.addEventListener('click', (event) => {
            event.stopPropagation();
            try {
                if(usuarioId){
                    getEndCobranca(usuarioId);    
                } else {
                    alert("Faça login para acessar essa função!");
                }
                
            } catch (error) {
                console.error('Erro ao carregar página:', error);
            }
        });
    });
});