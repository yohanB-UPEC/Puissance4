import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import { DataResponse } from '../Fetchs/GetMatch';
import { Typography } from '@mui/material';

interface Puissance4Props {
    play?: (i: number) => void; // Fonction pour jouer un coup
    boardInfo?: DataResponse; // Etat du plateau de jeu
  }

const Puissance4 : React.FC<Puissance4Props> = ({ play, boardInfo }) => {
    const [data, setData] = useState<number[][]>(Array.from({ length: 7 }, () => Array(6).fill(0)));
    const [player, setPlayer] = useState<number>(1);

    useEffect(() => {
        if(boardInfo) {
            setData(boardInfo.boardState);
        }
    }, [boardInfo])

    function handleClick(i: number) {
        if(play) {
            play(i);
            return;
        }
        const newData = data.slice();
        let havePlayed = false;
        for (let k = 0; k < 6; k++) {
            if (newData[i][k] === 0) {
                newData[i][k] = player;
                havePlayed = true;
                break;
            }
        }
        if(!havePlayed) return;

        setData(newData);
        setPlayer(player === 1 ? 2 : 1);
    }


    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{border: "1px solid black", minWidth: 200, display: "flex", justifyContent: "space-between", p:1, transition: "box-shadow 0.3s", boxShadow: (boardInfo?.currentPlayer == 1 || (!boardInfo && player == 1)) ? "10px 5px 5px #306fbb" : null}}>
                    <Box sx={{borderRadius: "50%", backgroundColor: "yellow", height: 50, width: 50, mr: 1}}></Box>
                    <Box sx={{fontSize: 30, fontWeight: "bold"}}>{boardInfo ? boardInfo.player1.name : "Joueur 1"}</Box>
                </Box>
                <Box sx={{border: "1px solid black", minWidth: 200, display: "flex", justifyContent: "space-between", p:1, transition: "box-shadow 0.3s", boxShadow: (boardInfo?.currentPlayer == 2 || (!boardInfo && player == 2)) ? "10px 5px 5px #306fbb" : null}}>
                    <Box sx={{borderRadius: "50%", backgroundColor: "red", height: 50, width: 50, mr: 1}}></Box>
                    <Box sx={{fontSize: 30, fontWeight: "bold"}}>{boardInfo ? boardInfo.player2.name : "Joueur 2"}</Box>
                </Box>
            </Box>
            {boardInfo?.winnerId && (
                <Typography variant="h4" align="center" sx={{mt: 2}}>{boardInfo.winnerId == boardInfo.player1Id ? boardInfo.player1.name : boardInfo.player2.name} a gagné !</Typography>
            )}
            <Box sx={{display: "flex", background: "#306fbb", borderRadius: 5, p:1, overflow: "hidden", mt: 3}}>
                {data.map((colonne, i) => (
                    <Box key={i} onClick={() => handleClick(i)}>
                        {[...colonne].reverse().map((cell, j) => (
                            <Box sx={{background: "#306fbb", width: 80, height: 80, display: "flex", justifyContent: "center", alignItems: "center"}} key={j}>
                                <Box sx={{
                                    borderRadius: "50%", width: "80%", height: "80%", 
                                    background: cell === 0 ? "#b5b5b5" : (cell === 1 ? "yellow" : "red"), 
                                    cursor: "pointer"}}></Box>
                            </Box>
                        ))}
                    </Box>
                ))}
                
            </Box>
        </Box>
    )
}

export default Puissance4;