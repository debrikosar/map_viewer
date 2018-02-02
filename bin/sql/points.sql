CREATE TABLE points(
	id serial,
	name character varying(30),
	coordinates point,
	description character varying(100)
);

INSERT INTO points(name, coordinates, description)
VALUES
('BSTU', '(53, 27)', 'Description'),
('BSU', '(52, 28)', 'Description2');

