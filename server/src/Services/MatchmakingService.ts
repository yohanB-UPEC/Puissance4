import { Response } from "express";
import prisma from "../Services/client";
import { MatchmakingQueue } from "@prisma/client";

const INTERVAL_TIME = 5000;
let intervalId: NodeJS.Timeout | null = null;


export const SSEResponses: Map<number, Response> = new Map();


export function searchMatchmaking() {
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(async () => {
        console.log("Searching for a match...");
        //trouve tous les joueurs dans la file d'attente qui ne sont pas en proposition
        const playerInQueue = await prisma.matchmakingQueue.findMany({
            where: {
                player: {
                    AND: [
                        {player1Propositions: {none: {}}},
                        {player2Propositions: {none: {}}}
                    ]
                }   
            }
        });

        // récupère toutes les propositions qui existe depuis plus de 15 secondes
        const timeout = new Date(Date.now() - 15000);
        const oldPropositions = await prisma.proposition.findMany({
            where: {
                createdAt: {
                    lte: timeout
                },
                OR: [
                    {player1Accepted: false},
                    {player2Accepted: false}
                ]
            }
        });
        await prisma.proposition.deleteMany({
            where: {
                createdAt: {
                    lte: timeout
                },
                OR: [
                    {player1Accepted: false},
                    {player2Accepted: false}
                ]
            }
        });
        for(const proposition of oldPropositions) {
            let listTimeout = []
            let acceptPlayer = null
            if(proposition.player1Accepted === false) {
                listTimeout.push(proposition.player1Id);
            }else {
                acceptPlayer = proposition.player1Id;
            }
            if(proposition.player2Accepted === false) {
                listTimeout.push(proposition.player2Id);
            }else {
                acceptPlayer = proposition.player2Id;
            }
            
            await prisma.matchmakingQueue.deleteMany({
                where: {
                    playerId: {
                        in: listTimeout
                    }
                }
            });
            if(acceptPlayer) {
                SSEResponses.get(acceptPlayer)?.write(`data: ${JSON.stringify({eventType: "cancelMatch", msg: "L'adversaire proposé n'a pas accepté la partie dans les délais imposés", inQueue: true})}\n\n`);
            }
            for(const player of listTimeout) {
                const sse = SSEResponses.get(player);
                sse?.write(`data: ${JSON.stringify({eventType: "cancelMatch", msg: "Vous n'avez pas accepté la partie dans les délais imposés", inQueue: false})}\n\n`);
                sse?.end();
                SSEResponses.delete(player);
            }
        }
       

        console.log(`Found ${playerInQueue.length} players in queue`);
        if(playerInQueue.length >= 2) {
            for(let i = 0; i+1 < playerInQueue.length; i += 2) {
                const player1 = playerInQueue[i];
                const player2 = playerInQueue[i + 1];

                //TODO: baser la recherche de match sur le elo des joueurs.

                console.log(`Match found between ${player1.playerId} and ${player2.playerId}`);

                // Create proposition
                const proposition = await prisma.proposition.create({
                    data: {
                        player1Id: player1.playerId,
                        player2Id: player2.playerId
                    },
                    include: {
                        player1: true,
                        player2: true
                    }
                });

                let rep = JSON.stringify({
                    eventType: "matchFound",
                    data: {
                        id: proposition.id,
                        time: proposition.createdAt,
                        player1: {
                            id: proposition.player1Id,
                            name: proposition.player1.name
                        },
                        player2: {
                            id: proposition.player2Id,
                            name: proposition.player2.name
                        }
                    }
                });

                SSEResponses.get(player1.playerId)?.write(`data: ${rep}\n\n`);
                SSEResponses.get(player2.playerId)?.write(`data: ${rep}\n\n`);
            }
        }
    }, INTERVAL_TIME);
}
