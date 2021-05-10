import { parentPort } from 'worker_threads';
import { WWorker } from '../src/wworker';

jest.mock('worker_threads');

// const parentPortOnMock = parentPort?.on as jest.Mock;

describe('Create WWorker', () => {
    it('Instance', () => {
        expect(new WWorker(() => {}) instanceof WWorker).toBeTruthy();
    });
    // it('Call processMessage on message', () => {
    //     let fn = () => {};
    //     let worker = new WWorker(fn);
    //     expect(parentPortOnMock.mock).lastCalledWith('message', fn);
    // });
    it('Call on message', () => {
        let fn = jest.fn();
        let worker = new WWorker(fn);
        worker['processMessage']({id: 0, val: void 0});
        expect(fn).toBeCalled();
    });
});
