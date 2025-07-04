// cypress/e2e/inservaoVenda.cy.js

describe('Fluxo Venda/Troca Completo', () => {
  let nomeUsuario = 'Sicrano da Silva Teste ' + Math.floor(Math.random() * 1000);
  let userId;
  let transacaoId;
  let admName;

  // Funções auxiliares
  const loginSemUsuario = () => {
    cy.visit('http://localhost:3000/telaInicial');
    cy.contains('Selecione o tipo de Usuário:').should('be.visible');
    cy.get('#usuario').select('Sem Login.');
    cy.get('.botao-usuario').click();
    cy.url().should('include', '/home');
  };

  const navegarParaCadastro = () => {
    cy.get('#cadastro-side-btn').click();
    cy.url().should('include', '/cadastro');
    cy.contains('Cadastrar Usuário').should('be.visible');
  };

  const preencherFormularioCadastro = (nome, email, cpf, senha) => {
    cy.get('#nome').type(nome);
    cy.get('#email').type(email);
    cy.get('#cpf').type(cpf);
    cy.get('#senha').type(senha);
    cy.get('#conf_senha').type(senha);
    cy.get('#data_nascimento').type('1990-01-01');
    cy.get('#telefone1').type('11987654321');
    cy.get('#telefone2').type('1133334444');
    cy.get('#genero').select('M');
  };

  const preencherEndereco = (prefix) => {
    cy.get(`#cidade_${prefix}`).type('São Paulo');
    cy.get(`#bairro_${prefix}`).type('Centro');
    cy.get(`#estado_${prefix}`).select('SP');
    cy.get(`#endereco_${prefix}`).type('Rua das Flores');
    cy.get(`#numero_${prefix}`).type('123');
    cy.get(`#complemento_${prefix}`).type('Apto 101');
    cy.get(`#cep_${prefix}`).type('01001000');
  };

  const preencherCartao = () => {
    cy.get('#num_cartao').type('4111111111111111');
    cy.get('#cod_sec').type('123');
    cy.get('#bandeira').select('Visa');
    cy.get('#nome_c').type('FULANO DA SILVA TESTE');
  };

  const submeterCadastro = () => {
    cy.intercept('POST', '/cadastro').as('submitCadastro');
    cy.get('#submit').click();
    cy.wait('@submitCadastro').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      userId = interception.response.body.id;
    });
  };

  const loginComUsuario = (nome) => {
    cy.visit('http://localhost:3000/telaInicial');
    cy.contains('Selecione o tipo de Usuário:').should('be.visible');
    
    cy.get('#usuario').then(($select) => {
      const option = Array.from($select[0].options).find(opt => 
        opt.text.includes(nome)
      );
      
      if (option) {
        cy.get('#usuario').select(option.value);
      } else {
        throw new Error('Usuário não encontrado no dropdown');
      }
    });
    
    cy.get('.botao-usuario').click();
    cy.url().should('include', '/home');
  };

  const adicionarLivroAoCarrinho = (quantidade = 1) => {
    cy.get('.adicionar-produto').first().click();
    cy.get('.atualizar_submenu').should('be.visible');
    cy.get('.atualizar_submenu .numero_input').clear().type(quantidade.toString());
    cy.get('.submenu-adicionar-produto').click();
    cy.get('.confirmacao-overlay').should('be.visible');
    cy.contains('Item adicionado ao carrinho com sucesso').should('be.visible');
    cy.get('.continuar-comprando').click();
    cy.get('.confirmacao-overlay').should('not.exist');
  };

  const verificarEAtualizarCarrinho = (novaQuantidade) => {
    cy.get('#botao-carrinho').click();
    cy.url().should('include', '/carrinho');
    cy.get('#tabela-carrinho tbody tr').should('have.length.gt', 0);
    cy.get('.atualizar').first().click();
    cy.get('.atualizar_submenu').should('be.visible');
    cy.get('.atualizar_submenu .numero_input').clear().type(novaQuantidade.toString());
    cy.get('.submenu-atualizar-produto').click();
    cy.get('.confirmacao-overlay').should('be.visible');
    cy.get('.continuar-comprando').click();
    cy.get('#tabela-carrinho tbody tr:first-child td:nth-child(4)')
      .should('contain', novaQuantidade.toString());
  };

  const realizarPagamento = () => {
    cy.get('#comprar').should('be.enabled').click();
    cy.url().should('include', '/pagamento');
    cy.contains('Pagamento').should('be.visible');
    cy.get('#end_entrega option').should('have.length', 1);
    cy.get('#end_entrega').select(0); 
    cy.get('.adicionar-forma-pagamento').click();
    cy.get('#forma-pagamento-select').select('1');
    cy.get('.confirmar-pagamento').click();
    cy.get('#total-valor').invoke('text').then(text => {
      const valorTotal = text.replace('R$ ', '').trim();
      cy.get('.forma-pagamento-item input[name="valor"]')
        .clear()
        .type(valorTotal);
  });
    cy.get('.forma-pagamento-item select[name="cartao"]').select(0);
    cy.intercept('POST', '/pagamento/confirmar').as('finalizarPagamento');
    cy.get('#Confirmar').click();
    cy.wait('@finalizarPagamento').its('response.statusCode').should('eq', 200);
  };

  const verificarHistoricoCompras = (statusEsperado) => {
    cy.wait(4000);
    cy.get('#historico').click();
    cy.url().should('include', '/pagamento/historico');
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).within(() => {
        cy.get('td:nth-child(4)').then(($status) => {
          if ($status.text().includes(statusEsperado)) {
            cy.get('.ver_mais').click();
            return false;
          }
        });
      });
    });
  };

  const loginAdm = () => {
    cy.visit('http://localhost:3000/telaInicial');
    cy.contains('Selecione o tipo de Usuário:').should('be.visible');
    cy.get('#adm').then(($select) => {
      if ($select.find('option').length > 0) {
        cy.get('#adm').select(0);
        cy.get('#adm option:selected').invoke('text').then((textoAdm) => {
          admName = textoAdm.split(', ')[1];
          cy.log(`Nome do ADM: ${admName}`);
          cy.get('.botao-adm').click();
        });
      } else {
        throw new Error('Nenhum ADM disponível para seleção');
      }
    });
  };

  const navegarParaPedidosAdm = () => {
    cy.url().should('include', '/home-adm');
    cy.get('#pedidos').click();
    cy.url().should('include', '/pedidos');
  };

  const filtrarPedidoPorNome = (nome) => {
    cy.get('#mostrar-filtros').click();
    cy.get('#nomeUsuario').type(nome);
    cy.get('#aplicar-filtros').click();
    cy.get('table tbody tr').should('have.length.at.least', 1);
    cy.contains('td', nome).should('exist');
    cy.contains('td', nome).parent('tr').find('.alterar').click();
  };

  const atualizarStatusPedido = (acao) => {
    // 1. Intercepta a chamada de API de atualização
    cy.intercept('POST', '/api/pedidos-atualizar/status').as('statusUpdate');

    // 2. Clica no botão de atualizar
    cy.get('#atualizar')
      .should('be.visible')
      .click();

    // 3. Interage com o modal de status
    cy.get('.status-modal', { timeout: 10000 }).within(() => {
      cy.contains('button', acao, { timeout: 5000 })
        .should('be.visible')
        .click();
    });

    // 4. Espera a requisição completar
    cy.wait('@statusUpdate').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // 5. Recarrega a página manualmente
    cy.reload();
  };

  const navegarParaPaginaLivro = () => {
    cy.get('.texto-container').first().within(() => {
      cy.get('.alterar').click();
    });
    cy.url().should('include', '/livros');
    cy.get('.titulo-livro h1').should('be.visible');
  };

  // Nova função para adicionar livro da página do produto
  const adicionarLivroDaPagina = (quantidade = 1) => {
    cy.get('.adicionar-produto').click();
    cy.get('.atualizar_submenu').should('be.visible');
    cy.get('.atualizar_submenu .numero_input').clear().type(quantidade.toString());
    cy.get('.submenu-adicionar-produto').click();
    cy.get('.confirmacao-overlay').should('be.visible');
    cy.get('.continuar-comprando').click();
    cy.get('.confirmacao-overlay').should('not.exist');
  };

  const solicitarTroca = (quantidade = 1) => {
    cy.get('.atualizar').first().click();
    cy.get('.atualizar_submenu').should('be.visible');
    cy.get('.atualizar_submenu .numero_input').clear().type(quantidade.toString());
    cy.get('.submenu-atualizar-produto').click();
    cy.get('#tabela-carrinho tbody tr:first-child .qtd-atual').should('contain', quantidade.toString());
    cy.intercept('POST', '/trocas/confirmar').as('confirmarTroca');
    cy.get('#trocar').click();
    cy.wait('@confirmarTroca').its('response.statusCode').should('eq', 200);
  };

  const atualizarStatusTroca = (acao) => {
    // 1. Intercepta a chamada de API de atualização
    cy.intercept('POST', '/api/pedidos-atualizar/status').as('statusUpdate');

    // 2. Clica no botão de atualizar
    cy.get('#atualizar')
      .should('be.visible')
      .click();

    // 3. Interage com o modal de status
    cy.wait(2000);
    cy.get('.status-modal', { timeout: 10000 }).within(() => {
      cy.contains('button', acao, { timeout: 5000 })
        .should('be.visible')
        .click();
    });

    // 4. Espera a requisição completar
    cy.wait('@statusUpdate').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // 5. Recarrega a página manualmente 
    cy.reload();
  };

  // Teste principal
  it('Teste completo de cadastro e atualização', () => {
    cy.viewport(1080, 720)

    // 1. Login sem usuario
    loginSemUsuario();

    cy.wait(1500);
    
    // 2. Navegação para Cadastro de Usuário
    navegarParaCadastro();

    cy.wait(1500);

    // 3. Preenchimento do Formulário de Cadastro
    const senhaValida = 'Senha@123';
    preencherFormularioCadastro(nomeUsuario, 'fulano.teste@example.com', '12345678901', senhaValida);

    cy.wait(1500);
    
    // Preenchimento de Endereços
    preencherEndereco('e'); // Endereço de entrega
    preencherEndereco('c'); // Endereço de cobrança

    cy.wait(1500);

    // Preenchimento de Cartão
    preencherCartao();

    cy.wait(1500);

    // 4. Submissão do Cadastro
    submeterCadastro();

    cy.wait(1500);

    // 5. Login com usuario criado
    loginComUsuario(nomeUsuario);

    cy.wait(1500);
    
    // 6. Adicionar livro ao carrinho (primeiro slide)
    navegarParaPaginaLivro();
    cy.wait(1500);
    adicionarLivroDaPagina(2);

    cy.wait(1500);
    
    // 7. Verificar carrinho e atualizar quantidade
    verificarEAtualizarCarrinho(1);

    cy.wait(1500);
    
    // 8. Realiza o pagamento
    realizarPagamento();

    cy.wait(1500);

    // 9. Verificar histórico de compras
    verificarHistoricoCompras('APROVADO');
    
    cy.wait(1500);

    // 10. Verificar detalhes da transação
    cy.url().should('include', '/pagamento/detalhes');
    cy.get('.titulo').invoke('text').then((text) => {
      transacaoId = text.match(/#(\d+)/)[1];
    });

    cy.wait(1500);

    // 11. Login Adm
    loginAdm();

    cy.wait(1500);

    // 12. Navegação para Pedidos
    navegarParaPedidosAdm();

    cy.wait(1500);

    // 13. Filtrar e verificar a compra
    filtrarPedidoPorNome(nomeUsuario);

    cy.wait(1500);

    // 14. Verificar dados e atualizar status da compra
    cy.get('h1.titulo').then(($titulo) => {
      transacaoId = $titulo.text().match(/#(\d+)/)[1];
    });

    cy.wait(1500);
    
    // Primeira atualização: APROVADO → EM TRANSPORTE
    atualizarStatusPedido('Confirmar Transporte');

    cy.wait(1500);
    
    // Segunda atualização: EM TRANSPORTE → ENTREGUE
    atualizarStatusPedido('Confirmar Entrega');

    cy.wait(1500);

    // 15. Login com usuario criado
    loginComUsuario(nomeUsuario);

    cy.wait(1500);

    // 16. Verificar histórico de compras
    verificarHistoricoCompras('ENTREGUE');

    cy.wait(1500);

    // 17. Solicitar troca do item
    cy.get('#troca').click(); 
    cy.url().should('include', '/trocas');
    solicitarTroca(1);

    cy.wait(1500);
    
    // 18. Login Adm
    loginAdm();

    cy.wait(1500);

    // 19. Navegação para Pedidos
    navegarParaPedidosAdm();

    cy.wait(1500);

    // 20. Filtrar e verificar a compra
    filtrarPedidoPorNome(nomeUsuario);

    cy.wait(1500);

    // 21. Verificar status da troca e atualizar para TROCA APROVADA
    cy.url().should('include', '/pedidos-adm');
    atualizarStatusTroca('Aprovar Troca');

    cy.wait(1500);
    
    // 22. Atualizar para TROCA CONCLUÍDA
    atualizarStatusTroca('Confirmar Troca');

    cy.wait(2000);

    // 24. Login User
    loginComUsuario(nomeUsuario);  
    
    cy.wait(1500);
  });
});