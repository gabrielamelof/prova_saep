CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    estoque_atual INT DEFAULT 0,
    estoque_min INT DEFAULT 0
);

CREATE TABLE movimentacoes (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,

    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
        ON DELETE CASCADE ON UPDATE CASCADE,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO usuarios (nome, login, senha) VALUES
('Administrador', 'admin', '1234'),
('Maria Souza', 'maria', 'senha123'),
('João Carlos', 'joao', 'abc123');

INSERT INTO produtos (nome, descricao, estoque_atual, estoque_min) VALUES
('Teclado Mecânico', 'Teclado RGB switch blue', 50, 10),
('Mouse Gamer', 'Mouse 7200 DPI', 30, 5),
('Monitor 24"', 'Monitor Full HD 75Hz', 20, 2);

INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'entrada', 10, '2025-01-10'),
(1, 2, 'saida', 4, '2025-01-11'),
(2, 3, 'entrada', 15, '2025-01-12'),
(3, 1, 'saida', 3, '2025-01-15'),
(2, 1, 'saida', 5, '2025-01-18');
