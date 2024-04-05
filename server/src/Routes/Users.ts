import express, {Request, Response} from "express";
import prisma from "../Services/client";
import { body, validationResult } from 'express-validator';
import { generateAccessToken, generateRefreshToken, validateToken } from "../Services/Token";
import { User } from "@prisma/client";
import jwt from 'jsonwebtoken';
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

        const existingUser : User | null = await prisma.user.findUnique({
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

router.post("/login", [
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("password").isString().notEmpty()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: "Erreur lors de la tentative de connexion", errors: errors.array()});
    }

    try {
        const {email, password} = req.body;

        const user : User | null = await prisma.user.findUnique({
            where: {
                email: email as string
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({msg: "Email ou mot de passe incorrect"});
        }

        const accessToken = generateAccessToken({userId: user.id});
        const refreshToken = generateRefreshToken({userId: user.id});

        // Save the refresh token in the database
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: refreshToken as string
            }
        });

        res.json({accessToken: accessToken, refreshToken: refreshToken});
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error", error: error});
    }
})

router.post("/refreshToken", [
    body("refreshToken").isString().notEmpty()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: "Erreur lors de la tentative de rafraichissement du token", errors: errors.array()});
    }

    try {
        let {refreshToken} = req.body;
        // Check if the refresh token is valid
        const user : User | null = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken
            }
        });

        if (!user) {
            return res.status(400).json({msg: "Token invalide"});
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err: any, user2: any) => {
            if(err) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        refreshToken: null
                    }
                });
                return res.status(403).send("Invalid token")
            }else {
                const accessToken = generateAccessToken({userId: user.id});
                refreshToken = generateRefreshToken({userId: user.id});

                // Save the refresh token in the database
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        refreshToken: refreshToken as string
                    }
                });
                res.json({accessToken: accessToken, refreshToken: refreshToken});
            }
        })  
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error", error: error});
    }
})

router.delete("/logout", validateToken, async (req: any, res: Response) => {
    try {
        // Remove the refresh token from the database
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            }
        });
        if (!user) {
            return res.status(403).json({msg: "Invalid token"});
        }
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: null
            }
        });

        await prisma.matchmakingQueue.deleteMany({
            where: {
                playerId: user.id
            }
        });
        res.json({msg: "User Logged Out Successfully"});
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error", error: error});
    }
})

router.get("/me", validateToken, async (req: any, res: Response) => {
    try {
        const user: any = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        if (!user) {
            return res.status(403).json({msg: "Invalid token"});
        }
        res.json(user);
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal Server Error", error: error});
    }
})

export default router;