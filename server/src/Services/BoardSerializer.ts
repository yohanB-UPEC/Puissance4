import { empty } from "@prisma/client/runtime/library";
import { Response } from "express";

// keys are marchId, values are the list of viewers for that match
export const SSEMatch: Map<number, Response[]> = new Map();

export function pushSSE(matchId: number, res: Response) {
    if (!SSEMatch.has(matchId)) {
        SSEMatch.set(matchId, [res]);
    } else {
         SSEMatch.get(matchId)?.push(res);
    }
}

export function removeSSE(matchId: number, res: Response) {
    if (!SSEMatch.has(matchId)) {
        return;
    }
    const viewers = SSEMatch.get(matchId) || [];
    const index = viewers?.indexOf(res) || -1;
    if (index !== -1) {
        viewers?.splice(index, 1);
    }
    if (viewers?.length === 0) {
        SSEMatch.delete(matchId);
    }else {
        SSEMatch.set(matchId, viewers);
    }

}

type BoardState = string;

// Fonction pour sérialiser l'état du plateau de jeu à partir d'une grille 2D
export function serializeBoardState(board: number[][]): BoardState {
  return board.map(row => row.join('')).join('|');
}

// Fonction pour désérialiser l'état du plateau de jeu en une grille 2D.
export function deserializeBoardState(boardState: BoardState): number[][] {
    return boardState.split('|').map(row => row.split('').map(cell => parseInt(cell)));
}

export function checkWinner(board: number[][]): number {
    // Check vertical
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 2; j++) {
            if (board[i][j] !== 0 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3]) {
                return board[i][j];
            }
        }
    }

    // Check horizontal
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] !== 0 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j]) {
                return board[i][j];
            }
        }
    }

    // Check diagonal
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3]) {
                return board[i][j];
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 3; j < 6; j++) {
            if (board[i][j] !== 0 && board[i][j] === board[i + 1][j - 1] && board[i][j] === board[i + 2][j - 2] && board[i][j] === board[i + 3][j - 3]) {
                return board[i][j];
            }
        }
    }

    return 0;
}

export const emptyBoard: number[][] = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];