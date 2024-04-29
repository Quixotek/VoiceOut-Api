import { Test, TestingModule } from '@nestjs/testing';
import { LegalResourcesResolver } from './legal-resources.resolver';
import { LegalResourcesService } from './legal-resources.service';

describe('LegalResourcesResolver', () => {
  let resolver: LegalResourcesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegalResourcesResolver, LegalResourcesService],
    }).compile();

    resolver = module.get<LegalResourcesResolver>(LegalResourcesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
