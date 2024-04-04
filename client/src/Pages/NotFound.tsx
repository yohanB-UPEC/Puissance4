import React from 'react';
import '../Styles/NotFound.css'
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {

    return (
        <Box sx={{textAlign: "center", margin: "auto", backgroundColor: "white", p: 4}}>
            {/*copie le style du composant d'en dessous mais avec materia ui*/}  
            <Box component="div" className="images_404">
                <Typography variant="h1" noWrap sx={{ fontFamily: 'Arvo, serif' }}>404</Typography>
            </Box>
            <Box sx={{marginTop: "-40px"}}>
                <Typography variant="h3" noWrap sx={{ fontFamily: 'Arvo, serif' }}>Look like you're lost</Typography>
                <Typography variant="body1" noWrap sx={{ fontFamily: 'Arvo, serif', fontSize: "1.2em" }}>the page you are looking for not avaible!</Typography>
                <Link to="/" className="link_404">Go to Home</Link>
            </Box>
        </Box>
    )
}