import express, {Request, Response} from "express";
import prisma from "../Services/client";
import { body, validationResult } from 'express-validator';
import { validateToken } from "../Services/Token";
import { SSEMatch, checkWinner, deserializeBoardState, pushSSE, removeSSE, serializeBoardState } from "../Services/BoardSerializer";

const router = express.Router();


router.get('/match/:id?', async (req: any, res: Response) => {
    try {
        const {id} = req.params;
        const matches = await prisma.match.findMany({
            where: id && {
                id: parseInt(id)
            },
            include: {
                player1: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                player2: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        if(id) {
            if(matches.length === 0) {
                return res.status(404).json({msg: 'Match non trouvé'});
            }
            return res.status(200).json(matches[0]);
        }

        res.status(200).json(matches);
    } catch (error) {
        console.error('Erreur lors de la récupération des matches :', error);
        res.status(500).json({msg: 'Une erreur est survenue lors de la récupération des matches'});
    }
});


router.get('/match/player/:id', async (req: any, res: Response) => {
    try {
        const {id} = req.params;
        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    {player1Id: parseInt(id)},
                    {player2Id: parseInt(id)}
                ]
            },
            include: {
                player1: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                player2: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        res.status(200).json(matches);
    } catch (error) {
        console.error('Erreur lors de la récupération des matches :', error);
        res.status(500).json({msg: 'Une erreur est survenue lors de la récupération des matches'});
    }
});

// route to play a move in a match
router.post('/match/play', validateToken, [
    body('matchId').isInt().toInt(),
    body('move').isInt({min: 0, max: 6}).toInt()
], async (req: any, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: "Erreur lors de la création de l'utilisateur", errors: errors.array()});
    }

    const userId = req.user.userId;
    const {matchId, move} = req.body;

    const match = await prisma.match.findUnique({
        where: {
            id: matchId
        }
    });

    if(!match) {
        return res.status(404).json({msg: 'Match non trouvé'});
    }

    if(match.player1Id !== userId && match.player2Id !== userId) {
        return res.status(403).json({msg: 'Vous ne pouvez pas jouer dans ce match'});
    }

    if(match.end) {
        return res.status(403).json({msg: 'Le match est déjà terminé'});
    }

    if((match.currentPlayer == 1 && match.player1Id !== userId) || (match.currentPlayer == 2 && match.player2Id !== userId)) {
        return res.status(403).json({msg: 'Ce n\'est pas votre tour'});
    }

    const board = deserializeBoardState(match.boardState);
    let didIPlay = false;
    for(let i = 0; i < board[move].length; i++) {
        if(board[move][i] === 0) {
            board[move][i] = match.currentPlayer;
            didIPlay = true;
            break;
        }
    }
    if(!didIPlay) {
        return res.status(403).json({msg: 'Impossible de jouer ce coup'});
    }

    const winner = checkWinner(board);

    const newMatch = await prisma.match.update({
        where: {
            id: matchId
        },
        data: {
            boardState: serializeBoardState(board),
            currentPlayer: match.currentPlayer === 1 ? 2 : 1,
            end: winner !== 0,
            winnerId: winner === 1 ? match.player1Id : (winner === 2 ? match.player2Id : undefined)
        }
    });

    const sseData = {id: newMatch.id, boardState: newMatch.boardState, currentPlayer: newMatch.currentPlayer, winnerId: newMatch.winnerId, end: newMatch.end};
    const viewers = SSEMatch.get(matchId) || [];
    for(const viewer of viewers) {
        viewer.write(`data: ${JSON.stringify(sseData)}\n\n`);
    }

    res.status(200).json({msg: 'Move played successfully'});
});

// sse match
router.get('/match/:id/events', async (req: any, res: Response) => {
    const {id} = req.params;
    const match = await prisma.match.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if(!match) {
        return res.status(404).json({msg: 'Match non trouvé'});
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    pushSSE(match.id, res);

    req.on('close', () => {
        removeSSE(match.id, res);
    });
});

export default router;