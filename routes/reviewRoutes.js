import express from 'express';
import { freelancerReview, adminReview,getUserReviews } from '../controllers/reviewController.js';
import { isProtected } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/freelancer/:jobId').post(isProtected,freelancerReview);
router.route('/admin/:jobId').post(isProtected,adminReview);
router.route('/user/:userId').get(isProtected,getUserReviews);

export default router;
