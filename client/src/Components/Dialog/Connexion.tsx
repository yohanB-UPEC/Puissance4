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

interface ConnexionProps {
    open: boolean;
    onClose: () => void;
}

function Connexion({ open, onClose }: ConnexionProps) {
    const [formData, setFormData] = useState({email: "", password: ""})
    const location = useLocation();
    const {data, isLoading, error, loginUser, reset} = useLoginUserLazy()
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if(open) {
            setFormData({email: "", password: ""})
            reset();
        }
    }, [open])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) : void {
        event.preventDefault();
        loginUser(
            formData.email,
            formData.password
        )
        .then((result) => {
            console.log("Utilisateur connecté :", result);
            API.setTokens(result.accessToken, result.refreshToken);
            enqueueSnackbar("Vous ètes maintenant connecté.", {autoHideDuration: 5000, variant: "success"});
            onClose();
            window.location.reload();
        })
        .catch((error) => {
            console.error("Erreur lors de la connexion de l'utilisateur :", error);
        });
    }

    let email_helperText = error?.errors?.find((e: any) => e.path == "email")?.msg;
    let password_helperText = error?.errors?.find((e: any) => e.path == "password")?.msg;
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Puissance 4</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{p: 2}}>
                {error && (<Typography variant="body2" sx={{color: "red", textAlign: "center", pb: 3, mt: -3}}>{error?.msg}</Typography>)}
                <TextField error={!!error} label="Adresse mail" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required helperText={email_helperText} />
                <TextField error={!!error} label="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" fullWidth required sx={{mt: 2}} helperText={password_helperText} />
                <Button variant="contained" type="submit" sx={{mt: 2, display: "block", mx: "auto"}} disabled={isLoading}>Se connecter</Button>
                <Typography variant="body2" sx={{mt: 2, textAlign: "center"}}>Pas encore de compte ? <Link to={location.pathname.replace("connexion", "inscription")}>S'inscrire</Link></Typography>
            </Box>
        </Dialog>
    );
}

export default Connexion;