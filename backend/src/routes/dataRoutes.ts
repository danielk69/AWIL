import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import {
  getThemes,
  getSubthemes,
  getCategories,
  getRandomName,
  getAllData,
  importData,
  addTheme,
  addSubtheme,
  addCategory,
  addName,
  deleteName
} from '../controllers/dataController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Public routes
router.get('/themes', getThemes);
router.get('/themes/:themeId/subthemes', getSubthemes);
router.get('/subthemes/:subthemeId/categories', getCategories);
router.get('/categories/:categoryId/random-name', getRandomName);

// Protected routes (admin only)
router.get('/all', authenticateToken, getAllData);
router.post('/import', authenticateToken, upload.single('file'), importData);
router.post('/themes', authenticateToken, addTheme);
router.post('/subthemes', authenticateToken, addSubtheme);
router.post('/categories', authenticateToken, addCategory);
router.post('/names', authenticateToken, addName);
router.delete('/names/:id', authenticateToken, deleteName);

export default router; 