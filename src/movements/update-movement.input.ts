import { Field, Float, InputType, PartialType } from '@nestjs/graphql';
import { CreateMovementInput } from './create-movement.input.js';
import { MovementItemInput } from './movement-item.input.js';

@InputType()
export class UpdateMovementInput extends PartialType(CreateMovementInput) {
  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  date?: string;

  @Field(() => [MovementItemInput], { nullable: true })
  items?: MovementItemInput[] | null;
}
