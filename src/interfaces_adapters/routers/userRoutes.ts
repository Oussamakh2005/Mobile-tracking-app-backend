import { Router } from "express";
import UserController from "../controllers/userController.js";
import UserService from "../../use_cases/services/userServise.js";
import UsersRepository from "../repositories/usersRepository.js";
import prisma from "../../frameworks_drivers/singeltons/prismaClient.js";
import transporter from "../../frameworks_drivers/singeltons/emailTransporter.js";
import EmailAdapter from "../adapters/emailAdapter.js";

const userRouter = Router();

const userController = new UserController(new UserService(new UsersRepository(prisma)),new EmailAdapter(transporter));

//signup : 
userRouter.post("/signup", async (req, res) => userController.singUp(req,res));
//signin :
userRouter.post("/signin", async (req, res) => userController.singIn(req,res));
//verification :
userRouter.get("/verification", async (req, res) => userController.verification(req,res));

export default userRouter;