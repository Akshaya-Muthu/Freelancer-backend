import Task from '../models/taskModel.js';
//start job task
export const startJobTask = async (req,res)=>{
    const {taskId} = req.params;
    const loggedInUserId = req.user._id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

   
    if (task.assigned_user_id.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this task' });
    }

        task.status = 'in-progress';
        await task.save();
        res.status(200).json({message: 'Task status updated to in-progress', task});
    } catch (error) {
        console.error("Error starting job task:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

//get all my tasks
export const getAllMyTasks = async (req, res) => {
  const loggedInUserId = req.user._id;
  try{
    const tasks = await Task.find({ assigned_user_id: loggedInUserId })
      .populate('job_id')
      .populate('assigned_user_id', 'name email');

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    res.status(200).json(tasks);
  } catch (error) { 
  console.error("Error fetching tasks:", error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
}
};  



export const submitTask = async (req, res) => {
  const {taskId}  = req.params;
  console.log("Task ID:", taskId);
  const loggedInUserId = req.user._id;
  const { submitted_external_link, submission_note } = req.body;
const submitted_file_url = req.file?.path;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assigned_user_id.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this task' });
    }

    if(!submitted_external_link && !submitted_file_url){
      return res.status(400).json({message:"Please provide either a  external link or file"})
    }

    task.status = 'done';
    task.submitted_external_link = submitted_external_link || '';
    task.submission_note = submission_note || '';
    task.submitted_file_url = submitted_file_url || '';
    console.log(task)

    await task.save();
    res.status(200).json({ message: 'Task submitted successfully', task });
  } catch (error) {
    console.error("Error submitting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId)
      .populate('job_id', 'title description deadline') // populate job info
      .populate('assigned_user_id', 'name email'); // optional, if you want user info

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
