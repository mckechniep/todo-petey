import { Router } from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { newEntry, getEntries, getEntryById, editEntry, deleteEntry } from '../controllers/journalController.js';

const router = Router();

router.post('/', verifyToken, newEntry);
router.get('/', verifyToken, getEntries);
router.get('/:id', verifyToken, getEntryById);
router.put(':/id', verifyToken, editEntry);
router.delete('/:id', verifyToken, deleteEntry);
router.delete('/bulk-delete', verifyToken, deleteEntry);

export default router;