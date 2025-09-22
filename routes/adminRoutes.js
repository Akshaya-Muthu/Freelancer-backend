import express from 'express';
import { isProtected } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import {
  createOrUpdateProfile,
  getMyProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import { createTask,approveTask,rejectTask ,deleteTask, getAllTasksForJob,getAllTasks,editTask} from '../controllers/adminController.js';
const router = express.Router();


router.route("/client-profile").get(isProtected, isAdmin, getMyProfile);
router.route("/clientprofilecreate").post(isProtected, isAdmin,createOrUpdateProfile)


router.route("/create-task").post(isProtected, isAdmin,createTask)
router.route('/delete-task/:taskId').delete(isProtected, isAdmin, deleteTask);
router.route("/edit-task/:taskId").put(isProtected, isAdmin, editTask);
router.route("/approve-task/:taskId").put(isProtected, isAdmin, approveTask);
router.route("/reject-task/:taskId").put(isProtected, isAdmin, rejectTask);
router.route("/job/:jobId/tasks").get(isProtected, isAdmin,getAllTasksForJob);
router.route("/tasks").get(isProtected, isAdmin, getAllTasks);

export default router;