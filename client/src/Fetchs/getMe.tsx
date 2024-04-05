import React, {useState, useEffect} from 'react'
import API from '../API'
import { DataResponse } from './GetMatch';

interface UserResponse {
    id: number;
    name: string;
    email: string;
}

interface GetMeResponse {
    data: UserResponse | null;
    isLoading: boolean;
    error: any | null;
}

export default function useGetMe(): GetMeResponse {
    const [data, setData] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        if(isLoading) return;
        setIsLoading(true);
        API.sendData("/me", "GET", undefined, true).then(response => {
            if (!response.ok) {
                setError(response);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data2 => {
            setData({...data2});
        }).catch(error => {
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    return {data, isLoading, error};
}