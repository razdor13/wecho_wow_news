import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { IGoogleUser } from 'src/types/types'
import { AuthGuard } from '@nestjs/passport'
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy'
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.registerUser(registerDto)
    } catch (error) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST)
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.authService.login(req.user)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user.email
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request & { user: IGoogleUser }) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request & { user: IGoogleUser },
    @Res() res,
  ) {
    try {
      const { access_token, refresh_token } =
        await this.authService.googleLogin(req.user)
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'strict', // Захист від CSRF
      })
      // res.send(`
      //   <html>
      //     <script>
      //       window.opener.postMessage({ access_token: '${access_token}' });
      //       window.close();
      //     </script>
      //   </html>
      // `);
      res.end()
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Google login failed')
    }
  }
  
  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshTokens(@Req() request) {
    try {
      const refreshToken = request.cookies['refresh_token']
      if (!refreshToken) {
        throw new HttpException(
          'Refresh token not found',
          HttpStatus.BAD_REQUEST,
        )
      }

      return this.authService.refreshTokens(refreshToken)
    } catch (error) {
      throw new HttpException('Token refresh failed', HttpStatus.UNAUTHORIZED)
    }
  }
}
