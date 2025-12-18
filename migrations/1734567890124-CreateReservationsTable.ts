import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateReservationsTable1734567890124 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reservations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'timestamp',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'placeId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'invoiceId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'IDX_reservations_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'IDX_reservations_placeId',
        columnNames: ['placeId'],
      }),
    );

    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'IDX_reservations_invoiceId',
        columnNames: ['invoiceId'],
      }),
    );

    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'IDX_reservations_dates',
        columnNames: ['startDate', 'endDate'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('reservations', 'IDX_reservations_dates');
    await queryRunner.dropIndex('reservations', 'IDX_reservations_invoiceId');
    await queryRunner.dropIndex('reservations', 'IDX_reservations_placeId');
    await queryRunner.dropIndex('reservations', 'IDX_reservations_userId');
    await queryRunner.dropTable('reservations');
  }
}


