import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (must be strong)',
    example: 'StrongP@ssw0rd123',
    minLength: 8,
  })
  @IsStrongPassword()
  password: string;
}
