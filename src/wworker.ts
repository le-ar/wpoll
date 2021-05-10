import { parentPort } from 'worker_threads';

export class WWorker<T = void, P = void> {
    constructor(private onMessage: (message: T) => Promise<P> | P) {
        parentPort?.on('message', this.processMessage.bind(this));
    }

    private async processMessage(message: any) {
        if ('id' in message) {
            let result = await Promise.resolve(this.onMessage(message.val));
            parentPort?.postMessage({ id: message.id, val: result });
        }
    }
}
