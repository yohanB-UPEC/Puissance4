import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import useCreateUserLazy from '../../Fetchs/CreateUser';

interface InscriptionProps {
    open: boolean;
    onClose: () => void;
}

function Inscription({ open, onClose }: InscriptionProps) {
    const [formData, setFormData] = useState({username: "", email: "", password: ""})
    const {data, isLoading, error, createUser, reset} = useCreateUserLazy()
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if(open) {
            setFormData({username: "",email: "", password: ""})
            reset();
        } 
    }, [open])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) : void {
        event.preventDefault();
        createUser(
            formData.username,
            formData.email,
            formData.password
        )
        .then((result) => {
            console.log("Utilisateur créé :", result);
            enqueueSnackbar("Un nouveau compte utilisateur a été créé avec succès.", {autoHideDuration: 5000, variant: "success"});
            onClose();
        })
        .catch((error) => {
            console.error("Erreur lors de la création de l'utilisateur :", error);
        });
    }

    let name_helperText = error?.errors?.find((e: any) => e.path == "name")?.msg;
    let email_helperText = error?.errors?.find((e: any) => e.path == "email")?.msg;
    let password_helperText = error?.errors?.find((e: any) => e.path == "password")?.msg;
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Nous rejoindre</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{p: 2}}>
                <TextField error={!!name_helperText} label="Nom d'utilisateur" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} fullWidth required helperText={name_helperText} />
                <TextField error={!!email_helperText} label="Adresse Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required sx={{mt: 2}} helperText={email_helperText}/>
                <TextField error={!!password_helperText} label="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" fullWidth required sx={{mt: 2}} helperText={password_helperText}/>
                <Button variant="contained" type="submit" sx={{mt: 2, display: "block", mx: "auto"}} disabled={isLoading}>S'inscrire</Button>
            </Box>
        </Dialog>
    );
}

export default Inscription;