use projetoles;

CREATE TABLE administradores (
    adm_id                  INTEGER NOT NULL auto_increment,
    adm_nome                VARCHAR(75) NOT NULL,
    adm_email               VARCHAR(50) NOT NULL,
    adm_cpf                 VARCHAR(11) NOT NULL,
    adm_senha               VARCHAR(20) NOT NULL,
    adm_data_de_nascimento  DATE NOT NULL,
    adm_telefone_1          INTEGER NOT NULL,
    adm_telefone_2          INTEGER,
    adm_genero              VARCHAR(10) NOT NULL,
    adm_status_de_atividade CHAR(1) NOT NULL
);

ALTER TABLE administradores ADD CONSTRAINT administradores_pk PRIMARY KEY ( adm_id );

CREATE TABLE autor (
    atr_id   INTEGER NOT NULL,
    atr_nome VARCHAR(75) NOT NULL
);

ALTER TABLE autor ADD CONSTRAINT autor_pk PRIMARY KEY ( atr_id );

CREATE TABLE carrinho (
    car_id          INTEGER NOT NULL AUTO_INCREMENT,
    car_qtd_item    INTEGER NOT NULL,
    usuarios_usr_id INTEGER,
    livros_lvr_id   INTEGER
);

ALTER TABLE carrinho ADD CONSTRAINT carrinho_pk PRIMARY KEY ( car_id );

CREATE TABLE cartoes (
    crt_id               INTEGER NOT NULL AUTO_INCREMENT,
    crt_numero           BIGINT NOT NULL,
    crt_bandeira         VARCHAR(20) NOT NULL,
    crt_codigo_seguranca INTEGER NOT NULL,
    crt_nome             VARCHAR(50) NOT NULL,
    usuarios_usr_id       INTEGER NOT NULL
);

ALTER TABLE cartoes ADD CONSTRAINT cartao_pk PRIMARY KEY ( crt_id );

CREATE TABLE categoria (
    cat_id   INTEGER NOT NULL,
    cat_nome VARCHAR(25) NOT NULL
);

ALTER TABLE categoria ADD CONSTRAINT categoria_pk PRIMARY KEY ( cat_id );

CREATE TABLE cupom (
    cup_id   INTEGER NOT NULL AUTO_INCREMENT,
    cup_nome VARCHAR(50) NOT NULL,
    cup_valor DECIMAL(6,2) NOT NULL,
    cup_data DATE NOT NULL,
    cup_status INTEGER NOT NULL DEFAULT 1,
    usuarios_usr_id INTEGER NOT NULL
);

ALTER TABLE cupom ADD CONSTRAINT cupom_pk PRIMARY KEY ( cup_id );

CREATE TABLE editora (
    edi_id   INTEGER NOT NULL,
    edi_nome VARCHAR(50) NOT NULL
);

ALTER TABLE editora ADD CONSTRAINT editora_pk PRIMARY KEY ( edi_id );

CREATE TABLE editou (
    editora_edi_id INTEGER NOT NULL,
    livros_lvr_id  INTEGER NOT NULL
);

ALTER TABLE editou ADD CONSTRAINT relation_14_pk PRIMARY KEY ( editora_edi_id,
                                                               livros_lvr_id );

CREATE TABLE enderecos_cobranca (
    end_id          INTEGER NOT NULL AUTO_INCREMENT,
    end_estado      VARCHAR(2) NOT NULL,
    end_cidade      VARCHAR(50) NOT NULL,
    end_bairro      VARCHAR(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_endereco    VARCHAR(100) NOT NULL,
    end_complemento VARCHAR(20),
    end_cep         INTEGER NOT NULL,
    usuarios_usr_id  INTEGER NOT NULL
);

ALTER TABLE enderecos_cobranca ADD CONSTRAINT endereço_cobrança_pk PRIMARY KEY ( end_id );

CREATE TABLE enderecos_entrega (
    end_id          INTEGER NOT NULL AUTO_INCREMENT,
    end_estado      VARCHAR(2) NOT NULL,
    end_cidade      VARCHAR(50) NOT NULL,
    end_bairro      VARCHAR(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_endereco    VARCHAR(100) NOT NULL,
    end_complemento VARCHAR(20),
    end_cep         INTEGER NOT NULL,
    usuarios_usr_id  INTEGER NOT NULL
);

ALTER TABLE enderecos_entrega ADD CONSTRAINT endereço_entrega_pk PRIMARY KEY ( end_id );

CREATE TABLE escreveu (
    autor_atr_id  INTEGER NOT NULL,
    livros_lvr_id INTEGER NOT NULL
);

ALTER TABLE escreveu ADD CONSTRAINT relation_15_pk PRIMARY KEY ( autor_atr_id,
                                                                 livros_lvr_id );

CREATE TABLE estoque (
    est_id                  INTEGER NOT NULL AUTO_INCREMENT,
    est_quantidade          INTEGER NOT NULL,
    est_custo               DECIMAL(6, 2) NOT NULL,
    est_fornecedor          VARCHAR(100) NOT NULL,
    est_data                DATE NOT NULL,
    livros_lvr_id           INTEGER NOT NULL,
);

ALTER TABLE estoque ADD CONSTRAINT estoque_pk PRIMARY KEY ( est_id );

CREATE TABLE forma_de_pagamento (
    fpg_id             INTEGER NOT NULL AUTO_INCREMENT,
    fpg_tipo           VARCHAR(20) NOT NULL,
    fpg_valor          DECIMAL(6, 2) NOT NULL,
    transacoes_tra_id  INTEGER NOT NULL,
    cartoes_crt_id     INTEGER,
    cupom_cup_id     INTEGER
    );

ALTER TABLE forma_de_pagamento ADD CONSTRAINT forma_de_pagamento_pk PRIMARY KEY ( fpg_id );

CREATE TABLE grupo_de_precificacao (
    grp_id           INTEGER NOT NULL,
    grp_nome         VARCHAR(50) NOT NULL,
    grp_margem_lucro DECIMAL(4, 2) NOT NULL
);

ALTER TABLE grupo_de_precificacao ADD CONSTRAINT grupo_de_precificacao_pk PRIMARY KEY ( grp_id );

CREATE TABLE itens_de_venda (
    itv_id            INTEGER NOT NULL AUTO_INCREMENT,
    itv_qtd_item      INTEGER NOT NULL,
    itv_valor         DECIMAL(6, 2) NOT NULL,
    transacoes_tra_id INTEGER NOT NULL,
    livros_lvr_id     INTEGER
);

ALTER TABLE itens_de_venda ADD CONSTRAINT itens_de_venda_pk PRIMARY KEY ( itv_id );

CREATE TABLE livros (
    lvr_id                       INTEGER NOT NULL,
    lvr_ano                      INTEGER NOT NULL,
    lvr_titulo                   VARCHAR(150) NOT NULL,
    lvr_edicao                   VARCHAR(30) NOT NULL,
    lvr_isbn                     INTEGER NOT NULL,
    lvr_numero_de_paginas        INTEGER NOT NULL,
    lvr_sinopse                  VARCHAR(500) NOT NULL,
    lvr_altura                   DECIMAL(5, 2) NOT NULL,
    lvr_largura                  DECIMAL(5, 2) NOT NULL,
    lvr_peso                     INTEGER NOT NULL,
    lvr_profundidade             DECIMAL(5, 2) NOT NULL,
    lvr_codigo_de_barras         INTEGER NOT NULL,
    lvr_ponteiro_imagem          VARCHAR(50) NOT NULL,
    lvr_status                   INTEGER NOT NULL,
    lvr_qtd_estoque              INTEGER NOT NULL,
    lvr_custo                    DECIMAL(4, 2) NOT NULL,
    lvr_desconto                 INTEGER,
    lvr_justificativa            VARCHAR(200),
    grupo_de_precificacao_grp_id INTEGER
);

ALTER TABLE livros ADD CONSTRAINT livros_pk PRIMARY KEY ( lvr_id );

CREATE TABLE notificacao (
    ntf_id INTEGER NOT NULL AUTO_INCREMENT,
    ntf_mensagem VARCHAR(250) NOT NULL,
    usuarios_usr_id INTEGER NOT NULL,
    transacoes_tra_id INTEGER NOT NULL
);

ALTER TABLE notificacao ADD CONSTRAINT notificacao_pk PRIMARY KEY ( ntf_id );

CREATE TABLE possui4 (
    categoria_cat_id INTEGER NOT NULL,
    livros_lvr_id    INTEGER NOT NULL
);

ALTER TABLE possui4 ADD CONSTRAINT relation_16_pk PRIMARY KEY ( categoria_cat_id, livros_lvr_id );

CREATE TABLE transacoes (
    tra_id                   INTEGER NOT NULL AUTO_INCREMENT,
    tra_data                 DATETIME NOT NULL,
    tra_valor_frete          DECIMAL(5, 2) NOT NULL,
    tra_status               VARCHAR(25) NOT NULL,
    tra_valor                DECIMAL(6, 2) NOT NULL,
    tra_desconto             DECIMAL(6, 2),
    tra_subtotal             DECIMAL(6, 2) NOT NULL,
    tra_id_original          INTEGER,
    enderecos_entrega_end_id INTEGER,
    usuarios_usr_id          INTEGER
);

ALTER TABLE transacoes ADD CONSTRAINT transacoes_pk PRIMARY KEY ( tra_id );

CREATE TABLE usuarios (
    usr_id                  INTEGER NOT NULL AUTO_INCREMENT,
    usr_nome                VARCHAR(75) NOT NULL,
    usr_email               VARCHAR(50) NOT NULL,
    usr_cpf                 VARCHAR(11) NOT NULL,
    usr_senha               VARCHAR(20) NOT NULL,
    usr_data_de_nascimento  DATE NOT NULL,
    usr_telefone_1          INTEGER NOT NULL,
    usr_telefone_2          INTEGER,
    usr_genero              VARCHAR(10) NOT NULL,
    usr_ranking             INTEGER,
    usr_status_de_atividade CHAR(1) NOT NULL
);

ALTER TABLE usuarios ADD CONSTRAINT usuário_pk PRIMARY KEY ( usr_id );

ALTER TABLE carrinho
    ADD CONSTRAINT fk_car_lvr FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE carrinho
    ADD CONSTRAINT fk_car_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE cartoes
    ADD CONSTRAINT fk_crt_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

	ALTER TABLE cupom
    ADD CONSTRAINT fk_cup_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE enderecos_cobranca
    ADD CONSTRAINT fk_endc_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE enderecos_entrega
    ADD CONSTRAINT fk_ende_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE estoque
    ADD CONSTRAINT fk_est_lvr FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE itens_de_venda
    ADD CONSTRAINT fk_itv_lvr FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE itens_de_venda
    ADD CONSTRAINT fk_itv_tra FOREIGN KEY ( transacoes_tra_id )
        REFERENCES transacoes ( tra_id );

ALTER TABLE livros
    ADD CONSTRAINT fk_lvr_gpr FOREIGN KEY ( grupo_de_precificacao_grp_id )
        REFERENCES grupo_de_precificacao ( grp_id );

ALTER TABLE transacoes
    ADD CONSTRAINT fk_tra_ende FOREIGN KEY ( enderecos_entrega_end_id )
        REFERENCES enderecos_entrega ( end_id );

ALTER TABLE transacoes
    ADD CONSTRAINT fk_tra_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE editou
    ADD CONSTRAINT relation_14_editora_fk FOREIGN KEY ( editora_edi_id )
        REFERENCES editora ( edi_id );

ALTER TABLE editou
    ADD CONSTRAINT relation_14_livros_fk FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE escreveu
    ADD CONSTRAINT relation_15_autor_fk FOREIGN KEY ( autor_atr_id )
        REFERENCES autor ( atr_id );

ALTER TABLE escreveu
    ADD CONSTRAINT relation_15_livros_fk FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE possui4
    ADD CONSTRAINT relation_16_categoria_fk FOREIGN KEY ( categoria_cat_id )
        REFERENCES categoria ( cat_id );

ALTER TABLE possui4
    ADD CONSTRAINT relation_16_livros_fk FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );
        
ALTER TABLE notificacao
    ADD CONSTRAINT fk_ntf_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

    ALTER TABLE notificacao
ADD CONSTRAINT fk_ntf_tra FOREIGN KEY ( transacoes_tra_id )
    REFERENCES transacoes ( tra_id );
        
ALTER TABLE forma_de_pagamento
    ADD CONSTRAINT fk_fpg_crt FOREIGN KEY ( cartoes_crt_id )
        REFERENCES cartoes ( crt_id );

ALTER TABLE forma_de_pagamento
    ADD CONSTRAINT fk_fpg_tra FOREIGN KEY ( transacoes_tra_id )
        REFERENCES transacoes ( tra_id );

ALTER TABLE forma_de_pforma_de_pagamento
    ADD CONSTRAINT fk_fpg_cup FOREIGN KEY ( cupom_cup_id )
        REFERENCES cupom ( cup_id );