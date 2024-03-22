
const API = {
    url: "http://localhost:3000",
    sendData: (url: string, method: string, data: any): Promise<any> => {
        return fetch(`${API.url}${url}`, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
            
        });
    }
}

export default API;