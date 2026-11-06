import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MovementItem {
  @Field(() => ID)
  id!: number;

  @Field(() => ID)
  movementId!: number;

  @Field()
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  subcategory!: string;

  @Field(() => Int)
  position!: number;
}
