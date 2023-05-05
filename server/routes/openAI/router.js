import express from "express";
import { recipeIdeas } from "./controller.js";
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send({
    success: true,
  });
});

router.post("/recipeideas", recipeIdeas);

export default router;
