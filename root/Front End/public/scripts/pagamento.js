document.addEventListener('DOMContentLoaded', function() {
    const userDataElement = document.getElementById('user-data');
    const usr_id = userDataElement ? userDataElement.dataset.userId : null;

    // Botão Cancelar - Volta para a home
    document.getElementById('Cancelar')?.addEventListener('click', function() {
        if (usr_id) {
            window.location.href = `/home/${usr_id}`;
        }
    });

    // Botão Confirmar - Finaliza a compra
    document.getElementById('Confirmar')?.addEventListener('click', async function() {
        const enderecoId = document.getElementById('end_entrega').value;
        const formasPagamento = document.querySelectorAll('.forma-pagamento-item');
        
        if (!enderecoId) {
            alert('Selecione um endereço de entrega');
            return;
        }

        if (formasPagamento.length === 0) {
            alert('Adicione pelo menos uma forma de pagamento');
            return;
        }

        const pagamentos = Array.from(formasPagamento).map(forma => {
            const tipo = forma.querySelector('p').textContent.trim();
            const valor = forma.querySelector('input[type="number"]').value;
            const cartaoSelect = forma.querySelector('select[name="cartao"]');
            const cartaoId = cartaoSelect ? cartaoSelect.value : null;
            
            return {
                tipo,
                valor: parseFloat(valor),
                cartaoId: cartaoId ? parseInt(cartaoId) : null
            };
        });

        try {
            const response = await fetch('/pagamento/confirmar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuarioId: parseInt(usr_id),
                    enderecoId: parseInt(enderecoId),
                    pagamentos
                })
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = `/pagamento/cupom/${result.vendaId}`;
            } else {
                throw new Error(result.message || 'Erro ao processar pagamento');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    });


    document.querySelectorAll('.adicionar-endereco').forEach(botao => {
        botao.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

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
                        <input class="cidade_input" type="text" id="bairro" name="bairro" required>
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
                
                <button type="submit">Adicionar</button>
            </form>
            `;

            // Adiciona evento de submit ao formulário
            submenu.querySelector('form').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = {
                    estado: this.estado.value,
                    cidade: this.cidade.value,
                    bairro: this.bairro.value,
                    endereco: this.endereco.value,
                    numero: this.numero.value,
                    complemento: this.complemento.value,
                    cep: this.cep.value,
                    usuarioId: parseInt(usr_id)
                };

                try {
                    const response = await fetch('/enderecos/entrega', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        window.location.reload();
                    } else {
                        throw new Error(result.message || 'Erro ao adicionar endereço');
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    alert(error.message);
                }
            });

            submenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            const form = submenu.querySelector('form');
            form.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                document.querySelector('form').addEventListener('submit', async function(event) {
                    event.preventDefault();
                
                    const formDados = new FormData(event.target);
                    let dados = Object.fromEntries(formDados.entries());        
                
                    const endereco = {
                        end_usr_id: usr_id,
                        end_bairro: dados.bairro,
                        end_cep: dados.cep,
                        end_cidade: dados.cidade,
                        end_estado: dados.estado,
                        end_endereco: dados.endereco, 
                        end_numero: dados.numero,
                        end_complemento: dados.complemento
                    };
                
                    let result = await cadastrarEnderecoEntregaService(endereco, usr_id);
                
                    if (result.status === 200) {
                        alert('Endereço foi cadastrado com sucesso!');
                        return;
                    }
                
                    alert('Não foi possível cadastrar o endereço');
                });
            });

            this.appendChild(submenu);
        });
    });

    // Código para adicionar formas de pagamento (mantido igual, mas atualizando para usar os cartões do usuário)
    const btnAdicionar = document.querySelector('.adicionar-forma-pagamento');
    const containerFormas = document.querySelector('.formas-pagamento-adicionadas');
    
    btnAdicionar?.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const submenuAtual = document.querySelector('.submenu-pagamento');
        if (submenuAtual) {
            submenuAtual.remove();
            return;
        }
        
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
        
        this.parentNode.insertBefore(submenu, this);
        
        submenu.querySelector('.confirmar-pagamento').addEventListener('click', function() {
            const formaSelecionada = document.getElementById('forma-pagamento-select').value;
            
            if (!formaSelecionada) {
                alert('Selecione uma forma de pagamento');
                return;
            }
            
            const formaPagamentoItem = document.createElement('div');
            formaPagamentoItem.classList.add('forma-pagamento-item');
            
            let camposAdicionais = '';
            
            if (formaSelecionada === '1') {
                const cartoesDataElement = document.getElementById('cartoes-data');
                const cartoes = cartoesDataElement ? JSON.parse(cartoesDataElement.textContent) : [];

                camposAdicionais = `
                    <div class="linha_centralizada">
                        <div class="genero">
                            <label class="label_genero">Cartão</label>
                            <select class="selecao_media" name="cartao" required>
                                <option value="">Selecione</option>
                                ${cartoes.map(cartao => `
                                    <option value="${cartao.crt_id}">
                                        ${cartao.crt_bandeira} **** **** **** ${cartao.crt_numero.toString().slice(-4)}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                `;
            } else {
                camposAdicionais = `
                    <div class="valor">
                        <label class="label_pequena" for="valor">Valor a ser pago</label>
                        <input class="valor_input" type="number" name="valor" min="0.01" step="0.01" required>
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
            
            formaPagamentoItem.querySelector('.remover-forma').addEventListener('click', function() {
                formaPagamentoItem.remove();
            });
            
            containerFormas.appendChild(formaPagamentoItem);
            submenu.remove();
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.submenu-pagamento') && !e.target.closest('.adicionar-forma-pagamento')) {
            const submenu = document.querySelector('.submenu-pagamento');
            if (submenu) submenu.remove();
        }
        
        if (!e.target.closest('.atualizar_submenu_endereco') && !e.target.closest('.adicionar-endereco')) {
            document.querySelectorAll('.atualizar_submenu_endereco').forEach(menu => menu.remove());
        }
    });
});