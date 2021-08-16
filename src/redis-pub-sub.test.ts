import type redis from 'redis';
import { RedisPubSub } from './redis-pub-sub';

const CHANNEL_FOO = 'MATCH-foo';

describe('redis pub-sub', () => {
  let pubClientMock: any;
  let subClientMock: any;
  let pubSub: RedisPubSub<string>;

  beforeEach(() => {
    subClientMock = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      on: jest.fn(),
    };
    pubClientMock = {
      publish: jest.fn(),
    };
    pubSub = new RedisPubSub(pubClientMock as any, subClientMock as any);
  });

  it('should publish a payload to redis', () => {
    const payload = 'hello world';
    pubSub.publish(CHANNEL_FOO, payload);
    expect(pubClientMock.publish).toHaveBeenCalledWith(CHANNEL_FOO, JSON.stringify(payload));
  });

  it('should unsubscribe to a channel in redis', () => {
    pubSub.unsubscribeAll(CHANNEL_FOO);
    expect(subClientMock.unsubscribe).toHaveBeenCalledWith(CHANNEL_FOO);
  });

  it('should receive a message after subscription', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const payload = 'hello world';
    pubSub.subscribe(CHANNEL_FOO, callback1);
    pubSub.subscribe(CHANNEL_FOO, callback2);
    const redisCallback = subClientMock.on.mock.calls[0][1];
    redisCallback(CHANNEL_FOO, JSON.stringify(payload));
    expect(callback1).toHaveBeenCalledWith(payload);
    expect(callback2).toHaveBeenCalledWith(payload);
  });

  it('should ignore message from unrelated channel', () => {
    const callback = jest.fn();
    const payload = 'hello world';
    pubSub.subscribe(CHANNEL_FOO, callback);
    const redisCallback = subClientMock.on.mock.calls[0][1];
    redisCallback('notTheRightId', JSON.stringify(payload));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should ignore message after unsubscription', () => {
    const callback = jest.fn();
    const payload = 'hello world';
    pubSub.subscribe(CHANNEL_FOO, callback);
    pubSub.unsubscribeAll(CHANNEL_FOO);
    const redisCallback = subClientMock.on.mock.calls[0][1];
    redisCallback(CHANNEL_FOO, JSON.stringify(payload));
    expect(callback).not.toHaveBeenCalled();
  });
});
