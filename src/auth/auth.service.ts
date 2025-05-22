import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto, MobileLoginDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { SmsService } from 'src/sms/sms.service';
import { OtpDto } from './dto/otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private sms: SmsService,
  ) {}

  async create(authDto: AuthDto) {
    const { password, ...rest } = authDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            ...rest,
            password: hashedPassword,
          },
        });
      });

      return { message: 'User created successfully' };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException(
          'Email already exists. Please use a different email.',
        );
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // If user is admin, do plain password check (no bcrypt)
      if (email === 'admin@gmail.com') {
        if (user.password !== password) {
          throw new UnauthorizedException('Invalid email or password');
        }
      } else {
        // For other users, compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid email or password');
        }
      }

      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Login successful',
        access_token: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  async mobilelogin(mobileLoginDto: MobileLoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phone_number: mobileLoginDto.phone_number },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid Mobile Number');
      } else {
        await this.sms.create({
          countryCode: mobileLoginDto.country_code,
          phoneNumber: BigInt(mobileLoginDto.phone_number),
          isWhatsappOTP: true,
        });
      }
      return {
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }
  async phoneNumberVerification(otpDto: OtpDto) {
    const authorizedUser = await this.prisma.otp.findUnique({
      where: {
        phone_number: otpDto.phone_number,
        otp: otpDto.otp,
      },
    });

    if (!authorizedUser) {
      throw new HttpException(
        'Invalid OTP, Unable to find user',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const payload = {
        sub: authorizedUser.phone_number,
        email: authorizedUser.otp,
      };
      const token = this.jwtService.sign(payload);
      return {
        message: 'Login successful',
        access_token: token,
      };
    }
  }
  async authToken(authToken: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        token: authToken,
      },
    });
    return !!user;
  }

  async getList(paginate: { skip: number; take: number }) {
    const data = await this.prisma.user.findMany(paginate);
    const total = await this.prisma.user.count();
    return {
      data,
      total,
      page: paginate.skip / paginate.take + 1,
      limit: paginate.take,
      totalPages: Math.ceil(total / paginate.take),
    };
  }
}
