import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { MovementType } from './movement.entity.js';

@InputType()
export class MovementFilterInput {
  @Field(() => MovementType, { nullable: true })
  type?: MovementType;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  fromDate?: string;

  @Field({ nullable: true })
  toDate?: string;
}

@ObjectType()
export class MovementSummary {
  @Field(() => Float)
  totalIncome!: number;

  @Field(() => Float)
  totalExpense!: number;

  @Field(() => Float)
  balance!: number;
}

@ObjectType()
export class MovementByCategory {
  @Field()
  category!: string;

  @Field(() => Float)
  totalIncome!: number;

  @Field(() => Float)
  totalExpense!: number;
}

@ObjectType()
export class MovementByMonth {
  @Field()
  month!: string;

  @Field(() => Float)
  totalIncome!: number;

  @Field(() => Float)
  totalExpense!: number;
}
