import { alterarCarrinho } from "/scripts/service/carrinhoService.js";
import { deletarCarrinho } from "/scripts/service/carrinhoService.js";

const tabelaBody = document.querySelector('#tabela-carrinho tbody'); 

function atualizarTabela(itensCarrinho) {
    tabelaBody.innerHTML = '';

    if (itensCarrinho.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhum livro encontrado</td></tr>';
        return;
    }

    itensCarrinho.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.livro.lvr_titulo}</td>
            <td>R$ ${item.livro.lvr_custo}</td>
            <td>${item.livro.lvr_desconto || '0'}%</td>
            <td>${item.car_qtd_item }"</td>
            <td>
                <div class="botoes_resultado">
                    <button class="atualizar" data-lvr-id="<%= item.lvr_id %>">Atualizar</button>
                    <button class="remover" data-car-id="<%= item.car_id %>">Remover</button>
                    </div>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

document.querySelectorAll('.atualizar').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        const userDataElement = document.getElementById('user-data');
        const usr_id = userDataElement ? userDataElement.dataset.userId : null;

        let submenuAtual = this.querySelector('.atualizar_submenu');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('atualizar_submenu');
        
        const quantidadeAtual = this.closest('tr').querySelector('td:nth-child(4)').textContent;
        submenu.innerHTML = `
        <div class="linha_centralizada">
            <p class="confirmar-atualizacao">Confirmar Alteração?</p>
        </div>

        <div class="linha_centralizada">
            <button class="submenu-botao-atualizacao" type="button"><</button>
            <input class="numero_input" type="number" value="${quantidadeAtual.replace('"', '')}" min="1">
            <button class="submenu-botao-atualizacao" type="button">></button>
        </div>

        <button class="submenu-atualizar-produto" type="button">Confirmar</button>
        `;

        this.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-atualizacao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-atualizacao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-atualizar-produto');

        const stopProp = (e) => e.stopPropagation();

        btnDecrease.addEventListener('click', stopProp);
        btnIncrease.addEventListener('click', stopProp);
        input.addEventListener('click', stopProp);
        btnConfirmar.addEventListener('click', stopProp);

        // Controle dos valores
        btnDecrease.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });

        btnIncrease.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
        });

        input.addEventListener('change', () => {
            if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
                input.value = 1;
            }
        });

        btnConfirmar.addEventListener('click', async () => {
            const quantidade = parseInt(input.value);
            const lvr_id = this.closest('tr').querySelector('.atualizar').dataset.lvrId;
            
            try {
                const resultado = await alterarCarrinho(lvr_id, usr_id, quantidade);
                
                if (!resultado.success) {
                    throw new Error(resultado.message);
                }
                
                atualizarTabela(resultado.itensCarrinho);
                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message}</p>
                        <button class="continuar-comprando">Continuar</button>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();  
                    }
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao atualizar o carrinho:', error);
                
                const mensagemErro = document.createElement('div');
                mensagemErro.classList.add('confirmacao-overlay');
                
                mensagemErro.innerHTML = `
                    <div class="confirmacao-box erro">
                        <p>${error.message}</p>
                        <button class="fechar-erro">OK</button>
                    </div>
                `;
                
                document.body.appendChild(mensagemErro);
                
                const btnFechar = mensagemErro.querySelector('.fechar-erro');
                btnFechar.addEventListener('click', () => {
                    mensagemErro.remove();
                });
                
                mensagemErro.addEventListener('click', (e) => {
                    if (e.target === mensagemErro) {
                        mensagemErro.remove();
                    }
                });
            }
        });
    });
});

document.querySelectorAll('.remover').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        let submenuAtual = this.querySelector('.deletar_submenu');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.deletar_submenu').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('deletar_submenu');

        submenu.innerHTML = `
        <div class="linha_centralizada">
            <p class="confirmar-remocao">Confirmar Remoção?</p>
        </div>

        <button class="submenu-deletar-produto" type="button">Confirmar</button>
        <button class="submenu-sair" type="button">Cancelar</button>
        `;

        this.appendChild(submenu);

        const btnConfirmar = submenu.querySelector('.submenu-deletar-produto');

        const stopProp = (e) => e.stopPropagation();

        btnConfirmar.addEventListener('click', stopProp);

        btnConfirmar.addEventListener('click', async () => {
            const car_id = this.closest('tr').querySelector('.remover').dataset.carId;
            
            try {
                const response = await deletarCarrinho(car_id);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
                
                const resultado = await response.json();
                atualizarTabela(resultado.itensCarrinho);

                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message || 'Produto removido do carrinho!'}</p>
                        <div class="confirmacao-botoes">
                            <button class="continuar-comprando">Continuar</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();  
                    }
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao atualizar o carrinho:', error);
                
                const mensagemErro = document.createElement('div');
                mensagemErro.classList.add('confirmacao-overlay');
                
                mensagemErro.innerHTML = `
                    <div class="confirmacao-box erro">
                        <p>${error.message}</p>
                        <button class="fechar-erro">OK</button>
                    </div>
                `;
                
                document.body.appendChild(mensagemErro);
                
                const btnFechar = mensagemErro.querySelector('.fechar-erro');
                btnFechar.addEventListener('click', () => {
                    mensagemErro.remove();
                });
                
                mensagemErro.addEventListener('click', (e) => {
                    if (e.target === mensagemErro) {
                        mensagemErro.remove();
                    }
                });
            }
        });
    });
});

// Removendo o submenu ao clicar fora da tela
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});

document.addEventListener('click', () => {
    document.querySelectorAll('.deletar_submenu').forEach(menu => menu.remove());
});