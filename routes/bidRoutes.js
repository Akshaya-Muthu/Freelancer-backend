import express from 'express';
const router = express.Router();
import { isProtected } from '../middlewares/authMiddleware.js';
import { isFreelancer } from '../middlewares/freelancerMiddleware.js';
import { getMyBids, submitBid,getBidsByJobId,acceptBid,getJobsWithBids , getAllBids} from '../controllers/bidController.js';
import {isAdmin} from '../middlewares/adminMiddleware.js';
router.route('/submitbid/:jobId').post(isProtected, isFreelancer, submitBid);
router.route('/mybids').get(isProtected, isFreelancer, getMyBids);

router.route("/job/:jobId").get(isProtected, isAdmin,getBidsByJobId);
router.route("/jobs/with-bids").get(isProtected, isAdmin, getJobsWithBids);
router.route("/:bidId/accept").put(isProtected, isAdmin, acceptBid);
router.route('/bids').get(isProtected, isAdmin, getAllBids);
export default router;