import { Field, Float, InputType } from '@nestjs/graphql';
import { MovementItemInput } from './movement-item.input.js';
import { MovementType } from './movement.entity.js';

@InputType()
export class CreateMovementInput {
  @Field()
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => MovementType)
  type!: MovementType;

  @Field()
  category!: string;

  @Field()
  date!: string;

  @Field(() => [MovementItemInput], { nullable: true })
  items?: MovementItemInput[] | null;
}
