import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema, Report } from './report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  providers: [ReportResolver, ReportService],
})
export class ReportModule {}
