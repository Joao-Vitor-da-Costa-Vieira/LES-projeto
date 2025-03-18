describe('Testes de Recuperação de Senha', () => {
  beforeEach(() => {
    // Visita a página de recuperação de senha
    cy.visit('http://localhost:3000/senha/1'); // Substitua 1 pelo ID do usuário
  });

  it('Deve recuperar a senha com sucesso', () => {
    // Preenche os campos do formulário
    cy.get('.senha_input').type('SenhaAtual123');
    cy.get('.senha_nova_input').type('NovaSenha123');
    cy.get('.senha_confirma_input').type('NovaSenha123');

    // Submete o formulário
    cy.get('form').submit();

    // Verifica se a senha foi recuperada com sucesso
    cy.contains('Senha atualizada com sucesso!').should('exist');
  });

  it('Deve exibir erro ao tentar recuperar senha com senhas diferentes', () => {
    // Preenche os campos do formulário com senhas diferentes
    cy.get('.senha_input').type('SenhaAtual123');
    cy.get('.senha_nova_input').type('NovaSenha123');
    cy.get('.senha_confirma_input').type('OutraSenha123');

    // Submete o formulário
    cy.get('form').submit();

    // Verifica se a mensagem de erro é exibida
    cy.get('#erroConfSenha').should('be.visible');
  });
});