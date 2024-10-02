import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from '../../users';

@Injectable()
export class UserRepository {
  private LOGGER = new Logger(UserRepository.name);
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<IUser>) {}

  async create(user: CreateUserDto) {
    try {
      const userDoc = await this.userModel.create(user);
      this.LOGGER.log(`Inserting customer successfully ${userDoc}`);
      return userDoc;
    } catch (error: any) {
      this.LOGGER.error('error while inserting in DB');
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      const userDocument = this.userModel.findOne({ email });
      if (userDocument == null) {
        throw `no such user with email ${email}`;
      }
      this.LOGGER.log(
        `findByEmail got user  ${email} with data ${userDocument}`,
      );
      return userDocument;
    } catch (error: any) {
      this.LOGGER.error('Error while finding customer ' + error);
      throw error;
    }
  }

  async updateByEmail(email: string, user: CreateUserDto) {
    try {
      await this.userModel.findOneAndDelete({ email }, user);
      this.LOGGER.log(
        `updated user ${email} with these values ${user} get succeed`,
      );
    } catch (error: any) {
      this.LOGGER.error('Error while updating customer ' + error);
      throw error;
    }
  }
}
