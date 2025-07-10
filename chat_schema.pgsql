CREATE DATABASE "sch-chat";

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT 'anon.png',
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'creator')),
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    access_token TEXT,
    rating FLOAT DEFAULT 0
);

CREATE TABLE catalogs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) 
                          ON DELETE CASCADE 
                          ON UPDATE CASCADE,
    catalog_name VARCHAR(255) NOT NULL
);

CREATE TABLE conversation_participants (
    conversation_id VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) 
                           ON DELETE CASCADE 
                           ON UPDATE CASCADE,
    blacklisted BOOLEAN DEFAULT FALSE,
    favorited BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) 
                          ON DELETE CASCADE 
                          ON UPDATE CASCADE,
    conversation_id VARCHAR(50) NOT NULL,
    body TEXT NOT NULL
);

CREATE TABLE catalog_chats (
    catalog_id INTEGER NOT NULL REFERENCES catalogs(id) 
                           ON DELETE CASCADE 
                           ON UPDATE CASCADE,
    conversation_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (catalog_id, conversation_id)
);
