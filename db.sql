DROP DATABASE IF EXISTS gb;

CREATE DATABASE gb;

CREATE USER 'vbondarets'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON gb.* to 'vbondarets'@'localhost';

USE gb;

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
    ID INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(36) NOT NULL UNIQUE,
    password VARCHAR(72) NOT NULL,
    avatar VARCHAR(100) NULl,
    
    PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS cards(
    ID INT NOT NULL AUTO_INCREMENT,
    price INT NOT NULL,
    name VARCHAR(20) NOT NULL UNIQUE,
    hp TINYINT UNSIGNED NOT NULL,
    damage TINYINT UNSIGNED NOT NULL,
    file VARCHAR(100) NOT NULl,

    PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS deck(
    user_id INT NOT NULL,
    slot1 INT NOT NULL,
    slot2 INT NOT NULL,
    slot3 INT NOT NULL,
    slot4 INT NOT NULL,
    slot5 INT NOT NULL,
    slot6 INT NOT NULL,
    slot7 INT NOT NULL,
    slot8 INT NOT NULL
);

INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 1, 'Black Panther', 2, 3, 2, 'black_panther.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 2, 'Capitan America', 3, 3, 4, 'captain_amerika.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 3, 'Cyclop', 1, 1, 2, 'cyclop.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 4, 'dardevil', 2, 3, 3, 'dardevil.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 5, 'Doctor Strange', 6, 10, 10, 'doctor_strange.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 6, 'Hulk', 5, 8, 8, 'hulk.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 7, 'Iron Man', 4, 4, 6, 'iron_man.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 8, 'Spider Man', 3, 2, 6, 'spider_man.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 9, 'Thor', 4, 8, 2, 'thor.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 10, 'Wolverine', 1, 3, 1, 'wolverine.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 11, 'Doom', 3, 1, 6, 'doom.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 12, 'Electro', 2, 1, 3, 'electro.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 13, 'Galactus', 8, 16, 2, 'galactus.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 14, 'Goblin', 3, 6, 1, 'goblin.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 15, 'Kraven', 1, 1, 2, 'kraven.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 16, 'Loki', 5, 4, 8, 'loki.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 17, 'Red Skull', 1, 1, 1, 'red_skull.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 18, 'Vulture', 2, 2, 3, 'stervyatnik.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 19, 'Tanos', 9, 12, 12, 'tanos.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 20, 'Venom', 7, 7, 9, 'venom.png');
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 21, 'Mind Stone', 2, 5, 0, 'mind_stone.png'); -- добавляет 5 хп
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 22, 'Power Stone', 3, 0, 5, 'power_stone.png'); -- наносит 5 урона
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 23, 'Reality Stone', 1, 0, 0, 'reality_stone.png'); -- меняет местами атаку и хп существа
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 24, 'Soul Stone', 5, 0, 0, 'soul_stone.png'); -- клон с одним хп
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 25, 'Space Stone', 6, 0, 0, 'space_stone.png'); -- уничтожает луюбое существо
INSERT INTO `cards` (ID, name, price, hp, damage, file) VALUES ( 26, 'Time Stone', 4, 0, 0, 'time_stone.png'); -- воскресает последнее погибшее существо 

