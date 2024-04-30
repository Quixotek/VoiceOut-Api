import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { LegalResourcesService } from '../legal-resources/legal-resources.service';
import { LegalResourcesSearch } from '../utils/common.types';
import { LegalResourcesPaginationInput } from '../legal-resources/legal-resources.types';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let legalResourcesService: LegalResourcesService;
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

  const mockLegalResourcesService = {
    getLegalResources: jest.fn(),
    getLegalResourcesById: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        LegalResourcesService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
        {
          provide: LegalResourcesService,
          useValue: mockLegalResourcesService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    legalResourcesService = module.get<LegalResourcesService>(
      LegalResourcesService,
    );
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

  describe('legalResourcesSearch', () => {
    const query: LegalResourcesPaginationInput = {
      page: 1,
      limit: 10,
      q: 'VII of the Civil Rights Act of 1964',
      sort: 'desc',
      sortBy: 'createdAt',
    };
    const mockedResults: LegalResourcesSearch = {
      item: [
        {
          id: '1',
          title: 'VII of the Civil Rights Act of 1964',
          description:
            'Prohibits employment discrimination based on race, color, religion',
          category: 'Employment Law, Civil Rights',
          type: 'Statute',
          source: 'United State Code (USC) Title 42, Chapter 21, Subchapter VI',
          publicationDate: new Date(),
          author: 'John Doe',
          url: 'https://www.govinfo.gov/content/pkg/STATUTE-78/pdf/STATUTE-78-Pg241.pdf',
          verified: false,
          notes:
            'This is a federal statute that prohibits employment discrimination',
        },
      ],
      meta: {
        limit: 10,
        page: 1,
        total: 1,
      },
    };
    it('should return legal resources', async () => {
      jest
        .spyOn(legalResourcesService, 'getLegalResources')
        .mockResolvedValueOnce(mockedResults as any);

      const results = await resolver.legalResourcesSearch(query);

      expect(results).toEqual(mockedResults);
      expect(legalResourcesService.getLegalResources).toHaveBeenCalledWith(
        query,
      );
    });
  });

  describe('legalResources', () => {
    const mockResult = {
      id: '1',
      title: 'VII of the Civil Rights Act of 1964',
      description:
        'Prohibits employment discrimination based on race, color, religion',
      category: 'Employment Law, Civil Rights',
      type: 'Statute',
      source: 'United State Code (USC) Title 42, Chapter 21, Subchapter VI',
      publicationDate: new Date(),
      author: 'John Doe',
      url: 'https://www.govinfo.gov/content/pkg/STATUTE-78/pdf/STATUTE-78-Pg241.pdf',
      verified: false,
      notes:
        'This is a federal statute that prohibits employment discrimination',
    };

    it('should return a single legal resource by id', async () => {
      jest
        .spyOn(legalResourcesService, 'getLegalResourcesById')
        .mockResolvedValueOnce(mockResult as any);

      const result = await resolver.legalResources('1');

      expect(result).toEqual(mockResult);
      expect(legalResourcesService.getLegalResourcesById).toHaveBeenCalledWith(
        '1',
      );
    });

    it('should throw exception when no legal resource is found', async () => {
      jest
        .spyOn(legalResourcesService, 'getLegalResourcesById')
        .mockRejectedValueOnce(
          new HttpException('No legal resource found', HttpStatus.NOT_FOUND),
        );

      await expect(resolver.legalResources('1')).rejects.toThrow(
        new HttpException('No legal resource found', HttpStatus.NOT_FOUND),
      );
      expect(legalResourcesService.getLegalResourcesById).toHaveBeenCalledWith(
        '1',
      );
    });
  });
});
