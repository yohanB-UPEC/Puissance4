import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useLoginUserLazy from '../../Fetchs/LoginUser';
import API from '../../API';

interface ConfirmationProps {
    data: any;
    open: boolean;
    state: number;
    onClose: (res: boolean) => void;
}

export default function MatchmakingConfirmation({ data, open, state, onClose }: ConfirmationProps) {

    return (
        <Dialog onClose={() => (data?.response == 0) && onClose(false)} open={open}>
            <DialogTitle>Un adversaire a été trouvé !</DialogTitle>
            {data && state == 0 ? (
                <Box sx={{p: 2}}>
                    <Typography variant="body1" sx={{textAlign: "center"}}>Partie: {data.player1.name} VS {data.player2.name}</Typography>
                    <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                        <Button variant="contained" sx={{mr: 2}} onClick={() => onClose(true)}>Accepter</Button>
                        <Button variant="contained" color="error" sx={{ml: 2}} onClick={() => onClose(false)}>Refuser</Button>
                    </Box>
                </Box>
            ) : data && state == 1 && (
                <Box sx={{p: 2}}>
                    <Typography variant="body1" sx={{textAlign: "center"}}>Partie: {data.player1.name} VS {data.player2.name}</Typography>
                    <Typography variant="body1" sx={{textAlign: "center"}}>En attente de la réponse de l'adversaire...</Typography>
                    <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                        <Button variant="contained" sx={{mr: 2}} disabled>Accepté !</Button>
                    </Box>
                </Box>
            )}
        </Dialog>
    )
}    