import React, {useState} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Groups2Icon from '@mui/icons-material/Groups2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import Connexion from './Dialog/Connexion';
import Inscription from './Dialog/Inscription';

const drawerWidth = 240;


function RightDrawer() {

    return (
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="permanent"
            anchor="right"
        >     
        <Box p={2}>
          <Button variant="contained" fullWidth>Matchmaking</Button>
          <Button variant="outlined" fullWidth sx={{mt: 2}}>Jouer contre un amis</Button>
        </Box>
      </Drawer>
    )
}

export default RightDrawer;