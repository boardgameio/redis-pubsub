Usage:

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
