import React from 'react';
import { Box } from '@mui/material';
import Puissance4 from '../Components/Puissance4';
import RightDrawer from '../Components/RightDrawer';
import { Outlet } from 'react-router-dom';
import API from '../API';

export default function Home() {

    
    return (
        <React.Fragment>
            <Box sx={{width: "100%", display: "flex", justifyContent: "center", p:4}}>
                <Puissance4/>
            </Box>
            <Outlet />
            <RightDrawer />
        </React.Fragment>
    )
}