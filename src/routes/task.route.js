import Router from 'express'
import { sessionTime, verifyJWT } from '../middlewares/auth.middleware.js';
import { editTask, isFinished, newTask, removeTask } from '../controllers/task.controller.js';


const taskRouter = Router();

taskRouter.route('/add-new-task').post(sessionTime,verifyJWT,newTask)
taskRouter.route('/editTask').post(sessionTime,verifyJWT,editTask);
taskRouter.route('/removeTask').post(sessionTime,verifyJWT,removeTask);
taskRouter.route('/completed').post(sessionTime,verifyJWT,isFinished);

export {taskRouter}