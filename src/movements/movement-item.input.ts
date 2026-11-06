import { Field, Float, InputType } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

const ITEM_TEXT_MAX_LENGTH = 200;

@InputType()
export class MovementItemInput {
  @Field()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Item name is required' })
  @MinLength(1, { message: 'Item name is required' })
  @MaxLength(ITEM_TEXT_MAX_LENGTH, { message: 'Item name is too long' })
  name!: string;

  @Field(() => Float)
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Item price must be greater than zero' },
  )
  @IsPositive({ message: 'Item price must be greater than zero' })
  price!: number;

  @Field()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Item subcategory is required' })
  @MinLength(1, { message: 'Item subcategory is required' })
  @MaxLength(ITEM_TEXT_MAX_LENGTH, { message: 'Item subcategory is too long' })
  subcategory!: string;
}
