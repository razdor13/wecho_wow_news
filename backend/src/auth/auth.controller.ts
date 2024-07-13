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
    return this.authService.registerUser(registerDto)
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
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = await this.authService.googleLogin(
      req.user,
    )
    const user = req.user
    const token = user.accessToken

    // Send token back to the frontend
    res.send(`
      <script>
        window.opener.postMessage({ token: '${token}' }, 'http://localhost:3000');
        window.close();
      </script>
    `)
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshTokens(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken)
  }
}
