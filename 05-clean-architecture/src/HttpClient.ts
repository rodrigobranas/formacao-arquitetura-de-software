export default interface HttpClient {
    get (url: string): Promise<any>;
    post (url: string, body: any, headers: any): Promise<any>;
}
