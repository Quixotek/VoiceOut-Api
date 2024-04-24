import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { ReportCreateInput, ReportUpdateInput } from './report.types';
import { Report } from './report.schema';

@Resolver()
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Mutation(() => Report)
  async createReport(
    @Args('createReportInput') createReportInput: ReportCreateInput,
  ) {
    return this.reportService.createReport(createReportInput);
  }

  @Mutation(() => Report)
  async updateReport(
    @Args('updateReportInput') updateReportInput: ReportUpdateInput,
  ) {
    return this.reportService.updateReport(updateReportInput);
  }

  @Mutation(() => Report)
  async deleteReport(@Args('id') id: string) {
    return this.reportService.deleteReport(id);
  }
}
