import { pool } from '../config/db.js';

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
                status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
                assigned_to INTEGER REFERENCES users(id),
                created_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        `);
        
        console.log('Tables created successfully');
        
        await addTestData();
        
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error; 
    }

};

const addTestData = async () => {
    try {

        const userResult = await pool.query(`
            INSERT INTO users (username, email, password) 
            VALUES ('testuser', 'test@example.com', 'hashed_password_here')
            ON CONFLICT (username) DO NOTHING
            RETURNING id
        `);
  
        await pool.query(`
            INSERT INTO tasks (title, description, created_by) 
            SELECT 'Test Task', 'This is a test task', id 
            FROM users WHERE username = 'testuser'
            ON CONFLICT DO NOTHING
        `);
        
        console.log('Test data added successfully');
    } catch (error) {
        console.error(' Error adding test data:', error);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    await createTables();
}

export { createTables, addTestData };