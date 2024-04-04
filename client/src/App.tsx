import React from 'react';
import CustomDrawer from './Components/CustomDrawer';
import { Box } from '@mui/material';
import Puissance4 from './Components/Puissance4';
import RightDrawer from './Components/RightDrawer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: "#9b9b9b", minHeight: "100vh" }}>
        <CustomDrawer />
        <Outlet />
    </Box>
  );
}

export default App;
