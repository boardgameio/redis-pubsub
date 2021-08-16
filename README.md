# @boardgame.io/redis-pubsub
This package provides a Redis pub/sub adapter for [boardgame.io](https://boardgame.io/).

## Installation

```sh
npm install @boardgame.io/redis-pubsub
```

## Requirements

Requires `redis` npm library `3.1.2` or greater ([docs](https://github.com/NodeRedis/node-redis)), and `boardgame.io` version `0.47.0` or greater ([docs](https://boardgame.io)). 
Using a database adaptor (i.e. postgres) that stores and shares the state across servers is also required to properly horizontally scale them.

## Usage

```
import { RedisPubSub } from 'bgio-redis-pubsub'
import { Server, Origins, SocketIO } from 'boardgame.io/server';
import MyGame from './src/MyGame';
import redis from 'redis';
import { PostgresStore } from 'bgio-postgres';

const redisConfig = { host: '192.168.8.50' };
const pubClient = redis.createClient(redisConfig);
const subClient = pubClient.duplicate();
const server = Server({
  games: [MyGame],
  db: new PostgresStore('vdf@192.168.8.50/vdf'),
  origins: [Origins.LOCALHOST],
  transport: new SocketIO({
    pubSub: new RedisPubSub(pubClient, subClient),
  }),
});
server.run(8000);
```
