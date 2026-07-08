export default interface HttpServer {
    route (method: string, url: string, callback: Function): void;
    listen (port: number): void;
}
