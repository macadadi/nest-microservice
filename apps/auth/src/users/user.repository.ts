import { AbstractRepository } from '@app/common';
import { Model, QueryFilter } from 'mongoose';
import { UserDocument } from './model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);
  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findWithoutPassword(
    filterQuery: QueryFilter<UserDocument>,
  ): Promise<UserDocument[]> {
    this.logger.log('Finding users without password');
    return this.model
      .find(filterQuery)
      .select('-password')
      .lean<UserDocument[]>(true);
  }
}
