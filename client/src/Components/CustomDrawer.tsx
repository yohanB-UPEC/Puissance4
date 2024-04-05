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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API, { useAuthenticated } from '../API';
import { useSnackbar } from 'notistack';

const drawerWidth = 240;

function CustomDrawer() {
    const location = useLocation();
    const navigate = useNavigate();
    const authentified = useAuthenticated();
    const { enqueueSnackbar } = useSnackbar();

    function logout() {
      API.sendData("/logout", "delete", {}, true)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        API.setTokens(null, null);
        enqueueSnackbar("Vous ètes maintenant déconnecté.", {autoHideDuration: 5000, variant: "success"});
        navigate(location.pathname)
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
    }

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
              <ListItemButton component={Link} to="">
                <ListItemIcon>
                  <SportsEsportsIcon/>
                </ListItemIcon>
                <ListItemText primary="Jouer" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="social">
                <ListItemIcon>
                  <Groups2Icon/>
                </ListItemIcon>
                <ListItemText primary="Social" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="profile">
                <ListItemIcon>
                  <AccountCircleIcon/>
                </ListItemIcon>
                <ListItemText primary="Mon profile" />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        
        {!authentified ? (
          <React.Fragment>
            <Box p={2}>
              <Button component={Link} variant="contained" fullWidth to={location.pathname === "/" ? "connexion" : location.pathname +"/connexion"}>Se connecter</Button>
              <Button component={Link} variant="outlined" fullWidth to={location.pathname === "/" ? "inscription" : location.pathname +"/inscription"} sx={{mt: 2}} >S'inscrire</Button>
            </Box>
          </React.Fragment>
        ) : (
          <Box p={2} sx={{position: 'absolute', bottom: 8, width: "100%"}}>
            <Button variant="contained" color="error" fullWidth onClick={logout}>Se déconnecter</Button>
          </Box>
        )}
        
        <Connexion open={location.pathname.endsWith("/connexion")} onClose={() => navigate(location.pathname.replace("/connexion", ""))} />
        <Inscription open={location.pathname.endsWith("/inscription")} onClose={() => navigate(location.pathname.replace("/inscription", ""))} />
      </Drawer>
    )
}

export default CustomDrawer;