import { access } from "fs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


let accessToken: string | null = localStorage.getItem("accessToken") || null;
let refreshToken: string | null = localStorage.getItem("refreshToken") || null;


function setTokens(accessToken2: string | null, refreshToken2: string | null) {
    accessToken = accessToken2;
    refreshToken = refreshToken2;
    localStorage.setItem("accessToken", accessToken || "");
    localStorage.setItem("refreshToken", refreshToken || "");
}

async function requestRefreshToken() : Promise<boolean> {
    if(!refreshToken || refreshToken === "") {
        return false;
    }
    const rep = await fetch(`${API.url}/refreshToken`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({refreshToken})
    })
    
    if(!rep.ok) {
        console.log(rep)
        return false;
    }

    const data = await rep.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
}

const API = {
    url: "http://localhost:3000",
    sendData: (url: string, method: string, data: any, authenticated: boolean = false): Promise<any> => {
        return fetch(`${API.url}${url}`, {
            method: method,
            headers: {
                "Content-Type": "application/json", 
                "authorization": authenticated ? `Bearer ${accessToken}` : "",
            },
            body: JSON.stringify(data),
            
        });
    },
    setTokens: setTokens,
    async isAuth() : Promise<boolean> {
        if(!accessToken || accessToken === "") {
            return requestRefreshToken();
        }
        const token = jwtDecode(accessToken);
        console.log(token.exp, Date.now() / 1000)
        if(!token || !token.exp || token.exp < Date.now() / 1000) {
            return requestRefreshToken();
        }
        return true; 
    }
}

export function useAuthenticated() {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    useEffect(() => {
        API.isAuth().then((result) => {
            setIsAuth(result);
        })
    }, [accessToken])
    return isAuth;
}

export default API;