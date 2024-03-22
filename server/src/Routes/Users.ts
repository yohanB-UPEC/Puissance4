import express, {Request, Response} from "express";
import prisma from "../client";
import { body, validationResult } from 'express-validator';
const bcrypt = require ('bcrypt')

const router = express.Router();

router.post("/createuser", [
    body("name").isString().notEmpty(),
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("password").isString().notEmpty()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: "Erreur lors de la création de l'utilisateur", errors: errors.array()});
    }
    try {
        const {name, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email as string
            }
        });
        if (existingUser) {
            return res.status(400).json({ errors: [{ location: "body", msg: "L'adresse email est déjà utilisé", path: "email", type: "field", value: email}] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name: name as string,
                email: email as string,
                password: hashedPassword as string
            }
        });
        res.json({msg: "User Created Successfully"});
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error", error: error});
    }
});

export default router;