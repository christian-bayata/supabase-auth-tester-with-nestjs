import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { AppResponse } from 'src/common/app.response';
import { AuthRepository } from './auth.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

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

      const userExists = await this.authRepository.findUser({
        email,
      });
      if (userExists) {
        AppResponse.error({
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
        });
      }

      /* Hash password before storing it */
      password = password ? hashSync(password, genSaltSync()) : null;

      function userData(): CreateUserDto {
        return {
          firstName,
          lastName,
          email,
          password,
        };
      }

      await this.authRepository.createUser(userData());
      return;
    } catch (error) {
      error.location = `AuthServices.${this.signup.name} method`;
      AppResponse.error(error);
    }
  }
}
