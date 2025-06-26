import { adicionarCarrinho, getCarrinho } from "/scripts/service/transacoes/carrinhoService.js";

document.addEventListener('DOMContentLoaded', function() {
    const slide = document.querySelector('.carrosel-slide');
    const slides = document.querySelectorAll('.slide-item');
    const botaoAnterior = document.getElementById('botaoAnterior');
    const botaoProximo = document.getElementById('botaoProximo');
    const indicadores = document.querySelectorAll('.indicador');
    
    let counter = 0;
    const size = slides[0].clientWidth;
    const totalSlides = slides.length;

    // Posiciona o slide
    slide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    // Botão próximo
    botaoProximo.addEventListener('click', () => {
        if (counter >= totalSlides - 1) return;
        counter++;
        slide.style.transition = "transform 0.5s ease-in-out";
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicadores();
    });

    // Botão anterior
    botaoAnterior.addEventListener('click', () => {
        if (counter <= 0) return;
        counter--;
        slide.style.transition = "transform 0.5s ease-in-out";
        slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateIndicadores();
    });

    // Indicadores
    indicadores.forEach(indicador => {
        indicador.addEventListener('click', () => {
            counter = parseInt(indicador.getAttribute('data-index'));
            slide.style.transition = "transform 0.5s ease-in-out";
            slide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateIndicadores();
        });
    });

    // Atualiza os indicadores
    function updateIndicadores() {
        indicadores.forEach((indicador, index) => {
            if (index === counter) {
                indicador.classList.add('ativo');
            } else {
                indicador.classList.remove('ativo');
            }
        });
    }

    // Redimensionamento da janela
    window.addEventListener('resize', () => {
        slide.style.transition = "none";
        slide.style.transform = 'translateX(' + (-slides[0].clientWidth * counter) + 'px)';
    });

});

document.querySelectorAll('.adicionar-produto').forEach(botao => {
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

        submenu.innerHTML = `
        <div class="linha_centralizada">
            <button class="submenu-botao-adicao" type="button"><</button>
            <input class="numero_input" type="number" value="1" min="1">
            <button class="submenu-botao-adicao" type="button">></button>
        </div>

        <button class="submenu-adicionar-produto" type="button">Confirmar</button>
        `;

        this.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-adicao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-adicao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-adicionar-produto');

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
            const lvr_id = 4;
            
            try {
                const response = await adicionarCarrinho(lvr_id, usr_id, quantidade);
                const resultado = await response.json();
                
                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message || 'Produto adicionado ao carrinho!'}</p>
                        <div class="confirmacao-botoes">
                            <button class="ver-carrinho">Ver Carrinho</button>
                            <button class="continuar-comprando">Continuar Comprando</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();
                    }
                });
                
                const btnVerCarrinho = mensagemConfirmacao.querySelector('.ver-carrinho');
                btnVerCarrinho.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await getCarrinho(usr_id);
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                
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

document.querySelectorAll('.adicionar-produto-2').forEach(botao => {
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

        submenu.innerHTML = `
        <div class="linha_centralizada">
            <button class="submenu-botao-adicao" type="button"><</button>
            <input class="numero_input" type="number" value="1" min="1">
            <button class="submenu-botao-adicao" type="button">></button>
        </div>

        <button class="submenu-adicionar-produto" type="button">Confirmar</button>
        `;

        this.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-adicao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-adicao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-adicionar-produto');

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
            const lvr_id = 1;
            
            try {
                const response = await adicionarCarrinho(lvr_id, usr_id, quantidade);
                const resultado = await response.json();
                
                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message || 'Produto adicionado ao carrinho!'}</p>
                        <div class="confirmacao-botoes">
                            <button class="ver-carrinho">Ver Carrinho</button>
                            <button class="continuar-comprando">Continuar Comprando</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();
                    }
                });
                
                const btnVerCarrinho = mensagemConfirmacao.querySelector('.ver-carrinho');
                btnVerCarrinho.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await getCarrinho(usr_id);
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                
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

document.querySelectorAll('.adicionar-produto-3').forEach(botao => {
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

        submenu.innerHTML = `
        <div class="linha_centralizada">
            <button class="submenu-botao-adicao" type="button"><</button>
            <input class="numero_input" type="number" value="1" min="1">
            <button class="submenu-botao-adicao" type="button">></button>
        </div>

        <button class="submenu-adicionar-produto" type="button">Confirmar</button>
        `;

        this.appendChild(submenu);

        const input = submenu.querySelector('.numero_input');
        const btnDecrease = submenu.querySelector('.submenu-botao-adicao:first-child');
        const btnIncrease = submenu.querySelector('.submenu-botao-adicao:last-child');
        const btnConfirmar = submenu.querySelector('.submenu-adicionar-produto');

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
            const lvr_id = 2;
            
            try {
                const response = await adicionarCarrinho(lvr_id, usr_id, quantidade);
                const resultado = await response.json();
                
                submenu.remove();
                
                const mensagemConfirmacao = document.createElement('div');
                mensagemConfirmacao.classList.add('confirmacao-overlay');
                
                mensagemConfirmacao.innerHTML = `
                    <div class="confirmacao-box">
                        <p>${resultado.message || 'Produto adicionado ao carrinho!'}</p>
                        <div class="confirmacao-botoes">
                            <button class="ver-carrinho">Ver Carrinho</button>
                            <button class="continuar-comprando">Continuar Comprando</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(mensagemConfirmacao);
                
                mensagemConfirmacao.addEventListener('click', (e) => {
                    if (e.target === mensagemConfirmacao) {
                        mensagemConfirmacao.remove();
                    }
                });
                
                const btnVerCarrinho = mensagemConfirmacao.querySelector('.ver-carrinho');
                btnVerCarrinho.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await getCarrinho(usr_id);
                });
                
                const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
                btnContinuar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mensagemConfirmacao.remove();
                });
        
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                
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