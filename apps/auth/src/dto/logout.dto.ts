import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  refresh_token: string;

  @IsOptional()
  @IsString({ message: 'Access token must be a string' })
  access_token?: string;
}
