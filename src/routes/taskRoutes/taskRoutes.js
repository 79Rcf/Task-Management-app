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

/* testing purpose */
/* 
import express from 'express';
import { 
    getTasks, 
    createTask, 
    updateTaskStatus, 
    deleteTask 
} from '../../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
 */