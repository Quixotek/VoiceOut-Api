import { Test, TestingModule } from '@nestjs/testing';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';
import { ReportCreateInput, ReportUpdateInput } from './report.types';

describe('ReportResolver', () => {
  let resolver: ReportResolver;

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
    createReport: jest.fn(),
    updateReport: jest.fn(),
    deleteReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportResolver,
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    resolver = module.get<ReportResolver>(ReportResolver);
  });

  describe('createReport', () => {
    it('should return the created report', async () => {
      const report: ReportCreateInput = {
        type: 'title',
        description: 'description',
        locations: ['location1', 'location2'],
        attachments: ['attachment1', 'attachment2'],
        isReviewed: false,
      };

      mockReportService.createReport.mockReturnValue(mockReport);
      const result = await resolver.createReport(report);

      expect(result).toBe(mockReport);
    });

    it('should throw an error if createReport throws an exception', async () => {
      const report: ReportCreateInput = {
        type: 'title',
        description: 'description',
        locations: ['location1', 'location2'],
        attachments: ['attachment1', 'attachment2'],
        isReviewed: false,
      };

      mockReportService.createReport.mockImplementation(() => {
        throw new Error('createReport exception');
      });

      await expect(resolver.createReport(report)).rejects.toThrow(
        'createReport exception',
      );
    });
  });

  describe('updateReport', () => {
    it('should return the updated report', async () => {
      const updatedReport = {
        ...mockReport,
        type: 'new title',
        description: 'new description',
      };

      const report: ReportUpdateInput = {
        id: '1',
        type: 'new title',
        description: 'new description',
      };

      mockReportService.updateReport.mockReturnValue(updatedReport);
      const result = await resolver.updateReport(report);

      expect(result).toBe(updatedReport);
    });

    it('should throw an error if updateReport throws an exception', async () => {
      const report: ReportUpdateInput = {
        id: '1',
        type: 'title',
        description: 'description',
        locations: ['location1', 'location2'],
        attachments: ['attachment1', 'attachment2'],
        isReviewed: false,
      };

      mockReportService.updateReport.mockImplementation(() => {
        throw new Error('updateReport exception');
      });

      await expect(resolver.updateReport(report)).rejects.toThrow(
        'updateReport exception',
      );
    });
  });

  describe('deleteReport', () => {
    it('should return the deleted report', async () => {
      mockReportService.deleteReport.mockReturnValue(mockReport);
      const result = await resolver.deleteReport('1');

      expect(result).toBe(mockReport);
    });

    it('should throw an error if deleteReport throws an exception', async () => {
      mockReportService.deleteReport.mockImplementation(() => {
        throw new Error('deleteReport exception');
      });

      await expect(resolver.deleteReport('1')).rejects.toThrow(
        'deleteReport exception',
      );
    });
  });
});
