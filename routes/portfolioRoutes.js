import express from "express";
import { isProtected } from '../middlewares/authMiddleware.js';
import { isFreelancer } from '../middlewares/freelancerMiddleware.js';
import multer from "multer";
import path from "path";
import { createOrUpdatePortfolio, getAllPortfolio, deletePortfolio } from "../controllers/portfolioController.js";
import fs from "fs";

const router = express.Router();

// storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.post(
  "/portfoliocreate",
  isProtected,
  isFreelancer,
  upload.single("imageUrl"), // 👈 multer middleware
  createOrUpdatePortfolio
);
router.route("/portfolio").get(isProtected, isFreelancer, getAllPortfolio);
router.route("/portfolio/:id").delete(isProtected, isFreelancer, deletePortfolio);

export default router;
