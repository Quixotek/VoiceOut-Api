import { Module } from '@nestjs/common';
import { LegalResourcesService } from './legal-resources.service';
import { LegalResourcesResolver } from './legal-resources.resolver';

@Module({
  providers: [LegalResourcesResolver, LegalResourcesService],
})
export class LegalResourcesModule {}
