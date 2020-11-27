CREATE DATABASE IF NOT EXISTS informasuschatbot;
USE informasuschatbot;

-- DROP TABLE IF EXISTS perfil;
CREATE TABLE perfil (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

INSERT INTO perfil (nome) VALUES ('ADMINISTRADOR'), ('COMUM');

-- DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id int NOT NULL AUTO_INCREMENT,
  login varchar(100) NOT NULL,
  nome varchar(100) NOT NULL,
  idperfil int NOT NULL,
  senha varchar(100) NOT NULL,
  token char(32) DEFAULT NULL,
  criacao datetime NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY login_UN (login),
  KEY idperfil_FK_idx (idperfil),
  CONSTRAINT idperfil_FK FOREIGN KEY (idperfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (login, nome, idperfil, senha, token, criacao) VALUES ('ADMIN', 'ADMINISTRADOR', 1, 'peTcC99vkvvLqGQL7mdhGuJZIvL2iMEqvCNvZw3475PJ:JVyo1Pg2HyDyw9aSOd3gNPT30KdEyiUYCjs7RUzSoYGN', NULL, NOW());

-- DROP TABLE IF EXISTS chatlog;
CREATE TABLE chatlog (
  id bigint NOT NULL AUTO_INCREMENT,
  data datetime NOT NULL,
  idconversa tinytext NOT NULL,
  ip tinytext NOT NULL,
  conteudo text NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE textochat (
	id int NOT NULL AUTO_INCREMENT,
	texto mediumtext NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO textochat (texto) VALUES ('');
