import React, {useState, useEffect} from 'react'
import API from '../API'

export interface DataResponse {
    id: number;
    player1Id: number;
    player2Id: number;
    boardState: number[][];
    currentPlayer: number;
    winnerId: number | null;
    createdAt: string;
    updatedAt: string;
    end: boolean;
    player1: {
        id: number;
        name: string;
    };
    player2: {
        id: number;
        name: string;
    };
}

interface GetMatchResponse {
    data: DataResponse | null;
    isLoading: boolean;
    error: any | null;
}

function useGetMatch<T>(matchId:any): GetMatchResponse {
    const [data, setData] = useState<DataResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    function deserializeBoardState(boardState: string): number[][] {
        return boardState.split('|').map(row => row.split('').map(cell => parseInt(cell)));
    }



    useEffect(() => {
        if(!matchId || isLoading) return;
        setIsLoading(true);
        API.sendData("/match/"+matchId, "GET", undefined, false).then(response => {
            if (!response.ok) {
                setError(response);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data2 => {
            setData({...data2, boardState: deserializeBoardState(data2.boardState)});
            API.eventSource("/match/"+matchId+"/events", {
                onmessage: (event: any) => {
                  const data3 = JSON.parse(event.data);
                  setData({...data2, ...data3, boardState: deserializeBoardState(data3.boardState)})
                },
                onerror: (event: any) => {
                  throw event;
                }
            });
        }).catch(error => {
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    return {data, isLoading, error};
}

export default useGetMatch;