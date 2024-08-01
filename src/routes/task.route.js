import Router from 'express'
import { sessionTime, verifyJWT } from '../middlewares/auth.middleware.js';
import { editTask, isFinished, newTask, removeTask } from '../controllers/task.controller.js';


const taskRouter = Router();

taskRouter.route('/add-new-task').post(verifyJWT,newTask)
taskRouter.route('/editTask').post(verifyJWT,editTask);
taskRouter.route('/removeTask').post(verifyJWT,removeTask);
taskRouter.route('/completed').post(verifyJWT,isFinished);

export {taskRouter}