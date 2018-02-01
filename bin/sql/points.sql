CREATE TABLE points(
	id serial,
	name character varying(30),
	coord point,
	description character varying(100)
);

INSERT INTO points(name, coord, description)
VALUES
('BSTU', '(53, 27)', 'Description'),
('BSU', '(52, 28)', 'Description2');
