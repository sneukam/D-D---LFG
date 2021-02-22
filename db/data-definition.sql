/****************************************

		Group 67
		Project Step 4
		Data Definition
		2/14/2021
		
		* This file is meant to be loaded into the database.
		* It will create tables, and populate example data.
		
		Spencer Neukam
		Ethan Hunter

****************************************/


/****************************************

		Create Tables

****************************************/

SET foreign_key_checks = 0;

/* users */
DROP TABLE IF EXISTS users;
CREATE TABLE users (
	user_id int(11) NOT NULL AUTO_INCREMENT,
	username varchar(25) NOT NULL,
	password varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	name varchar(50) NOT NULL,
	player_type ENUM('DM','Player') NOT NULL,
	playstyle ENUM('By the book','UA allowed','UA and homebrew','Defer to DM'),
	campaign_history varchar(255),
	PRIMARY KEY (user_id)
)
ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* user_availability */
DROP TABLE IF EXISTS user_availability;
CREATE TABLE user_availability (
	user_id int(11) NOT NULL,
	monday tinyint NOT NULL,
	tuesday tinyint NOT NULL,
	wednesday tinyint NOT NULL,
	thursday tinyint NOT NULL,
	friday tinyint NOT NULL,
	saturday tinyint NOT NULL,
	sunday tinyint NOT NULL,
	PRIMARY KEY (user_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id)
)
ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* campaigns */
DROP TABLE IF EXISTS campaigns;
CREATE TABLE campaigns (
	campaign_id int(11) NOT NULL AUTO_INCREMENT,
	campaign_name varchar(60) NOT NULL,
	dm int(11) NOT NULL,
	num_players tinyint NOT NULL,
	plays_on tinyint NOT NULL,
	desired_history ENUM('All players welcome','New players only','Some experience','Experienced players only'),
	status ENUM('Open','Closed'),
	playstyle ENUM('By the book', 'UA allowed', 'UA and homebrew', 'Defer to DM'),
	created DATE,
	closed DATE DEFAULT NULL,
	PRIMARY KEY (campaign_id),
	FOREIGN KEY (dm) REFERENCES users (user_id)
)
ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* characters */
DROP TABLE IF EXISTS characters;
CREATE TABLE characters (
	character_id int(11) NOT NULL AUTO_INCREMENT,
	user_id int(11) NOT NULL,
	character_name varchar(60) NOT NULL,
	character_class varchar(50),
	character_traits varchar(255),
	PRIMARY KEY (character_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id)
)
ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* campaign_player_roster */
DROP TABLE IF EXISTS campaign_player_roster;
CREATE TABLE campaign_player_roster (
	campaign_player_id int(11) NOT NULL AUTO_INCREMENT,
	campaign_id int(11) NOT NULL ,
	user_id int(11) NOT NULL,
	character_id int(11),
	PRIMARY KEY (campaign_player_id),
	FOREIGN KEY (campaign_id) REFERENCES campaigns (campaign_id),
	FOREIGN KEY (user_id) REFERENCES users (user_id),
	FOREIGN KEY (character_id) REFERENCES characters (character_id)
)
ENGINE=InnoDB DEFAULT CHARSET=latin1;


/****************************************

		Example Data
		
****************************************/


/* users */
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('sneukam', '12345', 'neukams@oregonstate.edu', 'Spencer Neukam', 'Player', 'UA allowed', 'no campaigns played before');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('ehunter', '6789', 'hunteret@oregonstate.edu', 'Ethan Hunter', 'DM', 'UA and homebrew', 'Very experienced');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('jaycray', '9825245password', 'jay@cray.com', 'Jay Cray', 'Player', 'UA and homebrew', 'Professional');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('andrew', 'anotherpw', 'andrew@ttv.com', 'Andrew TTV', 'DM', 'By the book', 'Still new but competitive');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('juka', 'password3', 'juka@ttv.com', 'Juka', 'Player', 'By the book', 'Just here for fun');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('jimbo', 'anotherpw5', 'james@jimbo.com', 'James Cannon', 'DM', 'UA and homebrew', 'Experienced DM-er');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('primeplayer', 'qwerty', 'prime@gmail.com', 'Prime Player', 'Player', 'By the book', 'very new');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('tincan', 'sheepgrass', 'tin@can.com', 'Mr Tin', 'Player', 'UA and homebrew', 'Experienced DM-er');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('anita', 'password25', 'anita@knap.com', 'Anita Knap', 'Player', 'UA and homebrew', 'I have played one campaign');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('sheila', 'password56', 'sheila@blige.com', 'Sheila Blige', 'Player', 'Defer to DM', 'I have played two campaigns');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('hoosier-daddy', 'password76', 'hoosier@domain.com', 'Hoosier Dude', 'Player', 'Defer to DM', 'No experience yet but want to dive in');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('hugs', 'password12', 'hugs@hugs.com', 'Mr Hugs', 'Player', 'By the book', 'No experience yet but want to dive in');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('accountant', 'password0', 'accountant@accounting.com', 'Mr Accountant', 'Player', 'By the book', 'I always do it by the book');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('champain', 'password5', 'champ@pain.com', 'The Champion', 'Player', 'UA and homebrew', 'Who is champ?');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('baecon', 'password9', 'bacon@bae.com', 'Bae', 'Player', 'Defer to DM', 'No experience yet');
INSERT INTO users(username, password, email, name, player_type, playstyle, campaign_history)
VALUES('kiss-my-axe', 'password15', 'kiss@axe.com', 'Kiss My Axe', 'Player', 'Defer to DM', 'Very experienced');


/* user_availability */
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='sneukam'), 0, 0, 0, 1, 1, 1, 1);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='jaycray'), 1, 1, 1, 1, 1, 1, 1);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='juka'), 0, 1, 0, 0, 1, 1, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='primeplayer'), 1, 1, 0, 1, 0, 1, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='tincan'), 0, 0, 1, 1, 1, 0, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='anita'), 0, 0, 0, 0, 1, 0, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='sheila'), 0, 0, 0, 0, 1, 1, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='hoosier-daddy'), 0, 0, 0, 1, 1, 1, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='hugs'), 0, 0, 0, 1, 1, 1, 0);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='accountant'), 0, 0, 1, 1, 1, 1, 1);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='champain'), 1, 1, 1, 1, 1, 1, 1);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='baecon'), 0, 0, 1, 1, 1, 1, 1);
INSERT INTO user_availability(user_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
VALUES ((SELECT user_id FROM users WHERE username='kiss-my-axe'), 0, 0, 1, 1, 1, 1, 1);


/* characters */
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='sneukam'), 'Terra', 'Sorcerer/Warlock', 'Groveborn');
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='sneukam'), 'Alice', 'Rogue', 'Half demon');
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='sneukam'), 'Draug', 'Ranger', 'Wood elf');
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='jaycray'), 'MasterC', 'Chiefling', 'Green suit');
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='primeplayer'), 'Optimus', 'Giant Robot', 'leadership');
INSERT INTO characters(user_id, character_name, character_class, character_traits)
VALUES ((SELECT user_id FROM users WHERE username='tincan'), 'Grengurn', 'Dwarf', 'short');


/* campaigns */
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES('Dungeons of the Deep', (SELECT user_id FROM users WHERE username='ehunter'), 5, 5, 'Open', 'Experienced players only', 'UA and homebrew', '2021-02-14', NULL);
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES('Game of Gnomes', (SELECT user_id FROM users WHERE username='ehunter'), 4, 6, 'Open', 'Some experience', 'By the book', '2020-11-05', NULL);
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES('Dragonland', (SELECT user_id FROM users WHERE username='andrew'), 4, 4, 'Open', 'Some experience', 'UA allowed', '2020-11-05', NULL);
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES('Casual Wednesday Game', (SELECT user_id FROM users WHERE username='andrew'), 4, 3, 'Open', 'All players welcome', 'UA allowed', '2020-05-11', NULL);
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES("Jimbo's D&D Game", (SELECT user_id FROM users WHERE username='jimbo'), 3, 7, 'Closed', 'Some experience', 'UA and homebrew', '2019-07-01', '2019-11-21');
INSERT INTO campaigns(campaign_name, dm, num_players, plays_on, status, desired_history, playstyle, created, closed)
VALUES("The Monday Throwdown", (SELECT user_id FROM users WHERE username='jimbo'), 8, 1, 'Open', 'All players welcome', 'Defer to DM', '2020-12-05', NULL);


/* campaign_player_roster */
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Dungeons of the Deep'),
		(SELECT user_id FROM users WHERE username='juka'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Dungeons of the Deep'),
		(SELECT user_id FROM users WHERE username='sneukam'),
		(SELECT character_id FROM characters WHERE character_name='Terra'));
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Dungeons of the Deep'),
		(SELECT user_id FROM users WHERE username='jaycray'),
		(SELECT character_id FROM characters WHERE character_name='MasterC'));
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Game of Gnomes'),
		(SELECT user_id FROM users WHERE username='sheila'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Game of Gnomes'),
		(SELECT user_id FROM users WHERE username='primeplayer'),
		(SELECT character_id FROM characters WHERE character_name='Optimus'));
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Dragonland'),
		(SELECT user_id FROM users WHERE username='tincan'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Dragonland'),
		(SELECT user_id FROM users WHERE username='hoosier-daddy'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='Casual Wednesday Game'),
		(SELECT user_id FROM users WHERE username='accountant'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='The Monday Throwdown'),
		(SELECT user_id FROM users WHERE username='champain'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='The Monday Throwdown'),
		(SELECT user_id FROM users WHERE username='primeplayer'),
		NULL);
INSERT INTO campaign_player_roster(campaign_id, user_id, character_id)
VALUES(	(SELECT campaign_id FROM campaigns WHERE campaign_name='The Monday Throwdown'),
		(SELECT user_id FROM users WHERE username='jaycray'),
		NULL);

