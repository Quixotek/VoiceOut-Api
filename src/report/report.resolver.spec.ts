import { Test, TestingModule } from '@nestjs/testing';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema, Report } from './report.schema';
import { ReportCreateInput } from './report.types';

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
                _id: '1',
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
      _id: '1',
      type: 'title',
      description: 'description',
      createdAt: expect.any(Date),
    });

    expect(result.type).toEqual(report.type);
    expect(result.description).toEqual(report.description);
  });
});
