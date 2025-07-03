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
    cy.contains('Produto adicionado ao carrinho!').should('be.visible');
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
    cy.get('#end_entrega option').should('have.length.gt', 1);
    cy.get('#end_entrega').select(1);
    cy.get('.adicionar-forma-pagamento').click();
    cy.get('#forma-pagamento-select').select('1');
    cy.get('.confirmar-pagamento').click();
    cy.get('.forma-pagamento-item input[name="valor"]').type(
      cy.get('#total-valor').invoke('text').then(text => {
        return text.replace('R$ ', '').trim();
      })
    );
    cy.get('.forma-pagamento-item select[name="cartao"]').select(1);
    cy.intercept('POST', '/pagamento/confirmar').as('finalizarPagamento');
    cy.get('#Confirmar').click();
    cy.wait('@finalizarPagamento').its('response.statusCode').should('eq', 200);
  };

  const verificarHistoricoCompras = (statusEsperado) => {
    cy.get('button:contains("Histórico")').click();
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
    cy.get('#filtro-nome').type(nome);
    cy.get('#aplicar-filtros').click();
    cy.get('table tbody tr').should('have.length.at.least', 1);
    cy.contains('td', nome).should('exist');
    cy.contains('td', nome).parent('tr').find('.ver_mais').click();
  };

  const atualizarStatusPedido = (acao) => {
    cy.get('#atualizar').click();
    cy.get('.status-modal').should('be.visible');
    cy.contains('button', acao).click();
    cy.contains(`Status atualizado para: ${acao.split('Confirmar ')[1]}`).should('be.visible');
    cy.get('#btn-voltar-pedidos').click();
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
    cy.contains('Troca solicitada com sucesso').should('be.visible');
  };

  const atualizarStatusTroca = (acao) => {
    cy.get('#atualizar-troca').click();
    cy.get('.status-modal').should('be.visible');
    cy.contains('button', acao).click();
    cy.get('#btn-voltar-pedidos').click();
  };

  const verificarNotificacao = (tipo) => {
    cy.get('.notificacao-icone').should('be.visible').click();
    cy.get('.notificacao-submenu').should('be.visible');
    cy.get('.notificacao-item').should('contain', tipo);
    cy.get('.notificacao-item').first().click();
    cy.url().should('include', '/pagamento/detalhes');
    cy.contains(tipo).should('be.visible');
  };

  const adicionarLivroPorPesquisa = (termoPesquisa, livro) => {
    cy.get('#navbarInput').type(termoPesquisa);
    cy.get('#navbarBotaoPesquisa').click();
    cy.url().should('include', '/buscar-titulo');
    cy.get('.table_div table').should('be.visible');
    cy.contains('td', livro).parent('tr').within(() => {
      cy.get('.adicionar').click();
      cy.get('.atualizar_submenu .numero_input').should('have.value', '1');
      cy.get('.submenu-adicionar-produto').click();
      cy.get('.confirmacao-overlay').should('be.visible');
      cy.get('.continuar-comprando').click();
    });
  };

  const removerItemDoCarrinho = () => {
    cy.get('#tabela-carrinho tbody tr').then(($rows) => {
      if ($rows.length > 0 && !$rows.text().includes('Seu carrinho está vazio')) {
        cy.get('.remover').first().click();
        cy.get('.deletar_submenu').should('be.visible');
        cy.contains('Confirmar Remoção?').should('be.visible');
        cy.get('.submenu-deletar-produto').click();
        cy.get('.confirmacao-overlay').should('be.visible');
        cy.contains('Item removido do carrinho').should('be.visible');
        cy.get('.continuar-comprando').click();
        cy.get('#tabela-carrinho tbody tr').should(($newRows) => {
          expect($newRows.length).to.be.lessThan($rows.length);
        });
      }
    });
  };

  const realizarPagamentoComCupom = () => {
    cy.get('#comprar').should('be.enabled').click();
    cy.url().should('include', '/pagamento');
    cy.get('#end_entrega option').should('have.length.gt', 0);
    cy.get('#end_entrega').select(1);
    cy.get('.adicionar-forma-pagamento').click();
    cy.get('#forma-pagamento-select').select('2');
    cy.get('.confirmar-pagamento').click();
    cy.get('.forma-pagamento-item').within(() => {
      cy.get('select[name="cupom"] option').should('have.length.gt', 0);
      cy.get('select[name="cupom"]').select(1);
      cy.get('select[name="cupom"] option:selected').then(($option) => {
        const cupomValue = parseFloat($option.text().match(/R\$ (\d+\.\d{2})/)[1]);
        cy.get('input[name="valor"]').clear().type(cupomValue.toFixed(2));
      });
    });
    cy.intercept('POST', '/pagamento/confirmar').as('finalizarPagamentoCupom');
    cy.get('#Confirmar').click();
    cy.wait('@finalizarPagamentoCupom').its('response.statusCode').should('eq', 200);
  };

  const solicitarDevolucao = (quantidade = 1) => {
    cy.get('.atualizar').first().click();
    cy.get('.atualizar_submenu').should('be.visible');
    cy.get('.atualizar_submenu .numero_input').clear().type(quantidade.toString());
    cy.get('.submenu-atualizar-produto').click();
    cy.get('#tabela-carrinho tbody tr:first-child .qtd-atual').should('contain', quantidade.toString());
    cy.intercept('POST', '/devolucoes/confirmar').as('confirmarDevolucao');
    cy.get('#devolver').click();
    cy.wait('@confirmarDevolucao').its('response.statusCode').should('eq', 200);
    cy.contains('Devolução solicitada com sucesso').should('be.visible');
  };

  const atualizarStatusDevolucao = (acao) => {
    cy.get('#atualizar-devolucao').click();
    cy.get('.status-modal').should('be.visible');
    cy.contains('button', acao).click();
    cy.get('#btn-voltar-pedidos').click();
  };

  // Teste principal
  it('Teste completo de cadastro e atualização', () => {
    // 1. Login sem usuario
    loginSemUsuario();
    
    // 2. Navegação para Cadastro de Usuário
    navegarParaCadastro();

    // 3. Preenchimento do Formulário de Cadastro
    const senhaValida = 'Senha@123';
    preencherFormularioCadastro(nomeUsuario, 'fulano.teste@example.com', '12345678901', senhaValida);
    
    // Preenchimento de Endereços
    preencherEndereco('e'); // Endereço de entrega
    preencherEndereco('c'); // Endereço de cobrança

    // Preenchimento de Cartão
    preencherCartao();

    // 4. Submissão do Cadastro
    submeterCadastro();

    // 5. Login com usuario criado
    loginComUsuario(nomeUsuario);
    
    // 6. Adicionar livro ao carrinho (primeiro slide)
    adicionarLivroAoCarrinho(2);
    
    // 7. Verificar carrinho e atualizar quantidade
    verificarEAtualizarCarrinho(1);
    
    // 8. Realiza o pagamento
    realizarPagamento();

    // 9. Verificar histórico de compras
    verificarHistoricoCompras('APROVADO');

    // 10. Verificar detalhes da transação
    cy.url().should('include', '/pagamento/detalhes');
    cy.get('.titulo').invoke('text').then((text) => {
      transacaoId = text.match(/#(\d+)/)[1];
    });

    // 11. Login Adm
    loginAdm();

    // 12. Navegação para Pedidos
    navegarParaPedidosAdm();

    // 13. Filtrar e verificar a compra
    filtrarPedidoPorNome(nomeUsuario);

    // 14. Verificar dados e atualizar status da compra
    cy.get('h1.titulo').then(($titulo) => {
      transacaoId = $titulo.text().match(/#(\d+)/)[1];
    });
    
    // Primeira atualização: APROVADO → EM TRANSPORTE
    atualizarStatusPedido('Confirmar Transporte');
    
    // Segunda atualização: EM TRANSPORTE → ENTREGUE
    cy.contains('tr', transacaoId).find('.ver_mais').click();
    atualizarStatusPedido('Confirmar Entrega');
    
    // Verificação final no histórico
    cy.contains('tr', transacaoId).within(() => {
      cy.get('td:nth-child(4)').should('contain', 'ENTREGUE');
    });

    // 15. Login com usuario criado
    loginComUsuario(nomeUsuario);

    // 16. Verificar histórico de compras
    verificarHistoricoCompras('ENTREGUE');

    // 17. Solicitar troca do item
    cy.url().should('include', '/trocas');
    solicitarTroca(1);
    
    // 18. Login Adm
    loginAdm();

    // 19. Navegação para Pedidos
    navegarParaPedidosAdm();

    // 20. Filtrar e verificar a compra
    filtrarPedidoPorNome(nomeUsuario);

    // 21. Verificar status da troca e atualizar para TROCA APROVADA
    cy.url().should('include', '/pedidos-adm');
    atualizarStatusTroca('Aprovar Troca');
    
    // 22. Atualizar para TROCA CONCLUÍDA
    cy.contains('tr', transacaoId).find('.ver_mais').click();
    atualizarStatusTroca('Concluir Troca');

    // 23. Verificação final no histórico
    cy.contains('tr', transacaoId).within(() => {
      cy.get('td:nth-child(4)').should('contain', 'TROCA CONCLUÍDA');
    });

    // 24. Verificar como usuário que a troca foi concluída
    loginComUsuario(nomeUsuario);
    verificarNotificacao('TROCA CONCLUÍDA');

    // 25. Pesquisar e Adicionar novos livros ao carrinho
    adicionarLivroPorPesquisa('Harry', 'Harry Potter e a Pedra Filosofal');

    // 26. Teste da página de detalhes do livro
    cy.get('.botao-mais-filtro').click(); 
    cy.get('.filtro-pesquisa-numero-isbn').type('9788532512062');
    cy.get('#pesquisa-botao').click();
    cy.contains('td', 'Harry Potter e a Câmara Secreta').parent('tr').find('.atualizar').click();
    
    cy.url().should('include', 'livros');
    cy.get('.estoque-div').within(() => {
      cy.get('.estoque:visible').then(($estoqueElement) => {
        const estoqueText = $estoqueElement.text().trim();
        if (estoqueText === 'Em Estoque') {
          cy.get('.adicionar-produto').click();
          cy.get('.submenu-adicionar-produto').click();
          cy.get('.ver-carrinho').click();
        } else if (estoqueText !== 'Sem Estoque') {
          throw new Error('Status de estoque desconhecido');
        }
      });
    });
        
    // 27. Remoção de item do carrinho e avanço para compra
    removerItemDoCarrinho();
    
    // 28. Pagamento usando cupom da primeira compra
    realizarPagamentoComCupom();

    // 29. Verificar histórico da compra com cupom
    verificarHistoricoCompras('APROVADO');

    // 30. Verificar detalhes da transação 
    cy.url().should('include', '/pagamento/detalhes');
    cy.contains('Transação').should('be.visible');

    // 31. Login Adm 
    loginAdm();

    // 32. Navegação para Pedidos 
    navegarParaPedidosAdm();

    // 33. Filtrar e verificar a compra 
    filtrarPedidoPorNome(nomeUsuario);

    // 34. Atualizar status para EM TRANSPORTE e ENTREGUE 
    atualizarStatusPedido('Confirmar Transporte');
    cy.contains('tr', transacaoId).find('.ver_mais').click();
    atualizarStatusPedido('Confirmar Entrega');

    // 35. Login com usuário criado 
    loginComUsuario(nomeUsuario);

    // 36. Verificar histórico e solicitar DEVOLUÇÃO 
    verificarHistoricoCompras('ENTREGUE');

    // 37. Solicitar devolução do item
    cy.url().should('include', '/devolucoes'); 
    solicitarDevolucao(1);

    // 38. Login Adm para processar devolução
    loginAdm();

    // 39. Navegação para Pedidos 
    navegarParaPedidosAdm();

    // 40. Filtrar e verificar a devolução 
    cy.get('#mostrar-filtros').click();
    cy.get('#filtro-nome').type(nomeUsuario);
    cy.get('#filtro-status').select('DEVOLUCAO SOLICITADA'); 
    cy.get('#aplicar-filtros').click();
    cy.contains('td', nomeUsuario).parent('tr').find('.ver_mais').click();

    // 41. Aprovar e concluir devolução
    atualizarStatusDevolucao('Aprovar Devolução');
    cy.contains('tr', transacaoId).find('.ver_mais').click();
    atualizarStatusDevolucao('Concluir Devolução');

    // 42. Verificação final
    loginComUsuario(nomeUsuario);
    verificarNotificacao('DEVOLUÇÃO CONCLUÍDA');
  });
});