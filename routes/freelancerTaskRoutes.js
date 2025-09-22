import express from 'express';
import { isProtected } from '../middlewares/authMiddleware.js';
import { isFreelancer } from '../middlewares/freelancerMiddleware.js';
import {
    createOrUpdateProfile,
    getMyProfile,
    getAllFreelancers,
    createEducation,
    createQualification,
    createExperience,
    getExperience,
    getQualification,
    getEducation
} from "../controllers/freelancerProfileController.js";
import { startJobTask,getAllMyTasks, submitTask,getTaskById } from '../controllers/freelancerTasksController.js';
import upload from '../middlewares/uploadMiddleware.js'
const router = express.Router();
router.route("/serchfilter").get(isProtected,  getAllFreelancers);
router.route("/client-profile").get(isProtected, isFreelancer, getMyProfile);
router.route("/clientprofilecreate").post(isProtected, isFreelancer,createOrUpdateProfile)
router.route("/geteducation").get(isProtected, isFreelancer, getEducation);
router.route("/createeducation").post(isProtected, isFreelancer,createEducation)
router.route("/getexperience").get(isProtected, isFreelancer, getExperience);
router.route("/createexperience").post(isProtected, isFreelancer,createExperience)

router.route("/getqualification").get(isProtected, isFreelancer, getQualification);
router.route("/createqualification").post(isProtected, isFreelancer,createQualification)

router.route('/:taskId/start').put(isProtected, isFreelancer, startJobTask);
router.route('/my-tasks').get(isProtected, isFreelancer, getAllMyTasks);
router.get('/:id', isProtected, isFreelancer, getTaskById);

router.route('/submit/:taskId').put(isProtected, isFreelancer, upload.single('file'), submitTask);
export default router;
