# @boardgame.io/redis-pubsub
This package provides a Redis pub/sub adapter for [boardgame.io](https://boardgame.io/).

## Installation

```sh
npm install @boardgame.io/redis-pubsub
```

## Requirements

Requires `redis` npm library `3.1.2` or greater, and `boardgame.io` version `0.47.0` or greater. 
Using a database adaptor (i.e. postgres) that stores and shares the state across servers is also required to properly horizontally scale them.

## Usage

```
import { RedisPubSub } from 'bgio-redis-pubsub'
import { Server, Origins, SocketIO } from 'boardgame.io/server';
import TicTacToe from './src/tic-tac-toe/game';
import Chess from './src/chess/game';
import redis from 'redis';
import { PostgresStore } from 'bgio-postgres';
 
const PORT = process.env.PORT || 8000;
const redisConfig = { host: '192.168.8.50' };
const pubClient = redis.createClient(redisConfig);
const subClient = redis.createClient(redisConfig);
const server = Server({
  games: [TicTacToe, Chess],
  db: new PostgresStore('vdf@192.168.8.50/vdf'),
  origins: [Origins.LOCALHOST],
  transport: new SocketIO({
    pubSub: new RedisPubSub(pubClient, subClient),
  }),
});
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}`);
});
```
