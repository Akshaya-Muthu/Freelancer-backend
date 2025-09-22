import express from 'express';
const router = express.Router();
import { createJob,getJobs, updateJob,deleteJob,getOpenJobs,jobDetails,markJobAsCompleted,totaljobs,getInProgressJobs } from '../controllers/jobsController.js';
import {isAdmin} from '../middlewares/adminMiddleware.js';
import {isProtected} from '../middlewares/authMiddleware.js';

router.route('/createjob').post(isProtected,isAdmin,createJob);

router.route('/jobs').get(isProtected,isAdmin,getJobs);

router.route('/job/:id').put(isProtected,isAdmin,updateJob);

router.route('/job/:id').delete(isProtected,isAdmin,deleteJob);
router.route('/openjobs').get(getOpenJobs);
router.route('/inprogressjobs').get(isProtected,isAdmin,getInProgressJobs);

router.route('/job/:id').get(jobDetails); 
router.route('/job/:jobId/complete').put(isProtected, isAdmin, markJobAsCompleted); 
router.route('/totaljobs').get(isProtected, isAdmin, totaljobs);
export default router;
