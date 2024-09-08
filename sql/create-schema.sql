BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL, 
    email VARCHAR(100) NOT NULL,  
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT,        
	sales INT CHECK (sales >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS sales (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	product_id INT,
	sale_date TIMESTAMP DEFAULT NULL,
	amount INT CHECK (amount >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS teams (
	team_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	team_name VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS departments(
	department_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	department_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS employees (
	employee_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(255) DEFAULT NULL,
	department VARCHAR(255) DEFAULT NULL,	
	salary INT CHECK (salary >= 0) DEFAULT NULL,
	team_id INT REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	department_id INT REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS customers(
	customer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	customer_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
	order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	customer_id INT,
	amount INT CHECK (amount >= 0) DEFAULT NULL,
	order_date TIMESTAMP DEFAULT NULL,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
	transaction_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	client_id INT CHECK (client_id >= 0) DEFAULT NULL,
	transaction_date TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS student_grades (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	student_id INT,
	course_id INT CHECK (course_id >= 0) DEFAULT NULL,
	grade INT CHECK (grade >= 0) DEFAULT NULL 
);

CREATE TABLE IF NOT EXISTS responses (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	employee_id INT CHECK (employee_id >= 0) DEFAULT NULL,
	response_time INT CHECK (response_time >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS sales_reps (
	sales_rep_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	month DATE DEFAULT NULL,
	sales_count INT CHECK (sales_count >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS movies (
	movie_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	genre VARCHAR(255) DEFAULT NULL,
	rating DECIMAL(2,1) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS employee_projects (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	employee_id INT CHECK (employee_id >= 0) DEFAULT NULL,
	project_id INT CHECK (project_id >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS projects (
	project_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	budget INT CHECK (budget >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS salaries (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	employee_id INT CHECK (employee_id >= 0) DEFAULT NULL,
	month DATE DEFAULT NULL,
	salary INT CHECK (salary >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS product_prices (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	product_id INT CHECK (product_id >= 0) DEFAULT NULL,
	date DATE DEFAULT NULL,
	price INT CHECK (price >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS order_statuses (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	order_id INT CHECK (order_id >= 0) DEFAULT NULL,
	status VARCHAR(255) DEFAULT NULL,
	status_date DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS project_stages(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	project_id INT CHECK (project_id >= 0) DEFAULT NULL,
	stage VARCHAR(255) DEFAULT NULL,
	start_date DATE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS daily_sales(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	date DATE DEFAULT NULL,
	sales INT CHECK (sales >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS user_visits(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	user_id INT CHECK (user_id >= 0) DEFAULT NULL,
	visit_date DATE DEFAULT NULL,
	visit_count INT CHECK (visit_count >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS monthly_sales(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	region VARCHAR(255) DEFAULT NULL,
	month DATE DEFAULT NULL,
	sales INT CHECK(sales >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS customer_orders(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	customer_id INT CHECK(customer_id >= 0) DEFAULT NULL,
	order_date DATE DEFAULT NULL,
	order_amount INT CHECK(order_amount >= 0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS product_revenue(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	product_id INT CHECK (product_id >= 0),
	revenue_date DATE,
	revenue_amount INT CHECK (revenue_amount >= 0)
);

CREATE TABLE IF NOT EXISTS student_scores(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	student_id INT CHECK (student_id >= 0),
	subject VARCHAR(255),
	score INT CHECK (score >= 0 AND score <= 100)
);

CREATE TABLE IF NOT EXISTS employee_sales(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	employee_id INT CHECK (employee_id >= 0),
	sales_month DATE,
	sales_amount INT CHECK( sales_amount>=0)
);

CREATE TABLE IF NOT EXISTS employee_performance(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	employee_id INT CHECK (employee_id >= 0),
	tasks_completed INT CHECK (tasks_completed >= 0)
);

CREATE TABLE IF NOT EXISTS authors(
	author_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	author_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS books (
	book_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	book_title VARCHAR(255),
	author_id INT REFERENCES authors(author_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS students(
	student_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	student_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cources(
	cource_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	cource_name VARCHAR(255),
	student_id INT REFERENCES students(student_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases(
	purchase_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	client_id INT CHECK (purchase_amount >= 0),
	category_id VARCHAR(255),
	purchase_amount INT CHECK (purchase_amount >= 0)
);

END;










