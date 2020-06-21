Drop table if exists messages;
Drop table if exists captcha;
Drop table if exists themes;
Drop table if exists users;

#------------------------------------------------------------
# Table: users
#------------------------------------------------------------

CREATE TABLE users
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(55) NOT NULL,
  email VARCHAR(75) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'utilisateur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#------------------------------------------------------------
# Table: themes
#------------------------------------------------------------

CREATE TABLE themes
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(55) NOT NULL
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
  name VARCHAR(55) NOT NULL UNIQUE,
  url VARCHAR(75) NOT NULL,
  theme_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY(theme_id) REFERENCES themes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#------------------------------------------------------------
# Table: messages
#------------------------------------------------------------

CREATE TABLE messages
(
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(255) NOT NULL,
  created_at DATETIME,
  captcha_id INT NOT NULL,
  FOREIGN KEY(captcha_id) REFERENCES captcha(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
