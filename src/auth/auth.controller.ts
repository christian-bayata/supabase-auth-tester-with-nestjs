import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

// const { success } = AppResponse;
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/signup')
  // async signup(
  //   @Req() req: any,
  //   @Res() res: Response,
  //   @Body() createUserDto: CreateUserDto,
  // ): Promise<Response> {
  //   const data = await this.authService.signup(createUserDto);

  //   return res
  //     .status(201)
  //     .json(success('Successfully created user', 201, data));
  // }
}
