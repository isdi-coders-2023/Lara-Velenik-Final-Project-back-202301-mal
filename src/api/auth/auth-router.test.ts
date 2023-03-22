import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import connectDB from '../../database/connection.js';
import app from '../../app.js';
import { UserModel } from '../users/user-schema.js';
import { encryptPassword } from './auth-utils.js';
import dotenv from 'dotenv';
dotenv.config();
describe('Given an app with auth-router', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUrl = mongoServer.getUri();
    await connectDB(mongoUrl);
  });

  afterAll(async () => {
    await mongoServer.stop();
    await mongoose.connection.close();
  });

  describe('When a user wants to log in with an existing email and pasasword', () => {
    test('Then it should be logged', async () => {
      const user = {
        email: 'lara@gmail.com',
        password: 'lara123',
      };
      const userDb = { ...user, password: encryptPassword(user.password) };
      await UserModel.create(userDb);

      await request(app).post('/auth/login').send(user).expect(201);
    });
  });

  describe('When a user wants to log in with an unexisting email', () => {
    test('Then it should return a 404 error', async () => {
      const notExistUser = {
        email: 'lara2@gmail.com',
        password: '123lara',
      };
      await request(app).post('/auth/login').send(notExistUser).expect(404);
    });
  });
});
