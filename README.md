# @boardgame.io/redis-pubsub

This package provides a Redis pub/sub adapter for [boardgame.io](https://boardgame.io/) multiplayer servers.

## Installation

```sh
npm install @boardgame.io/redis-pubsub
```

## Requirements

Requires `redis` npm library `3.1.2` or greater ([docs](https://github.com/NodeRedis/node-redis)), and `boardgame.io` version `0.47.0` or greater.

If you don’t have those installed yet, install them too:

```sh
npm install redis boardgame.io
```

Using a database adapter that stores and shares the state across servers is also required to properly horizontally scale them. See [the boardgame.io storage docs](https://boardgame.io/documentation/#/storage) for details.

## Usage

```js
import redis from 'redis';
import { RedisPubSub } from '@boardgame.io/redis-pubsub'
import { Server, Origins, SocketIO } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import MyGame from './src/MyGame';

// 1. Create your Redis clients.
const pubClient = redis.createClient({ host: '192.168.8.50' });
const subClient = pubClient.duplicate();

// 2. Create an instance of the RedisPubSub adapter.
const pubSub = new RedisPubSub(pubClient, subClient);

const server = Server({
  games: [MyGame],
  origins: [Origins.LOCALHOST],
  // 3. Pass the pub/sub instance to the SocketIO transport class.
  transport: new SocketIO({ pubSub }),
  db: new PostgresStore('vdf@192.168.8.50/vdf'),
});

server.run(8000);
```

## License

[MIT](LICENSE)
