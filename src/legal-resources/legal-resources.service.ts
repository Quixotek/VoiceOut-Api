import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LegalResources,
  LegalResourcesDocument,
} from './legal-resources.schema';
import { Model, PipelineStage } from 'mongoose';
import {
  LegalResourcesCreateInput,
  LegalResourcesPaginationInput,
  LegalResourcesUpdateInput,
} from './legal-resources.types';
import { UserService } from '../user/user.service';
import { escape } from 'querystring';
import { escapeRegExp, get, isEmpty } from 'lodash';

@Injectable()
export class LegalResourcesService {
  constructor(
    @InjectModel(LegalResources.name)
    private readonly legalResourcesRepo: Model<LegalResourcesDocument>,
    private readonly userService: UserService,
  ) {}
  async getLegalResources(query: LegalResourcesPaginationInput) {
    const { page, limit, q, sort, sortBy } = query;

    const aggregate: PipelineStage[] = [];

    const match: PipelineStage.Match = {
      $match: {},
    };

    const sorting: PipelineStage.Sort = {
      $sort: {
        [sortBy]: sort?.toLocaleLowerCase() === 'asc' ? 1 : -1,
      },
    };

    if (q) {
      match['$match']['$text'] = { $search: escapeRegExp(q) };
    }

    if (!isEmpty(match.$match)) {
      aggregate.push(match);
    }

    aggregate.push(sorting);

    aggregate.push({
      $facet: {
        meta: [
          {
            $group: {
              _id: null,
              totalDocs: {
                $sum: 1,
              },
            },
          },
          {
            $addFields: {
              limit,
              page,
            },
          },
        ],
        docs: [
          {
            $skip: limit * (page - 1),
          },
          {
            $limit: limit,
          },
        ],
      },
    });

    const results = await this.legalResourcesRepo.aggregate(aggregate);

    const items = get(results, '[0].docs', []) || [];
    const meta = get(results, '[0].meta[0]');

    return { items, meta };
  }

  async getLegalResourcesById(id: string) {
    const legalResource = await this.legalResourcesRepo.findOne({ id });

    return legalResource;
  }

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

  async updateLegalResources(id: string, input: LegalResourcesUpdateInput) {
    try {
      const updatedLegalResources =
        await this.legalResourcesRepo.findOneAndUpdate(
          { id },
          { $set: { ...input } },
          { new: true },
        );

      return updatedLegalResources;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteLegalResources(id: string, userId: string) {
    try {
      await this.legalResourcesRepo.findOneAndDelete({ id });

      return { message: 'Deleted Legal Resource Successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
