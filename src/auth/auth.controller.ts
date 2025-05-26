import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, MobileLoginDto } from './dto/user.dto';
import { OtpDto } from './dto/otp.dto';
import { paginate } from 'nestjs-prisma-pagination';
import { PaginationDto } from 'src/utils/pagination.dto';
import { RolesGuard } from 'src/common/decorators/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  async Create(@Body() authDto: AuthDto) {
    return this.authService.create(authDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('mobilelogin')
  async mobilelogin(@Body() mobileloginDto: MobileLoginDto) {
    return this.authService.mobilelogin(mobileloginDto);
  }
  @Post('otp-verification')
  async phoneNumberAuthentication(@Body() otpDto: OtpDto) {
    return await this.authService.phoneNumberVerification(otpDto);
  }
  @Post('authToken')
  @ApiOperation({
    summary: 'Validate Auth Token',
    description: 'Checks if the provided auth token is valid.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        authToken: {
          type: 'string',
          description: 'The authentication token to validate',
        },
      },
      required: ['authToken'],
    },
  })
  async authToken(@Body('authToken') authToken: string): Promise<boolean> {
    return await this.authService.authToken(authToken);
  }
  @Get('getList')
  async getList(@Query() paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    return await this.authService.getList({ skip, take: limit });
  }
}
