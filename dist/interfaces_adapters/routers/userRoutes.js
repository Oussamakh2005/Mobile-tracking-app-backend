import { Router } from "express";
import UserController from "../controllers/userController.js";
import UserService from "../../use_cases/services/userServise.js";
import UsersRepository from "../repositories/usersRepository.js";
import prisma from "../../frameworks_drivers/singeltons/prismaClient.js";
const userRouter = Router();
const userController = new UserController(new UserService(new UsersRepository(prisma)));
//signup : 
userRouter.post("/signup", async (req, res) => userController.singUp(req, res));
//signin :
userRouter.post("/signin", async (req, res) => userController.singIn(req, res));
export default userRouter;
