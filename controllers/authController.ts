import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/authService.js";

export class UserController {
    private userService = new UserService();

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({ error: "name, email and password are required" });
                return;
            }

            const newUser = await this.userService.createUser(email, name, password);

            // strip password if the repo ever returns it
            const { password: _pw, ...safeUser } = newUser as any;

            res.status(201).json({ message: "User created successfully", data: safeUser });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: "email and password are required" });
                return;
            }

            const user = await this.userService.loginUser(email, password);

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: "7d" }
            );

            res.status(200).json({
                message: "Login successful",
                data: { user, token },
            });
        } catch {
            // same message for "no user" and "wrong password" — prevents enumeration
            res.status(401).json({ error: "Invalid credentials" });
        }
    };
}