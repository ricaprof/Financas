import { addComment, getCommentsByCompany } from '../Controllers/comments.js';
import express from "express";
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments/:companyId
router.get('/get/:companyId', getCommentsByCompany);

// POST /api/comments/:companyId
router.post('/post/:companyId', addComment);

export default router;
