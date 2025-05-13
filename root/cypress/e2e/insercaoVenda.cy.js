// cypress/e2e/inservaoVenda.cy.js
Cypress.on("uncaught:exception", (err) => {
  console.error("Erro não tratado:", err.message);
  return false;
});

Cypress.on("window:before:load", (win) => {
  win.addEventListener("error", (event) => {
    console.error("Erro durante o carregamento:", event.error);
  });
});

describe('Fluxo Completo de Pesquisa, Carrinho e Compra', () => {
  const userId = 1;
  const livros = {
    it: {
      nome: 'It a Coisa',
      id: 4,
      quantidadeInicial: 2,
      novaQuantidade: 1
    },
    pedraFilosofal: {
      nome: 'Harry Potter e a Pedra Filosofal',
      id: 1,
      quantidade: 2,
      autor: 'J.K. Rowling'
    },
    camaraSecreta: {
      nome: 'Harry Potter e a Câmara Secreta',
      id: 2,
      quantidade: 1
    }
  };

  const baseURL = 'http://localhost:3000';

  before(() => {
    cy.viewport(1280, 720);
    
    // Configuração correta do visit
    cy.visit(`${baseURL}/home/${userId}`, {
      timeout: 20000,
      retryOnStatusCodeFailure: true,
      failOnStatusCode: true, 
      onLoad: () => {
        console.log('Página carregada com sucesso');
      }
    });

  });

   it('Deve executar todo o fluxo de compras', () => {
    // Primeira pesquisa e adição
    cy.realizarPesquisaENavegar('navbar', 'It')
      .adicionarLivroComQuantidade(livros.it.id, livros.it.quantidadeInicial)
      .fecharConfirmacao();

    // Segunda pesquisa e adição
    cy.realizarPesquisaENavegar('pagina', 'Harry Potter e a C')
      .get('[data-livro-id]', { timeout: 10000 }).should('exist') 
      .adicionarLivroComQuantidade(livros.camaraSecreta.id, livros.camaraSecreta.quantidade)
      .fecharConfirmacao();

    // Pesquisa com filtros avançados
    cy.realizarPesquisaComFiltrosAvancados()
      .verificarResultadoUnico(livros.pedraFilosofal.nome)
      .acessarDetalhesLivro(livros.pedraFilosofal.nome)
      .adicionarLivroDireto()
      .verCarrinho();

    // Ajustes no carrinho
    cy.atualizarItemCarrinho(livros.it.id, livros.it.novaQuantidade)
      .fecharConfirmacao()
      .atualizarItemCarrinho(livros.pedraFilosofal.id, livros.pedraFilosofal.quantidade)
      .fecharConfirmacao()
          .removerItemCarrinho(livros.camaraSecreta.nome)
    .fecharConfirmacao()
      .finalizarCompra();

    // Fluxo de pagamento
    cy.get('.adicionar-endereco').click();
    cy.get('.atualizar_submenu_endereco').within(() => {
      cy.get('#cidade').type('São Paulo');
      cy.get('#bairro').type('Centro');
      cy.get('#estado').select('SP');
      cy.get('#endereco').type('Rua da Liberdade');
      cy.get('#numero').type('100');
      cy.get('#cep').type('01001000');
      cy.get('button[type="submit"]').click();
    });

    cy.get('#end_entrega').select(1);
    
    cy.get('.adicionar-forma-pagamento').click();
    cy.get('.submenu-pagamento').within(() => {
      cy.get('#forma-pagamento-select').select('1');
      cy.get('.confirmar-pagamento').click();
    });

    cy.get('.forma-pagamento-item').last().within(() => {
      cy.get('input[name="valor"]').invoke('val').then(valorAtual => {
        cy.get('#total-valor').invoke('text').then(totalText => {
          const total = parseFloat(totalText.replace('R$ ', ''));
          if (parseFloat(valorAtual) !== total) {
            cy.get('input[name="valor"]').clear().type(total.toFixed(2));
          }
        });
      });
      cy.get('select[name="cartao"]').select(1);
    });

    cy.get('#Confirmar').click();
    cy.on('window:alert', (texto) => {
      expect(texto).to.match(/Pagamento Concluído|sucesso/i);
    });
    
    cy.url().should('include', '/pagamento/historico');
    cy.get('@consoleError').should('not.be.called');
  });

  // Commands customizados
  Cypress.Commands.add('realizarPesquisaENavegar', (tipo, termo) => {
    const seletorInput = tipo === 'navbar' ? '#navbarInput' : '.filtro-pesquisa-input';
    const seletorBotao = tipo === 'navbar' ? '#navbarBotaoPesquisa' : '#pesquisa-botao';

    return cy.get(seletorInput).clear().type(termo)
      .get(seletorBotao).click()
      .get('.table_div', { timeout: 10000 }).should('be.visible');
  });

 Cypress.Commands.add('adicionarLivroComQuantidade', (id, quantidade) => {
  return cy.get(`td[data-livro-id="${id}"] .adicionar`) 
    .click()
    .get('.atualizar_submenu')
    .within(() => {
      if (quantidade > 1) {
        Cypress._.times(quantidade - 1, () => {
          cy.get('.submenu-botao-adicao').last().click();
        });
      }
      cy.get('.submenu-adicionar-produto').click();
    });
});

Cypress.Commands.add('realizarPesquisaENavegar', (tipo, termo) => {
  const seletorInput = tipo === 'navbar' ? '#navbarInput' : '.filtro-pesquisa-input';
  const seletorBotao = tipo === 'navbar' ? '#navbarBotaoPesquisa' : '#pesquisa-botao';

  cy.get(seletorInput).clear().type(termo);
  cy.get(seletorBotao).click();
  cy.get('.table_div', { timeout: 10000 }).should('be.visible');
  return cy;
});

Cypress.Commands.add('adicionarLivroComQuantidade', (id, quantidade) => {
  return cy.get(`td[data-livro-id="${id}"] .adicionar`)
    .click()
    .get('.atualizar_submenu')
    .within(() => {
      if (quantidade > 1) {
        Cypress._.times(quantidade - 1, () => {
          cy.get('.submenu-botao-adicao').last().click();
        });
      }
      cy.get('.submenu-adicionar-produto').click();
    });
});

Cypress.Commands.add('realizarPesquisaComFiltrosAvancados', () => {
  cy.get('.filtro-pesquisa-input').clear();
  cy.get('#preco').invoke('val', 31).trigger('input');
  cy.get('.botao-mais-filtro').click();
  cy.get('.filtro-pesquisa-input-autor').clear().type('J.K.');
  cy.get('#pesquisa-botao').click();
  return cy;
});

Cypress.Commands.add('verificarResultadoUnico', (nomeLivro) => {
  cy.get('.table_div tbody tr').should('have.length', 1);
  cy.contains('.table_div tbody tr', nomeLivro).should('exist');
  return cy;
});

Cypress.Commands.add('acessarDetalhesLivro', (nomeLivro) => {
  cy.contains('.table_div tbody tr', nomeLivro)
    .find('.atualizar').click();
  cy.get('.titulo-livro h1').should('contain', nomeLivro);
  cy.get('.estoque:visible').should('contain', 'Em Estoque');
  return cy;
});

Cypress.Commands.add('adicionarLivroDireto', () => {
  cy.get('.adicionar-produto').click();
  cy.get('.atualizar_submenu').within(() => {
    cy.get('.submenu-adicionar-produto').click();
  });
  return cy;
});

Cypress.Commands.add('verCarrinho', () => {
  cy.get('.ver-carrinho').click();
  cy.url().should('include', '/carrinho');
  return cy;
});

Cypress.Commands.add('atualizarItemCarrinho', (id, novaQuantidade) => {
  cy.get(`[data-lvr-id="${id}"]`).click();
  
  cy.get('.atualizar_submenu').within(() => {
    cy.get('.numero_input').invoke('val').then(current => {
      const currentValue = parseInt(current);
      const diff = novaQuantidade - currentValue;

      Array.from({ length: Math.abs(diff) }, () => {
        cy.get(diff > 0 ? '.submenu-botao-atualizacao:last' : '.submenu-botao-atualizacao:first').click();
      });
    });
    
    cy.get('.submenu-atualizar-produto').click();
  });
  return cy;
});

Cypress.Commands.add('removerItemCarrinho', (nomeLivro) => {
  cy.contains('tr', nomeLivro).within(() => {
    cy.get('.remover').click();
  });

  cy.get('.deletar_submenu').within(() => {
    cy.get('.submenu-deletar-produto').click();
  });
  return cy;
});

Cypress.Commands.add('fecharConfirmacao', () => {
  cy.get('.confirmacao-overlay').should('be.visible');
  cy.get('.continuar-comprando').click();
  cy.get('.confirmacao-overlay').should('not.exist');
  return cy;
});

Cypress.Commands.add('finalizarCompra', () => {
  cy.get('#comprar').click();
  cy.url().should('include', '/pagamento');
  return cy;
});

Cypress.Commands.add('selecionarPrimeiroCartao', (total) => {
  cy.get('.forma-pagamento-item').last().within(() => {
    cy.get('input[name="valor"]').clear().type(total.toFixed(2));
    cy.get('select[name="cartao"]').select(1);
  });
  return cy;
});
});