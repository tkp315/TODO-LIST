import Router from 'express'
import { upload } from '../middlewares/multer.js';
import { allFolders, folderTasks, login, logout, signup, taskList } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCategory } from '../controllers/category.controller.js';

const userRoute = Router();

userRoute.route("/signup").post(upload.single("avatar"),signup);
userRoute.route("/login").post(login);
userRoute.route("/logout").post(verifyJWT ,logout);
userRoute.route('/tasks').post(verifyJWT ,taskList)
userRoute.route('/folder-tasks').post(verifyJWT ,folderTasks)
userRoute.route('/new-folder').post(verifyJWT ,addCategory)
userRoute.route('/all-folders').post(verifyJWT ,allFolders)

export {userRoute}