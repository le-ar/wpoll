import { WPollNode } from './wpollnode';
import * as fs from 'fs';

export interface WPollProps {
    WPollNodeCount?: number;
    execTimeout?: number;
    recreateOnTimeout?: boolean;
}

export class WPoll<T = void, P = void> {
    private currNode: number = -1;
    private nodes: WPollNode<T, P>[] = [];

    private WPollNodeCount: number;
    private execTimeout: number;
    private recreateOnTimeout: boolean;

    constructor(private workerFile: string, props?: WPollProps) {
        if (!this.checkWorkerFile(workerFile)) {
            throw new Error('WorkerFile not found');
        }

        this.WPollNodeCount = props?.WPollNodeCount ?? 3;
        this.execTimeout = props?.execTimeout ?? 0;
        this.recreateOnTimeout = !!props?.recreateOnTimeout;
    }

    private checkWorkerFile(file: string): boolean {
        if (!fs.existsSync(file)) {
            return false;
        }

        return true;
    }

    private createWPollNode(): WPollNode<T, P> {
        return new WPollNode<T, P>(this.workerFile, this.execTimeout, {
            recreateOnTimeout: this.recreateOnTimeout,
        });
    }

    init() {
        this.init = () => {
            throw Error('Already initialized');
        };

        for (let i = 0; i < this.WPollNodeCount; i++) {
            this.nodes.push(this.createWPollNode());
        }
    }

    exec(val: T): Promise<P> {
        return this.pickNode().exec(val);
    }

    private pickNode(): WPollNode<T, P> {
        this.currNode = (this.currNode + 1) % this.WPollNodeCount;
        return this.nodes[this.currNode];
    }
}
