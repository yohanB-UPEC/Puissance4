import React, {useState} from 'react'
import Box from '@mui/material/Box';

function Puissance4() {
    const [data, setData] = useState(Array(7).fill(Array(6).fill(0)));
    const [player, setPlayer] = useState(1);

    function handleClick(i: number) {
        const newData = data.slice();
        console.log(newData)
        let play = false;
        for (let k = 0; k < 6; k++) {
            if (newData[i][k] === 0) {
                newData[i][k] = player;
                play = true;
                break;
            }
        }
        if(!play) return;

        setData(newData);
        setPlayer(player === 1 ? 2 : 1);
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{border: "1px solid black", display: "flex", justifyContent: "space-between", p:1, boxShadow: player === 1 ? "10px 5px 5px #306fbb" : null}}>
                    <Box sx={{borderRadius: "50%", backgroundColor: "yellow", height: 50, width: 50, mr: 1}}></Box>
                    <Box sx={{fontSize: 30, fontWeight: "bold"}}>Joueur 1</Box>
                </Box>
                <Box sx={{border: "1px solid black", display: "flex", justifyContent: "space-between", p:1, boxShadow: player === 2 ? "10px 5px 5px #306fbb" : null}}>
                    <Box sx={{borderRadius: "50%", backgroundColor: "red", height: 50, width: 50, mr: 1}}></Box>
                    <Box sx={{fontSize: 30, fontWeight: "bold"}}>Joueur 2</Box>
                </Box>
            </Box>
            <Box sx={{display: "flex", background: "#306fbb", borderRadius: 5, p:1, overflow: "hidden", mt: 3}}>
                {Array(7).fill(0).map((_, i) => (
                    <Box key={i} onClick={() => handleClick(i)}>
                        {Array(6).fill(0).map((_, j) => (
                            <Box sx={{background: "#306fbb", width: 80, height: 80, display: "flex", justifyContent: "center", alignItems: "center"}} key={j}>
                                <Box sx={{borderRadius: "50%", width: "80%", height: "80%", background: data[i][j] === 0 ? "#b5b5b5" : (data[i][j] === 1 ? "yellow" : "red"), cursor: "pointer"}}></Box>
                            </Box>
                        ))}
                    </Box>
                ))}
                
            </Box>
        </Box>
    )
}

export default Puissance4;