import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CreateMovementInput } from './create-movement.input.js';
import {
  MovementByCategory,
  MovementByMonth,
  MovementFilterInput,
  MovementSummary,
} from './movement-summary.entity.js';
import { Movement } from './movement.entity.js';
import { MovementsService } from './movements.service.js';
import { UpdateMovementInput } from './update-movement.input.js';

@Resolver(() => Movement)
export class MovementsResolver {
  constructor(private readonly movementsService: MovementsService) {}

  /* Finds all movements */
  /* @param filter - The filter input
   * @returns An array of movements
   */
  @Query(() => [Movement], { name: 'movements' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Args('filter', { type: () => MovementFilterInput, nullable: true })
    filter?: MovementFilterInput,
  ) {
    return this.movementsService.findAll(user, filter);
  }

  /* Finds a movement by id */
  /* @param id - The id of the movement
   * @returns The movement
   */
  @Query(() => Movement, { name: 'movement' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.movementsService.findOne(user, id);
  }

  /* Gets the summary of the movements */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns The summary of the movements
   */
  @Query(() => MovementSummary, { name: 'movementSummary' })
  getSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Args('fromDate') fromDate: string,
    @Args('toDate') toDate: string,
  ) {
    return this.movementsService.getSummary(user, fromDate, toDate);
  }

  /* Gets the movements by category */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns An array of movements by category
   */
  @Query(() => [MovementByCategory], { name: 'movementsByCategory' })
  getByCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Args('fromDate', { nullable: true }) fromDate?: string,
    @Args('toDate', { nullable: true }) toDate?: string,
  ) {
    return this.movementsService.getByCategory(user, fromDate, toDate);
  }

  /* Gets the movements by month */
  /* @param fromDate - The start date of the range
   * @param toDate - The end date of the range
   * @returns An array of movements by month
   */
  @Query(() => [MovementByMonth], { name: 'movementsByMonth' })
  getByMonth(
    @CurrentUser() user: AuthenticatedUser,
    @Args('fromDate', { nullable: true }) fromDate?: string,
    @Args('toDate', { nullable: true }) toDate?: string,
  ) {
    return this.movementsService.getByMonth(user, fromDate, toDate);
  }

  /* Creates a new movement */
  /* @param input - The input for the movement
   * @returns The created movement
   */
  @Mutation(() => Movement)
  createMovement(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateMovementInput,
  ) {
    return this.movementsService.create(user, input);
  }

  /* Updates a movement */
  /* @param id - The id of the movement
   * @param input - The input for the movement
   * @returns The updated movement
   */
  @Mutation(() => Movement)
  updateMovement(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateMovementInput,
  ) {
    return this.movementsService.update(user, id, input);
  }

  /* Removes a movement */
  /* @param id - The id of the movement
   * @returns The removed movement
   */
  @Mutation(() => Movement)
  deleteMovement(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.movementsService.remove(user, id);
  }
}
