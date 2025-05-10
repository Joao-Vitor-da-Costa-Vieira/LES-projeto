DROP DATABASE IF EXISTS projetoles;

CREATE DATABASE projetoles;

USE projetoles;

CREATE TABLE administradores (
    adm_id                  INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE autor (
    atr_id   INTEGER NOT NULL PRIMARY KEY,
    atr_nome VARCHAR(75) NOT NULL
);

CREATE TABLE grupo_de_precificacao (
    grp_id           INTEGER NOT NULL PRIMARY KEY,
    grp_nome         VARCHAR(50) NOT NULL,
    grp_margem_lucro DECIMAL(4, 2) NOT NULL
);

CREATE TABLE livros (
    lvr_id                       INTEGER NOT NULL PRIMARY KEY,
    lvr_ano                      INTEGER NOT NULL,
    lvr_titulo                   VARCHAR(150) NOT NULL,
    lvr_edicao                   VARCHAR(30) NOT NULL,
    lvr_isbn                     BIGINT NOT NULL,  -- Alterado para BIGINT
    lvr_numero_de_paginas        INTEGER NOT NULL,
    lvr_sinopse                  VARCHAR(500) NOT NULL,
    lvr_altura                   DECIMAL(5, 2) NOT NULL,
    lvr_largura                  DECIMAL(5, 2) NOT NULL,
    lvr_peso                     INTEGER NOT NULL,
    lvr_profundidade             DECIMAL(5, 2) NOT NULL,
    lvr_codigo_de_barras         BIGINT NOT NULL,  -- Alterado para BIGINT
    lvr_ponteiro_imagem          VARCHAR(50) NOT NULL,
    lvr_status                   INTEGER NOT NULL,
    lvr_qtd_estoque              INTEGER NOT NULL,
    lvr_custo                    DECIMAL(6, 2) NOT NULL,  -- Aumentado para 6,2
    lvr_desconto                 INTEGER,
    lvr_justificativa            VARCHAR(200),
    grupo_de_precificacao_grp_id INTEGER,
    CONSTRAINT fk_lvr_gpr FOREIGN KEY (grupo_de_precificacao_grp_id)
        REFERENCES grupo_de_precificacao(grp_id)
);

CREATE TABLE editora (
    edi_id   INTEGER NOT NULL PRIMARY KEY,
    edi_nome VARCHAR(50) NOT NULL
);

CREATE TABLE editou (
    editora_edi_id INTEGER NOT NULL,
    livros_lvr_id  INTEGER NOT NULL,
    PRIMARY KEY (editora_edi_id, livros_lvr_id),
    CONSTRAINT relation_14_editora_fk FOREIGN KEY (editora_edi_id)
        REFERENCES editora(edi_id),
    CONSTRAINT relation_14_livros_fk FOREIGN KEY (livros_lvr_id)
        REFERENCES livros(lvr_id)
);

CREATE TABLE escreveu (
    autor_atr_id  INTEGER NOT NULL,
    livros_lvr_id INTEGER NOT NULL,
    PRIMARY KEY (autor_atr_id, livros_lvr_id),
    CONSTRAINT relation_15_autor_fk FOREIGN KEY (autor_atr_id)
        REFERENCES autor(atr_id),
    CONSTRAINT relation_15_livros_fk FOREIGN KEY (livros_lvr_id)
        REFERENCES livros(lvr_id)
);

CREATE TABLE categoria (
    cat_id   INTEGER NOT NULL PRIMARY KEY,
    cat_nome VARCHAR(25) NOT NULL
);

CREATE TABLE possui4 (
    categoria_cat_id INTEGER NOT NULL,
    livros_lvr_id    INTEGER NOT NULL,
    PRIMARY KEY (categoria_cat_id, livros_lvr_id),
    CONSTRAINT relation_16_categoria_fk FOREIGN KEY (categoria_cat_id)
        REFERENCES categoria(cat_id),
    CONSTRAINT relation_16_livros_fk FOREIGN KEY (livros_lvr_id)
        REFERENCES livros(lvr_id)
);

CREATE TABLE usuarios (
    usr_id                  INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE carrinho (
    car_id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    car_qtd_item    INTEGER NOT NULL,
    usuarios_usr_id INTEGER,
    livros_lvr_id   INTEGER,
    CONSTRAINT fk_car_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id),
    CONSTRAINT fk_car_lvr FOREIGN KEY (livros_lvr_id)
        REFERENCES livros(lvr_id)
);

CREATE TABLE cartoes (
    crt_id               INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    crt_numero           VARCHAR(19) NOT NULL,  -- Alterado para VARCHAR (16 dígitos + espaços)
    crt_bandeira         VARCHAR(20) NOT NULL,
    crt_codigo_seguranca VARCHAR(6) NOT NULL,   -- Alterado para VARCHAR (normalmente 3-4 dígitos)
    crt_nome             VARCHAR(50) NOT NULL,
    usuarios_usr_id      INTEGER NOT NULL,
    CONSTRAINT fk_crt_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id)
);

CREATE TABLE cupom (
    cup_id         INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cup_nome       VARCHAR(50) NOT NULL,
    cup_valor      DECIMAL(6,2) NOT NULL,
    cup_data       DATE NOT NULL,
    cup_status     INTEGER NOT NULL DEFAULT 1,
    usuarios_usr_id INTEGER NOT NULL,
    CONSTRAINT fk_cup_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id)
);

CREATE TABLE enderecos_cobranca (
    end_id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    end_estado      VARCHAR(2) NOT NULL,
    end_cidade      VARCHAR(50) NOT NULL,
    end_bairro      VARCHAR(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_endereco    VARCHAR(100) NOT NULL,
    end_complemento VARCHAR(20),
    end_cep         INTEGER NOT NULL,
    usuarios_usr_id INTEGER NOT NULL,
    CONSTRAINT fk_endc_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id)
);

CREATE TABLE enderecos_entrega (
    end_id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    end_estado      VARCHAR(2) NOT NULL,
    end_cidade      VARCHAR(50) NOT NULL,
    end_bairro      VARCHAR(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_endereco    VARCHAR(100) NOT NULL,
    end_complemento VARCHAR(20),
    end_cep         INTEGER NOT NULL,
    usuarios_usr_id INTEGER NOT NULL,
    CONSTRAINT fk_ende_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id)
);

CREATE TABLE transacoes (
    tra_id                   INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tra_data                 DATETIME NOT NULL,
    tra_valor_frete          DECIMAL(5, 2) NOT NULL,
    tra_status               VARCHAR(25) NOT NULL,
    tra_valor                DECIMAL(6, 2) NOT NULL,
    tra_desconto             DECIMAL(6, 2),
    tra_subtotal             DECIMAL(6, 2) NOT NULL,
    tra_id_original          INTEGER,
    enderecos_entrega_end_id INTEGER,
    usuarios_usr_id          INTEGER,
    CONSTRAINT fk_tra_ende FOREIGN KEY (enderecos_entrega_end_id)
        REFERENCES enderecos_entrega(end_id),
    CONSTRAINT fk_tra_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id)
);

CREATE TABLE itens_de_venda (
    itv_id            INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    itv_qtd_item      INTEGER NOT NULL,
    transacoes_tra_id INTEGER NOT NULL,
    livros_lvr_id     INTEGER,
    CONSTRAINT fk_itv_tra FOREIGN KEY (transacoes_tra_id)
        REFERENCES transacoes(tra_id),
    CONSTRAINT fk_itv_lvr FOREIGN KEY (livros_lvr_id)
        REFERENCES livros(lvr_id)
);

CREATE TABLE forma_de_pagamento (
    fpg_id             INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fpg_tipo           VARCHAR(20) NOT NULL,
    fpg_valor          DECIMAL(6, 2) NOT NULL,
    transacoes_tra_id  INTEGER NOT NULL,
    cartoes_crt_id     INTEGER,
    cupom_cup_id       INTEGER,
    CONSTRAINT fk_fpg_tra FOREIGN KEY (transacoes_tra_id)
        REFERENCES transacoes(tra_id),
    CONSTRAINT fk_fpg_crt FOREIGN KEY (cartoes_crt_id)
        REFERENCES cartoes(crt_id),
    CONSTRAINT fk_fpg_cup FOREIGN KEY (cupom_cup_id)
        REFERENCES cupom(cup_id)
);

CREATE TABLE notificacao (
    ntf_id          INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ntf_mensagem    VARCHAR(250) NOT NULL,
    usuarios_usr_id INTEGER NOT NULL,
	transacoes_tra_id INTEGER NOT NULL,
    CONSTRAINT fk_ntf_usr FOREIGN KEY (usuarios_usr_id)
        REFERENCES usuarios(usr_id),
	CONSTRAINT fk_ntf_tra FOREIGN KEY ( transacoes_tra_id )
    REFERENCES transacoes ( tra_id );
);