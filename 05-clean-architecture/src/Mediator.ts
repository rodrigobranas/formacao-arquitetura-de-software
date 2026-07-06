export default class Mediator {
    handlers: { event: string, callback: Function }[] = [];

    register (event: string, callback: Function) {
        this.handlers.push({ event, callback });
    }

    async notifyAll (event: string, data: any) {
        for (const handler of this.handlers) {
            if (handler.event === event) {
                await handler.callback(data);
            }
        }
    }

}
