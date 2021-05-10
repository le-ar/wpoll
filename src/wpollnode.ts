import { Worker } from 'worker_threads';

type Timeout = ReturnType<typeof setTimeout>;

export class WPollNode<T = void, P = void> {
    private messageId: number = -1;
    private worker: Worker | null = null;
    private messages: {
        [key: string]: {
            resolve: (param: P) => void;
            reject: (reason?: any) => void;
            timeoutId: Timeout | null;
        };
    } = {};

    constructor(
        private filename: string,
        private timeout: number = 0,
        private params: {
            recreateOnTimeout?: boolean;
        } = {},
    ) {
        this.createWorker();
    }

    private createWorker() {
        this.worker = new Worker(this.filename);
        this.worker.on('message', this.onWorkerMessage.bind(this));
    }

    private onWorkerMessage(message: any) {
        if (message?.id in this.messages) {
            let id = message?.id;
            this.messages[id].resolve(message.val);

            if (this.messages[id].timeoutId !== null) {
                clearTimeout(this.messages[id].timeoutId!);
            }

            delete this.messages[id];
        }
    }

    exec(val: T): Promise<P> {
        let messageId = ++this.messageId;
        let resolve: (param: P) => void = () => {};
        let reject: (reason?: any) => void = () => {};
        let result: Promise<P> = new Promise<P>((res, rej) => {
            resolve = res;
            reject = rej;
        });

        this.worker!.postMessage({ id: messageId, val });
        let timeoutId: Timeout | null = null;
        if (this.timeout > 0) {
            timeoutId = setTimeout(() => {
                if (messageId in this.messages) {
                    this.messages[messageId].reject('Timeout');
                    delete this.messages[messageId];
                    if (this.params.recreateOnTimeout) {
                        this.recreate();
                    }
                }
            }, this.timeout);
        }
        this.messages[messageId] = { resolve, reject, timeoutId };

        return result;
    }

    recreate() {
        for (let messageId of Object.keys(this.messages)) {
            try {
                this.messages[messageId].reject('Recreated');
                if (this.messages[messageId].timeoutId !== null) {
                    clearTimeout(this.messages[messageId].timeoutId!);
                }
            } catch (e) {}
        }
        try {
            this.worker!.terminate();
        } catch (e) {}
        this.createWorker();
        this.messages = {};
    }
}
