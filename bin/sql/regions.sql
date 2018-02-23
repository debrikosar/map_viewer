CREATE TABLE regions(
	id serial,
	name character varying(30),
	description character varying(100)
);

INSERT INTO regions(name, description)
VALUES
('Region1', 'Description'),
('Region2', 'Description2');

