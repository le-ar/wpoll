# WPoll

![Lines of code](https://img.shields.io/tokei/lines/github/le-ar/wpoll)
![GitHub top language](https://img.shields.io/github/languages/top/le-ar/wpoll)
![NPM](https://img.shields.io/npm/l/wpoll)
![GitHub last commit](https://img.shields.io/github/last-commit/le-ar/wpoll)

### Worker poll use worker_threads

## Example

- main.ts
```typescript
import { WPoll } from 'wpoll';
import path from 'path';

let wpoll = new WPoll<number>(path.resolve(__dirname, './worker.js'));
wpoll.init();

(async () => {
    console.log(await wpoll.exec(100));
})();
```

- worker.ts
```typescript
import { WWorker } from 'wpoll';

new WWorker(async (message) => {
    console.log(message);
    return 5;
});
```

## Types
### ```WPoll<T = void, P = void>```

|Name|Parameter|Type|Description|
|---|---|---|---|
|Constructor||WPoll&lt;T, P>|
||workerFile|string|Path to worker file (absolute path preferred)|
||props|WPollProps|Init Parameters
|init|-|-|Init Workers. Must be called once|
|exec|T|P|Execute with parameters T and return P

### ```WWorker<T = void, P = void>```

|Name|Parameter|Type|Description|
|---|---|---|---|
|Constructor||WWorker&lt;T,P>
||onMessage|(message: T) => Promise&lt;P> &#124; P| callback on message received