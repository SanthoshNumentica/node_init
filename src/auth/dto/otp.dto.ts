import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OtpDto {
  @IsString()
  @IsNumber()
  @ApiProperty()
  otp: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  phone_number: number;
}
