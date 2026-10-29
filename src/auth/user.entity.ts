import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from './user-role.enum.js';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  status!: boolean;

  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;

  @Field(() => String, { nullable: true })
  inactivatedAt?: string | null;

  @Field(() => Int, { nullable: true })
  inactivatedBy?: number | null;
}
