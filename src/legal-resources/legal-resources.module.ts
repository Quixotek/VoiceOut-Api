import { forwardRef, Module } from '@nestjs/common';
import { LegalResourcesService } from './legal-resources.service';
import { LegalResourcesResolver } from './legal-resources.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { LegalResources, LegalResourcesSchema } from './legal-resources.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [LegalResourcesResolver, LegalResourcesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: LegalResources.name,
        schema: LegalResourcesSchema,
      },
    ]),

    forwardRef(() => UserModule),
  ],
  exports: [LegalResourcesService],
  controllers: [],
})
export class LegalResourcesModule {}
