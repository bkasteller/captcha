Drop table if exists users;
Drop table if exists messages;
Drop table if exists themes;
Drop table if exists captcha;

#------------------------------------------------------------
# Table: users
#------------------------------------------------------------

CREATE TABLE users
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(55),
  email VARCHAR(75),
  password VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#------------------------------------------------------------
# Table: messages
#------------------------------------------------------------

CREATE TABLE messages
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(255),
  created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


#------------------------------------------------------------
# Table: themes
#------------------------------------------------------------

CREATE TABLE themes
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(55)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO themes (id, name)
VALUES (1, "Annimaux");
INSERT INTO themes (id, name)
VALUES (2, "BD");
INSERT INTO themes (id, name)
VALUES (3, "Graphisme");

#------------------------------------------------------------
# Table: captcha
#------------------------------------------------------------

CREATE TABLE captcha
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(55),
  theme_id INT NOT NULL,
  FOREIGN KEY(theme_id) REFERENCES themes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;