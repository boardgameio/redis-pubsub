import type redis from 'redis';
import type { GenericPubSub } from 'boardgame.io/server';

export class RedisPubSub<T> implements GenericPubSub<T> {
  private pubClient: redis.RedisClient;
  private subClient: redis.RedisClient;
  callbacks: Map<string, ((payload: T) => void)[]> = new Map();

  constructor(pubClient: redis.RedisClient, subClient: redis.RedisClient) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.subClient.on('message', (redisChannelId, message) => {
      if (!this.callbacks.has(redisChannelId)) {
        return;
      }
      const allCallbacks = this.callbacks.get(redisChannelId) || [];
      const parsedPayload = JSON.parse(message) as T;
      for (const callback of allCallbacks) {
        callback(parsedPayload);
      }
    });
  }

  publish(channelId: string, payload: T) {
    this.pubClient.publish(channelId, JSON.stringify(payload));
  }

  subscribe(channelId: string, callback: (payload: T) => void) {
    if (!this.callbacks.has(channelId)) {
      this.callbacks.set(channelId, []);
    }
    this.callbacks.get(channelId)!.push(callback);
    this.subClient.subscribe(channelId);
  }

  unsubscribeAll(channelId: string) {
    this.subClient.unsubscribe(channelId);
    if (this.callbacks.has(channelId)) {
      this.callbacks.delete(channelId);
    }
  }
}
