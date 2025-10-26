// routes/careerRoutes.js
import express from "express";
import {
  showHome,
  showCareerForm,
  getRecommendations,
} from "../controllers/careerController.js";
const router = express.Router();

router.get("/", showHome);
router.get("/career", showCareerForm);
router.post("/career/recommendations", getRecommendations);

export default router;
