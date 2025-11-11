import pool from '../config/db.js';

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            due_date TIMESTAMP,
            status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo','in-progress','done')),
            assigned_to INTEGER REFERENCES users(id),
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('Tables created successfully');
    } catch (error) {
        console.log('Error creating tables:', error);
    } finally {
        await pool.end();
    }
};

await createTables();