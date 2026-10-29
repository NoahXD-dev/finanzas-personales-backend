import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum MovementType {
  income = 'income',
  expense = 'expense',
}

registerEnumType(MovementType, {
  name: 'MovementType',
});

@ObjectType()
export class Movement {
  @Field(() => ID)
  id!: number;

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

  @Field()
  createdAt!: string;

  @Field(() => ID)
  userId!: number;
}
