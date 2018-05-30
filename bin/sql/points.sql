CREATE TABLE points(
	id serial,
	name character varying(30),
	coordinates point,
	description character varying(100)
);

CREATE TABLE regions(
	id serial,
	name character varying(30),
	description character varying(100)
);

CREATE TABLE short_points(
	id serial,
	region_id integer,
	coordinates point
);

CREATE TABLE users(
	id serial,
	username character varying(30),
	password character varying(30)
);

INSERT INTO points(name, coordinates, description)
VALUES
('BSTU', '(53, 27)', 'Description'),
('BSU', '(52, 28)', 'Description2');

INSERT INTO short_points(region_id, coordinates)
VALUES
(1, '(53, 27)'),
(1, '(50, 23)'),
(2, '(43, 7)'),
(2, '(17, 15)'),
(1, '(52, 28)');

INSERT INTO regions(name, description)
VALUES
('Test', 'Description'),
('Test2', 'Description2');

INSERT INTO users(username, password)
VALUES
('User', 'Password'),
('User2', 'Password2');


