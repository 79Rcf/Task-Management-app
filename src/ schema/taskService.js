import pool from '../config/db.js';

export const getTasks = async () => {
    try {
        const res = await pool.query('SELECT * FROM tasks');
        return res.rows;
    } catch (error) {
        throw error;
    }
};

export const createTask = async (title, description, due_date, assigned_to, created_by) => {
    try {
        const res = await pool.query(
            `INSERT INTO tasks (title, description, due_date, assigned_to, created_by) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description, due_date, assigned_to, created_by]
        );
        return res.rows[0];
    } catch (error) {
        throw error;
    }
};

export const updateTaskStatus = async (taskId, status) => {

    try {
        await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, taskId]);
        return { message: `Task ${taskId} updated to ${status}`};
    } catch (error) {
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        return { message: `Task ${taskId} deleted successfully` };
    } catch (error) {
        throw error;
    }
};