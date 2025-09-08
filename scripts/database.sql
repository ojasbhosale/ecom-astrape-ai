-- Create database (run this first)
-- CREATE DATABASE ecommerce_db;

-- Connect to the database and run the following:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table (junction table for user-item relationships with quantities)
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_id ON cart_items(item_id);

-- Insert sample data
INSERT INTO items (name, description, category, price) VALUES
('Laptop Pro', 'High-performance laptop for professionals', 'Electronics', 1299.99),
('Wireless Headphones', 'Premium noise-canceling headphones', 'Electronics', 299.99),
('Coffee Maker', 'Automatic drip coffee maker', 'Appliances', 89.99),
('Running Shoes', 'Comfortable athletic shoes', 'Sports', 129.99),
('Backpack', 'Durable travel backpack', 'Accessories', 79.99),
('Smartphone', 'Latest model smartphone', 'Electronics', 899.99),
('Desk Chair', 'Ergonomic office chair', 'Furniture', 249.99),
('Water Bottle', 'Insulated stainless steel bottle', 'Sports', 24.99);
