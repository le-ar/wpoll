import { WPoll } from '../src/wpoll';
import { WPollNode } from '../src/wpollnode';
import * as fs from 'fs';

jest.mock('worker_threads');
jest.mock('fs');

const existsSync = fs.existsSync as jest.Mock<
    ReturnType<typeof fs.existsSync>,
    Parameters<typeof fs.existsSync>
>;

describe('Create WPoll', () => {
    beforeAll(() => {
        existsSync.mockReturnValue(true);
    });

    it('Instance of WPoll', () => {
        existsSync.mockReturnValue(true);
        expect(new WPoll('') instanceof WPoll).toBeTruthy();
    });
    it('Throw error on init several times', () => {
        let wpoll = new WPoll('');
        wpoll.init();
        expect(() => wpoll.init()).toThrow('Already initialized');
        expect(() => wpoll.init()).toThrow('Already initialized');
    });
    it('Create WPollNode on init WPoll', () => {
        let wpoll = new WPoll('');
        wpoll.init();
        expect(wpoll['nodes'].length).toBe(3);
        for (let wpollnode of wpoll['nodes']) {
            expect(wpollnode instanceof WPollNode).toBeTruthy();
        }
    });
    it('Create WPollNode on init WPoll with custom nodes count', () => {
        let wpoll = new WPoll('', {
            WPollNodeCount: 5,
        });
        wpoll.init();
        expect(wpoll['nodes'].length).toBe(5);
        for (let wpollnode of wpoll['nodes']) {
            expect(wpollnode instanceof WPollNode).toBeTruthy();
        }
    });
    it('Throw error on wrong path', () => {
        existsSync.mockReturnValue(false);
        expect(() => new WPoll('')).toThrow('WorkerFile not found');
    });
});

describe('WPoll exec', () => {
    beforeAll(() => {
        existsSync.mockReturnValue(true);
    });

    it('pick node', () => {
        let wpoll = new WPoll('');
        wpoll.init();
        expect(wpoll['pickNode']()).toBe(wpoll['nodes'][0]);
        expect(wpoll['pickNode']()).toBe(wpoll['nodes'][1]);
        expect(wpoll['pickNode']()).toBe(wpoll['nodes'][2]);
        expect(wpoll['pickNode']()).toBe(wpoll['nodes'][0]);
    });

    it('exec call WPollNode exec', () => {
        let wpoll = new WPoll('');
        wpoll.init();
        let mock = jest.fn(async () => {});
        wpoll['nodes'][0].exec = mock;
        wpoll.exec();
        expect(mock).toBeCalled();
    });

    // it('run exec', async () => {
    //     let wpoll = new WPoll('');
    //     expect(await wpoll.exec()).toBeUndefined();
    // });
});
