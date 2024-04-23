import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ReportSchema, Report } from './report.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportCreateInput, ReportUpdateInput } from './report.types';
import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
jest.useRealTimers();

const mockReportModel = {
  new: jest.fn(() => {
    return {
      ...mockReportModel,
    };
  }),
  save: jest.fn(() => Promise.resolve({ ...mockReportModel })),
};

describe('ReportService', () => {
  let service: ReportService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL_TEST, {
          dbName: process.env.MONGO_DB_NAME,
        }),
        MongooseModule.forFeature([
          { name: Report.name, schema: ReportSchema },
        ]), // Add this line
      ],
      providers: [ReportService],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }

    mongoose.connection.close();
  });

  it('createReport should create a new report', async () => {
    const createReportInput: ReportCreateInput = {
      type: 'This is a test report',
      description: 'This is a description for the test report',
    };

    const expectedReport = { ...createReportInput }; // Assume saved report doesn't change data
    mockReportModel.new.mockReturnValue(expectedReport);
    mockReportModel.save.mockResolvedValueOnce(expectedReport);

    const createdReport = await service.createReport(createReportInput);
    expect(createdReport.id).toBeDefined();
    expect(createdReport.type).toEqual(createReportInput.type);
    expect(createdReport.description).toEqual(createReportInput.description);
    expect(createdReport.createdAt).toBeDefined();

    await service.deleteReport(createdReport.id);
  });

  it('updateReport should update a report', async () => {
    const createReportInput: ReportCreateInput = {
      type: 'This is a test report',
      description: 'This is a description for the test report',
    };

    const createdReport = await service.createReport(createReportInput);

    const updateReportInput: ReportUpdateInput = {
      id: createdReport.id,
      type: 'This is a test report updated',
      description: 'This is a description for the test report updated',
    };

    const updatedReport = await service.updateReport(updateReportInput);

    expect(updatedReport.id).toEqual(createdReport.id);
    expect(updatedReport.type).toBe(updateReportInput.type);
    expect(updatedReport.description).toBe(updateReportInput.description);
    expect(updatedReport.createdAt).toEqual(createdReport.createdAt);

    await service.deleteReport(createdReport.id);
  });

  it('deleteReport should delete a report', async () => {
    const createReportInput: ReportCreateInput = {
      type: 'This is a test report',
      description: 'This is a description for the test report',
    };

    const createdReport = await service.createReport(createReportInput);

    const deletedReport = await service.deleteReport(createdReport.id);

    expect(deletedReport.id).toEqual(createdReport.id);
    expect(deletedReport.type).toEqual(createdReport.type);
    expect(deletedReport.description).toEqual(createdReport.description);
    expect(deletedReport.createdAt).toEqual(createdReport.createdAt);
  });
});
