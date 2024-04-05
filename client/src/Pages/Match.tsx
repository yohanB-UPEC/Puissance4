import React from 'react';
import { Box } from '@mui/material';
import Puissance4 from '../Components/Puissance4';
import RightDrawer from '../Components/RightDrawer';
import { Outlet, useParams } from 'react-router-dom';
import API, { useAuthenticated } from '../API';
import useGetMatch from '../Fetchs/GetMatch';
import NotFound from './NotFound';

export default function Match() {
    const {matchId} = useParams();
    const {data, isLoading, error} = useGetMatch(matchId);
    const isAuth = useAuthenticated();

    console.log(data)
    function play(move: number) {
        if (!isAuth) {
            console.error("Erreur lors du coup : pas d'utilisateur connecté");
            return;
        }
        const userId = API.getUserId();
        
        if(data?.end) {
            console.log("La partie est terminée");
            return;
        }

        if((data?.currentPlayer == 1 && userId != data?.player1Id) || (data?.currentPlayer == 2 && userId != data?.player2Id)) {
            console.log("Ce n'est pas à vous de jouer")
            return;
        }

        if(data?.boardState[move].every(cell => cell !== 0)) {
            console.log("Colonne pleine");
            return;
        }

        API.sendData("/match/play", "POST", {matchId: Number(matchId), move}, true).then(response => {
            if (!response.ok) {
                console.error("Erreur lors du coup :", response);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            console.log("Coup joué :", data);
        }).catch(error => {
            console.error("Erreur lors du coup :", error);
        });
    }

    return (
        error ? (
            <NotFound/>
        ) : (
            <Box sx={{width: "100%", display: "flex", justifyContent: "center", p:4}}>
                <Puissance4 play={ play } boardInfo={data}/>
            </Box>
        )
    )
}