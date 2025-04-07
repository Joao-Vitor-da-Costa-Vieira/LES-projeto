CREATE TABLE autor (
    atr_id   INTEGER NOT NULL,
    atr_nome VARCHAR2(75) NOT NULL
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
    crt_id               INTEGER NOT NULL,
    crt_numero           INTEGER NOT NULL,
    crt_bandeira         VARCHAR2(20) NOT NULL,
    crt_codigo_seguranca INTEGER NOT NULL,
    crt_nome             VARCHAR2(50) NOT NULL,
    usuário_usr_id       INTEGER NOT NULL
);

COMMENT ON COLUMN cartoes.crt_id IS
    'Código de Identificação do Cartão';

COMMENT ON COLUMN cartoes.crt_numero IS
    'Numero do Cartão';

COMMENT ON COLUMN cartoes.crt_bandeira IS
    'Bandeira do Cartão';

COMMENT ON COLUMN cartoes.crt_codigo_seguranca IS
    'Código de Segurança do Cartão';

COMMENT ON COLUMN cartoes.crt_nome IS
    'Nome do Titular do Cartão';

ALTER TABLE cartoes ADD CONSTRAINT cartao_pk PRIMARY KEY ( crt_id );

CREATE TABLE categoria (
    cat_id   INTEGER NOT NULL,
    cat_nome VARCHAR2(25) NOT NULL
);

ALTER TABLE categoria ADD CONSTRAINT categoria_pk PRIMARY KEY ( cat_id );

CREATE TABLE editora (
    edi_id   INTEGER NOT NULL,
    edi_nome VARCHAR2(50) NOT NULL
);

ALTER TABLE editora ADD CONSTRAINT editora_pk PRIMARY KEY ( edi_id );

CREATE TABLE editou (
    editora_edi_id INTEGER NOT NULL,
    livros_lvr_id  INTEGER NOT NULL
);

ALTER TABLE editou ADD CONSTRAINT relation_14_pk PRIMARY KEY ( editora_edi_id,
                                                               livros_lvr_id );

CREATE TABLE enderecos_cobranca (
    end_id          INTEGER NOT NULL,
    end_estado      VARCHAR2(2) NOT NULL,
    end_cidade      VARCHAR2(50) NOT NULL,
    end_bairro      VARCHAR2(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_complemento VARCHAR2(20),
    end_cep         INTEGER NOT NULL,
    usuário_usr_id  INTEGER NOT NULL
);

COMMENT ON COLUMN enderecos_cobranca.end_id IS
    'Código de Identificação do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_estado IS
    'Estado do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_cidade IS
    'Cidade do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_bairro IS
    'Bairro do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_numero IS
    'Numero do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_complemento IS
    'Complemento do Endereço de Cobrança';

COMMENT ON COLUMN enderecos_cobranca.end_cep IS
    'CEP do  Endereço de Cobrança';

ALTER TABLE enderecos_cobranca ADD CONSTRAINT endereço_cobrança_pk PRIMARY KEY ( end_id );

CREATE TABLE enderecos_entrega (
    end_id          INTEGER NOT NULL,
    end_estado      VARCHAR2(2) NOT NULL,
    end_cidade      VARCHAR2(50) NOT NULL,
    end_bairro      VARCHAR2(25) NOT NULL,
    end_numero      INTEGER NOT NULL,
    end_complemento VARCHAR2(20),
    end_cep         INTEGER NOT NULL,
    usuário_usr_id  INTEGER NOT NULL
);

COMMENT ON COLUMN enderecos_entrega.end_id IS
    'Código de Identificação do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_estado IS
    'Estado do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_cidade IS
    'Cidade do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_bairro IS
    'Bairro do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_numero IS
    'Numero do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_complemento IS
    'Complemento do Endereço de Entrega';

COMMENT ON COLUMN enderecos_entrega.end_cep IS
    'CEP do  Endereço de Entrega';

ALTER TABLE enderecos_entrega ADD CONSTRAINT endereço_entrega_pk PRIMARY KEY ( end_id );

CREATE TABLE escreveu (
    autor_atr_id  INTEGER NOT NULL,
    livros_lvr_id INTEGER NOT NULL
);

ALTER TABLE escreveu ADD CONSTRAINT relation_15_pk PRIMARY KEY ( autor_atr_id,
                                                                 livros_lvr_id );

CREATE TABLE grupo_de_precificacao (
    grp_id           INTEGER NOT NULL,
    grp_nome         VARCHAR2(50) NOT NULL,
    grp_margem_lucro NUMBER(4, 2) NOT NULL
);

ALTER TABLE grupo_de_precificacao ADD CONSTRAINT grupo_de_precificacao_pk PRIMARY KEY ( grp_id );

CREATE TABLE itens_de_venda (
    itv_id            INTEGER NOT NULL,
    itv_qtd_item      INTEGER NOT NULL,
    transacoes_tra_id INTEGER NOT NULL,
    livros_lvr_id     INTEGER
);

ALTER TABLE itens_de_venda ADD CONSTRAINT itens_de_venda_pk PRIMARY KEY ( itv_id );

CREATE TABLE livros (
    lvr_id                       INTEGER NOT NULL,
    lvr_ano                      INTEGER NOT NULL,
    lvr_titulo                   VARCHAR2(150) NOT NULL,
    lvr_edicao                   VARCHAR2(30) NOT NULL,
    lvr_isbn                     INTEGER NOT NULL,
    lvr_numero_de_paginas        INTEGER NOT NULL,
    lvr_sinopse                  VARCHAR2(500) NOT NULL,
    lvr_altura                   NUMBER(5, 2) NOT NULL,
    lvr_largura                  NUMBER(5, 2) NOT NULL,
    lvr_peso                     INTEGER NOT NULL,
    lvr_profundidade             NUMBER(5, 2) NOT NULL,
    lvr_codigo_de_barras         INTEGER NOT NULL,
    lvr_ponteiro_imagem          VARCHAR2(50) NOT NULL,
    lvr_status                   INTEGER NOT NULL,
    lvr_qtd_estoque              INTEGER NOT NULL,
    lvr_custo                    NUMBER(4, 2) NOT NULL,
    lvr_desconto                 INTEGER,
    lvr_justificativa            VARCHAR2(200),
    grupo_de_precificacao_grp_id INTEGER
);

ALTER TABLE livros ADD CONSTRAINT livros_pk PRIMARY KEY ( lvr_id );

CREATE TABLE possui4 (
    categoria_cat_id INTEGER NOT NULL,
    livros_lvr_id    INTEGER NOT NULL
);

ALTER TABLE possui4 ADD CONSTRAINT relation_16_pk PRIMARY KEY ( categoria_cat_id, livros_lvr_id );

CREATE TABLE transacoes (
    tra_id                   INTEGER NOT NULL,
    tra_numero_venda         INTEGER NOT NULL,
    tra_data                 DATE NOT NULL,
    tra_valor_frete          NUMBER(5, 2) NOT NULL,
    tra_forma_de_pagamento   VARCHAR2(20) NOT NULL,
    tra_status               VARCHAR2(15) NOT NULL,
    tra_valor                NUMBER(6, 2) NOT NULL,
    tra_desconto             NUMBER(6, 2),
    tra_subtotal             NUMBER(6, 2) NOT NULL,
    enderecos_entrega_end_id INTEGER,
    usuarios_usr_id          INTEGER
);

ALTER TABLE transacoes ADD CONSTRAINT transacoes_pk PRIMARY KEY ( tra_id );

CREATE TABLE usuarios (
    usr_id                  INTEGER NOT NULL AUTO_INCREMENT,
    usr_nome                VARCHAR2(75) NOT NULL,
    usr_email               VARCHAR2(50) NOT NULL,
    usr_cpf                 VARCHAR2(11) NOT NULL,
    usr_senha               VARCHAR2(20) NOT NULL,
    usr_data_de_nascimento  DATE NOT NULL,
    usr_telefone_1          INTEGER NOT NULL,
    usr_telefone_2          INTEGER,
    usr_genero              VARCHAR2(10) NOT NULL,
    usr_status_de_atividade CHAR(1) NOT NULL
);

COMMENT ON COLUMN usuarios.usr_id IS
    'Código de Identificação do Usúario';

COMMENT ON COLUMN usuarios.usr_nome IS
    'Nome do Usúario';

COMMENT ON COLUMN usuarios.usr_email IS
    'E-mail do Usúrario';

COMMENT ON COLUMN usuarios.usr_cpf IS
    'CPF do Usúario';

COMMENT ON COLUMN usuarios.usr_senha IS
    'Senha do Usúario';

COMMENT ON COLUMN usuarios.usr_data_de_nascimento IS
    'Data de Nascimento do Usúario';

COMMENT ON COLUMN usuarios.usr_telefone_1 IS
    'Telefone do Usúario';

COMMENT ON COLUMN usuarios.usr_telefone_2 IS
    'Telefone Alternativo do Usúario';

COMMENT ON COLUMN usuarios.usr_genero IS
    'Genero do Usúario';

COMMENT ON COLUMN usuarios.usr_status_de_atividade IS
    'Status de Atividade do Usúario';

ALTER TABLE usuarios ADD CONSTRAINT usuário_pk PRIMARY KEY ( usr_id );

ALTER TABLE carrinho
    ADD CONSTRAINT fk_car_lvr FOREIGN KEY ( livros_lvr_id )
        REFERENCES livros ( lvr_id );

ALTER TABLE carrinho
    ADD CONSTRAINT fk_car_usr FOREIGN KEY ( usuarios_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE cartoes
    ADD CONSTRAINT fk_crt_usr FOREIGN KEY ( usuário_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE enderecos_cobranca
    ADD CONSTRAINT fk_endc_usr FOREIGN KEY ( usuário_usr_id )
        REFERENCES usuarios ( usr_id );

ALTER TABLE enderecos_entrega
    ADD CONSTRAINT fk_ende_usr FOREIGN KEY ( usuário_usr_id )
        REFERENCES usuarios ( usr_id );

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