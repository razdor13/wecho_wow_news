import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards , Request, Get, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IGoogleUser, IUser } from 'src/types/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req()  req :Request & { user: IUser }) {
    return this.authService.login(req.user)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req :Request & { user: IUser }) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req:Request & { user: IGoogleUser }) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res ) {
    console.log(await this.authService.googleLogin(req.user))
    const { access_token } = await this.authService.googleLogin(req.user);
    return res.redirect(`http://localhost:3333/api/?token=${access_token}`);
  }
}