import express from 'express'
import { checkRoleValidity } from '../controller/profileInterview.controller.js';
import { verifySupabaseToken } from '../middleware/authBypass.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Profile interview routes with Supabase authentication
router.post('/checkRoleValidity', verifySupabaseToken, upload.single("file"), checkRoleValidity);

export default router
























