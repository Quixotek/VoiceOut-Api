import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let userModel = Model<User>;
  let module: TestingModule;

  const mockUser = {
    _id: '1',
    id: '1',
    email: 'doe@mail.com',
    name: 'John Doe',
    password: 'password',
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userModel).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Viewer', () => {
    it('should return user', async () => {
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(mockUser as any);

      const user = await resolver.viewer(mockUser.id);

      expect(user).toEqual(mockUser);
    });
  });

  describe('userId', () => {
    // TRYING TESTING GRAPHQL RESOLVER with ResolveField
    it('should return userId', async () => {
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(mockUser as any);

      const user = await resolver.userId(mockUser.id);

      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
      expect(user).toEqual(mockUser.id);
    });
  });
});
