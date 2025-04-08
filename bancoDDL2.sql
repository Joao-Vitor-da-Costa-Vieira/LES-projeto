DROP DATABASE IF EXISTS BRAVO;
CREATE DATABASE BRAVO;
USE BRAVO;

CREATE TABLE autor (
    atr_id   INTEGER NOT NULL,
    atr_nome VARCHAR(75) NOT NULL,
    PRIMARY KEY (atr_id)
);

CREATE TABLE usuarios (
    usr_id                  INTEGER NOT NULL AUTO_INCREMENT,
    usr_nome                VARCHAR(75) NOT NULL COMMENT 'Nome do Usuário',
    usr_email               VARCHAR(50) NOT NULL COMMENT 'E-mail do Usuário',
    usr_cpf                 VARCHAR(11) NOT NULL COMMENT 'CPF do Usuário',
    usr_senha               VARCHAR(20) NOT NULL COMMENT 'Senha do Usuário',
    usr_data_de_nascimento  DATE NOT NULL COMMENT 'Data de Nascimento do Usuário',
    usr_telefone_1          INTEGER NOT NULL COMMENT 'Telefone do Usuário',
    usr_telefone_2          INTEGER COMMENT 'Telefone Alternativo do Usuário',
    usr_genero              VARCHAR(10) NOT NULL COMMENT 'Gênero do Usuário',
    usr_status_de_atividade CHAR(1) NOT NULL COMMENT 'Status de Atividade do Usuário',
    PRIMARY KEY (usr_id)
);

CREATE TABLE carrinho (
    car_id          INTEGER NOT NULL AUTO_INCREMENT,
    car_qtd_item    INTEGER NOT NULL,
    usuarios_usr_id INTEGER,
    livros_lvr_id   INTEGER,
    PRIMARY KEY (car_id)
);

CREATE TABLE cartoes (
    crt_id               INTEGER NOT NULL AUTO_INCREMENT COMMENT 'Código de Identificação do Cartão',
    crt_numero           VARCHAR(50) NOT NULL COMMENT 'Número do Cartão',
    crt_bandeira         VARCHAR(20) NOT NULL COMMENT 'Bandeira do Cartão',
    crt_codigo_seguranca INTEGER NOT NULL COMMENT 'Código de Segurança do Cartão',
    crt_nome             VARCHAR(50) NOT NULL COMMENT 'Nome do Titular do Cartão',
    usuarios_usr_id      INTEGER NOT NULL,
    PRIMARY KEY (crt_id)
);

CREATE TABLE categoria (
    cat_id   INTEGER NOT NULL,
    cat_nome VARCHAR(25) NOT NULL,
    PRIMARY KEY (cat_id)
);

CREATE TABLE editora (
    edi_id   INTEGER NOT NULL,
    edi_nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (edi_id)
);

CREATE TABLE grupo_de_precificacao (
    grp_id           INTEGER NOT NULL,
    grp_nome         VARCHAR(50) NOT NULL,
    grp_margem_lucro DECIMAL(4, 2) NOT NULL,
    PRIMARY KEY (grp_id)
);

CREATE TABLE livros (
    lvr_id                       INTEGER NOT NULL,
    lvr_ano                      INTEGER NOT NULL,
    lvr_titulo                   VARCHAR(150) NOT NULL,
    lvr_edicao                   VARCHAR(30) NOT NULL,
    lvr_isbn                     BIGINT NOT NULL,
    lvr_numero_de_paginas        INTEGER NOT NULL,
    lvr_sinopse                  VARCHAR(500) NOT NULL,
    lvr_altura                   DECIMAL(5, 2) NOT NULL,
    lvr_largura                  DECIMAL(5, 2) NOT NULL,
    lvr_peso                     INTEGER NOT NULL,
    lvr_profundidade             DECIMAL(5, 2) NOT NULL,
    lvr_codigo_de_barras         BIGINT NOT NULL,
    lvr_ponteiro_imagem          VARCHAR(50) NOT NULL,
    lvr_status                   INTEGER NOT NULL,
    lvr_qtd_estoque              INTEGER NOT NULL,
    lvr_custo                    DECIMAL(4, 2) NOT NULL,
    lvr_desconto                 INTEGER,
    lvr_justificativa            VARCHAR(200),
    grupo_de_precificacao_grp_id INTEGER,
    PRIMARY KEY (lvr_id)
);

CREATE TABLE escreveu (
    autor_atr_id  INTEGER NOT NULL,
    livros_lvr_id INTEGER NOT NULL,
    PRIMARY KEY (autor_atr_id, livros_lvr_id)
);

CREATE TABLE editou (
    editora_edi_id INTEGER NOT NULL,
    livros_lvr_id  INTEGER NOT NULL,
    PRIMARY KEY (editora_edi_id, livros_lvr_id)
);

CREATE TABLE possui4 (
    categoria_cat_id INTEGER NOT NULL,
    livros_lvr_id    INTEGER NOT NULL,
    PRIMARY KEY (categoria_cat_id, livros_lvr_id)
);

CREATE TABLE enderecos_cobranca (
    end_id          INTEGER NOT NULL AUTO_INCREMENT COMMENT 'Código de Identificação do Endereço de Cobrança',
    end_estado      VARCHAR(2) NOT NULL COMMENT 'Estado do Endereço de Cobrança',
    end_cidade      VARCHAR(50) NOT NULL COMMENT 'Cidade do Endereço de Cobrança',
    end_bairro      VARCHAR(25) NOT NULL COMMENT 'Bairro do Endereço de Cobrança',
    end_numero      INTEGER NOT NULL COMMENT 'Número do Endereço de Cobrança',
    end_endereco    VARCHAR(100) NOT NULL COMMENT 'Endereço de Cobrança',
    end_complemento VARCHAR(20) COMMENT 'Complemento do Endereço de Cobrança',
    end_cep         INTEGER NOT NULL COMMENT 'CEP do Endereço de Cobrança',
    usuarios_usr_id INTEGER NOT NULL,
    PRIMARY KEY (end_id)
);

CREATE TABLE enderecos_entrega (
    end_id          INTEGER NOT NULL AUTO_INCREMENT COMMENT 'Código de Identificação do Endereço de Entrega',
    end_estado      VARCHAR(2) NOT NULL COMMENT 'Estado do Endereço de Entrega',
    end_cidade      VARCHAR(50) NOT NULL COMMENT 'Cidade do Endereço de Entrega',
    end_bairro      VARCHAR(25) NOT NULL COMMENT 'Bairro do Endereço de Entrega',
    end_numero      INTEGER NOT NULL COMMENT 'Número do Endereço de Entrega',
    end_endereco    VARCHAR(100) NOT NULL COMMENT 'Endereço de Entrega',
    end_complemento VARCHAR(20) COMMENT 'Complemento do Endereço de Entrega',
    end_cep         INTEGER NOT NULL COMMENT 'CEP do Endereço de Entrega',
    usuarios_usr_id INTEGER NOT NULL,
    PRIMARY KEY (end_id)
);

CREATE TABLE transacoes (
    tra_id                   INTEGER NOT NULL AUTO_INCREMENT,
    tra_numero_venda         INTEGER NOT NULL,
    tra_data                 DATE NOT NULL,
    tra_valor_frete          DECIMAL(5, 2) NOT NULL,
    tra_forma_de_pagamento   VARCHAR(20) NOT NULL,
    tra_status               VARCHAR(15) NOT NULL,
    tra_valor                DECIMAL(6, 2) NOT NULL,
    tra_desconto             DECIMAL(6, 2),
    tra_subtotal             DECIMAL(6, 2) NOT NULL,
    enderecos_entrega_end_id INTEGER,
    usuarios_usr_id          INTEGER,
    PRIMARY KEY (tra_id)
);

CREATE TABLE itens_de_venda (
    itv_id            INTEGER NOT NULL,
    itv_qtd_item      INTEGER NOT NULL,
    transacoes_tra_id INTEGER NOT NULL,
    livros_lvr_id     INTEGER,
    PRIMARY KEY (itv_id)
);

-- CHAVES ESTRANGEIRAS
ALTER TABLE carrinho ADD CONSTRAINT fk_car_lvr FOREIGN KEY (livros_lvr_id) REFERENCES livros (lvr_id);
ALTER TABLE carrinho ADD CONSTRAINT fk_car_usr FOREIGN KEY (usuarios_usr_id) REFERENCES usuarios (usr_id);
ALTER TABLE cartoes ADD CONSTRAINT fk_crt_usr FOREIGN KEY (usuarios_usr_id) REFERENCES usuarios (usr_id);
ALTER TABLE enderecos_cobranca ADD CONSTRAINT fk_endc_usr FOREIGN KEY (usuarios_usr_id) REFERENCES usuarios (usr_id);
ALTER TABLE enderecos_entrega ADD CONSTRAINT fk_ende_usr FOREIGN KEY (usuarios_usr_id) REFERENCES usuarios (usr_id);
ALTER TABLE livros ADD CONSTRAINT fk_lvr_gpr FOREIGN KEY (grupo_de_precificacao_grp_id) REFERENCES grupo_de_precificacao (grp_id);
ALTER TABLE transacoes ADD CONSTRAINT fk_tra_ende FOREIGN KEY (enderecos_entrega_end_id) REFERENCES enderecos_entrega (end_id);
ALTER TABLE transacoes ADD CONSTRAINT fk_tra_usr FOREIGN KEY (usuarios_usr_id) REFERENCES usuarios (usr_id);
ALTER TABLE itens_de_venda ADD CONSTRAINT fk_itv_lvr FOREIGN KEY (livros_lvr_id) REFERENCES livros (lvr_id);
ALTER TABLE itens_de_venda ADD CONSTRAINT fk_itv_tra FOREIGN KEY (transacoes_tra_id) REFERENCES transacoes (tra_id);
ALTER TABLE escreveu ADD CONSTRAINT fk_escreveu_autor FOREIGN KEY (autor_atr_id) REFERENCES autor (atr_id);
ALTER TABLE escreveu ADD CONSTRAINT fk_escreveu_livros FOREIGN KEY (livros_lvr_id) REFERENCES livros (lvr_id);
ALTER TABLE editou ADD CONSTRAINT fk_editou_editora FOREIGN KEY (editora_edi_id) REFERENCES editora (edi_id);
ALTER TABLE editou ADD CONSTRAINT fk_editou_livros FOREIGN KEY (livros_lvr_id) REFERENCES livros (lvr_id);
ALTER TABLE possui4 ADD CONSTRAINT fk_possui_categoria FOREIGN KEY (categoria_cat_id) REFERENCES categoria (cat_id);
ALTER TABLE possui4 ADD CONSTRAINT fk_possui_livros FOREIGN KEY (livros_lvr_id) REFERENCES livros (lvr_id);
