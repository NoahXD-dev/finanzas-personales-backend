import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  user = 'user',
  super = 'super',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
