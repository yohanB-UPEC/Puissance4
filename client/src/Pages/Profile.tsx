import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import useGetAllMatch from '../Fetchs/GetAllMatch';
import { useAuthenticated } from '../API';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useGetMe from '../Fetchs/getMe';
import { DataResponse } from '../Fetchs/GetMatch';
import Puissance4 from '../Components/Puissance4';


interface MiniPuissance4Props {
    data: number[][];
}
const MiniPuissance4: React.FC<MiniPuissance4Props> = ({data}) => {

    return (
        <Box sx={{display: "flex", background: "#306fbb", borderRadius: 5, p:1, overflow: "hidden"}}>
            {data.map((colonne, i) => (
                <Box key={i}>
                    {[...colonne].reverse().map((cell, j) => (
                        <Box sx={{background: "#306fbb", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}} key={j}>
                            <Box sx={{
                                borderRadius: "50%", width: "80%", height: "80%", 
                                background: cell === 0 ? "#b5b5b5" : (cell === 1 ? "yellow" : "red"), 
                                cursor: "pointer"}}></Box>
                        </Box>
                    ))}
                </Box>
            ))}
            
        </Box>
    )
}

export default function Profile() {
    const { data, isLoading, error } = useGetAllMatch();
    const isAuth = useAuthenticated();
    const me = useGetMe();
    const location = useLocation();


    if(error && !isAuth) {
        if(!location.pathname.endsWith("/connexion")) {
            return <Navigate to="connexion" replace={true} />
        }
    }else if(isAuth && location.pathname.endsWith("/connexion")) {
        return <Navigate to={location.pathname.replace("/connexion", "")} replace={true} />
    }

    console.log(data)
    return (
        <Box sx={{width: "100%", p:4}}>
            { data && me.data ? (
                <React.Fragment>
                    <Typography variant="h3" component="h3" sx={{textAlign: "center" }}>Votre profile: {me.data?.name}</Typography>
                    <Grid container rowSpacing={2} mt={4}>
                        {data.map((match: DataResponse) => (
                            <Grid item key={match.id} xs={12} sx={{p: 2, backgroundColor: "white", borderRadius: "5px 5px 5px 5px", mt: 4, display: "flex"}}>
                                <MiniPuissance4 data={match.boardState}/>
                                <Box sx={{flexGrow: 1, ml: 2, p: 4}}>
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Box sx={{border: "1px solid black", display: "flex", justifyContent: "space-between", p:1, transition: "box-shadow 0.3s", boxShadow: (match?.currentPlayer == 1) ? "10px 5px 5px #306fbb" : null}}>
                                            <Box sx={{borderRadius: "50%", backgroundColor: "yellow", height: 25, width: 25, mr: 1}}></Box>
                                            <Box sx={{fontSize: 18, fontWeight: "bold"}}>{match.player1.name}</Box>
                                        </Box>
                                        <Typography px={4}>VS</Typography>
                                        <Box sx={{border: "1px solid black", display: "flex", justifyContent: "space-between", p:1, transition: "box-shadow 0.3s", boxShadow: (match?.currentPlayer == 2) ? "10px 5px 5px #306fbb" : null}}>
                                            <Box sx={{borderRadius: "50%", backgroundColor: "red", height: 25, width: 25, mr: 1}}></Box>
                                            <Box sx={{fontSize: 18, fontWeight: "bold"}}>{match.player2.name}</Box>
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" sx={{mt: 2}}>{match.winnerId == match.player1Id ? match.player1.name : match.player2.name} a gagné !</Typography>
                                    <Typography variant="h5" sx={{mt: 2}}>Match n°{match.id}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography variant="h3" component="h3" noWrap sx={{ p: 2, textAlign: "center" }}>Il faut être connecté pour acceder à cette page</Typography>
                </React.Fragment>
            )}
        </Box>
    )
}