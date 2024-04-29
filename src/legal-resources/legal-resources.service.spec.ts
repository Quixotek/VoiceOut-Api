import { Test, TestingModule } from '@nestjs/testing';
import { LegalResourcesService } from './legal-resources.service';

describe('LegalResourcesService', () => {
  let service: LegalResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegalResourcesService],
    }).compile();

    service = module.get<LegalResourcesService>(LegalResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
