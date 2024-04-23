import { Test, TestingModule } from '@nestjs/testing';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema, Report } from './report.schema';
import { ReportCreateInput, ReportUpdateInput } from './report.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

describe('ReportResolver', () => {
  let service: ReportService;
  let resolver: ReportResolver;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL_TEST, {
          dbName: process.env.MONGO_DB_NAME,
        }),
        MongooseModule.forFeature([
          { name: Report.name, schema: ReportSchema },
        ]),
      ],
      providers: [
        ReportResolver,
        {
          provide: ReportService,
          useValue: {
            createReport: jest.fn(() => {
              return {
                id: '1',
                type: 'title',
                description: 'description',
                createdAt: new Date(),
              };
            }),
            updateReport: jest.fn(() => {
              return {
                id: '1',
                type: 'new title',
                description: 'new description',
                createdAt: new Date(),
              };
            }),
            deleteReport: jest.fn(() => {
              return {
                id: '1',
                type: 'title',
                description: 'description',
                createdAt: new Date(),
              };
            }),
          },
        },
      ],
    }).compile();
    service = module.get<ReportService>(ReportService);
    resolver = module.get<ReportResolver>(ReportResolver);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should create a new report', async () => {
    const createReportInput: ReportCreateInput = {
      type: 'title',
      description: 'description',
    };
    const report = await service.createReport(createReportInput);
    const result = await resolver.createReport(createReportInput);

    expect(report).toEqual({
      id: '1',
      type: 'title',
      description: 'description',
      createdAt: expect.any(Date),
    });

    expect(result.type).toEqual(report.type);
    expect(result.description).toEqual(report.description);

    await service.deleteReport(result.id);
  });

  it('should update a report', async () => {
    const createReportInput: ReportUpdateInput = {
      id: '1',
      type: 'title',
      description: 'description',
    };

    const newReport = await service.createReport({
      type: 'title',
      description: 'description',
    });

    const report = await service.updateReport(createReportInput);
    const result = await resolver.updateReport({
      id: newReport.id,
      type: 'new title',
      description: 'new description',
    });

    expect(report).toEqual({
      id: '1',
      type: 'new title',
      description: 'new description',
      createdAt: expect.any(Date),
    });

    expect(result.id).toEqual(newReport.id);
    expect(result.type).toEqual('new title');
    expect(result.description).toEqual('new description');

    await service.deleteReport(result.id);
  });

  it('should delete a report', async () => {
    const newReport = await resolver.createReport({
      type: 'title',
      description: 'description',
    });

    const newSreport = await service.createReport({
      type: 'title',
      description: 'description',
    });

    const report = await service.deleteReport(newSreport.id);
    const result = await resolver.deleteReport(newReport.id);

    expect(result).toEqual(newReport);
    expect(report).toEqual(newSreport);
  });
});
