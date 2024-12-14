import { Router } from 'express';
import { editToDo, createToDo, getToDos, getToDoById, deleteToDo } from '../controllers/toDoController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

/* when a POST request is made to /create it first goes through verifytoken middleware
verifyToken applied at route level, modifies request object and this is passed to controller file later */
router.post('/', verifyToken, createToDo);
router.get('/', verifyToken, getToDos);
router.get('/:id', verifyToken, getToDoById);
router.put('/:id', verifyToken, editToDo);
router.delete('/:id', verifyToken, deleteToDo);

export default router;