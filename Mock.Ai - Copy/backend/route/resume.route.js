import {Router} from 'express'
import { optionalAuth } from '../middleware/authBypass.js'
import {createResume, getResumes, editResume} from '../controller/resume.controller.js'

const router = Router();

// Resume routes with optional authentication
router.post('/create-resume', optionalAuth, createResume);
router.post('/get-resumes', optionalAuth, getResumes);
router.post('/edit-resume', optionalAuth, editResume);

export default router;

