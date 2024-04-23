import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from './report.schema';
import { Model } from 'mongoose';
import { ReportCreateInput, ReportUpdateInput } from './report.types';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
  ) {}

  async createReport(createReportInput: ReportCreateInput): Promise<Report> {
    const report = new this.reportModel(createReportInput);
    return report.save();
  }

  async updateReport(updateReportInput: ReportUpdateInput): Promise<Report> {
    return this.reportModel.findOneAndUpdate(
      { id: updateReportInput.id },
      updateReportInput,
      { new: true },
    );
  }

  async deleteReport(id: string): Promise<Report> {
    return this.reportModel.findOneAndDelete({ id });
  }
}
