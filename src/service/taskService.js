import { pool } from '../config/db.js';

export const getTasks = async () => {
    let client;
    try {
        console.log('getTasks service called - acquiring database client...');
        client = await pool.connect();
        console.log('Database client acquired');

        console.log('Executing SQL query...');
        const result = await client.query(`
            SELECT 
                t.*,
                u1.username as created_by_username,
                u2.username as assigned_to_username
            FROM tasks t
            LEFT JOIN users u1 ON t.created_by = u1.id
            LEFT JOIN users u2 ON t.assigned_to = u2.id
            ORDER BY t.created_at DESC
        `);
        
        console.log(`Query successful, found ${result.rows.length} tasks`);
        
        return {
            success: true,
            data: result.rows,
            count: result.rows.length
        };
    } catch (error) {
        console.error('DATABASE ERROR in getTasks service:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error detail:', error.detail);
        console.error('Error hint:', error.hint);
        console.error('Error position:', error.position);
        console.error('Full error:', error);
        
        throw new Error('Failed to fetch tasks from database');
    } finally {
        if (client) {
            client.release();
            console.log(' Database client released');
        }
    }
};

export const createTask = async ({ title, description, due_date, assigned_to, created_by }) => {
    let client;
    try {
      client = await pool.connect();
  
      const result = await client.query(
        `INSERT INTO tasks (title, description, due_date, assigned_to, created_by, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING *`,
        [title, description, due_date, assigned_to, created_by]
      );
  
      return {
        success: true,
        message: 'Task created successfully',
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Database error creating task:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
  
      throw new Error(`Database error: ${error.message}`);
    } finally {
      if (client) client.release();
    }
  };

export const updateTaskStatus = async (taskId, status) => {
    try {
       
        const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const result = await pool.query(
            `UPDATE tasks 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
            [status, taskId]
        );

        if (result.rows.length === 0) {
            throw new Error('Task not found');
        }

        return {
            success: true,
            message: 'Task status updated successfully',
            data: result.rows[0]
        };
    } catch (error) {
        console.error('Error in updateTaskStatus service:', error);
        throw error; 
    }
};

export const deleteTask = async (taskId) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING id',
            [taskId]
        );

        if (result.rows.length === 0) {
            throw new Error('Task not found');
        }

        return {
            success: true,
            message: 'Task deleted successfully',
            deletedTaskId: result.rows[0].id
        };
    } catch (error) {
        console.error('Error in deleteTask service:', error);
        throw new Error('Failed to delete task from database');
    }
};


export const getTaskById = async (taskId) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.*,
                u1.username as created_by_username,
                u2.username as assigned_to_username
            FROM tasks t
            LEFT JOIN users u1 ON t.created_by = u1.id
            LEFT JOIN users u2 ON t.assigned_to = u2.id
            WHERE t.id = $1
        `, [taskId]);

        if (result.rows.length === 0) {
            throw new Error('Task not found');
        }

        return {
            success: true,
            data: result.rows[0]
        };
    } catch (error) {
        console.error('Error in getTaskById service:', error);
        throw error;
    }
};

export const getUserTasks = async (userId) => {
    try {
        const result = await pool.query(`
            SELECT * FROM tasks 
            WHERE created_by = $1 OR assigned_to = $1 
            ORDER BY created_at DESC
        `, [userId]);

        return {
            success: true,
            data: result.rows,
            count: result.rows.length
        };
    } catch (error) {
        console.error('Error in getUserTasks service:', error);
        throw new Error('Failed to fetch user tasks');
    }
};

export const completeTask = async (taskId) => {
    try {
        const result = await pool.query(
            `UPDATE tasks 
             SET status = 'completed', updated_at = CURRENT_TIMESTAMP, completed_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [taskId]
        );
 
        if (result.rows.length === 0) {
            throw new Error('Task not found');
        }
 
        return {
            success: true,
            message: 'Task marked as completed',
            data: result.rows[0]
        };
    } catch (error) {
        console.error('Error in completeTask service:', error);
        throw error;
    }
 };
 