import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

interface InscriptionProps {
    open: boolean;
    onClose: () => void;
}

function Inscription({ open, onClose }: InscriptionProps) {
    const [formData, setFormData] = useState({username: "", email: "", password: ""})
    useEffect(() => {open && setFormData({username: "",email: "", password: ""})}, [open])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) : void {
        event.preventDefault();
        console.log(event)
        onClose();
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Nous rejoindre</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{p: 2}}>
                <TextField label="Nom d'utilisateur" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} fullWidth required />
                <TextField label="Adresse Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} fullWidth required sx={{mt: 2}} />
                <TextField label="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" fullWidth required sx={{mt: 2}} />
                <Button variant="contained" type="submit" sx={{mt: 2, display: "block", mx: "auto"}} onClick={onClose}>S'inscrire</Button>
            </Box>
        </Dialog>
    );
}

export default Inscription;