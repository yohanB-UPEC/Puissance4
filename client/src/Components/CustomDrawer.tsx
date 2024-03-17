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


function CustomDrawer() {
    const [openConnexion, setOpenConnexion] = useState(false)
    const [openInscription, setOpenInscription] = useState(false)

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
            anchor="left"
        >
        <Typography variant="h6" noWrap component="div" sx={{ p: 2 }}>
            Puissance 4
        </Typography>
        <Divider />
        <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SportsEsportsIcon/>
                </ListItemIcon>
                <ListItemText primary="Jouer" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Groups2Icon/>
                </ListItemIcon>
                <ListItemText primary="Social" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleIcon/>
                </ListItemIcon>
                <ListItemText primary="Mon profile" />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        
        <Box p={2}>
          <Button variant="contained" fullWidth onClick={() => setOpenConnexion(true)}>Se connecter</Button>
          <Button variant="outlined" fullWidth onClick={() => setOpenInscription(true)} sx={{mt: 2}}>S'inscrire</Button>
        </Box>
        
        <Connexion open={openConnexion} onClose={() => setOpenConnexion(false)} />
        <Inscription open={openInscription} onClose={() => setOpenInscription(false)} />
        
      </Drawer>
    )
}

export default CustomDrawer;