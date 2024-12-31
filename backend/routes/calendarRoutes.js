import { Router } from 'express';
import { newCalendarEvent, getCalendarEvents, deleteCalendarEvent, editCalendarEvent } from '../controllers/calendarController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.get('/events', verifyToken, getCalendarEvents);
router.post('/events', verifyToken, newCalendarEvent);
router.delete('/events/:id', verifyToken, deleteCalendarEvent);
router.put('/events/:id', verifyToken, editCalendarEvent);

export default router;