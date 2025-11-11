import pool from '../config/db.js';

const seedData = async () => {
    try {
        await pool.query(`
        INSERT INTO users (username, email, password_hash) VALUES
        ('Alice', 'alice@example.com', 'hashedpassword1'),
        ('Bob', 'bob@example.com', 'hashedpassword2'),
        ('Charlie', 'charlie@example.com', 'hashedpassword3')
        ON CONFLICT (email) DO NOTHING;
        `);

        await pool.query(`
        INSERT INTO tasks (title, description, due_date, status, assigned_to, created_by) VALUES
        ('Task 1', 'Description 1', NOW() + INTERVAL '1 day', 'todo', 1, 1),
        ('Task 2', 'Description 2', NOW() + INTERVAL '2 days', 'in-progress', 2, 1),
        ('Task 3', 'Description 3', NOW() + INTERVAL '3 days', 'done', 3, 2)
        ON CONFLICT (title) DO NOTHING;
        `);
        console.log('sample data inserted successfully');
    } catch (error) {
        console.log('Error inserting sample data:', error);
    } finally {
        await pool.end();
    }
}
await seedData();