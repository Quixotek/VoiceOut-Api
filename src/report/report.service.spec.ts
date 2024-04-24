import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { Report, ReportDocument } from './report.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportCreateInput, ReportUpdateInput } from './report.types';

describe('ReportService', () => {
  let service: ReportService;
  let model: Model<ReportDocument>;

  const mockReport = {
    _id: '1',
    id: '1',
    type: 'title',
    description: 'description',
    locations: ['location1', 'location2'],
    attachments: ['attachment1', 'attachment2'],
    isReviewed: false,
  };

  const mockReportService = {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getModelToken(Report.name),
          useValue: mockReportService,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    model = module.get<Model<ReportDocument>>(getModelToken(Report.name));
  });

  describe('getReportById', () => {
    it('should return the report', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockReport as any);

      const result = await service.getReportById('1');

      expect(result).toEqual(mockReport);
      expect(model.findOne).toHaveBeenCalledWith({ id: '1' });

      jest.clearAllMocks();
    });

    it('should throw an error if findOne throws an exception', async () => {
      jest.spyOn(model, 'findOne').mockImplementation(() => {
        throw new Error('findOne exception');
      });

      await expect(service.getReportById('1')).rejects.toThrow(
        new Error('findOne exception'),
      );

      jest.clearAllMocks();
    });
  });

  describe('createReport', () => {
    it('should create and return new report', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockReport as any));

      const reportCreateInput: ReportCreateInput = {
        type: 'title',
        description: 'description',
      };

      const result = await service.createReport(reportCreateInput);

      expect(result).toEqual(mockReport);
      expect(model.create).toHaveBeenCalledWith(reportCreateInput);

      jest.clearAllMocks();
    });

    it('should throw an error if create throws an exception', async () => {
      jest.spyOn(model, 'create').mockImplementation(() => {
        throw new Error('create exception');
      });

      await expect(
        service.createReport({
          type: 'title',
          description: 'description',
        }),
      ).rejects.toThrow(new Error('create exception'));

      jest.clearAllMocks();
    });
  });

  describe('updateReport', () => {
    const updatedReport = {
      ...mockReport,
      type: 'new title',
      description: 'new description',
    };

    const reportUpdateInput: ReportUpdateInput = {
      id: '1',
      type: 'new title',
      description: 'new description',
    };

    it('should update and return the report', async () => {
      jest
        .spyOn(model, 'findOneAndUpdate')
        .mockResolvedValue(updatedReport as any);

      const result = await service.updateReport(reportUpdateInput);

      expect(result).toEqual(updatedReport);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '1' },
        reportUpdateInput,
        { new: true },
      );

      jest.clearAllMocks();
    });

    it('should throw an error if findOneAndUpdate throws an exception', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockImplementation(() => {
        throw new Error('findOneAndUpdate exception');
      });

      await expect(
        service.updateReport({
          id: '1',
          type: 'new title',
          description: 'new description',
        }),
      ).rejects.toThrow(new Error('findOneAndUpdate exception'));

      jest.clearAllMocks();
    });
  });

  describe('deleteReport', () => {
    it('should delete and return the report', async () => {
      jest
        .spyOn(model, 'findOneAndDelete')
        .mockResolvedValue(mockReport as any);

      const result = await service.deleteReport('1');

      expect(result).toEqual(mockReport);
      expect(model.findOneAndDelete).toHaveBeenCalledWith({ id: '1' });

      jest.clearAllMocks();
    });

    it('should throw an error if findOneAndDelete throws an exception', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockImplementation(() => {
        throw new Error('findOneAndDelete exception');
      });

      await expect(service.deleteReport('1')).rejects.toThrow(
        new Error('findOneAndDelete exception'),
      );

      jest.clearAllMocks();
    });
  });
});
