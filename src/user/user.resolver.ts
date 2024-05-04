import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';
import { LegalResourcesSearch } from '../utils/common.types';
import { LegalResourcesService } from '../legal-resources/legal-resources.service';
import { LegalResourcesPaginationInput } from '../legal-resources/legal-resources.types';
import { LegalResources } from '../legal-resources/legal-resources.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly legalResourcesService: LegalResourcesService,
  ) {}

  @Query(() => User)
  async viewer(@Args('id') id: string) {
    return await this.userService.findUserById(id); //TODO currentUser
  }

  @ResolveField(() => String, { nullable: true })
  async userId(@Args('id') id: string) {
    const user = await this.userService.findUserById(id); //TODO clean this, just testing ResolveField

    return user.id;
  }

  @ResolveField(() => LegalResourcesSearch, { nullable: true })
  async legalResourcesSearch(
    @Args('input') input: LegalResourcesPaginationInput,
  ) {
    const results = await this.legalResourcesService.getLegalResources(input);

    return results;
  }

  @ResolveField(() => LegalResources, { nullable: true })
  async legalResources(@Args('id') id: string) {
    const result = await this.legalResourcesService.getLegalResourcesById(id);

    return result;
  }
}
