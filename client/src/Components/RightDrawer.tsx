import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { Button, IconButton } from '@mui/material';
import Connexion from './Dialog/Connexion';
import Inscription from './Dialog/Inscription';
import CancelIcon from '@mui/icons-material/Cancel';
import API from '../API';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import MatchmakingConfirmation from './Dialog/MatchmakingConfirmation';
import { useSnackbar } from 'notistack';

const drawerWidth = 240;


function RightDrawer() {
    const [inQueue, setInQueue] = useState({state: false,loading: false, time: 0});
    const [confirmationDialog, setConfirmationDialog] = useState<{
      open: boolean;
      data: any;
      response: number;
    }>({open: false, data: null, response: 0});// 0: en attente, 1: accepté, 2: refusé
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
      let intervalId: any = null;
      if(inQueue.state) {
        intervalId = setInterval(() => {
          setInQueue({state: inQueue.state, loading: inQueue.loading, time: inQueue.time + 1000});
        }, 1000);
      } else {
        console.log("clear interval")
        clearInterval(intervalId);
      }
      return () => clearInterval(intervalId);
    }, [inQueue])

    function startMatchmaking() {
      setInQueue({state: false, loading: true, time: 0});
      API.sendData("/matchmaking", "POST", {}, true).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then((data) => {
        setInQueue({state: true, loading: false, time: new Date().getTime() - new Date(data.time).getTime()});
        API.eventSource("/matchmaking/events", {
          onmessage: (event: any) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if(data.eventType === "matchFound") {
              setConfirmationDialog({open: true, data: data.data, response: 0});
            }else if(data.eventType === "createGame") {
              startGame(data);
            }else if(data.eventType === "cancelMatch") {
              setConfirmationDialog({open: false, data: null, response: 0});
              if(!data.inQueue) {
                setInQueue({state: false, loading: false, time: 0});
              }
              enqueueSnackbar(data.msg, {autoHideDuration: 5000, variant: "error"});
            }
          },
          onerror: (event: any) => {
            throw event;
          }
        });
      }).catch((error) => {
        console.error("Erreur lors du matchmaking :", error);
        setInQueue({state: false, loading: false, time: 0});
      });
    }

    function cancelMatchmaking() {
      if(!inQueue.state) return;
      setInQueue({state: inQueue.state, loading: true, time: inQueue.time});
      API.sendData("/matchmaking", "DELETE", {}, true).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then(() => {
        setInQueue({state: false, loading: false, time: 0});
      }).catch((error) => {
        console.error("Erreur lors de l'annulation du matchmaking :", error);
        setInQueue({state: inQueue.state, loading: false, time: inQueue.time});
      });
    }

    function handleMatchmakingConfirmation(res: boolean) {
      API.sendData("/matchmaking/proposition", "POST", {idProposition: confirmationDialog?.data?.id, accept: res}, true).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then((data) => {
        if(data.eventType == "createGame"){
          startGame(data);
        }else if(data.eventType == "waitPlayer") {
          setConfirmationDialog({...confirmationDialog, response: 1});
        }else if(data.eventType == "cancelMatch") {
          setConfirmationDialog({open: false, data: null, response: 0});
          setInQueue({state: false, loading: false, time: 0});
          enqueueSnackbar("Vous avez refusé la proposition de partie.", {autoHideDuration: 5000, variant: "error"});
        }
      }).catch((error) => {
        console.error("Erreur lors de la réponse à la proposition de matchmaking :", error);
        setConfirmationDialog({open: false, data: null, response: 0});
      });
    }

    function startGame(data:any) {
      console.log("Creation de la partie", data);
      setConfirmationDialog({open: false, data: null, response: 0});
      setInQueue({state: false, loading: false, time: 0});
      enqueueSnackbar("La partie va commencer.", {autoHideDuration: 5000, variant: "success"});
    }

    let content = null;
    if(inQueue.state) {
      content = (
        <Box sx={{border: "1px solid black", py: 2}}>
          <IconButton aria-label="cancel" size="small" sx={{position: "absolute", right: "20px", top: "20px"}} onClick={cancelMatchmaking}>
            <CancelIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h6" align="center">{new Date(inQueue.time).toISOString().substr(14, 5)}</Typography>
          <Typography variant="h6" align="center">En attente d'un adversaire</Typography>
        </Box>
      )
    } else {
        content = (
          <React.Fragment>
            <Button variant="contained" fullWidth disabled={inQueue.loading} onClick={startMatchmaking}>Matchmaking</Button>
            <Button variant="outlined" fullWidth sx={{mt: 2}}>Jouer contre un amis</Button>
          </React.Fragment>
        )
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
            anchor="right"
        >     
        <Box p={2}>
          {content}
        </Box>
        <MatchmakingConfirmation data={confirmationDialog.data} open={confirmationDialog.open} onClose={handleMatchmakingConfirmation} state={confirmationDialog.response} />
      </Drawer>
    )
}

export default RightDrawer;