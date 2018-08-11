CREATE DATABASE takazon;
USE takazon;

CREATE TABLE products (
	id INTEGER(12) auto_increment not null,
    product_name char(30) not null,
    department_name char(30) not null,
    price decimal(10, 2) not null,
    stock_quantity integer(4) not null,
    primary key (id)
    );
    
    
insert into products (product_name, department_name, price, stock_quantity)
value('tomato', 'fremont', 4, 1200), ('lettuce', 'hayward', 3.45, 900), ('cabagge', 'fremont', 5.24, 3), ('spinach', 'walnut creek', 4.75, 487),
('cucumber', 'sunnyvale', 2.12, 7000), ('carrot', 'unioncity', 3.15, 322), ('onion', 'fremont', 2.98, 280), ('bell papper', 'fremont', 1.45, 980),
('bagle', 'fremont', 2.10, 1500), ('green beans', 'hayward', 1.10, 120), ('tomatoes', 'fremont', 4, 1200);

select * from products;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

select product_name, price from products;