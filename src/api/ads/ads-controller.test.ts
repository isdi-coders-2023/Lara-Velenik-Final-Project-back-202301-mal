import { Request, Response } from 'express';
import { Ads, AdsModel } from './ads-schema.js';
import { AdsRequest, UserLocalsAuthInfo } from '../../types/ads-types.js';
import {
  createAdController,
  getAdByIdController,
  getAllAdsController,
} from './ads-controller.js';
import { UserModel } from '../users/user-schema.js';
import { CustomHTTPError } from '../../utils/custom-http-error.js';

jest.mock('@supabase/supabase-js', () => {
  const data = {
    publicUrl: 'https://example.com/photo.webp',
  };
  return {
    createClient: jest.fn().mockImplementation(() => ({
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({
            error: null,
            data: {
              ...data,
            },
          }),
          getPublicUrl: jest.fn().mockReturnValue({
            error: null,
            data: {
              ...data,
            },
          }),
        }),
      },
    })),
  };
});

describe('Given a createAdController to create an ad', () => {
  const mockResponse = {
    json: jest.fn(),
    sendStatus: jest.fn().mockReturnThis(),
    locals: { email: 'thais@gmail.com', id: 'mockId' },
  } as Partial<
    Response<Ads | { message: string }, UserLocalsAuthInfo & { id: string }>
  >;

  const next = jest.fn();

  const ad = {
    name: 'mockName',
    surname: 'mockSurname',
    breed: 'mockBreed',
    email: 'mockEmail',
    phone: '611000000',
    city: 'mockCity',
    image: 'https://example.com/photo.webp',
  };

  AdsModel.create = jest.fn().mockResolvedValue(ad);
  UserModel.findOne = jest.fn().mockResolvedValue(ad);

  test('when the user tries to create an ad with an image, it should return a 201 status', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));

    const validMockRequest = {
      body: {
        name: 'Thais',
        surname: 'Jacob',
        breed: 'Bengalí',
        email: 'thais@gmail.com',
        phone: '666010101',
        city: 'Málaga',
      },
      file: {
        buffer: Buffer.from('mockBuffer'),
        originalname: 'mockOriginalname',
      },
    } as Partial<Request>;

    await createAdController(
      validMockRequest as Request<
        unknown,
        Ads,
        AdsRequest,
        unknown,
        UserLocalsAuthInfo
      >,
      mockResponse as Response<Ads | { message: string }, UserLocalsAuthInfo>,
      next,
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(201);
  });

  test('when the user tries to create an ad without an image, then it should continue', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));

    const validMockRequest = {
      body: {
        name: 'mockName',
        surname: 'mockSurname',
        breed: 'mockBreed',
        email: 'mockEmail',
        phone: '611000000',
        city: 'mockCity',
      },
    } as unknown as Partial<Request>;

    await createAdController(
      validMockRequest as Request<
        unknown,
        Ads,
        AdsRequest,
        unknown,
        UserLocalsAuthInfo
      >,
      mockResponse as Response<Ads | { message: string }, UserLocalsAuthInfo>,
      next,
    );

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(201);
  });

  test('when it tries to search for a creator user and does not find one, then it gives a 404 error', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));

    const validMockRequest = {
      body: {
        name: 'Thais',
        surname: 'Jacob',
        breed: 'Bengalí',
        email: 'thais@gmail.com',
        phone: '666010101',
        city: 'Málaga',
      },
      file: {
        buffer: Buffer.from('mockBuffer'),
        originalname: 'mockOriginalname',
      },
    } as Partial<Request>;

    await createAdController(
      validMockRequest as Request<
        unknown,
        Ads,
        AdsRequest,
        unknown,
        UserLocalsAuthInfo
      >,
      mockResponse as Response<Ads | { message: string }, UserLocalsAuthInfo>,
      next,
    );

    expect(next).toHaveBeenCalledWith(
      new CustomHTTPError(404, 'User not found'),
    );
  });

  describe('Given a getAllAdsController', () => {
    const mockRequest = {} as Partial<Request>;
    const mockResponse = {
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    const ads = {
      name: 'mockName',
      surname: 'mockSurname',
      breed: 'mockBreed',
      email: 'mockEmail',
      phone: '611000000',
      city: 'mockCity',
      image: 'https://example.com/photo.webp',
    };

    test('When the database response is successful, then the user should receive a list of ads', async () => {
      AdsModel.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(ads) });

      await getAllAdsController(
        mockRequest as Request,
        mockResponse as Response,
        next,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(ads);
    });

    test('When an error is throw, then it should be passed on to be handled', async () => {
      AdsModel.find = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockRejectedValue(null) });

      await getAllAdsController(
        mockRequest as Request,
        mockResponse as Response,
        next,
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Given a getAdByIdController to create an ad', () => {
    const mockRequest = {
      params: { _id: 'mockId' },
    } as Partial<Request>;

    const mockResponse = {
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    const next = jest.fn();

    const mockAd = {
      name: 'mockName',
      surname: 'mockSurname',
      breed: 'mockBreed',
      email: 'mockEmail',
      phone: '611000000',
      city: 'mockCity',
      image: 'https://example.com/photo.webp',
    };

    test('When the ad does not exist, then it should pass on an error 404', async () => {
      AdsModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await getAdByIdController(
        mockRequest as Request<{ _id: string }, Ads | { message: string }>,
        mockResponse as Response,
        next,
      );

      expect(next).toHaveBeenCalled();
    });

    test('When an error is throw searching for id, then it should be passed on to be handled', async () => {
      AdsModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(null),
      });

      await getAdByIdController(
        mockRequest as Request<{ _id: string }, Ads | { message: string }>,
        mockResponse as Response,
        next,
      );
      expect(next).toHaveBeenCalled();
    });

    test('When the ad exist, then the server should respond with it', async () => {
      AdsModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAd),
      });

      await getAdByIdController(
        mockRequest as Request<{ _id: string }, Ads | { message: string }>,
        mockResponse as Response,
        next,
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockAd);
    });
  });
});
