import {Router} from 'express'
import { optionalAuth } from '../middleware/authBypass.js'
import {checkRoleAndTopicQuiz} from '../controller/quiz.controller.js'

const router = Router();

// Quiz routes with optional authentication
router.post('/generate-quiz-questions', optionalAuth, checkRoleAndTopicQuiz);

// Test route
router.get('/test', (req, res) => {
  console.log('Quiz test route hit');
  res.json({ message: 'Quiz route working' });
});

export default router;




















