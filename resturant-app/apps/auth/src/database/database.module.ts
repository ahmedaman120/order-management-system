import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { usersProviders } from './providers/user.provider';
import { UserRepository } from './repository/user.repository';

@Module({
  providers: [...databaseProviders, ...usersProviders, UserRepository],
  exports: [...databaseProviders, ...usersProviders, UserRepository],
})
export class DatabaseModule {}
