CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE product (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	title VARCHAR(255) NOT NULL,
	description VARCHAR(1000) NOT NULL,
	price INTEGER DEFAULT 0,
	CONSTRAINT pk_product PRIMARY KEY(id)
);


CREATE TABLE store ( 
	product_id uuid NOT NULL,
	count INTEGER DEFAULT 0 NOT NULL,
	CONSTRAINT pk_store PRIMARY KEY(product_id),
	CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE
);

ALTER TABLE product ADD COLUMN IF NOT EXISTS img VARCHAR(255);