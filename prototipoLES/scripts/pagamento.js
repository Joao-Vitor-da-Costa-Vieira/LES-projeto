document.querySelectorAll('.adicionar-endereco').forEach(botao => {
    botao.addEventListener('click', function (event) {
        event.stopPropagation();

        let submenuAtual = this.querySelector('.atualizar_submenu_endereco');

        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }

        document.querySelectorAll('.atualizar_submenu_endereco').forEach(menu => menu.remove());

        let submenu = document.createElement('div');
        submenu.classList.add('atualizar_submenu_endereco');

        submenu.style.left = '50%';
        submenu.style.transform = 'translateX(-50%)';

        submenu.innerHTML = `
        <div class="bloco_titulo">
            <h1 class="titulo">Adição de End. Entrega</h1>
        </div>

        <form class="container-forms-endereco">

            <!--Primeira Linha-->
            <div class="linha_centralizada">
                <div class="cidade">
                    <label class="label_pequena" for="cidade">Cidade</label>
                    <input class="cidade_input" type="text" id="cidade" name="cidade" required>
                </div>

                <div class="bairro">
                    <label class="label_pequena" for="bairro">Bairro</label>
                    <input class="cidade_input" type="text" id="bairro" name="bairro"  required>
                </div>

                <div class="estado">
                    <label class="label_genero">Estado</label>
                    <select class="selecao" id="estado" name="estado" required>
                        <option value="">Selecione</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                    </select>
                </div>
            </div>

            <!--Segunda Linha-->
            <div class="linha_centralizada">
                <div class="endereco">
                    <label class="label_pequena" for="endereco">Endereço</label>
                    <input class="endereco_input" type="text" id="endereco" name="endereco" required>
                </div>

                <div class="numero">
                    <label class="label_pequena" for="numero">Nº.</label>
                    <input class="numero_input" type="number" id="numero" name="numero" required>
                </div>
            </div>

            <!--Terceira Linha-->
            <div class="linha_centralizada">
                <div class="cidade">
                    <label class="label_pequena" for="complemento">Complemento</label>
                    <input class="cidade_input" type="text" id="complemento" name="complemento_e">
                </div>

                <div class="bairro">
                    <label class="label_pequena" for="cep">CEP</label>
                    <input class="cidade_input" type="text" id="cep" name="cep" required>
                </div>
            </div>
            
            <button>Adicionar</button>
        </form>
        `;

        // Adicionando submenu ao lado do botão clicado
        this.appendChild(submenu);
    });
});

// Removendo o submenu ao clicar fora da tela
document.addEventListener('click', () => {
    document.querySelectorAll('.atualizar_submenu_endereco').forEach(menu => menu.remove());
});

document.addEventListener('DOMContentLoaded', function() {
    const btnAdicionar = document.querySelector('.adicionar-forma-pagamento');
    const containerFormas = document.querySelector('.formas-pagamento-adicionadas');
    
    btnAdicionar.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Verifica se já existe um submenu aberto
        const submenuAtual = document.querySelector('.submenu-pagamento');
        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }
        
        // Cria o submenu
        const submenu = document.createElement('div');
        submenu.classList.add('submenu-pagamento');
        
        submenu.innerHTML = `
            <div class="linha_centralizada">
                <div class="genero">
                    <label class="label_genero">Forma de Pag.</label>
                    <select class="selecao_media" id="forma-pagamento-select" name="forma de pagamento" required>
                        <option value="">Selecione uma forma de Pagamento</option>
                        <option value="1">Cartão de Crédito</option>
                        <option value="2">Cupom de Troca</option>
                        <option value="3">Cupom de Promoção</option>
                    </select>
                </div>
            </div>
            <div class="linha_centralizada">
                <button class="confirmar-pagamento" type="button">Confirmar</button>
            </div>
            `;
        
        // Insere o submenu antes do botão
        this.parentNode.insertBefore(submenu, this);
        
        // Adiciona evento ao botão confirmar
        submenu.querySelector('.confirmar-pagamento').addEventListener('click', function() {
            const formaSelecionada = document.getElementById('forma-pagamento-select').value;
            
            if (!formaSelecionada) {
                alert('Selecione uma forma de pagamento');
                return;
            }
            
            // Cria o elemento da forma de pagamento
            const formaPagamentoItem = document.createElement('div');
            formaPagamentoItem.classList.add('forma-pagamento-item');
            
            let camposAdicionais = '';
            
            if (formaSelecionada === '1') { // Cartão de Crédito
                camposAdicionais = `
                    <div class="linha_centralizada">
                        <div class="genero">
                            <label class="label_genero">Cartão</label>
                            <select class="selecao_media" name="cartao" required>
                                <option value="">Selecione</option>
                                <option value="1">**** **** **** 1023</option>
                                <option value="2">**** **** **** 4567</option>
                                <option value="3">**** **** **** 4778</option>
                            </select>
                        </div>
                    </div>
                    <div class="valor">
                        <label class="label_pequena" for="valor">Valor a ser pago</label>
                        <input class="valor_input" type="number" name="valor" required>
                    </div>
                `;
            } else { // Cupons
                camposAdicionais = `
                    <div class="valor">
                        <label class="label_pequena" for="valor">Valor a ser pago</label>
                        <input class="valor_input" type="number" name="valor" required>
                    </div>
                `;
            }
            
            formaPagamentoItem.innerHTML = `
                <div class="linha_centralizada">
                        <p>${document.getElementById('forma-pagamento-select').selectedOptions[0].text}</p>
                </div>
                ${camposAdicionais}
                <br>
                <div class="linha_centralizada">
                    <button class="remover-forma" type="button">Remover</button>
                </div>    
                `;
            
            // Adiciona evento ao botão remover
            formaPagamentoItem.querySelector('.remover-forma').addEventListener('click', function() {
                formaPagamentoItem.remove();
            });
            
            // Adiciona ao container
            containerFormas.appendChild(formaPagamentoItem);
            
            // Remove o submenu
            submenu.remove();
        });
    });
    
    // Fecha o submenu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.submenu-pagamento') && !e.target.closest('.adicionar-forma-pagamento')) {
            const submenu = document.querySelector('.submenu-pagamento');
            if (submenu) submenu.remove();
        }
    });
});