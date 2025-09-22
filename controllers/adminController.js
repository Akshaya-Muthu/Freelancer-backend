import Task from '../models/taskModel.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';
import {sendEmail} from '../utils/email.js';
import Notification from '../models/notificationModel.js';

export const createTask = async (req, res) => {
    const { title, description, job_id } = req.body;
    console.log("Received jobId:", job_id);

    try {
        const job = await Job.findById(job_id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const assignedUserId = job.assignedFreelancer;

        if (!assignedUserId) {
            return res.status(400).json({ message: 'No freelancer assigned to this job yet' });
        }
       
        const newTask = await Task.create({
            title,
            description,
            job_id: job_id,
            assigned_user_id: assignedUserId
        });
        const freelancer = await User.findById(assignedUserId);
        //await sendEmail(
            //freelancer.email,
  //'You’ve been assigned a new task!',
 // `Hi ${freelancer.name},\n\nYou have been assigned a new task: "${title}".\n\nPlease login to your dashboard to get started.\n\n- Freelancing SaaS`
       // );

        await Notification.create({
  user: assignedUserId,
  message: `You’ve been assigned a new task: "${title}"`,
  link: `/tasks/${newTask._id}`,
});
        return res.status(201).json({ message: 'Task created successfully', task: newTask });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
//delete task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}
export const editTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update only provided fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;

        const updatedTask = await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Approve Task
export const approveTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).populate('assigned_user_id'); // populate to get freelancer info
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== 'done') {
      return res.status(400).json({ message: "Task is not submitted yet" });
    }

    // Update task status
    task.status = 'approved';
    await task.save();

    const freelancer = task.assigned_user_id; 

    // Send email
    //await sendEmail(
      //freelancer.email,
     // "Your task has been approved!",
    //  `Congratulations ${freelancer.name},\n\nYour task "${task.title}" has been approved.\n\n- Freelancing SaaS`
  //  );

    // Create notification
    await Notification.create({
      user: freelancer._id,
      message: `Your task "${task.title}" has been approved!`,
      link: `/tasks/${task._id}`,
    });

    res.status(200).json({ message: "Task approved!!" });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


//reject task
export const rejectTask = async (req, res)=>{
    const {taskId} = req.params;
    const {rejection_note} = req.body;
    try{
        const task = await Task.findById(taskId).populate('assigned_user_id');
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.status!=='done'){
            return res.status(400).json({message:"Task is not submitted yet"});
        }

        task.status="rejected";
        task.rejection_note = rejection_note || '';
        await task.save();
       const freelancer= task.assigned_user_id;
        //await sendEmail(
            //freelancer.email,
            //"Your task has been rejected",
            //`Hi ${freelancer.name},\n\nYour task "${task.title}" has been rejected.\n\nRejection Note: ${rejection_note}\n\n- Freelancing SaaS`
       // );

        await Notification.create({
            user: freelancer._id,
            message: `Your task "${task.title}" has been rejected!`,
            link: `/tasks/${task._id}`
        });

        res.status(200).json({message:"Task rejected!!", task});

    }catch(error){
        console.error("Error rejecting task:", error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

//get all task for a job for admin
export const getAllTasksForJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const tasks = await Task.find({ job_id: jobId }).populate('assigned_user_id', 'name email');
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this job' });
        }
        return res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};