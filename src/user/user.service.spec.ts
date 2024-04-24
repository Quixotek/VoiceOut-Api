import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from './user.types';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel = Model<User>;
  let module: TestingModule;

  const mockUser = {
    _id: '1',
    id: '1',
    email: 'doe@mail.com',
    name: 'John Doe',
    password: 'password',
  };

  const newUser = {
    email: 'doe@mail.com',
    name: 'John Doe',
    password: 'password',
  };

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockUser as any);

      const user = await service.create(newUser as CreateUserInput);
      expect(user).toEqual(mockUser);

      jest.clearAllMocks();
    });

    it('should throw an exception if create throws an exception', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => {
        throw new HttpException('create error', HttpStatus.BAD_REQUEST);
      });

      await expect(service.create(newUser as CreateUserInput)).rejects.toThrow(
        new HttpException('create error', HttpStatus.BAD_REQUEST),
      );

      jest.clearAllMocks();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findUserByEmail(mockUser.email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);

      jest.clearAllMocks();
    });

    it('should return NotFoundError when user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.findUserByEmail(mockUser.email)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });

      jest.clearAllMocks();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser);

      const result = await service.findUserById(mockUser.id);

      expect(userModel.findOne).toHaveBeenCalledWith({ id: mockUser.id });
      expect(result).toEqual(mockUser);

      jest.clearAllMocks();
    });

    it('should retrun Not Found Exception when user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.findUserById(mockUser.id)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      expect(userModel.findOne).toHaveBeenCalledWith({ id: mockUser.id });

      jest.clearAllMocks();
    });
  });
});
