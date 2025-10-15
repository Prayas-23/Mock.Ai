import express from 'express'

import {Router} from 'express'
import { generateQuestions, checkRoleAndTopic} from '../controller/interview.controller.js';
import {createCompanyInterview, sendAllInterviews, searchInterviews, generateInterviewQuestions, evaluateInterviewResult, getAllCandidates} from '../controller/companyInterview.controller.js'
import { verifySupabaseToken } from '../middleware/authBypass.js';

const router = Router();

import { optionalAuth } from '../middleware/authBypass.js';

// Routes with optional authentication (for development)
router.post("/generate-question", optionalAuth, generateQuestions);
router.post("/checkRoleAndTopic", optionalAuth, checkRoleAndTopic);
router.post("/create-companyInterview", optionalAuth, createCompanyInterview);
router.post("/getAll-Interviews", optionalAuth, sendAllInterviews);
router.post("/search-Interviews", optionalAuth, searchInterviews);
router.post("/generateInterviewQuestions", optionalAuth, generateInterviewQuestions);
router.post("/evaluateInterviewResult", optionalAuth, evaluateInterviewResult);
router.post("/getAllCandidates", optionalAuth, getAllCandidates );

export default router;
























