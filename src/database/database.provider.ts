import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RepositoryConstants } from 'src/common/utils/constant.interface';

export const databaseProviders = [
  {
    provide: RepositoryConstants.DATA_SOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('SUPABASE_DB_HOST'),
        port: configService.get('SUPABASE_DB_PORT'),
        username: configService.get('SUPABASE_DB_USER'),
        password: configService.get('SUPABASE_DB_PASS'),
        database: configService.get('SUPABASE_DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
