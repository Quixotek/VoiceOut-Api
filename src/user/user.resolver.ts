import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async viewer(@Args('id') id: string) {
    return await this.userService.findUserById(id); //TODO currentUser
  }

  @ResolveField(() => String)
  async userId(@Args('id') id: string) {
    const user = await this.userService.findUserById(id); //TODO clean this, just testing ResolveField

    return user.id;
  }
}
