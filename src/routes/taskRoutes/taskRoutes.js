import express from 'express';
import { 
    getTasks, 
    createTask, 
    updateTaskStatus, 
    deleteTask 
} from '../../controllers/taskController.js';
import { protect } from '../../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

export default router;
