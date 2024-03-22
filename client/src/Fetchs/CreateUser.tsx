import React, {useState, useEffect} from 'react'
import API from '../API'

interface CreateUserResponse<T> {
    data: T | null;
    isLoading: boolean;
    error: any | null;
    createUser: (name: String, email: String, password: String) => Promise<any>;
    reset: () => void;
}

function useCreateUserLazy<T>(): CreateUserResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    async function createUser(name : String, email: String, password: String) : Promise<any> {
        setIsLoading(true);
        try {
            const response = await API.sendData("/createuser", "POST", {name, email, password})
            if (!response.ok) {
                setError(await response.json());
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setData(data); 
            return data;
        }catch(error : any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    function reset() {
        setData(null);
        setIsLoading(false);
        setError(null);
    }

    return {data, isLoading, error, createUser, reset};
}

export default useCreateUserLazy;