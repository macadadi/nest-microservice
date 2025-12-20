import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * Pagination query parameters DTO
 * Provides reusable pagination functionality
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Calculate skip value for database queries
   */
  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  /**
   * Calculate take value for database queries
   */
  get take(): number {
    return this.limit || 10;
  }
}

/**
 * Paginated response metadata
 */
export class PaginationMeta {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  total: number;

  @ApiPropertyOptional()
  totalPages: number;

  @ApiPropertyOptional()
  hasNext: boolean;

  @ApiPropertyOptional()
  hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponse<T> {
  @ApiPropertyOptional()
  data: T[];

  @ApiPropertyOptional()
  meta: PaginationMeta;

  constructor(data: T[], total: number, pagination: PaginationDto) {
    this.data = data;
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const totalPages = Math.ceil(total / limit);

    this.meta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}
