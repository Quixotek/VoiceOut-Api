import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ReportSchema, Report } from './report.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportCreateInput } from './report.types';

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
  });
});
