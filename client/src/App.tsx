import React from 'react';
import CustomDrawer from './Components/CustomDrawer';
import { Box } from '@mui/material';
import Puissance4 from './Components/Puissance4';
import RightDrawer from './Components/RightDrawer';

function App() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: "#9b9b9b" }}>
        <CustomDrawer />
        <Box sx={{width: "100%", display: "flex", justifyContent: "center", p:4}}>
          <Puissance4/>
        </Box>
        <RightDrawer />
    </Box>
  );
}

export default App;
