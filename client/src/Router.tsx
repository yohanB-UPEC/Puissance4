import React from 'react';
import * as ReactDOM from "react-dom";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import App from './App';
import Home from './Pages/Home';
import Social from './Pages/Social';
import Profile from './Pages/Profile';
import NotFound from './Pages/NotFound';
import Match from './Pages/Match';


const Router = createBrowserRouter(
    createRoutesFromElements(
        <React.Fragment>
            <Route path="/" element={<App />}>
                <Route path="" element={<Home/>}>
                    <Route path="connexion" element={null}/>
                    <Route path="inscription" element={null}/>
                </Route>
                <Route path=":matchId" element={<Match />} />
                <Route path="social" element={<Social/>}>
                    <Route path="connexion" element={null}/>
                    <Route path="inscription" element={null}/>
                </Route>
                <Route path="profile" element={<Profile/>}>
                    <Route path="connexion" element={null}/>
                    <Route path="inscription" element={null}/>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </React.Fragment>
    )
);

export default Router;