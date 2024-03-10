import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

interface ConnexionProps {
    open: boolean;
    onClose: () => void;
}

function Connexion({ open, onClose }: ConnexionProps) {
    const [formData, setFormData] = useState({username: "", password: ""})
    useEffect(() => {open && setFormData({username: "", password: ""})}, [open])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) : void {
        event.preventDefault();
        console.log(event)
        onClose();
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Puissance 4</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{p: 2}}>
                <TextField label="Nom d'utilisateur" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} fullWidth required />
                <TextField label="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" fullWidth required sx={{mt: 2}} />
                <Button variant="contained" type="submit" sx={{mt: 2, display: "block", mx: "auto"}} onClick={onClose}>Se connecter</Button>
            </Box>
        </Dialog>
    );
}

export default Connexion;