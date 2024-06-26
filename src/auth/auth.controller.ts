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
import { AppResponse } from 'src/common/app.response';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';

const { success } = AppResponse;
@Controller('supabase/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Req() req: any,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Response> {
    const data = await this.authService.signup(createUserDto);

    return res
      .status(201)
      .json(success('Successfully created user', 201, data));
  }

  @Post('/login')
  async login(
    @Req() req: any,
    @Res() res: Response,
    @Body() accessCode: string,
  ): Promise<Response> {
    const data = await this.authService.login(accessCode);

    return res.status(200).json(success('Successfully logged in', 200, data));
  }
}
