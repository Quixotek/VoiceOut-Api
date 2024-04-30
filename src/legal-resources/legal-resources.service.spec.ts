import { Test, TestingModule } from '@nestjs/testing';
import { LegalResourcesService } from './legal-resources.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  LegalResources,
  LegalResourcesDocument,
} from './legal-resources.schema';
import { Model } from 'mongoose';
import {
  LegalResourcesCreateInput,
  LegalResourcesPaginationInput,
  LegalResourcesUpdateInput,
} from './legal-resources.types';
import { UserService } from '../user/user.service';
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
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
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

  describe('getLegalResourcesById', () => {
    it('should get legal resource by id', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOne')
        .mockResolvedValue(mockLegalResources);

      const result = await service.getLegalResourcesById(mockLegalResources.id);

      expect(result).toEqual(mockLegalResources);
    });

    it('should throw and exception when legal resource is not found', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOne')
        .mockRejectedValue(
          new HttpException('Legal resource not found', HttpStatus.BAD_REQUEST),
        );

      await expect(
        service.getLegalResourcesById(mockLegalResources.id),
      ).rejects.toThrow(
        new HttpException('Legal resource not found', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getLegalResources', () => {
    it('should get legal resources', async () => {
      const query = {
        page: 1,
        limit: 10,
        q: 'VII of the Civil Rights Act of 1964',
        sort: 'desc',
        sortBy: 'createdAt',
      };

      const mockedResults = [
        {
          docs: [
            {
              _id: '1',
              id: '1',
              title: 'VII of the Civil Rights Act of 1964',
              description:
                'Prohibits employment discrimination based on race, color, religion',
              category: 'Employment Law, Civil Rights',
              type: 'Statute',
              source:
                'United State Code (USC) Title 42, Chapter 21, Subchapter VI',
              publicationDate: '1964-07-02',
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
            totalDocs: 1,
          },
        },
      ];

      jest
        .spyOn(legalResourcesModel, 'aggregate')
        .mockResolvedValueOnce(mockedResults);

      const result = await service.getLegalResources(
        query as LegalResourcesPaginationInput,
      );

      expect(result.items).toEqual(mockedResults[0].docs);
      expect(result.meta).toEqual(mockedResults[0].meta[0]);
    });
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

  describe('updateLegalResources', () => {
    const newUpdatedLegalresources = {
      ...mockLegalResources,
      title: 'VII of the Civil Rights Act of 1965',
      description: 'Prohibits employment discrimination based on race',
    };

    const legalResourcesUpdatedInput: LegalResourcesUpdateInput = {
      title: 'VII of the Civil Rights Act of 1965',
      description: 'Prohibits employment discrimination based on race',
    };

    it('should update Legal Resources', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOneAndUpdate')
        .mockResolvedValue(newUpdatedLegalresources as any);

      const updatedLegalResources = await service.updateLegalResources(
        mockLegalResources.id,
        legalResourcesUpdatedInput,
      );

      expect(updatedLegalResources).toEqual(newUpdatedLegalresources);
      expect(legalResourcesModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '1' },
        { $set: { ...legalResourcesUpdatedInput } },
        { new: true },
      );
    });

    it('should throw exception when no legal resource is found', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOneAndUpdate')
        .mockRejectedValue(new Error('No legal resource found'));

      try {
        await service.updateLegalResources(
          mockLegalResources.id,
          legalResourcesUpdatedInput,
        );

        fail('The function should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('No legal resource found');
      }
    });
  });

  describe('deleteLegalResouce', () => {
    it('should delete a Legal Resource', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOneAndDelete')
        .mockResolvedValue({ message: 'Successfully Deleted' });

      const result = await service.deleteLegalResources(
        mockLegalResources.id,
        mockUser.id,
      );

      expect(result).toEqual({
        message: 'Deleted Legal Resource Successfully',
      });
      expect(legalResourcesModel.findOneAndDelete).toHaveBeenCalledWith({
        id: '1',
      });
    });

    it('should throw an exceptioin when no Legal resource is found', async () => {
      jest
        .spyOn(legalResourcesModel, 'findOneAndDelete')
        .mockRejectedValue(new Error('No legal resource found'));

      try {
        await service.deleteLegalResources(mockLegalResources.id, mockUser.id);

        fail('The function should have thrown and exception');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toEqual('No legal resource found');
      }
    });
  });
});
