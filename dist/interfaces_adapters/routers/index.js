import { Router } from "express";
import userRouter from "./userRoutes.js";
const mainRouter = Router();
//user router :
mainRouter.use('/user', userRouter);
export default mainRouter;
