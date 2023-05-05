import express from 'express';
import { generateRecipe, recipeIdeas } from './controller.js';
const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).send({
    success: true,
  });
});

router.post('/recipeideas', recipeIdeas);
router.post('/generaterecipe', generateRecipe);

export default router;
