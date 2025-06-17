-- Categorias
INSERT INTO categoria (cat_id, cat_nome) VALUES (1, 'Ficção Científica');
INSERT INTO categoria (cat_id, cat_nome) VALUES (2, 'Fantasia');
INSERT INTO categoria (cat_id, cat_nome) VALUES (3, 'Romance');
INSERT INTO categoria (cat_id, cat_nome) VALUES (4, 'Mistério');
INSERT INTO categoria (cat_id, cat_nome) VALUES (5, 'Suspense');
INSERT INTO categoria (cat_id, cat_nome) VALUES (6, 'Terror');
INSERT INTO categoria (cat_id, cat_nome) VALUES (7, 'Biografia');
INSERT INTO categoria (cat_id, cat_nome) VALUES (8, 'História');
INSERT INTO categoria (cat_id, cat_nome) VALUES (9, 'Autoajuda');
INSERT INTO categoria (cat_id, cat_nome) VALUES (10, 'Negócios');
INSERT INTO categoria (cat_id, cat_nome) VALUES (11, 'Ciência');
INSERT INTO categoria (cat_id, cat_nome) VALUES (12, 'Tecnologia');
INSERT INTO categoria (cat_id, cat_nome) VALUES (13, 'Arte');
INSERT INTO categoria (cat_id, cat_nome) VALUES (14, 'Culinária');
INSERT INTO categoria (cat_id, cat_nome) VALUES (15, 'Infantil');

-- Autores
INSERT INTO autor (atr_id, atr_nome) VALUES (1, 'J.K. Rowling');
INSERT INTO autor (atr_id, atr_nome) VALUES (2, 'Stephen King');
INSERT INTO autor (atr_id, atr_nome) VALUES (3, 'George R.R. Martin');
INSERT INTO autor (atr_id, atr_nome) VALUES (4, 'Agatha Christie');
INSERT INTO autor (atr_id, atr_nome) VALUES (5, 'Machado de Assis');
INSERT INTO autor (atr_id, atr_nome) VALUES (6, 'Clarice Lispector');

-- Editoras
INSERT INTO editora (edi_id, edi_nome) VALUES (1, 'Companhia das Letras');
INSERT INTO editora (edi_id, edi_nome) VALUES (2, 'Editora Rocco');
INSERT INTO editora (edi_id, edi_nome) VALUES (3, 'Editora Arqueiro');
INSERT INTO editora (edi_id, edi_nome) VALUES (4, 'Editora Record');
INSERT INTO editora (edi_id, edi_nome) VALUES (5, 'Editora Intrínseca');
INSERT INTO editora (edi_id, edi_nome) VALUES (6, 'Editora Abril');
INSERT INTO editora (edi_id, edi_nome) VALUES (7, 'Editora Globo');
INSERT INTO editora (edi_id, edi_nome) VALUES (8, 'Editora Nova Fronteira');
INSERT INTO editora (edi_id, edi_nome) VALUES (9, 'Editora Martins Fontes');
INSERT INTO editora (edi_id, edi_nome) VALUES (10, 'Editora Leya');

-- Grupos de Precificação
INSERT INTO grupo_de_precificacao (grp_id, grp_nome, grp_margem_lucro) VALUES 
(1, 'Grupo A', 20.00),
(2, 'Grupo B', 30.00),
(3, 'Grupo C', 25.00),
(4, 'Grupo D', 15.00),
(5, 'Grupo E', 35.00);

-- Livros
INSERT INTO livros (
    lvr_id, lvr_ano, lvr_titulo, lvr_edicao, lvr_isbn, 
    lvr_numero_de_paginas, lvr_sinopse, lvr_altura, lvr_largura, 
    lvr_peso, lvr_profundidade, lvr_codigo_de_barras, 
    lvr_ponteiro_imagem, lvr_status, lvr_qtd_estoque, 
    lvr_custo, lvr_desconto, grupo_de_precificacao_grp_id
) VALUES
-- J.K. Rowling
(1, 1997, 'Harry Potter e a Pedra Filosofal', '1ª Edição', 9788532511010, 223, 'Sinopse do livro 1', 23.0, 16.0, 400, 2.5, 123456789, 'hp1.jpg', 1, 100, 29.90, 10, 1),
(2, 1998, 'Harry Potter e a Câmara Secreta', '1ª Edição', 9788532512062, 251, 'Sinopse do livro 2', 23.0, 16.0, 420, 2.5, 123456790, 'hp2.jpg', 1, 80, 32.50, 5, 1),

-- Stephen King
(3, 1977, 'O Iluminado', 'Edição Especial', 9788532520661, 464, 'Sinopse do livro 3', 21.0, 14.0, 600, 3.0, 123456791, 'iluminado.jpg', 1, 50, 39.90, NULL, 2),
(4, 1986, 'It - A Coisa', 'Edição de Luxo', 9788532530783, 1104, 'Sinopse do livro 4', 24.0, 16.0, 900, 4.0, 123456792, 'it.jpg', 1, 30, 59.90, 15, 2),

-- George R.R. Martin
(5, 1996, 'A Guerra dos Tronos', 'Edição Comemorativa', 9788556510787, 592, 'Sinopse do livro 5', 23.5, 16.5, 700, 3.5, 123456793, 'got.jpg', 1, 60, 49.90, NULL, 1),
(6, 1998, 'A Fúria dos Reis', 'Edição Padrão', 9788556510794, 656, 'Sinopse do livro 6', 23.5, 16.5, 750, 3.5, 123456794, 'furia.jpg', 1, 45, 52.50, 10, 1),

-- Agatha Christie
(7, 1934, 'Assassinato no Expresso do Oriente', 'Edição de Colecionador', 9788525422061, 256, 'Sinopse do livro 7', 20.5, 13.5, 350, 2.0, 123456795, 'expresso.jpg', 1, 70, 34.90, NULL, 3),
(8, 1939, 'E Não Sobrou Nenhum', 'Edição Especial', 9788525414615, 288, 'Sinopse do livro 8', 20.5, 13.5, 380, 2.0, 123456796, 'nenhum.jpg', 1, 65, 37.50, 5, 3),

-- Machado de Assis
(9, 1881, 'Memórias Póstumas de Brás Cubas', 'Edição Crítica', 9788520923721, 240, 'Sinopse do livro 9', 21.0, 14.0, 300, 2.0, 123456797, 'bras.jpg', 1, 40, 27.90, NULL, 4),
(10, 1899, 'Dom Casmurro', 'Edição Comentada', 9788520931436, 208, 'Sinopse do livro 10', 21.0, 14.0, 280, 2.0, 123456798, 'casmurro.jpg', 1, 55, 25.50, 10, 4),

-- Clarice Lispector
(11, 1977, 'A Hora da Estrela', 'Edição de Luxo', 9788520921239, 96, 'Sinopse do livro 11', 19.0, 12.5, 150, 1.5, 123456799, 'hora.jpg', 1, 35, 22.90, NULL, 5),
(12, 1964, 'A Paixão Segundo G.H.', 'Edição Especial', 9788520921246, 192, 'Sinopse do livro 12', 19.0, 12.5, 200, 1.5, 123456800, 'paixao.jpg', 1, 25, 28.50, 5, 5);

-- Associando autores aos livros
INSERT INTO escreveu (autor_atr_id, livros_lvr_id) VALUES
(1, 1), (1, 2),    -- J.K. Rowling
(2, 3), (2, 4),    -- Stephen King
(3, 5), (3, 6),    -- George R.R. Martin
(4, 7), (4, 8),    -- Agatha Christie
(5, 9), (5, 10),   -- Machado de Assis
(6, 11), (6, 12);  -- Clarice Lispector

-- Associando editoras aos livros
INSERT INTO editou (editora_edi_id, livros_lvr_id) VALUES
(2, 1), (2, 2),    -- Editora Rocco
(3, 3), (3, 4),    -- Editora Arqueiro
(4, 5), (4, 6),    -- Editora Record
(1, 7), (1, 8),    -- Companhia das Letras
(8, 9), (8, 10),   -- Nova Fronteira
(1, 11), (1, 12);  -- Companhia das Letras

-- Associando categorias aos livros (usando nome de tabela sem espaços)
INSERT INTO possui4 (categoria_cat_id, livros_lvr_id) VALUES
(2, 1), (2, 2),    -- Fantasia
(6, 3), (5, 4),    -- Terror/Suspense
(2, 5), (2, 6),    -- Fantasia
(4, 7), (4, 8),    -- Mistério
(3, 9), (3, 10),   -- Romance
(3, 11), (3, 12);  -- Romance

-- Usuario
INSERT INTO usuarios (
    usr_id,
    usr_nome,
    usr_email,
    usr_cpf,
    usr_senha,
    usr_data_de_nascimento,
    usr_telefone_1,
    usr_telefone_2,
    usr_genero,
    usr_status_de_atividade
) VALUES (
    1,
    'João da Silva',
    'joao.silva@email.com',
    '12345678901',
    'senha123',
    '1990-05-15',
    1198765432,
    1133334444,
    'Masculino',
    'A'
);

-- Endereços de Entrega
INSERT INTO enderecos_entrega ( 
end_estado,
end_cidade,
end_bairro,
end_endereco,
end_numero,
end_complemento,
end_cep,
usuarios_usr_id
) VALUES (
	'SP',
    'Mogi das Cruzes',
    'Centro',
    'Rua Braz Cardoso',
    '22',
    '',
    '22335786',
    '1'
);

INSERT INTO enderecos_entrega ( 
end_estado,
end_cidade,
end_bairro,
end_endereco,
end_numero,
end_complemento,
end_cep,
usuarios_usr_id
) VALUES (
	'SP',
    'Mogi das Cruzes',
    'Centro',
    'Rua São João',
    '12',
    '',
    '11235786',
    '1'
);

-- Cartões

INSERT INTO cartoes ( 
crt_numero,
crt_bandeira,
crt_codigo_seguranca,
crt_nome,
usuarios_usr_id
) VALUES (
	'1111 2222 3333 4444',
    'VISA',
    '123154',
    'João da Silva',
    '1'
);

INSERT INTO cartoes ( 
crt_numero,
crt_bandeira,
crt_codigo_seguranca,
crt_nome,
usuarios_usr_id
) VALUES (
	'2222 4444 6666 8888',
    'VISA',
    '123154',
    'João da Silva',
    '1'
);

-- Transações
INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-05-15',
    15.90,
    'APROVADO',
    150.75,
    10.00,
    140.75,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-06-20',
    12.50,
    'APROVADO',
    89.90,
    5.00,
    84.90,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-07-10',
    0.00,
    'APROVADO',
    230.50,
    20.00,
    210.50,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-08-05',
    8.75,
    'APROVADO',
    75.25,
    0.00,
    75.25,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-09-12',
    18.30,
    'APROVADO',
    320.00,
    30.00,
    290.00,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-08-05',
    8.75,
    'APROVADO',
    75.25,
    0.00,
    75.25,
    1,
    1
);

INSERT INTO transacoes (
    tra_data,
    tra_valor_frete,
    tra_status,
    tra_valor,
    tra_desconto,
    tra_subtotal,
    enderecos_entrega_end_id,
    usuarios_usr_id
) VALUES (
    '2023-09-12',
    18.30,
    'APROVADO',
    320.00,
    30.00,
    290.00,
    1,
    1
);

-- Formas de Pagamento
INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cartoes_crt_id
) VALUES (
    'Cartao de Credito',
    210.5,
    6,
    1
);

INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cartoes_crt_id
) VALUES (
    'Cartao de Credito',
    50.25,
    7,
    1
);

INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cupom_cup_id
) VALUES (
    'Cupom',
    25.00,
    7,
    3
);

INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cartoes_crt_id
) VALUES (
    'Cartao de Credito',
    290.00,
    8,
    1
);

INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cartoes_crt_id
) VALUES (
    'Cartao de Credito',
    84.90,
    9,
    1
);

INSERT INTO forma_de_pagamento (
    fpg_tipo,
    fpg_valor,
    transacoes_tra_id,
    cartoes_crt_id
) VALUES (
    'Cartao de Credito',
    140.75,
    10,
    1
);

INSERT INTO cupom (
    cup_data,
    cup_nome,
    cup_valor,
    usuarios_usr_id
) VALUES (
    '2023-08-05',
    ' Cupom de Troca',
    75.00,
    1
);

INSERT INTO cupom (
    cup_data,
    cup_nome,
    cup_valor,
    usuarios_usr_id
) VALUES (
    '2023-08-06',
    ' Cupom de Troca',
    100.00,
    1
);

INSERT INTO cupom (
    cup_data,
    cup_nome,
    cup_valor,
    cup_status,
    usuarios_usr_id
) VALUES (
    '2023-08-06',
    ' Cupom de Troca',
    25.00,
    0,
    1
);

-- Transação 21 (2025-05-02)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-02 14:30:00', 12.50, 'APROVADO', 187.40, 15.00, 172.40, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 57, 1),  -- Harry Potter e a Pedra Filosofal
(1, 57, 5),  -- A Guerra dos Tronos
(1, 57, 9);  -- Memórias Póstumas de Brás Cubas

-- Transação 22 (2025-05-07)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-07 10:15:00', 14.75, 'APROVADO', 221.25, 0.00, 221.25, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 22, 3),  -- O Iluminado
(1, 22, 7),  -- Assassinato no Expresso do Oriente
(1, 22, 11); -- A Hora da Estrela

-- Transação 23 (2025-05-12)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-12 16:45:00', 11.20, 'APROVADO', 203.60, 20.00, 183.60, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 23, 2),  -- Harry Potter e a Câmara Secreta
(1, 23, 6),  -- A Fúria dos Reis
(1, 23, 10); -- Dom Casmurro

-- Transação 24 (2025-05-18)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-18 09:30:00', 16.30, 'APROVADO', 254.80, 0.00, 254.80, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 24, 4),  -- It - A Coisa
(1, 24, 8),  -- E Não Sobrou Nenhum
(1, 24, 12); -- A Paixão Segundo G.H.

-- Transação 25 (2025-05-22)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-22 13:20:00', 13.90, 'APROVADO', 178.30, 10.00, 168.30, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 25, 1),  -- Harry Potter e a Pedra Filosofal
(1, 25, 8),  -- E Não Sobrou Nenhum
(1, 25, 11); -- A Hora da Estrela

-- Transação 26 (2025-05-27)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-05-27 15:10:00', 15.25, 'APROVADO', 232.75, 25.00, 207.75, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 26, 3),  -- O Iluminado
(1, 26, 5),  -- A Guerra dos Tronos
(1, 26, 9);  -- Memórias Póstumas de Brás Cubas

-- Transação 27 (2025-06-03)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-06-03 11:40:00', 10.50, 'APROVADO', 195.50, 0.00, 195.50, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 27, 2),  -- Harry Potter e a Câmara Secreta
(1, 27, 7),  -- Assassinato no Expresso do Oriente
(1, 27, 12); -- A Paixão Segundo G.H.

-- Transação 28 (2025-06-08)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-06-08 14:00:00', 18.40, 'APROVADO', 273.90, 30.00, 243.90, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 28, 4),  -- It - A Coisa
(1, 28, 6),  -- A Fúria dos Reis
(1, 28, 10); -- Dom Casmurro

-- Transação 29 (2025-06-14)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-06-14 10:25:00', 12.80, 'APROVADO', 206.70, 15.00, 191.70, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 29, 1),  -- Harry Potter e a Pedra Filosofal
(1, 29, 3),  -- O Iluminado
(1, 29, 12); -- A Paixão Segundo G.H.

-- Transação 30 (2025-06-20)
INSERT INTO transacoes (tra_data, tra_valor_frete, tra_status, tra_valor, tra_desconto, tra_subtotal, enderecos_entrega_end_id, usuarios_usr_id) 
VALUES ('2025-06-20 16:30:00', 14.20, 'APROVADO', 224.20, 0.00, 224.20, 1, 1);

INSERT INTO itens_de_venda (itv_qtd_item, transacoes_tra_id, livros_lvr_id) VALUES
(1, 30, 5),  -- A Guerra dos Tronos
(1, 30, 8),  -- E Não Sobrou Nenhum
(1, 30, 11); -- A Hora da Estrela