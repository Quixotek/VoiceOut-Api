import { Test, TestingModule } from '@nestjs/testing';
import { LegalResourcesService } from './legal-resources.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  LegalResources,
  LegalResourcesDocument,
} from './legal-resources.schema';
import { Model } from 'mongoose';
import { LegalResourcesCreateInput } from './legal-resources.types';
import { UserService } from '../user/user.service';
import { find } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LegalResourcesService', () => {
  let service: LegalResourcesService;
  let userService: UserService;
  let legalResourcesModel = Model<LegalResourcesDocument>;
  let module: TestingModule;

  const mockUser = {
    _id: '1',
    id: '1',
    email: 'doe@mail.com',
    name: 'John Doe',
    password: 'password',
  };

  const mockLegalResources = {
    _id: '1',
    id: '1',
    title: 'VII of the Civil Rights Act of 1964',
    description:
      'Prohibits employment discrimination based on race, color, religion',
    category: 'Employment Law, Civil Rights',
    type: 'Statute',
    source: 'United State Code (USC) Title 42, Chapter 21, Subchapter VI',
    publicationDate: '1964-07-02',
    author: 'John Doe',
    url: 'https://www.govinfo.gov/content/pkg/STATUTE-78/pdf/STATUTE-78-Pg241.pdf',
    verified: false,
    notes: 'This is a federal statute that prohibits employment discrimination',
  };

  const newMockLegalResources = {
    _id: '1',
    id: '1',
    title: 'VII of the Civil Rights Act of 1964',
    description:
      'Prohibits employment discrimination based on race, color, religion',
    category: 'Employment Law, Civil Rights',
    type: 'Statute',
    source: 'United State Code (USC) Title 42, Chapter 21, Subchapter VI',
    publicationDate: '1964-07-02',
    author: 'John Doe',
    url: 'https://www.govinfo.gov/content/pkg/STATUTE-78/pdf/STATUTE-78-Pg241.pdf',
    notes: 'This is a federal statute that prohibits employment discrimination',
  };

  const mockLegalResourcesService = {
    create: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        LegalResourcesService,
        UserService,
        {
          provide: getModelToken(LegalResources.name),
          useValue: mockLegalResourcesService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<LegalResourcesService>(LegalResourcesService);
    legalResourcesModel = module.get<Model<LegalResourcesDocument>>(
      getModelToken(LegalResources.name),
    );
    userService = module.get<UserService>(UserService);
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
    expect(service).toBeDefined();
    expect(legalResourcesModel).toBeDefined();
  });

  describe('createLegalResources', () => {
    it('should create a new legal resources', async () => {
      jest
        .spyOn(legalResourcesModel, 'create')
        .mockResolvedValueOnce(mockLegalResources as any);
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(mockUser as any);

      const user = await userService.findUserById(mockUser.id);

      const legalResources = await service.createLegalResources(
        user.id,
        newMockLegalResources as LegalResourcesCreateInput,
      );

      expect(legalResources).toEqual(mockLegalResources);
    });

    it('should throw an exception if user not found', async () => {
      jest.spyOn(legalResourcesModel, 'create').mockImplementationOnce(() => {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      });

      await expect(
        service.createLegalResources(
          mockUser.id,
          newMockLegalResources as LegalResourcesCreateInput,
        ),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
      expect(userService.findUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
