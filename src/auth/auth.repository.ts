import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryConstants } from 'src/common/utils/constant.interface';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PropDataInput } from 'src/common/utils/util.interface';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(RepositoryConstants.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @Responsibility: Repo for finding a user
   *
   * @param where
   *
   * @returns {Promise<User>}
   */

  async findUser(where: any): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({ where });
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }

  /**
   * @Responsibility: Repo for creating a user
   *
   * @param data
   *
   * @returns {Promise<User>}
   */

  async createUser(data: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(data);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }
}
