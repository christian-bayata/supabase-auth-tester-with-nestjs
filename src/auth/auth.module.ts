import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from '../guards/supabase.strategy';
import { userProviders } from './auth.provider';
import { AuthRepository } from './auth.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, PassportModule],
  controllers: [AuthController],
  providers: [...userProviders, AuthService, SupabaseStrategy, AuthRepository],
  exports: [AuthService, SupabaseStrategy],
})
export class AuthModule {}
