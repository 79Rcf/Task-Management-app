import * as taskService from '../service/taskService.js';

export const getTasks = async (req, res) => {
    try {
      const tasks = await taskService.getTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Get tasks controller error:', error);
      res.status(500).json({
        message: 'Error fetching tasks',
        error: error.message
      });
    }
  };
 
  export const getTasksById = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Valid task ID is required' });
    }
  
    try {
      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      console.error('Get task by ID controller error:', error);
      res.status(500).json({
        message: 'Error fetching task by ID',
        error: error.message
      });
    }
  };
  
  export const createTask = async (req, res) => {
    console.log('creating task');
    const { title, description, due_date, assigned_to } = req.body;
    const created_by = req.user?.id;
  
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
  
    if (!created_by) {
      return res.status(401).json({ message: 'User authentication required' });
    }
  
    try {
      const result = await taskService.createTask({
        title,
        description,
        due_date,
        assigned_to,
        created_by
      });
  
      res.status(201).json(result);
    } catch (error) {
      console.error('Create task controller error:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
  
      res.status(500).json({
        message: 'Error creating task',
        error: error.message
      });
    } finally {
      console.log('created tasks ended');
    }
  };

export const updateTaskStatus = async (req, res) => { 
    const { id } = req.params;
    const { status } = req.body;


    if (!status) {
        return res.status(400).json({ 
            message: 'Status is required' 
        });
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
    }

    try {
        const result = await taskService.updateTaskStatus(id, status);
        res.status(200).json(result);
    } catch (error) {
        console.error('Update task status controller error:', error);
        
        if (error.message === 'Task not found') {
            return res.status(404).json({ 
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Error updating task status', 
            error: error.message 
        });
    }
}; 

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ 
            message: 'Valid task ID is required' 
        });
    }

    try {
        const result = await taskService.deleteTask(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete task controller error:', error);
        
        if (error.message === 'Task not found') {
            return res.status(404).json({ 
                message: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Error deleting task', 
            error: error.message 
        });
    }
}; 

export const  completeTask = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Valid task ID is required' });
    }
     try {
        const result = await taskService.completeTask(id);
        res.status(200).json(result);
     } catch (error) {
       res.status(500).json({ 
        message: 'Error completing this task', 
        error: error.message 
       });
     }
};
