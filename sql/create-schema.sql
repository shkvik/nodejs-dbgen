CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,        -- Уникальный идентификатор пользователя
    username VARCHAR(50) NOT NULL, -- Имя пользователя
    email VARCHAR(100) NOT NULL,   -- Электронная почта пользователя
    password VARCHAR(255) NOT NULL, -- Хэш пароля пользователя
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Время создания записи
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Время последнего обновления записи
);

CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,         -- Уникальный идентификатор товара (автоинкремент)
    name VARCHAR(255) NOT NULL,    -- Название товара
    description TEXT,              -- Описание товара
    price DECIMAL(10, 2) NOT NULL, -- Цена товара с двумя знаками после запятой
    stock INT DEFAULT 0,           -- Количество товара на складе, по умолчанию 0
	  quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата и время добавления товара
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Дата и время последнего обновления товара
);