import React, {useState, useEffect} from 'react'
import API from '../API'
import { DataResponse } from './GetMatch';

interface GetAllMatchResponse {
    data: DataResponse[] | null;
    isLoading: boolean;
    error: any | null;
}

export default function useGetAllMatch(): GetAllMatchResponse {
    const [data, setData] = useState<DataResponse[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    function deserializeBoardState(boardState: string): number[][] {
        return boardState.split('|').map(row => row.split('').map(cell => parseInt(cell)));
    }

    useEffect(() => {
        if(isLoading) return;
        setIsLoading(true);
        API.sendData("/match/player/"+API.getUserId(), "GET", undefined, false).then(response => {
            if (!response.ok) {
                setError(response);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data2 => {
            setData([...data2.map((match: any) => ({...match, boardState: deserializeBoardState(match.boardState)}))]);
        }).catch(error => {
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    return {data, isLoading, error};
}