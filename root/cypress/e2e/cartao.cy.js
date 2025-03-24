describe('Testes de Cartão', () => {
  beforeEach(() => {
    // Visita a página de cadastro de cartão
    cy.visit('http://localhost:3000/cartao/1/adicionar'); // Substitua 1 pelo ID do usuário
  });

  it('Deve cadastrar um novo cartão com sucesso', () => {
    // Preenche os campos do formulário
    cy.get('#num_cartao').type('4111111111111111');
    cy.get('#nome_c').type('João Silva');
    cy.get('#bandeira').select('Visa');
    cy.get('#codigo_seguranca').type('123');

    // Submete o formulário
    cy.get('form').submit();

    // Verifica se o cadastro foi bem-sucedido
    cy.contains('Cartão foi cadastrado com sucesso!').should('exist');
  });
});

it('Deve atualizar um cartão com sucesso', () => {
  // Visita a página de atualização de cartão
  cy.visit('http://localhost:3000/cartao/1/atualizar/1'); // Substitua pelos IDs corretos

  // Altera os campos do formulário
  cy.get('#num_cartao').clear().type('5111111111111111');
  cy.get('#nome_c').clear().type('João Silva Atualizado');

  // Submete o formulário
  cy.get('form').submit();

  // Verifica se a atualização foi bem-sucedida
  cy.contains('Cartão foi atualizado com sucesso!').should('exist');
});

describe('Testes de Cartões', () => {
  beforeEach(() => {
    // Visita a página de cartões
    cy.visit('http://localhost:3000/cartao/1'); // Substitua 1 pelo ID do usuário
  });

  it('Deve verificar os dados da primeira linha da tabela de cartões', () => {
    // Verifica se a tabela está visível
    cy.get('table').should('exist');

    // Verifica se há pelo menos um cartão na lista
    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    // Verifica os dados da primeira linha da tabela
    cy.get('table tbody tr').first().within(() => {
      // Verifica a bandeira
      cy.get('td').eq(1).should('contain', 'Visa'); // Coluna 1: Bandeira
      // Verifica o nome do titular
      cy.get('td').eq(2).should('contain', 'João Silva'); // Coluna 2: Nome do Titular
      // Verifica o número do cartão
      cy.get('td').eq(3).should('contain', '4111111111111111'); // Coluna 3: Número do Cartão
    });
  });
});