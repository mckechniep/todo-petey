import { Router } from 'express';
import { newCalendarEvent, getCalendarEvents } from '../controllers/calendarController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.get('/events', verifyToken, getCalendarEvents);
router.post('/events', verifyToken, newCalendarEvent);

export default router;