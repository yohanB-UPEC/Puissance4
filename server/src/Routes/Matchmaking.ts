import express, {Request, Response} from "express";
import prisma from "../Services/client";
import { body, validationResult } from 'express-validator';
import { validateToken } from "../Services/Token";
import { User, MatchmakingQueue } from "@prisma/client";

const router = express.Router();

router.post('/matchmaking', validateToken,async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const queueElement = await prisma.matchmakingQueue.create({
            data: { 
                playerId: userId
            }
        });
        res.status(200).json({
            msg: "Joueur ajouté à la file d'attente",
            time: queueElement.createdAt
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du joueur à la file d\'attente :', error);
        res.status(500).json({msg: 'Une erreur est survenue lors de l\'ajout du joueur à la file d\'attente'});
    }
});

router.delete('/matchmaking', validateToken, async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        await prisma.matchmakingQueue.deleteMany({
            where: {
                playerId: userId
            }
        });
        res.status(200).json({msg: "Joueur retiré de la file d'attente"});
    } catch (error) {
        console.error('Erreur lors du retrait du joueur de la file d\'attente :', error);
        res.status(500).json({msg: 'Une erreur est survenue lors du retrait du joueur de la file d\'attente'});
    }
  });

export default router;
