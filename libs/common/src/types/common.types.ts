/**
 * Common type definitions used across the application
 */

/**
 * Generic service response type
 */
export type ServiceResponse<T> = Promise<T>;

/**
 * Generic repository response type
 */
export type RepositoryResponse<T> = Promise<T | null>;

/**
 * ID type (can be string UUID or number)
 */
export type IdType = string | number;

/**
 * Timestamp type
 */
export type Timestamp = number | Date;

/**
 * Generic entity with common fields
 */
export interface BaseEntityFields {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generic pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Generic filter parameters
 */
export interface FilterParams {
  [key: string]: any;
}

/**
 * Generic sort parameters
 */
export interface SortParams {
  field: string;
  order: 'ASC' | 'DESC';
}
