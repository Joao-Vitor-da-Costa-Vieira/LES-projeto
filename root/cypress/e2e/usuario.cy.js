describe('Fluxo Completo de Cadastro de Usuário pelo ADM', () => {
 describe('Fluxo Completo de Cadastro e Atualização de Usuário', () => {
  let nomeUsuario = 'Fulano da Silva Teste ' + Math.floor(Math.random() * 1000);
  let novoNomeUsuario = nomeUsuarioOriginal + ' Atualizado';
  let novaSenha = 'NovaSenha@123';

  it('Deve cadastrar, pesquisar e acessar a tela de atualização do usuário', () => {
    // 1. Acessa a tela inicial e seleciona ADM
    cy.visit('http://localhost:3000/telaInicial')
    cy.contains('Selecione o tipo de Usuário:').should('be.visible')
    
    cy.get('#adm').then(($select) => {
      if ($select.find('option').length > 0) {
        cy.get('#adm').select(0)
        cy.get('#adm option:selected').invoke('text').then((admName) => {
          this.admName = admName.split(', ')[1]
        })
      } else {
        throw new Error('Nenhum ADM disponível para seleção')
      }
    })

    cy.get('.botao-adm').click()

    // 2. Navega até a página de cadastro
    cy.url().should('include', '/homeAdm')
    cy.get('#Clientes').click()
    cy.url().should('include', '/consultarUsuario')
    cy.get('#cadastrarUsuario').click()
    cy.url().should('include', '/cadastrarUsuarioAdm')
    cy.contains('Cadastrar Usuário').should('be.visible')

    // 3. Preenche todos os campos do formulário
    cy.get('#nome').type('Fulano da Silva Teste')
    cy.get('#email').type('fulano.teste@example.com')
    cy.get('#cpf').type('12345678901')
    
    const senhaValida = 'Senha@123'
    cy.get('#senha').type(senhaValida)
    cy.get('#conf_senha').type(senhaValida)
    
    cy.get('#data_nascimento').type('1990-01-01')
    cy.get('#telefone1').type('11987654321')
    cy.get('#telefone2').type('1133334444')
    cy.get('#genero').select('M')

    // Preenche endereços e cartão
    cy.get('#cidade_e').type('São Paulo')
    cy.get('#bairro_e').type('Centro')
    cy.get('#estado_e').select('SP')
    cy.get('#endereco_e').type('Rua das Flores')
    cy.get('#numero_e').type('123')
    cy.get('#complemento_e').type('Apto 101')
    cy.get('#cep_e').type('01001000')

    cy.get('#cidade_c').type('São Paulo')
    cy.get('#bairro_c').type('Centro')
    cy.get('#estado_c').select('SP')
    cy.get('#endereco_c').type('Rua das Flores')
    cy.get('#numero_c').type('123')
    cy.get('#complemento_c').type('Apto 101')
    cy.get('#cep_c').type('01001000')

    cy.get('#num_cartao').type('4111111111111111')
    cy.get('#cod_sec').type('123')
    cy.get('#bandeira').select('Visa')
    cy.get('#nome_c').type('FULANO DA SILVA TESTE')

    // 4. Submete o formulário e lida com o alerta
    cy.intercept('POST', '/cadastrarUsuarioAdm').as('submitCadastro')
    cy.get('#submit').click()
    
    // Aguarda a requisição e verifica o alerta
    cy.wait('@submitCadastro').its('response.statusCode').should('eq', 200)
    
    // Verifica e fecha o alerta de confirmação
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Cliente foi Cadastrado com Sucesso!')
    })
    
    // 5. Clica novamente no botão Clientes para voltar à lista
    cy.get('#Clientes').click()
    
    // 6. Verifica se voltou para a página de consulta
    cy.url().should('include', '/consultarUsuario')
    cy.contains('Consulta de Usuários').should('be.visible') 

    // 7. Pesquisa pelo usuário recém-cadastrado
    cy.get('.nome_input').type(nomeUsuario)
    cy.get('#pesquisa-botao').click()

    // 8. Verifica se o usuário aparece na tabela de resultados
    cy.get('tbody tr').should('have.length.gt', 0)
    cy.contains('td', nomeUsuario).should('exist')

    // 9. Clica no botão "Atualizar" do usuário encontrado
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click()
    })

    // 10. Verifica se o submenu apareceu e clica em "Atualizar Cadastro"
    cy.get('.atualizar_submenu').should('be.visible')
    cy.contains('.submenu-botao', 'Atualizar Cadastro').click()

    // 11. Verifica se foi para a página de atualização
    cy.url().should('include', '/atualizar-adm')
    cy.contains('Atualizar Cadastro').should('be.visible')

    // 12. Verifica se está na página de atualização
    cy.url().should('include', '/atualizar-adm')
    cy.contains('Atualizando Usuario').should('be.visible')

    // 13. Modifica o nome do usuário
    cy.get('#nome').clear().type(novoNomeUsuario)
    
    // 14. Submete o formulário de atualização
    cy.intercept('POST', '/atualizar-adm*').as('atualizacaoSubmit')
    cy.contains('button', 'Confirmar').click()
    
    // 15. Verifica e fecha o alerta de confirmação
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Usuário foi atualizado com sucesso!')
    })
    
    // 16. Volta para a página de clientes
    cy.get('#Clientes').click()
    
    // 17. Verifica se voltou para a página de consulta
    cy.url().should('include', '/consultarUsuario')
    
    // 18. Pesquisa pelo usuário atualizado para confirmar a mudança
    cy.get('.nome_input').clear().type(novoNomeUsuario)
    cy.get('#pesquisa-botao').click()
    
    // 19. Verifica se o usuário com novo nome aparece nos resultados
    cy.contains('tr', novoNomeUsuario).should('exist')

    // 20. Localiza o usuário novamente na lista
    cy.get('.nome_input').clear().type(nomeUsuario)
    cy.get('#pesquisa-botao').click()
    cy.contains('tr', nomeUsuario).should('exist')

    // 21. Abre o submenu de atualização
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click()
    })

    // 22. Clica na opção de Senha no submenu
    cy.get('.atualizar_submenu').should('be.visible')
    cy.contains('.submenu-botao', 'Senha').click()

    // 23. Verifica se foi para a página de senha
    cy.url().should('include', '/senha-adm')
    cy.contains('Recuperar Senha').should('be.visible')

    // 24. Preenche o formulário de alteração de senha
    cy.get('#senha').type('Senha@123') // Senha atual (usada no cadastro)
    cy.get('#senhanova').type(novaSenha)
    cy.get('#conf_senha').type(novaSenha)

    // 25. Submete o formulário
    cy.intercept('POST', '/senha-adm*').as('alteracaoSenha')
    cy.contains('button', 'Confirmar').click()

    // 26. Verifica e fecha o alerta de confirmação
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Senha atualizada com sucesso!')
    })

    // 27. Volta para a página de clientes
    cy.get('#Clientes').click()

    // 28. Verificação final
    cy.url().should('include', '/consultarUsuario')
    cy.contains('Consulta de Usuários').should('be.visible')

    // 1. Atualização do Cartão
    cy.log('**Atualizando cartão**')
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click()
    })
    
    cy.get('.atualizar_submenu').should('be.visible')
    cy.contains('.submenu-botao', 'Cartões').click()
    
    // Verifica página de cartões
    cy.url().should('include', '/cartao-adm')
    cy.contains('Cartões').should('be.visible')
    
    // Clica em atualizar no primeiro cartão
    cy.get('.cartoes-mostrado .atualizar').first().click()
    
    // Verifica página de atualização
    cy.url().should('include', '/cartao-atualizar-adm')
    cy.contains('Atualização de Cartão').should('be.visible')
    
    // Atualiza o número do cartão
    cy.get('#num_cartao').clear().type('5555555555554444') // Novo número (Mastercard teste)
    cy.intercept('POST', '/cartao-atualizar-adm*').as('atualizaCartao')
    cy.contains('button', 'Alterar').click()
    
    // Verifica e fecha alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Cartão foi atualizado com sucesso!')
    })
    
    // Volta para clientes
    cy.get('#Clientes').click()
    cy.url().should('include', '/consultarUsuario')

    // 2. Atualização Endereço de Cobrança
    cy.log('**Atualizando endereço de cobrança**')
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click()
    })
    
    cy.get('.atualizar_submenu').should('be.visible')
    cy.contains('.submenu-botao', 'Endereços de cobrança').click()
    
    // Verifica página de endereços
    cy.url().should('include', '/endCobranca-adm')
    cy.contains('Endereço de Cobranca').should('be.visible')
    
    // Clica em atualizar no primeiro endereço
    cy.get('.endereco-mostrado .atualizar').first().click()
    
    // Verifica página de atualização
    cy.url().should('include', '/endCobranca-atualizar-adm')
    cy.contains('Atualização de End. Cobranca').should('be.visible')
    
    // Atualiza o número do endereço
    cy.get('#numero').clear().type('456')
    cy.intercept('POST', '/endCobranca-atualizar-adm*').as('atualizaEndCobranca')
    cy.contains('button', 'Atualizar').click()
    
    // Verifica e fecha alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Endereço foi atualizado com sucesso!')
    })
    
    // Volta para clientes
    cy.get('#Clientes').click()
    cy.url().should('include', '/consultarUsuario')

    // 3. Atualização Endereço de Entrega
    cy.log('**Atualizando endereço de entrega**')
    cy.contains('tr', nomeUsuario).within(() => {
      cy.get('.atualizar').click()
    })
    
    cy.get('.atualizar_submenu').should('be.visible')
    cy.contains('.submenu-botao', 'Endereços de entrega').click()
    
    // Verifica página de endereços
    cy.url().should('include', '/endEntrega-adm')
    cy.contains('Endereço de Entrega').should('be.visible')
    
    // Clica em atualizar no primeiro endereço
    cy.get('.endereco-mostrado .atualizar').first().click()
    
    // Verifica página de atualização
    cy.url().should('include', '/endEntrega-atualizar-adm')
    cy.contains('Atualização de End. Entrega').should('be.visible')
    
    // Atualiza o número do endereço
    cy.get('#numero').clear().type('789')
    cy.intercept('POST', '/endEntrega-atualizar-adm*').as('atualizaEndEntrega')
    cy.contains('button', 'Atualizar').click()
    
    // Verifica e fecha alerta
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Endereço foi atualizado com sucesso!')
    })
    
    // Volta para clientes
    cy.get('#Clientes').click()
    cy.url().should('include', '/consultarUsuario')
  })
})