import express from 'express';
import { getMyNotifications } from '../controllers/notificationController.js';
import { isProtected } from '../middlewares/authMiddleware.js';
import { isFreelancer } from '../middlewares/freelancerMiddleware.js';
const router = express.Router()

router.route("/").get(isProtected,isFreelancer,getMyNotifications)
export default router;