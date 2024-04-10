import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { AppResponse } from 'src/common/app.response';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthUtility } from './auth.utility';
import { generate } from 'rxjs';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly authUtility: AuthUtility,
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
      let { firstName, lastName, email } = createUserDto;

      const userExists = await this.authRepository.findUser({
        email,
      });
      if (userExists) {
        AppResponse.error({
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
        });
      }

      /* Generate user access code */
      const generatedAccessCode = this.authUtility.generateRandomPassword(10);

      /* Encode the access code */
      const encodedAccessCode =
        this.authUtility.generateAccessCode(generatedAccessCode);

      function userData(): CreateUserDto {
        return {
          firstName,
          lastName,
          email,
          accessCode: encodedAccessCode,
        };
      }

      /* Create user in the users table */
      await this.authRepository.createUser(userData());

      /* Afterwards allow superbase manage the user */
      /* Provide the generated access code to the superbase user management */
      let { data, error } = await this.supabase.auth.signUp({
        email,
        password: generatedAccessCode,
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

  /**
   * @Responsibility: dedicated service for logging in a user
   *
   * @param accessCode
   * @returns {Promise<any>}
   */

  async login(accessCode: string): Promise<any> {
    try {
      const getUser = await this.authRepository.findUser(accessCode);
      if (!getUser) {
        AppResponse.error({
          message: 'User not found',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      /* Decode access code */
      const decodedAccessCode = this.authUtility.decodeAccessCode(
        getUser?.accessCode,
      );

      let { data, error } = await this.supabase.auth.signInWithPassword({
        email: getUser?.email,
        password: JSON.parse(decodedAccessCode),
      });

      return data;
    } catch (error) {
      error.location = `AuthServices.${this.login.name} method`;
      AppResponse.error(error);
    }
  }
}
