import UserService from "../../use_cases/services/userServise.js";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { userSchema } from "../../frameworks_drivers/validations/userValidations.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import EmailAdapter from "../adapters/emailAdapter.js";
import User from "../../domain/entities/user.js";
dotenv.config();

class UserController {

    constructor(
        private userService: UserService,
        private emailAdapter: EmailAdapter
    ) { }
    async singUp(req: Request, res: Response) {
        try {
            const validatedData: { email: string, username: string, password: string } = userSchema.parse(req.body);
            try {
                const user = await this.userService.findByEmail(validatedData.email);
                if (user) {
                    return res.status(400).json({
                        ok: false,
                        msg: "this email already in used"
                    });
                }
            } catch {
                //delete when using error handler
                return res.status(500).json({
                    ok: false,
                    msg: "somthing went wrong"
                });
            }
            const phoneId = uuidv4();
            validatedData.password = hashSync(validatedData.password, 10);
            try {
                await this.userService.createUser({ ...validatedData, phoneId });
                //send email
                const result = await this.sendVerificaitonEmail(validatedData.email);
                if (result) {
                    return res.status(201).json({
                        ok: true,
                        msg: "user created check your email for verification"
                    });
                } else {
                    return res.status(500).json({
                        ok: false,
                        msg: "somthing went wrong"
                    });
                }
            } catch (err) {
                //delete when using error handler
                return res.status(500).json({
                    ok: false,
                    msg: "somthing went wrong"
                });
            }
        } catch (err) {
            //delete when using error handler
            res.status(400).json({
                ok: false,
                message: err
            });
        }
    }
    async singIn(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.findByEmail(email);
            if (user && compareSync(password, user.password)) {
                if (req.query.machine === "phone") {
                    return res.status(200).json({
                        ok: true,
                        data: user.phoneId
                    });
                }
                if (!user.isVerified) {
                    const result = await this.sendVerificaitonEmail(email);
                    if (result) {
                        return res.status(200).json({
                            ok: false,
                            msg: "this account not verified please check your email"
                        });
                    } else {
                        return res.status(500).json({
                            ok: false,
                            msg: "somthing went wrong"
                        });
                    }
                }
                const token = this.generateToken({ userId: user.id, phoneId: user.phoneId }, process.env.JWT_SECRET_KEY!);
                return res.status(200).json({
                    ok: true,
                    data: token
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    msg: "user not found"
                });
            }
        } catch (err) {
            //delete when using error handler
            return res.status(500).json({
                ok: false,
                msg: "somthing went wrong"
            });
        }
    }

    async verification(req: Request, res: Response) {
        const token = req.query.token as string;
        if (token) {
            let payload;
            try{
                payload = jwt.verify(token, process.env.VERFICATION_EMAIL_SECRET_KEY!) as { email: string };
            }catch(err){
                //delete when using error handler
                return res.status(400).json({
                    ok: false,
                    msg : "invalid token"
                })
            }
            //const email = payload.email;
            let user: User | null;
            if (payload.email) {
                try {
                    user = await this.userService.findByEmail(payload.email);
                } catch {
                    //delete when using error handler
                    return res.status(500).json({
                        ok: false,
                        msg: "somthing went wrong"
                    });
                }
                if (user) {
                    if (user.isVerified) {
                        return res.status(200).json({
                            ok: true,
                            msg: "user already verified"
                        })
                    } else {
                        try {
                            await this.userService.updateUser(user.id as number, { isVerified: true });
                            return res.status(200).json({
                                ok: true,
                                msg: "user verified",
                            });
                        } catch {
                            //delete when using error handler
                            return res.status(500).json({
                                ok: false,
                                msg: "somthing went wrong"
                            });
                        }
                    }
                } else {
                    return res.status(404).json({
                        ok: false,
                        msg: "user not found"
                    });
                }
            }
        }else{
            return res.status(400).json({
                ok : false,
                msg : "invalid token"
            });
        }
    }

    async sendVerificaitonEmail(email: string) {
        const token = this.generateToken({ email }, process.env.VERFICATION_EMAIL_SECRET_KEY!);
        try {
            await this.emailAdapter.sendEmail({
                from: process.env.APP_EMAIL!,
                to: email,
                subject: "verification email",
                text: `Click here to verify your email : http://localhost:5000/api/user/verification?token=${token}`,
            });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    generateToken(payload: object, secretKey: string): string {
        return jwt.sign(payload, secretKey, { expiresIn: "1h" });
    }
}

export default UserController;