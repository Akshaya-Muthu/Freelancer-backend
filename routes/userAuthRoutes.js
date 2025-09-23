import express from 'express';
import { isProtected } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
const router = express.Router();
import { registerUser, loginUser, logoutUser ,forgotPassword,resetPassword, changePassword} from '../controllers/userAuthController.js';
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/change-password').post(isProtected,changePassword);
router.route('/logout').get(logoutUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);

export default router;
