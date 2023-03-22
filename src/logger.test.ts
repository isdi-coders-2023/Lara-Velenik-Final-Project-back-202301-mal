import bunyan from 'bunyan';
import log from './logger';
import dotenv from 'dotenv';
dotenv.config();

describe('Given a logger', () => {
  test('When a logger is created, then it should be an instance of a bunyan logger', () => {
    expect(log).toBeInstanceOf(bunyan);
  });
});
