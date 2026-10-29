import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { AuthPayload } from './auth-payload.entity.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { LoginInput } from './login.input.js';
import { RegisterInput } from './register.input.js';
import type { AuthenticatedUser } from './auth.types.js';
import { User } from './user.entity.js';
import { UserRole } from './user-role.enum.js';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Public()
  @Mutation(() => AuthPayload)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id);
  }

  @Query(() => User, { name: 'me' })
  me(@CurrentUser() user: AuthenticatedUser): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      inactivatedAt: user.inactivatedAt,
      inactivatedBy: user.inactivatedBy,
    };
  }

  @Roles(UserRole.super)
  @Query(() => [User], { name: 'users' })
  users() {
    return this.authService.findAllUsers();
  }

  @Roles(UserRole.super)
  @Mutation(() => User)
  setUserStatus(
    @CurrentUser() actor: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: boolean,
  ) {
    return this.authService.setUserStatus(actor.id, id, status);
  }
}
