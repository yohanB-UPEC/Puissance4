import express, {Request, Response} from "express";
import prisma from "../Services/client";
import { body, validationResult } from 'express-validator';
import { validateToken } from "../Services/Token";
import { User, MatchmakingQueue } from "@prisma/client";
import { SSEResponses } from "../Services/MatchmakingService";
import { emptyBoard, serializeBoardState } from "../Services/BoardSerializer";

const router = express.Router();

router.post('/matchmaking', validateToken,async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;

        const existingQueueElement : MatchmakingQueue | null = await prisma.matchmakingQueue.findUnique({
            where: {
                playerId: userId
            }
        });
        if (existingQueueElement) {
            return res.status(200).json({
                msg: "Joueur déjà dans la file d'attente",
                time: existingQueueElement.createdAt
            });
        }

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
        await prisma.proposition.deleteMany({
            where: {
                OR: [
                    {player1Id: userId},
                    {player2Id: userId}
                ]
            }
        });
        const sse = SSEResponses.get(userId);
        if(sse) {
            sse.end();
            SSEResponses.delete(userId);
        }
        res.status(200).json({msg: "Joueur retiré de la file d'attente"});
    } catch (error) {
        console.error('Erreur lors du retrait du joueur de la file d\'attente :', error);
        res.status(500).json({msg: 'Une erreur est survenue lors du retrait du joueur de la file d\'attente'});
    }
});

router.get('/matchmaking/events', validateToken, async (req: any, res: Response) => {
    const userId = req.user.userId;
    const queueElement = await prisma.matchmakingQueue.findUnique({
        where: {
            playerId: userId
        }
    });
    if (!queueElement) {
        return res.status(403).json({msg: "Vous n'êtes pas dans la file d'attente"});
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    SSEResponses.set(userId, res);
    

    req.on('close', () => {
        SSEResponses.delete(userId);
    });
});

// route pour accepter ou refuser une proposition
router.post('/matchmaking/proposition', [
    validateToken,
    body("idProposition").notEmpty().isNumeric().toInt(),
    body("accept").notEmpty().isBoolean().toBoolean()
], async (req: any, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: "Erreur lors de la création de l'utilisateur", errors: errors.array()});
    }

    const { idProposition, accept } = req.body;
    const userId = req.user.userId;

    const proposition = await prisma.proposition.findUnique({
        where: {
            id: idProposition
        }
    });

    if (!proposition) {
        return res.status(404).json({msg: "Proposition non trouvée"});
    }

    if (proposition.player1Id !== userId && proposition.player2Id !== userId) {
        return res.status(403).json({msg: "Vous n'êtes pas concerné par cette proposition"});
    }


    if(accept == false) {
        await prisma.proposition.delete({
            where: {
                id: idProposition
            }
        });
        await prisma.matchmakingQueue.delete({
            where: {
                playerId: userId
            }
        });
        if(proposition.player1Id !== userId) {
            SSEResponses.get(proposition.player1Id)?.write(`data: ${JSON.stringify({eventType: "cancelMatch", msg: "L'adversaire proposé à refusé la partie", inQueue: true})}\n\n`);
        }else {
            SSEResponses.get(proposition.player2Id)?.write(`data: ${JSON.stringify({eventType: "cancelMatch", msg: "L'adversaire proposé à refusé la partie", inQueue: true})}\n\n`);
        }
        return res.status(200).json({msg: "Vous avez refusé la propositon", eventType:"cancelMatch"});
    }else if (proposition.player1Accepted === false && proposition.player2Accepted === false) {
        if (userId === proposition.player1Id) {
            await prisma.proposition.update({
                where: {
                    id: idProposition
                },
                data: {
                    player1Accepted: accept
                }
            });
        } else {
            await prisma.proposition.update({
                where: {
                    id: idProposition
                },
                data: {
                    player2Accepted: accept
                }
            });
        }
        return res.status(200).json({msg: "Proposition acceptée", eventType: "waitPlayer"});
    }else if((proposition.player1Accepted == true && proposition.player1Id != userId) || (proposition.player2Accepted == true && proposition.player2Id != userId)) {
        console.log("Proposition accepté, création de la partie")
        // création de la partie
        const match = await prisma.match.create({
            data: {
                player1Id: proposition.player1Id,
                player2Id: proposition.player2Id,
                boardState: serializeBoardState(emptyBoard),
                currentPlayer: 1,
            }
        });

        const sse = SSEResponses.get(proposition.player1Id != userId ? proposition.player1Id : proposition.player2Id); 
        if(sse) {
            console.log("notification du joueur : CreateGame")
            sse.write(`data: ${JSON.stringify({eventType: "createGame", id: match.id})}\n\n`);
            sse.end();
            SSEResponses.delete(proposition.player1Id != userId ? proposition.player1Id : proposition.player2Id);
        }
        
        await prisma.matchmakingQueue.deleteMany({
            where: {
                playerId: {
                    in: [proposition.player1Id, proposition.player2Id]
                }
            }
        });
        await prisma.proposition.delete({
            where: {
                id: idProposition
            }
        });

        return res.status(200).json({msg: "Proposition acceptée, création de la partie", eventType: "createGame", id: match.id});
    }

});

export default router;
