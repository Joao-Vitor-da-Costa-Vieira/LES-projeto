describe('Testes de Endereço de Entrega', () => {
  beforeEach(() => {
    // Visita a página de cadastro de endereço de entrega
    cy.visit('http://localhost:3000/endereco-entrega/1/adicionar'); // Substitua 1 pelo ID do usuário
  });

  it('Deve cadastrar um novo endereço de entrega com sucesso', () => {
    // Preenche os campos do formulário
    cy.get('#bairro').type('Centro');
    cy.get('#cep').type('01001000');
    cy.get('#cidade').type('São Paulo');
    cy.get('#estado').select('SP');
    cy.get('#endereco').type('Rua Exemplo, 123');
    cy.get('#numero').type('123');
    cy.get('#complemento').type('Apto 101');

    // Submete o formulário
    cy.get('form').submit();

    // Verifica se o cadastro foi bem-sucedido
    cy.contains('Endereço foi cadastrado com sucesso!').should('exist');
  });
});

it('Deve atualizar um endereço de entrega com sucesso', () => {
  // Visita a página de atualização de endereço de entrega
  cy.visit('http://localhost:3000/endereco-entrega/1/atualizar/1'); // Substitua pelos IDs corretos

  // Altera os campos do formulário
  cy.get('#bairro').clear().type('Novo Bairro');
  cy.get('#cep').clear().type('02002000');

  // Submete o formulário
  cy.get('form').submit();

  // Verifica se a atualização foi bem-sucedida
  cy.contains('Endereço foi atualizado com sucesso!').should('exist');
});

describe('Testes de Endereço de Entrega', () => {
  beforeEach(() => {
    // Visita a página de endereço de entrega
    cy.visit('http://localhost:3000/endereco-entrega/1'); // Substitua 1 pelo ID do usuário
  });

  it('Deve verificar os dados da primeira linha da tabela de endereço de entrega', () => {
    // Verifica se a tabela está visível
    cy.get('table').should('exist');

    // Verifica se há pelo menos um endereço na lista
    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    // Verifica os dados da primeira linha da tabela
    cy.get('table tbody tr').first().within(() => {
      // Verifica o endereço
      cy.get('td').eq(1).should('contain', 'Avenida Exemplo, 456'); // Coluna 1: Endereço
      // Verifica o bairro
      cy.get('td').eq(2).should('contain', 'Jardim'); // Coluna 2: Bairro
      // Verifica o estado
      cy.get('td').eq(3).should('contain', 'RJ'); // Coluna 3: Estado
      // Verifica o CEP
      cy.get('td').eq(4).should('contain', '20020000'); // Coluna 4: CEP
      // Verifica o número
      cy.get('td').eq(5).should('contain', '456'); // Coluna 5: Número
    });
  });
});

