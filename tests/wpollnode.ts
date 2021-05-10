import { Worker } from 'worker_threads';
import { WPollNode } from '../src/wpollnode';

jest.mock('worker_threads');

describe('Create WPollNode', () => {
    it('Instanceof WPollNode', () => {
        let t = new WPollNode('');
        expect(new WPollNode('') instanceof WPollNode).toBeTruthy();
    });
    it('Call new worker', () => {
        let wPollNode = new WPollNode('');
        expect(wPollNode['worker'] instanceof Worker).toBeTruthy();
    });
});

describe('exec', () => {
    it('Must call postMessage', () => {
        let wPollNode = new WPollNode('');
        wPollNode.exec();
        expect(wPollNode['worker']!.postMessage).toBeCalled();
    });
    it('Must add to messages', () => {
        let wPollNode = new WPollNode('');
        wPollNode.exec();
        expect(Object.keys(wPollNode['messages']).length).toBe(1);
        expect(wPollNode['messages']['0']).not.toBeUndefined();
        wPollNode.exec();
        expect(Object.keys(wPollNode['messages']).length).toBe(2);
        expect(wPollNode['messages']['1']).not.toBeUndefined();
    });
    it('Must remove from messages', () => {
        let wPollNode = new WPollNode('');
        let promise = wPollNode.exec();
        expect(Object.keys(wPollNode['messages']).length).toBe(1);
        expect(wPollNode['messages']['0']).not.toBeUndefined();

        let onMock = wPollNode['worker']!.on as jest.Mock<any, any>;

        expect(onMock).toBeCalled();
        onMock.mock.calls[onMock.mock.calls.length - 1][1]({
            id: 0,
        });
        expect(Object.keys(wPollNode['messages']).length).toBe(0);
    });
    it('Must resolve promise', async () => {
        let wPollNode = new WPollNode('');
        let promise = wPollNode.exec();
        let onMock = wPollNode['worker']!.on as jest.Mock<any, any>;
        onMock.mock.calls[onMock.mock.calls.length - 1][1]({
            id: 0,
        });
        await expect(promise).resolves.toEqual(void 0);
    });
    it('Must resolve promise', async () => {
        let wPollNode = new WPollNode('');
        let promise = wPollNode.exec();
        let onMock = wPollNode['worker']!.on as jest.Mock<any, any>;
        onMock.mock.calls[onMock.mock.calls.length - 1][1]({
            id: 0,
        });
        await expect(promise).resolves.toEqual(void 0);
    });
    it('Throw timeout', async () => {
        jest.useFakeTimers();
        let wPollNode = new WPollNode('', 1);
        let promise = wPollNode.exec();
        jest.runAllTimers();
        await expect(promise).rejects.toEqual('Timeout');
    });
    it('Call recreate on timeout', async () => {
        jest.useFakeTimers();
        let wPollNode = new WPollNode('', 1, {
            recreateOnTimeout: true,
        });
        let mock = jest.fn();
        wPollNode.recreate = mock;
        let promise = wPollNode.exec();
        jest.runAllTimers();
        await expect(promise).rejects.toEqual('Timeout');
        expect(mock).toBeCalled();
    });
    it('Remove timeout', async () => {
        jest.useFakeTimers();
        let wPollNode = new WPollNode('', 1, {
            recreateOnTimeout: true,
        });
        let mock = jest.fn();
        wPollNode.recreate = mock;
        let promise = wPollNode.exec();
        let onMock = wPollNode['worker']!.on as jest.Mock<any, any>;
        onMock.mock.calls[onMock.mock.calls.length - 1][1]({
            id: 0,
        });
        await expect(promise).resolves.toEqual(void 0);
        jest.runAllTimers();
        expect(mock).not.toBeCalled();
        expect(Object.keys(wPollNode['messages']).length).toBe(0);
    });
    it('Throw Recreate', async () => {
        jest.useFakeTimers();
        let wPollNode = new WPollNode('', 1, {
            recreateOnTimeout: true,
        });
        let mock = wPollNode['worker']?.terminate as jest.Mock;
        let promise = wPollNode.exec();
        wPollNode.recreate();
        await expect(promise).rejects.toEqual('Recreated');
        jest.runAllTimers();
        expect(mock).toBeCalled();
    });
});
