import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LegalResources,
  LegalResourcesDocument,
} from './legal-resources.schema';
import { Model } from 'mongoose';
import {
  LegalResourcesCreateInput,
  LegalResourcesPaginationInput,
  LegalResourcesUpdateInput,
} from './legal-resources.types';
import { UserService } from '../user/user.service';

@Injectable()
export class LegalResourcesService {
  constructor(
    @InjectModel(LegalResources.name)
    private readonly legalResourcesRepo: Model<LegalResourcesDocument>,
    private readonly userService: UserService,
  ) {}
  async getLegalResources(query: LegalResourcesPaginationInput) {}

  async getLegalResourcesById(id: string) {}

  async createLegalResources(id: string, input: LegalResourcesCreateInput) {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newLegalResources = await this.legalResourcesRepo.create({
      ...input,
      author: user.name,
    });

    return newLegalResources;
  }

  async updateLegalResources(input: LegalResourcesUpdateInput) {}

  async deleteLegalResources(id: string, userId: string) {}
}
