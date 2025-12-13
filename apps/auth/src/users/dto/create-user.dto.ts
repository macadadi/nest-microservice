import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsStrongPassword()
  password: string;
}
