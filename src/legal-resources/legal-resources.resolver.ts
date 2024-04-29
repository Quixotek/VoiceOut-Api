import { Resolver } from '@nestjs/graphql';
import { LegalResourcesService } from './legal-resources.service';

@Resolver()
export class LegalResourcesResolver {
  constructor(private readonly legalResourcesService: LegalResourcesService) {}
}
