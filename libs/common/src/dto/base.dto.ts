import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * Base DTO with common fields
 * Can be extended by other DTOs for consistency
 */
export class BaseDto {
  @ApiPropertyOptional({
    description: 'Entity ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  id?: string;
}

