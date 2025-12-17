import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
  DeleteResult,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';

/**
 * Abstract repository providing common CRUD operations for TypeORM entities
 * Implements repository pattern with proper error handling and logging
 */
export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Create a new entity
   */
  async create(entity: DeepPartial<T>): Promise<T> {
    const createdEntity = this.repository.create(entity);
    const savedEntity = await this.repository.save(createdEntity);
    this.logger.log(`Created entity with id: ${savedEntity.id}`);
    return savedEntity;
  }

  /**
   * Find one entity by filter query
   * @throws NotFoundException if entity not found
   */
  async findOne(filterQuery: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(filterQuery);
    if (!entity) {
      this.logger.warn(
        `Entity not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  /**
   * Find one entity by filter query without throwing exception
   * Returns null if not found
   */
  async findOneOrNull(filterQuery: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(filterQuery);
  }

  /**
   * Find and update an entity
   * @throws NotFoundException if entity not found
   */
  async findOneAndUpdate(
    filterQuery: FindOptionsWhere<T>,
    update: DeepPartial<T>,
  ): Promise<T> {
    const entity = await this.repository.findOne({ where: filterQuery });
    if (!entity) {
      this.logger.warn(
        `Entity not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Entity not found');
    }
    Object.assign(entity, update);
    const updatedEntity = await this.repository.save(entity);
    this.logger.log(`Updated entity with id: ${updatedEntity.id}`);
    return updatedEntity;
  }

  /**
   * Find multiple entities by filter query
   */
  async find(filterQuery: FindManyOptions<T>): Promise<T[]> {
    const entities = await this.repository.find(filterQuery);
    if (entities.length === 0) {
      this.logger.warn(
        `No entities found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
    }
    return entities;
  }

  /**
   * Find one entity and delete it
   * @throws NotFoundException if entity not found
   */
  async findOneAndDelete(filterQuery: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repository.findOne({ where: filterQuery });
    if (!entity) {
      this.logger.warn(
        `Entity not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Entity not found');
    }
    await this.repository.remove(entity);
    this.logger.log(`Deleted entity with id: ${entity.id}`);
    return entity;
  }

  /**
   * Delete entities by filter query
   */
  async delete(filterQuery: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.repository.delete(filterQuery);
  }

  /**
   * Count entities by filter query
   */
  async count(filterQuery: FindManyOptions<T>): Promise<number> {
    return this.repository.count(filterQuery);
  }

  /**
   * Get the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<T> {
    return this.repository;
  }
}
