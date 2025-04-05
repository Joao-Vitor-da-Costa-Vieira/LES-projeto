document.querySelectorAll('.adicionar-produto').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

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
            <p class="confirmar-adicao">Confirmar Adição?</p>
        </div>

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

        btnConfirmar.addEventListener('click', () => {
            const quantidade = parseInt(input.value);
            console.log(`Quantidade confirmada: ${quantidade}`);
            submenu.remove();
            
            const mensagemConfirmacao = document.createElement('div');
            mensagemConfirmacao.classList.add('confirmacao-overlay');
            
            mensagemConfirmacao.innerHTML = `
                <div class="confirmacao-box">
                    <p>Produto adicionado ao carrinho!</p>
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
            
            // Evento para o botão Ver Carrinho
            const btnVerCarrinho = mensagemConfirmacao.querySelector('.ver-carrinho');
            btnVerCarrinho.addEventListener('click', (e) => {
                e.stopPropagation();
                mensagemConfirmacao.remove();
                console.log('Redirecionar para o carrinho');
            });
            
            // Evento para o botão Continuar Comprando
            const btnContinuar = mensagemConfirmacao.querySelector('.continuar-comprando');
            btnContinuar.addEventListener('click', (e) => {
                e.stopPropagation();
                mensagemConfirmacao.remove();
                // Apenas fecha a mensagem e continua na página atual
            });
        });
    });
});

// Removendo o submenu ao clicar fora da tela
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu').forEach(menu => menu.remove());
});