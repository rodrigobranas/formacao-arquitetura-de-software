import axios from "axios";

export default interface HttpClient {
    get (url: string): Promise<any>;
    post (url: string, body: any, headers: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        const response = await axios.get(url);
        const output = response.data;
        return output;
    }

    async post(url: string, body: any, headers: any): Promise<any> {
        const response = await axios({
            url,
            method: "POST",
            headers,
            data: body
        });
        const output = response.data;
        return output;
    }

}

export class FetchAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        const response = await fetch(url);
        const output = await response.json();
        return output;
    }

    async post(url: string, body: any, headers: any): Promise<any> {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });
        const output = await response.json();
        return output;
    }

}
