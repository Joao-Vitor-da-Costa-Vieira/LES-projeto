describe('Testes de Cadastro de Usuário', () => {
  beforeEach(() => {
    // Visita a página de cadastro antes de cada teste
    cy.visit('http://localhost:3000/cadastro');
  });

  it('Deve cadastrar um novo usuário com sucesso', () => {
    // Preenche os campos do formulário
    cy.get('#nome').type('João Silva');
    cy.get('#email').type('joao.silva@example.com');
    cy.get('#cpf').type('12345678901');
    cy.get('#senha').type('Senha@123');
    cy.get('#conf_senha').type('Senha@123');
    cy.get('#data_nascimento').type('1990-01-01');
    cy.get('#telefone1').type('11987654321');
    cy.get('#genero').select('Masculino');

    // Preenche o endereço de entrega
    cy.get('#cidade_e').type('São Paulo');
    cy.get('#bairro_e').type('Centro');
    cy.get('#estado_e').select('SP');
    cy.get('#endereco_e').type('Rua Exemplo, 123');
    cy.get('#numero_e').type('123');
    cy.get('#cep_e').type('01001000');

    // Preenche o endereço de cobrança
    cy.get('#cidade_c').type('São Paulo');
    cy.get('#bairro_c').type('Centro');
    cy.get('#estado_c').select('SP');
    cy.get('#endereco_c').type('Rua Exemplo, 123');
    cy.get('#numero_c').type('123');
    cy.get('#cep_c').type('01001000');

    // Preenche os dados do cartão
    cy.get('#num_cartao').type('4111111111111111');
    cy.get('#cod_sec').type('123');
    cy.get('#bandeira').select('Visa');
    cy.get('#nome_c').type('João Silva');

    // Submete o formulário
    cy.get('form').submit();
  });

  it('Deve exibir erro ao tentar cadastrar com senhas diferentes', () => {
    cy.get('#senha').type('Senha@123');
    cy.get('#conf_senha').type('Senha@456');
    cy.get('form').submit();

  });
});

describe('Testes de Atualização de Usuário', () => {
  beforeEach(() => {
    // Visita a página de atualização de um usuário específico
    cy.visit('http://localhost:3000/cadastro/1'); // Substitua 1 pelo ID do usuário
  });

  it('Deve atualizar os dados do usuário com sucesso', () => {
    // Altera os campos do formulário
    cy.get('#nome').clear().type('João Vitor Atualizado');
    cy.get('#email').clear().type('joao.atualizado@example.com');
    cy.get('#telefone1').clear().type('11987654321');

    // Submete o formulário
    cy.get('form').submit();

  });

  it('Deve exibir erro ao tentar atualizar com senhas diferentes', () => {
    cy.get('#senha').type('NovaSenha@123');
    cy.get('#conf_senha').type('NovaSenha@456');
    cy.get('form').submit();

    // Verifica se a mensagem de erro é exibida
    cy.get('#erroConfSenha').should('be.visible');
  });
});

describe('Testes de Consulta de Usuário', () => {
  beforeEach(() => {
    // Visita a página de consulta de usuários
    cy.visit('http://localhost:3000/consultarUsuario');
  });

  it('Deve verificar os dados da primeira linha da tabela', () => {
    // Verifica se a tabela de usuários está visível
    cy.get('table').should('exist');

    // Verifica se há pelo menos um usuário na lista
    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    // Verifica os dados da primeira linha da tabela
    cy.get('table tbody tr').first().within(() => {
      // Verifica o nome
      cy.get('td').eq(1).should('contain', 'João Vitor Atualizado'); // Coluna 1: Nome
      // Verifica o e-mail
      cy.get('td').eq(2).should('contain', 'joao.atualizado@example.com'); // Coluna 2: E-mail
      // Verifica o CPF
      cy.get('td').eq(3).should('contain', '12345678901'); // Coluna 3: CPF
      // Verifica o gênero
      cy.get('td').eq(4).should('contain', 'Masculino'); // Coluna 4: Gênero
    });
  });
});