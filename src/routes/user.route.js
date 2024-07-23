import Router from 'express'
import { upload } from '../middlewares/multer.js';
import { login, logout, signup, taskList } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const userRoute = Router();

userRoute.route("/signup").post(upload.single("avatar"),signup);
userRoute.route("/login").post(login);
userRoute.route("/logout").post(verifyJWT,logout);
userRoute.route('/tasks').post(verifyJWT,taskList)



export {userRoute}