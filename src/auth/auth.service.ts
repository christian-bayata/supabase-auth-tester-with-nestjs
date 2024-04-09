import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { AppResponse } from 'src/common/app.response';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: dedicated service for signing up a new user
   *
   * @param createUserDto
   * @returns {Promise<any>}
   */

  async signup(createUserDto: CreateUserDto): Promise<any> {
    try {
      let { firstName, lastName, email, password } = createUserDto;

      let { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email rate limit exceeded') {
          console.error('Email rate limit exceeded. Please try again later.');
        } else {
          console.error('Sign-up error:', error.message);
        }
        return null;
      }
      return data;
    } catch (error) {
      error.location = `AuthServices.${this.signup.name} method`;
      AppResponse.error(error);
    }
  }
}
