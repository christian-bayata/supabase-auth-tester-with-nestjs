import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { RepositoryConstants } from 'src/common/utils/constant.interface';

export const userProviders = [
  {
    provide: RepositoryConstants.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [RepositoryConstants.DATA_SOURCE],
  },
];
