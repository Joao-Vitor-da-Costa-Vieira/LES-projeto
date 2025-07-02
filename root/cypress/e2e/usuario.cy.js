// cypress/e2e/usuario.cy.js

describe('Fluxo Administrativo Completo', () => {
  let nomeUsuario = 'Fulano da Silva Teste ' + Math.floor(Math.random() * 1000);
  let novoNomeUsuario = nomeUsuario + ' Atualizado';
  let novaSenha = 'NovaSenha@123';
  let admName;

  it('Teste completo de cadastro e atualização', () => {
    // 1. Login como Administrador
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

    // 2. Navegação para Cadastro de Usuário
    cy.url().should('include', '/home-adm');
    cy.get('#Clientes').click();
    cy.url().should('include', '/usuarios');
    cy.get('#cadastrarUsuario').click();
    cy.url().should('include', '/cadastro-adm');
    cy.contains('Cadastrar Usuário').should('be.visible');

    // 3. Preenchimento do Formulário de Cadastro
    cy.get('#nome').type(nomeUsuario);
    cy.get('#email').type('fulano.teste@example.com');
    cy.get('#cpf').type('12345678901');
    
    const senhaValida = 'Senha@123';
    cy.get('#senha').type(senhaValida);
    cy.get('#conf_senha').type(senhaValida);
    
    cy.get('#data_nascimento').type('1990-01-01');
    cy.get('#telefone1').type('11987654321');
    cy.get('#telefone2').type('1133334444');
    cy.get('#genero').select('M');

    // Preenchimento de Endereços
    cy.get('#cidade_e').type('São Paulo');
    cy.get('#bairro_e').type('Centro');
    cy.get('#estado_e').select('SP');
    cy.get('#endereco_e').type('Rua das Flores');
    cy.get('#numero_e').type('123');
    cy.get('#complemento_e').type('Apto 101');
    cy.get('#cep_e').type('01001000');

    cy.get('#cidade_c').type('São Paulo');
    cy.get('#bairro_c').type('Centro');
    cy.get('#estado_c').select('SP');
    cy.get('#endereco_c').type('Rua das Flores');
    cy.get('#numero_c').type('123');
    cy.get('#complemento_c').type('Apto 101');
    cy.get('#cep_c').type('01001000');

    // Preenchimento de Cartão
    cy.get('#num_cartao').type('4111111111111111');
    cy.get('#cod_sec').type('123');
    cy.get('#bandeira').select('Visa');
    cy.get('#nome_c').type('FULANO DA SILVA TESTE');

    // 4. Submissão do Cadastro
    cy.intercept('POST', '/cadastro').as('submitCadastro');
    cy.get('#submit').click();
    cy.wait('@submitCadastro').its('response.statusCode').should('eq', 200);


    // 5. Navegação para Lista de Usuários
    cy.get('#Clientes').click();
    cy.url().should('include', '/usuarios');
    cy.contains('Gerenciar Usuários').should('be.visible');

    // 6. Pesquisa do Usuário Cadastrado
    cy.get('.nome_input').type(nomeUsuario);
    cy.get('#pesquisa-botao').click();
    cy.contains('tr', nomeUsuario).should('exist');

    // 7. Atualização do Cadastro
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click();
    });

    cy.get('.atualizar_submenu').should('be.visible');
    cy.contains('.submenu-botao', 'Atualizar Cadastro').click();

    cy.url().should('include', '/atualizar-adm');
    cy.contains('Atualizando Usuario').should('be.visible');

    cy.get('#nome').clear().type(novoNomeUsuario);
    
    cy.intercept('PUT', '/cadastro/*').as('atualizacaoSubmit'); 
    cy.contains('button', 'Confirmar').click();
    cy.wait('@atualizacaoSubmit').its('response.statusCode').should('eq', 200);

    // 8. Verificação da Atualização
    cy.get('#Clientes').click();
    cy.url().should('include', '/usuarios');
    
    cy.get('.nome_input').clear().type(novoNomeUsuario);
    cy.get('#pesquisa-botao').click();
    cy.contains('tr', novoNomeUsuario).should('exist');

    // 9. Atualização de Senha
    cy.contains('tr', novoNomeUsuario).within(() => {
      cy.get('.atualizar').click();
    });

    cy.get('.atualizar_submenu').should('be.visible');
    cy.contains('.submenu-botao', 'Senha').click();

    cy.url().should('include', '/senha-adm');
    cy.contains('Recuperar Senha').should('be.visible');

    cy.get('#senha').type(senhaValida);
    cy.get('#senhanova').type(novaSenha);
    cy.get('#conf_senha').type(novaSenha);

    cy.intercept('PATCH', '/senha/*').as('alteracaoSenha');
    cy.contains('button', 'Confirmar').click();
    cy.wait('@alteracaoSenha').its('response.statusCode').should('eq', 204);

    // 10. Atualização de Cartão
    cy.get('#Clientes').click();

    cy.get('.nome_input').type(nomeUsuario);
    cy.get('#pesquisa-botao').click();
    cy.contains('tr', nomeUsuario).should('exist');

    cy.contains('tr', novoNomeUsuario).within(() => {
      cy.get('.atualizar').click();
    });
    
    cy.get('.atualizar_submenu').should('be.visible');
    cy.contains('.submenu-botao', 'Cartões').click();
    
    cy.url().should('include', '/cartao-adm');
    cy.contains('Cartões').should('be.visible');
    
    cy.get('.cartoes-mostrado .atualizar').first().click();
    
    cy.url().should('include', '/cartao-adm/atualizar');
    cy.contains('Atualização de Cartão').should('be.visible');
    
    cy.get('#num_cartao').clear().type('5555555555554444');
    cy.intercept('PUT', '/cartao/*/atualizar/*').as('atualizaCartao');
    cy.contains('button', 'Alterar').click();
    cy.wait('@atualizaCartao').its('response.statusCode').should('eq', 200);

    // 11. Atualização de Endereço de Cobrança
    cy.get('#Clientes').click();

    cy.get('.nome_input').type(nomeUsuario);
    cy.get('#pesquisa-botao').click();
    cy.contains('tr', nomeUsuario).should('exist');

    cy.contains('tr', novoNomeUsuario).within(() => {
      cy.get('.atualizar').click();
    });

    cy.get('.atualizar_submenu').should('be.visible');
    cy.contains('.submenu-botao', 'Endereços de cobrança').click();

    cy.url().should('include', '/endereco-cobranca-adm');
    cy.contains('Endereço de Cobranca').should('be.visible');

    cy.get('.endereco-mostrado .atualizar').first().click();

    cy.url().should('include', '/endereco-cobranca-adm/atualizar');
    cy.contains('Atualização de End. Cobranca').should('be.visible');

    cy.get('#numero').clear().type('456');
    cy.intercept('PUT', '/endereco-cobranca/*/atualizar/*').as('atualizaEndCobranca');
    cy.contains('button', 'Atualizar').click();
    cy.wait('@atualizaEndCobranca').its('response.statusCode').should('eq', 200);

    // 12. Atualização de Endereço de Entrega
    cy.get('#Clientes').click();

    cy.get('.nome_input').type(nomeUsuario);
    cy.get('#pesquisa-botao').click();
    cy.contains('tr', nomeUsuario).should('exist');

    cy.contains('tr', novoNomeUsuario).within(() => {
      cy.get('.atualizar').click();
    });

    cy.get('.atualizar_submenu').should('be.visible');
    cy.contains('.submenu-botao', 'Endereços de entrega').click();

    cy.url().should('include', '/endereco-entrega-adm');
    cy.contains('Endereço de Entrega').should('be.visible');

    cy.get('.endereco-mostrado .atualizar').first().click();

    cy.url().should('include', '/endereco-entrega-adm/atualizar');
    cy.contains('Atualização de End. Entrega').should('be.visible');

    cy.get('#numero').clear().type('789');
    cy.intercept('PUT', '/endereco-entrega/*/atualizar/*').as('atualizaEndEntrega');
    cy.contains('button', 'Atualizar').click();
    cy.wait('@atualizaEndEntrega').its('response.statusCode').should('eq', 200);

    // 13. Finalização
    cy.get('#Clientes').click();
    cy.url().should('include', '/usuarios');
    cy.contains('Gerenciar Usuários').should('be.visible');
  });
});